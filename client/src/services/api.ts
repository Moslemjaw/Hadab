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

  async toggleDisableCustomer(id: string) {
    const res = await fetch(`${API_BASE}/customers/${id}/toggle-disable`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle customer status');
    return data;
  },

  async deleteCustomer(id: string) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete customer');
    return data;
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

  // Settings
  async getSettings(): Promise<Record<string, any>> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) return { baseCurrency: 'KWD', freeShippingThreshold: 25, storeEmail: 'Byhadab@gmail.com' };
      return await res.json();
    } catch {
      return { baseCurrency: 'KWD', freeShippingThreshold: 25, storeEmail: 'Byhadab@gmail.com' };
    }
  },

  async updateSettings(settings: Record<string, any>): Promise<any> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data;
  },

  // Web Push Notifications
  async getVapidKey(): Promise<{ publicKey: string }> {
    const res = await fetch(`${API_BASE}/notifications/vapid-key`);
    if (!res.ok) throw new Error('Failed to fetch VAPID key');
    return await res.json();
  },

  async subscribePush(payload: {
    subscription: any;
    role?: 'admin' | 'customer';
    device?: string;
    userAgent?: string;
    userId?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to subscribe to push');
    return data;
  },

  async unsubscribePush(endpoint: string): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ endpoint }),
    });
    return await res.json();
  },

  async sendTestPush(subscription?: any): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ subscription }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send test notification');
    return data;
  },

  async getPushStats(): Promise<{
    total: number;
    admins: number;
    customers: number;
    iosDevices: number;
  }> {
    const res = await fetch(`${API_BASE}/notifications/stats`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return { total: 0, admins: 0, customers: 0, iosDevices: 0 };
    return await res.json();
  },

  // Messages / Contact Support
  async sendMessage(payload: {
    subject: string;
    message: string;
    orderNumber?: string;
    senderName?: string;
    senderPhone?: string;
  }) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  },

  async getMyMessages() {
    const res = await fetch(`${API_BASE}/messages/my`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load messages');
    return data;
  },

  async getAllMessages() {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load all messages');
    return data;
  },

  async replyMessage(
    id: string,
    reply: string | { adminReply: string; status?: 'in_progress' | 'resolved' },
    status?: 'in_progress' | 'resolved'
  ) {
    const payload = typeof reply === 'string' ? { adminReply: reply, status } : reply;
    const res = await fetch(`${API_BASE}/messages/${id}/reply`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reply to message');
    return data;
  },

  async deleteMessage(id: string) {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete message');
    return data;
  },
};
