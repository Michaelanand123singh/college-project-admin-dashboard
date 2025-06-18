// src/App.js - Modified to bypass login
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Direct access to admin routes without authentication */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          {/* Catch all other routes and redirect to dashboard */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;