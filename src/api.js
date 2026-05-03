import axios from 'axios';

const API = axios.create({ baseURL: 'https://qcu-coop-api.onrender.com/api' });

// Automatically attach token to every request
API.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// AUTH
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getMe         = ()     => API.get('/auth/me');

// PRODUCTS
export const getProducts   = (category) => API.get('/products', { params: { category } });
export const getProduct    = (id)   => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id)   => API.delete(`/products/${id}`);

// ORDERS
export const placeOrder    = (data) => API.post('/orders', data);
export const getMyOrders   = ()     => API.get('/orders/my');
export const getAllOrders   = ()     => API.get('/orders');
export const updateOrder   = (id, data) => API.put(`/orders/${id}`, data);

export const uploadImage = (formData) => API.post('/products/upload-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;