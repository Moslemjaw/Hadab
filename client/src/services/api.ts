import type { Product } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api');

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('hadab_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData: { name: string; email: string; password: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.user;
  },

  // Products
  async getProducts(params?: { category?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.featured) query.set('featured', 'true');
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.map((p: any) => ({ ...p, id: p._id || p.id }));
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return { ...data, id: data._id || data.id };
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return { ...data, id: data._id || data.id };
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete product');
    }
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((c: any) => ({ ...c, id: c._id || c.id }));
  },

  async createCategory(category: any) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return { ...data, id: data._id || data.id };
  },

  async updateCategory(id: string, category: any) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update category');
    return { ...data, id: data._id || data.id };
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete category');
    }
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.map((o: any) => ({ ...o, id: o._id || o.id }));
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your orders');
    const data = await res.json();
    return data.map((o: any) => ({ ...o, id: o._id || o.id }));
  },

  async updateProfile(profileData: { name?: string; phone?: string; country?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data.user;
  },

  async createOrder(orderData: {
    userId?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    destination: string;
    destinationArabic?: string;
    address?: string;
    items: { productId?: string; name: string; nameArabic?: string; price: number; quantity: number; image?: string }[];
    total: number;
    notes?: string;
    status?: string;
    statusArabic?: string;
    paymentStatus?: string;
    paymentStatusArabic?: string;
  }) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return { ...data, id: data._id || data.id };
  },

  async updateOrderStatus(
    id: string,
    payload: {
      status?: string;
      statusArabic?: string;
      paymentStatus?: 'unpaid' | 'contacting' | 'paid' | string;
      paymentStatusArabic?: string;
      artisan?: string;
    }
  ) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return { ...data, id: data._id || data.id };
  },

  // Customers
  async getCustomers() {
    const res = await fetch(`${API_BASE}/customers`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch customers');
    const data = await res.json();
    return data.map((c: any) => ({ ...c, id: c._id || c.id }));
  },

  // Cloudinary Upload
  async uploadImage(file: File): Promise<{ url: string; public_id: string }> {
    const token = localStorage.getItem('hadab_token');
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data;
  },

  // Admin
  async eraseAllData() {
    const res = await fetch(`${API_BASE}/admin/erase-all`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to erase data');
    return data;
  },
};
