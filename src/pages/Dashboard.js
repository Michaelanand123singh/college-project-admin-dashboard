import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    featuredProducts: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for fallback
  const mockProducts = [
    {
      id: 1,
      name: 'Adobe Photoshop 2024',
      price: 299.99,
      category: 'Design',
      featured: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Microsoft Office 365',
      price: 149.00,
      category: 'Productivity',
      featured: false,
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      name: 'Antivirus Pro 2024',
      price: 89.99,
      category: 'Security',
      featured: true,
      createdAt: '2024-01-13T09:15:00Z'
    }
  ];

  const mockOrders = [
    {
      id: 1,
      customerName: 'John Doe',
      total: 299.99,
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      total: 149.00,
      status: 'pending',
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      customerName: 'Bob Johnson',
      total: 89.99,
      status: 'processing',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let products = mockProducts;
      let orders = mockOrders;

      // Try to fetch real data, fallback to mock data
      try {
        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          products = productsData.products || productsData;
        }
      } catch (error) {
        console.log('Using mock products data');
      }

      try {
        const ordersResponse = await fetch(`${API_BASE_URL}/orders/all`, { headers });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          orders = ordersData.orders || ordersData;
        }
      } catch (error) {
        console.log('Using mock orders data');
      }

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const featuredProducts = products.filter(p => p.featured).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        featuredProducts: featuredProducts
      });

      // Get recent products (last 5)
      const sortedProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentProducts(sortedProducts);

      // Get recent orders (last 5)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(sortedOrders);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data as final fallback
      setStats({
        totalProducts: mockProducts.length,
        totalOrders: mockOrders.length,
        totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
        featuredProducts: mockProducts.filter(p => p.featured).length
      });
      setRecentProducts(mockProducts.slice(0, 5));
      setRecentOrders(mockOrders.slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your software store admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="💻"
          color="bg-blue-100"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          color="bg-green-100"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          color="bg-yellow-100"
        />
        <StatCard
          title="Featured Products"
          value={stats.featuredProducts}
          icon="⭐"
          color="bg-purple-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/products'}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition duration-200"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">➕</span>
                <p className="font-medium text-blue-800">Add New Product</p>
                <p className="text-sm text-blue-600">Add software to your store</p>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/orders'}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition duration-200"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">📋</span>
                <p className="font-medium text-green-800">View Orders</p>
                <p className="text-sm text-green-600">Manage customer orders</p>
              </div>
            </button>
            <button
              onClick={fetchDashboardData}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition duration-200"
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">🔄</span>
                <p className="font-medium text-purple-800">Refresh Data</p>
                <p className="text-sm text-purple-600">Update dashboard stats</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Products</h2>
          </div>
          <div className="p-6">
            {recentProducts.length > 0 ? (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <span className="text-sm font-medium text-green-600">${product.price.toFixed(2)}</span>
                        {product.featured && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Added {formatDate(product.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📦</span>
                <p className="text-gray-500">No products found</p>
                <p className="text-sm text-gray-400">Products will appear here once added</p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => window.location.href = '/products'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              View All Products
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                        <span className="font-medium text-green-600">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">{order.customerName}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🛒</span>
                <p className="text-gray-500">No orders found</p>
                <p className="text-sm text-gray-400">Orders will appear here once customers make purchases</p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => window.location.href = '/orders'}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Quick Stats</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalProducts > 0 ? ((stats.featuredProducts / stats.totalProducts) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Featured Products</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Order Value</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {recentOrders.filter(order => order.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Recent Completed Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;