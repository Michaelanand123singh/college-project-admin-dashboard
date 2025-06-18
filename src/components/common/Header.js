// src/components/common/Header.js - Modified to remove auth dependencies
import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h2 className="ml-4 text-lg font-semibold text-gray-800 lg:ml-0">
            Admin Dashboard
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <BellIcon className="h-6 w-6" />
          </button>
          
          <div className="relative">
            <div className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;