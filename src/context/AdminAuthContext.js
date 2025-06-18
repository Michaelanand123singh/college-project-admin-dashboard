// src/context/AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import adminAPI from '../services/adminAPI';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have a stored token and validate it
    const checkStoredAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        try {
          const response = await adminAPI.verifyToken(storedToken);
          if (response.user && response.user.role === 'admin') {
            setUser(response.user);
            setError(null);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (err) {
          console.error('Stored token validation failed:', err);
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    checkStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Attempting Firebase login for:', email);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // Prepare login data for backend
      const loginData = {
        idToken,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid
      };

      // Send to backend for verification and JWT token
      const response = await adminAPI.login(loginData);

      if (response.user && response.user.role === 'admin') {
        localStorage.setItem('adminToken', response.token);
        setUser(response.user);
        setError(null);
        console.log('Admin login successful');
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      // Sign out from Firebase if backend login fails
      await signOut(auth);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('adminToken');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  // 🔥 FIX: Add the missing functions to the value object
  const value = {
    user,
    setUser,        // ✅ Added
    login,
    logout,
    loading,
    setLoading,     // ✅ Added
    error,
    setError        // ✅ Added
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;