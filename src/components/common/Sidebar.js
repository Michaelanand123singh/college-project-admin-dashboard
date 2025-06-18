// src/components/common/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CogIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto lg:h-screen
        flex flex-col
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button 
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        
        <nav className="mt-8 flex-1 overflow-auto">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;