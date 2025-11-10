import React, { useState, useEffect } from 'react';
import { useAppState } from '../state/AppState.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import { getGoogleOAuthUrl, getFacebookOAuthUrl } from '../services/auth.js';

const SocialLoginView = ({ provider }) => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const { socialLogin, isAuthenticated } = useAppState();

  useEffect(() => {
    const handleSocialLogin = async () => {
      try {
        setStatus('loading');
        
        // Get the appropriate OAuth URL based on provider
        let oauthUrl;
        if (provider === 'google') {
          oauthUrl = getGoogleOAuthUrl();
        } else if (provider === 'facebook') {
          oauthUrl = getFacebookOAuthUrl();
        }
        
        // For development/demo purposes, we'll simulate the OAuth flow
        // In production, you would redirect to oauthUrl and handle the callback
        setStatus('processing');
        
        // Simulate the OAuth process delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock social user data (in production, this would come from OAuth callback)
        const mockSocialUser = {
          id: `${provider}_user_${Date.now()}`,
          name: provider === 'google' ? 'Google User' : 'Facebook User',
          email: `user@${provider}.com`,
          provider: provider,
          providerId: `${provider}_id_${Date.now()}`,
          avatar: '/images/avatar/placeholder.svg',
          token: `social_token_${Date.now()}`
        };
        
        // Use social login function from AppState
        await socialLogin(mockSocialUser);
        
        setStatus('success');
        
        // Redirect to profile after successful login
        setTimeout(() => {
          window.location.hash = '#/profile';
        }, 1500);
        
      } catch (err) {
        setError(err.message || `Failed to login with ${provider}`);
        setStatus('error');
      }
    };

    // Start social login process
    handleSocialLogin();
  }, [provider, socialLogin]);

  // If already authenticated, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '#/profile';
    }
  }, [isAuthenticated]);

  const getProviderIcon = () => {
    if (provider === 'google') {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`;
      case 'processing':
        return `Authenticating with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`;
      case 'success':
        return `Successfully logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`;
      case 'error':
        return error;
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="bg-white py-16 md:py-24 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            {getProviderIcon()}
          </div>
          
          <h1 className="text-2xl font-serif font-semibold mb-4">
            {provider.charAt(0).toUpperCase() + provider.slice(1)} Login
          </h1>
          
          <div className="mb-6">
            {status === 'loading' || status === 'processing' ? (
              <div className="flex flex-col items-center">
                <LoadingSpinner />
                <p className="text-gray-600 mt-4">{getStatusMessage()}</p>
              </div>
            ) : status === 'success' ? (
              <div className="text-green-600">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{getStatusMessage()}</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting to your profile...</p>
              </div>
            ) : (
              <div className="text-red-600">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{getStatusMessage()}</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => window.location.hash = '#/login'}
                    className="w-full bg-brand-dark text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
           
            <p>In production, you would redirect to {provider}'s OAuth page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginView;