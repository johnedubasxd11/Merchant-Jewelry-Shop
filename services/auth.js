
// Auth service for handling user authentication (LEGACY - Use api.js instead)
// This service is maintained for backward compatibility but new code should use api.js

const USER_STORAGE_KEY = 'userInfo';

/**
 * LEGACY: Simulates a login API call.
 * @deprecated Use api.login() instead
 */
export const login = async (email, password) => {
  console.warn('auth.js login() is deprecated. Use api.login() instead.');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, you'd make a network request here.
      if (email.toLowerCase() === 'alex.doe@example.com' && password === 'password123') {
        try {
          const user = {
            id: 'user1',
            name: 'Alex Doe',
            email: 'alex.doe@example.com',
            token: 'deprecated-token'
          };
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          resolve(user);
        } catch (error) {
          reject(new Error("Could not save user session."));
        }
      } else {
        reject(new Error("Invalid email or password."));
      }
    }, 500);
  });
};

/**
 * LEGACY: Register a new user
 * @deprecated Use api.register() instead
 */
export const register = async (name, email, password) => {
  console.warn('auth.js register() is deprecated. Use api.register() instead.');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newUser = {
          id: 'user2',
          name,
          email,
          token: 'deprecated-token'
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        resolve(newUser);
      } catch (error) {
        reject(new Error("Could not register user."));
      }
    }, 500);
  });
};

/**
 * LEGACY: Simulates a logout action by clearing the user session.
 * @deprecated Use api.logout() instead
 */
export const logout = () => {
  console.warn('auth.js logout() is deprecated. Use api.logout() instead.');
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    // Clear any deprecated user data
    localStorage.removeItem('deprecated_user_data');
  } catch (error) {
    console.error("Could not clear user session.", error);
  }
};

/**
 * Retrieves the current user from the session storage.
 * @returns {Object|null} The user object if logged in, otherwise null.
 */
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Could not retrieve user from session.", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

/**
 * Get user profile
 * @returns {Promise<Object>} A promise that resolves with the user profile
 */
export const getUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getCurrentUser());
    }, 300);
  });
};

/**
 * Get auth token
 * @returns {string|null} The authentication token or null if not authenticated
 */
export const getToken = () => {
  const userInfo = getCurrentUser();
  return userInfo ? userInfo.token : null;
};

/**
 * Handle social login (Google/Facebook)
 * @param {Object} socialUser - User data from social provider
 * @param {string} socialUser.id - Social provider user ID
 * @param {string} socialUser.name - User's name
 * @param {string} socialUser.email - User's email
 * @param {string} socialUser.provider - Social provider ('google' or 'facebook')
 * @param {string} socialUser.avatar - User's avatar URL
 * @param {string} socialUser.token - Social provider access token
 * @returns {Promise<Object>} A promise that resolves with the user object
 */
export const socialLogin = async (socialUser) => {
  console.log('Processing social login for:', socialUser.provider);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // In production, this would:
        // 1. Verify the social token with the provider
        // 2. Create/update user in your database
        // 3. Generate your own JWT token
        
        const user = {
          id: socialUser.id,
          name: socialUser.name,
          email: socialUser.email,
          provider: socialUser.provider,
          providerId: socialUser.providerId || socialUser.id,
          avatar: socialUser.avatar || '/images/avatar/placeholder.svg',
          token: socialUser.token || `social_token_${Date.now()}`,
          isSocialLogin: true
        };
        
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      } catch (error) {
        reject(new Error(`Social login failed: ${error.message}`));
      }
    }, 1000);
  });
};

/**
 * Initialize Google OAuth
 * @returns {Promise<void>} A promise that resolves when Google OAuth is initialized
 */
export const initGoogleOAuth = async () => {
  console.log('Initializing Google OAuth...');
  // In production, this would load the Google OAuth script
  // and initialize with your client ID
  return Promise.resolve();
};

/**
 * Initialize Facebook OAuth
 * @returns {Promise<void>} A promise that resolves when Facebook OAuth is initialized
 */
export const initFacebookOAuth = async () => {
  console.log('Initializing Facebook OAuth...');
  // In production, this would load the Facebook SDK
  // and initialize with your app ID
  return Promise.resolve();
};

/**
 * Get Google OAuth URL
 * @returns {string} The Google OAuth authorization URL
 */
export const getGoogleOAuthUrl = () => {
  // In development, redirect to our backend OAuth endpoint
  // In production, this would be your actual Google OAuth URL
  return 'http://localhost:4000/api/auth/google-url';
};

/**
 * Get Facebook OAuth URL
 * @returns {string} The Facebook OAuth authorization URL
 */
export const getFacebookOAuthUrl = () => {
  // In development, redirect to our backend OAuth endpoint
  // In production, this would be your actual Facebook OAuth URL
  return 'http://localhost:4000/api/auth/facebook-url';
};
