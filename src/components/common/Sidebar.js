import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      name: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/products',
      name: 'Products',
      icon: '💻'
    },
    {
      path: '/orders',
      name: 'Orders',
      icon: '📦'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Software Store</h1>
        <p className="text-gray-400 text-sm">Admin Dashboard</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;