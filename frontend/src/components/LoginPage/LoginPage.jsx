import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const db = getFirestore();

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/select-sports');
    } catch (error) {
      alert('Google login failed: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/select-sports');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return alert('Please fill all fields');
    }

    if (password !== confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      // Check if username already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return alert('Username already taken');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Save username to Firestore
      await addDoc(usersRef, {
        uid: result.user.uid,
        email,
        username,
      });

      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/select-sports');
    } catch (error) {
      alert('Signup failed: ' + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert('Enter your email');
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Reset link sent to email.');
    } catch (error) {
      alert('Reset failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="gradient-heading">
        Welcome to <span className="gradient-text">Athletica</span>
      </h1>

      <p className="text-lg text-gray-600">{isSignup ? 'Create an account' : 'Sign in to continue'}</p>

      <div className="w-full max-w-sm">
        {isSignup && (
          <input
            type="text"
            placeholder="Enter a username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          className="auth-button"
          onClick={isSignup ? handleSignup : handleLogin}
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </button>

        {!isSignup && (
          <button className="auth-option" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        )}

        <div className="separator"><span>or</span></div>

        <button className="auth-option" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <div className="auth-options">
          <button className="auth-option" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
