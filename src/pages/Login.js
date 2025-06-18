// src/pages/Login.js - DEBUG VERSION
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebase'; // Your firebase app instance
import { useAdminAuth } from '../context/AdminAuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { user, setUser, loading, setLoading, setError, error } = useAdminAuth();

  const auth = getAuth(app);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setLocalError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Step 1: Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ Step 2: Firebase auth successful:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified
      });

      console.log('🎫 Step 3: Getting ID token...');
      const idToken = await firebaseUser.getIdToken();
      console.log('✅ ID Token obtained:', {
        tokenLength: idToken.length,
        tokenPreview: idToken.substring(0, 50) + '...'
      });

      const loginData = {
        idToken,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid
      };

      console.log('📤 Step 4: Sending to backend:', {
        ...loginData,
        idToken: `[${idToken.length} chars]`
      });

      const response = await fetch('https://college-backend-51y3.onrender.com/api/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('📥 Step 5: Backend response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        
        // Check if it's a JSON error
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`Backend error: ${errorJson.message || errorText}`);
        } catch (parseError) {
          throw new Error(`Backend error (${response.status}): ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('✅ Step 6: Login successful:', {
        hasToken: !!data.token,
        hasUser: !!data.user,
        userRole: data.user?.role
      });

      if (data.user?.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('adminToken', data.token);
      setUser(data.user);

    } catch (err) {
      console.error('❌ Login failed:', err);
      setLocalError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={loading}
              />
            </div>
          </div>

          {displayError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{displayError}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* DEBUG INFO */}
        <div className="mt-4 p-3 bg-gray-100 text-xs text-gray-600 rounded">
          <p><strong>Debug Info:</strong></p>
          <p>Firebase App: {app ? '✅ Connected' : '❌ Not connected'}</p>
          <p>Auth: {auth ? '✅ Initialized' : '❌ Not initialized'}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;