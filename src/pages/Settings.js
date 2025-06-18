// src/pages/Settings.js
import React, { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const Settings = () => {
  const { user, logout } = useAdminAuth();
  const [settings, setSettings] = useState({
    siteName: 'E-commerce Store',
    siteDescription: 'Your digital marketplace',
    currency: 'USD',
    taxRate: 10,
    emailNotifications: true,
    orderNotifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">General Settings</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Description</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                min="0"
                max="100"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Save Settings
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="mr-2"
                />
                Email Notifications
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="orderNotifications"
                  checked={settings.orderNotifications}
                  onChange={handleChange}
                  className="mr-2"
                />
                Order Notifications
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-md font-medium mb-4">Account Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user?.name}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role:</span> {user?.role}</p>
            </div>
            
            <button
              onClick={logout}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;