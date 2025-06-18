// src/services/adminAPI.js
const API_BASE_URL = 'https://college-backend-51y3.onrender.com/api';

class AdminAPI {
  // Always use latest token from localStorage
  setAuthHeader() {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.setAuthHeader(),
      credentials: 'include', // CORS + cookie support
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // 🔐 Auth

  async login(credentials) {
    try {
      console.log('AdminAPI.login called with:', { 
        email: credentials?.email,
        hasIdToken: !!credentials?.idToken 
      });

      // ✅ Ensure we're sending the correct format that backend expects
      const loginData = {
        idToken: credentials.idToken,
        email: credentials.email,
        displayName: credentials.displayName,
        photoURL: credentials.photoURL,
        uid: credentials.uid
      };

      console.log('Sending login data:', { 
        ...loginData, 
        idToken: loginData.idToken ? '[PRESENT]' : '[MISSING]' 
      });

      const response = await fetch(`${API_BASE_URL}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        throw new Error(`Login failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async verifyToken(token) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error(`Token verification failed: ${response.status}`);
    }

    return response.json();
  }

  // 📦 Products

  async getProducts() {
    return this.request('/products');
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // 👥 Users

  async getUsers() {
    return this.request('/users/admin/all');
  }

  async updateUserStatus(id, status) {
    return this.request(`/users/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // 📦 Orders

  async getOrders() {
    return this.request('/orders');
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // 📊 Dashboard

  async getDashboardStats() {
    return this.request('/admin/stats');
  }
}

// ✅ Export single instance
const adminAPI = new AdminAPI();

export default adminAPI;