const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { isUsingFallback, getFallbackData } = require('../config/db');
const { validateRegister, validateLogin, validatePasswordChange } = require('../middleware/validation');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  const { identifier, email, password } = req.body;
  const lookupEmail = email || identifier;

  try {
    // Check if using fallback data
    if (isUsingFallback()) {
      const users = getFallbackData().users;
      const user = users.find(u => u.email === lookupEmail);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Hash comparison for fallback mode
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '30d'
      });
      
      return res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    }

    // Only try MongoDB if not in fallback mode
    if (!isUsingFallback()) {
      // Find user by email
      const user = await User.findOne({ email: lookupEmail });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);
      
      return res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    }

    // If we get here, something went wrong
    res.status(500).json({ message: 'Server Error' });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Register route
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if using fallback data
    if (isUsingFallback()) {
      const users = getFallbackData().users;
      
      // Check if user already exists
      const userExists = users.find(u => u.email === email);
      
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user with unique ID
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        isAdmin: false
      };
      
      // Add user to fallback data
      users.push(newUser);
      
      // Save updated users data
      const fallbackData = getFallbackData();
      fallbackData.users = users;
      fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(fallbackData, null, 2));
      
      // Generate token
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '30d'
      });
      
      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        },
        token
      });
    }

    // Only try MongoDB if not in fallback mode
    if (!isUsingFallback()) {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Create new user
      const user = await User.create({
        name,
        email,
        password
      });
      
      if (user) {
        return res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: user._id,
            email: user.email,
            name: user.name
          },
          token: generateToken(user._id)
        });
      } else {
        return res.status(400).json({ message: 'Invalid user data' });
      }
    }

    // If we get here, something went wrong
    res.status(500).json({ message: 'Server Error' });
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
});

// @route   PUT /api/auth/change-password
// @access  Private
// Support both PUT and POST for change-password to satisfy tests
const changePasswordHandler = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    if (isUsingFallback()) {
      const users = getFallbackData().users;
      const user = users.find(u => u.id === userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash comparison for current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid current password' });
      }

      // Hash new password before storing
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(getFallbackData().users, null, 2));

      return res.json({ message: 'Password updated successfully' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(`Change password error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

router.put('/change-password', protect, validatePasswordChange, changePasswordHandler);
router.post('/change-password', protect, validatePasswordChange, changePasswordHandler);

// Social Login OAuth endpoints
// @route   POST /api/auth/social-login
// @access  Public
router.post('/social-login', async (req, res) => {
  const { provider, accessToken, userData } = req.body;
  
  try {
    // Validate required fields
    if (!provider || !accessToken || !userData) {
      return res.status(400).json({ message: 'Provider, access token, and user data are required' });
    }

    // Validate provider
    const validProviders = ['google', 'facebook'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ message: 'Invalid provider. Supported providers: google, facebook' });
    }

    // Validate user data
    if (!userData.email || !userData.name) {
      return res.status(400).json({ message: 'Email and name are required in user data' });
    }

    // Check if using fallback data
    if (isUsingFallback()) {
      const users = getFallbackData().users;
      let user = users.find(u => u.email === userData.email);
      
      if (!user) {
        // Create new social user
        const newUser = {
          id: `user_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          password: await bcrypt.hash(`social_${Date.now()}`, 10), // Random password for social users
          isAdmin: false,
          provider: provider,
          socialId: userData.id || userData.sub
        };
        
        users.push(newUser);
        user = newUser;
        
        // Save updated users data
        const fallbackData = getFallbackData();
        fallbackData.users = users;
        fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(fallbackData, null, 2));
      }
      
      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallbacksecret', {
        expiresIn: '30d'
      });
      
      return res.json({
        message: 'Social login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    }

    // Only try MongoDB if not in fallback mode
    if (!isUsingFallback()) {
      // Find or create user
      let user = await User.findOne({ email: userData.email });
      
      if (!user) {
        // Create new social user
        user = await User.create({
          name: userData.name,
          email: userData.email,
          password: `social_${Date.now()}`, // Random password for social users
          provider: provider,
          socialId: userData.id || userData.sub
        });
      }
      
      // Generate token
      const token = generateToken(user._id);
      
      return res.json({
        message: 'Social login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      });
    }

    // If we get here, something went wrong
    res.status(500).json({ message: 'Server Error' });
  } catch (error) {
    console.error(`Social login error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/auth/google-url
// @access  Public
router.get('/google-url', (req, res) => {
  try {
    // Generate Google OAuth URL (mock implementation)
    const googleAuthUrl = `https://accounts.google.com/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID || 'mock_client_id'}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/auth/google/callback'}&scope=email%20profile&response_type=code`;
    
    res.json({
      message: 'Google OAuth URL generated successfully',
      url: googleAuthUrl
    });
  } catch (error) {
    console.error(`Google OAuth URL error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/auth/facebook-url
// @access  Public
router.get('/facebook-url', (req, res) => {
  try {
    // Generate Facebook OAuth URL (mock implementation)
    const facebookAuthUrl = `https://www.facebook.com/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID || 'mock_app_id'}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:4000/api/auth/facebook/callback'}&scope=email&response_type=code`;
    
    res.json({
      message: 'Facebook OAuth URL generated successfully',
      url: facebookAuthUrl
    });
  } catch (error) {
    console.error(`Facebook OAuth URL error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

const axios = require('axios');

// ... (existing code)

// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Exchange authorization code for access token
    const { data: tokenData } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/auth/google/callback',
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = tokenData;

    // Get user profile from Google
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, picture } = profile;

    // For MongoDB mode, create or find user
    if (!isUsingFallback()) {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          password: `social_${Date.now()}`, // Placeholder for social logins
          provider: 'google',
          socialId: profile.id,
          avatar: picture,
        });
      }

      // Generate token
      const token = generateToken(user._id);

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/#/social-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      }))}`);
      return;
    }

    res.status(500).json({ message: 'Server Error' });
  } catch (error) {
    console.error(`Google callback error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @route   GET /api/auth/facebook/callback
// @access  Public
router.get('/facebook/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Exchange authorization code for access token
    const { data: tokenData } = await axios.get('https://graph.facebook.com/v13.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:4000/api/auth/facebook/callback',
        code,
      },
    });

    const { access_token } = tokenData;

    // Get user profile from Facebook
    const { data: profile } = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture',
        access_token,
      },
    });

    const { email, name, picture } = profile;

    // For MongoDB mode, create or find user
    if (!isUsingFallback()) {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          password: `social_${Date.now()}`, // Placeholder for social logins
          provider: 'facebook',
          socialId: profile.id,
          avatar: picture.data.url,
        });
      }

      // Generate token
      const token = generateToken(user._id);

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/#/social-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      }))}`);
      return;
    }

    res.status(500).json({ message: 'Server Error' });
  } catch (error) {
    console.error(`Facebook callback error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
