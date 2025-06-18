import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const Header = () => {
  const { user, logout } = useAdminAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.name || 'Admin'}
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;