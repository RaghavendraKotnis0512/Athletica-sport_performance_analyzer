import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './LoginPage.css'; // Import the external CSS file
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    console.log(response);
    navigate("/select-sports");   // Move to select sports
  };
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <h1 className="gradient-heading">
          Welcome to <span className="gradient-text">Athletica</span>
        </h1>

        <p className="text-lg text-gray-600">Sign in to continue</p>

        <div className="w-full max-w-sm">
          {/* Email Login */}
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}"
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="input-field"
            required
          />

          <button className="auth-button">Login with Email</button>

          <div className="separator">
            <span>or</span>
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log('Google login failed');
            }}
            render={(renderProps) => (
              <button
                className="auth-option"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Sign in with Google
              </button>
            )}
          />

          <div className="auth-options">
            <button className="auth-option">Sign Up</button>
            <button className="auth-option">Forgot Password?</button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
