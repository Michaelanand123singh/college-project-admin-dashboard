const API_BASE = 'https://college-backend-51y3.onrender.com/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};

export const adminAPI = {
  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE}/products`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  // Orders
  getOrders: async (page = 1, status = '') => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_BASE}/orders/admin/all?${params}`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${API_BASE}/users/admin/all`, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },

  updateUserStatus: async (id, status) => {
    const response = await fetch(`${API_BASE}/users/admin/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};