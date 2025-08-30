import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

const GoogleLogin: React.FC = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 300,
        }
      );
    }
  };

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      await loginWithGoogle(response.credential);
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Make handleCredentialResponse available globally
  useEffect(() => {
    window.handleCredentialResponse = handleCredentialResponse;
  }, []);

  if (isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>You are already signed in!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Sign in to Kuboot</h2>
      <p>Sign in with your Google account to start posting works</p>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#ffeaea',
          border: '1px solid #ffcdd2',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div>Signing in...</div>
      ) : (
        <div id="google-signin-button" style={{ margin: '20px auto' }}></div>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Note:</strong> To use Google Sign-In, you need to set up a Google Cloud project and configure OAuth. 
        Set your Google Client ID in the environment variable <code>REACT_APP_GOOGLE_CLIENT_ID</code>.
      </div>
    </div>
  );
};

export default GoogleLogin;