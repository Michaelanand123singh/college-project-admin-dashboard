import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Users', href: '/users', icon: UserGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar = () => {
  return (
    <div className="bg-gray-800 w-64 min-h-screen">
      <div className="p-4">
        <h1 className="text-white text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                isActive ? 'bg-gray-700 text-white border-r-2 border-blue-500' : ''
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;