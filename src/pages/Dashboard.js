import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminAPI';

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

        const revenue = orders.orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

        setStats({
          totalProducts: products.products?.length || 0,
          totalOrders: orders.total || 0,
          totalUsers: users.users?.length || 0,
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
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
          <p className="text-3xl font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add New Product
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            View Orders
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;