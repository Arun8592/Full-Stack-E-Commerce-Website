import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const getAdminProducts = () => API.get('/products/admin/all');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const createPaymentIntent = (data) => API.post('/orders/create-payment-intent', data);
export const updateOrderToPaid = (id, data) => API.put(`/orders/${id}/pay`, data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params) => API.get('/orders/admin/all', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getDashboardStats = () => API.get('/orders/admin/stats');

// Admin
export const getAllUsers = () => API.get('/admin/users');
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
