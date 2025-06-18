// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import adminAPI from '../services/adminAPI';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-md ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders, users] = await Promise.all([
          adminAPI.getProducts(),
          adminAPI.getOrders(),
          adminAPI.getUsers()
        ]);

        const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBagIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCartIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={CurrencyDollarIcon}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New order received</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Product updated</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New user registered</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
              Add New Product
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700">
              View Orders
            </button>
            <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;