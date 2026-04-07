// import axios from 'axios';

// // Vite uses import.meta.env instead of process.env
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (credentials) => api.post('/auth/login', credentials),
//   getProfile: () => api.get('/auth/profile'),
//   updateProfile: (userData) => api.put('/auth/profile', userData),
// };

// // Product API
// export const productAPI = {
//   getAll: () => api.get('/products'),
//   getById: (id) => api.get(`/products/${id}`),
//   create: (productData) => api.post('/products/admin/products', productData),
//   update: (id, productData) => api.put(`/products/admin/products/${id}`, productData),
//   delete: (id) => api.delete(`/products/admin/products/${id}`),
//   createReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
// };

// // Category API
// export const categoryAPI = {
//   getAll: () => api.get('/categories'),
//   getById: (id) => api.get(`/categories/${id}`),
//   create: (categoryData) => api.post('/categories/admin/categories', categoryData),
//   update: (id, categoryData) => api.put(`/categories/admin/categories/${id}`, categoryData),
//   delete: (id) => api.delete(`/categories/admin/categories/${id}`),
// };

// // Offer API
// export const offerAPI = {
//   getAll: () => api.get('/offers'),
//   getById: (id) => api.get(`/offers/${id}`),
//   create: (offerData) => api.post('/offers/admin/offers', offerData),
//   update: (id, offerData) => api.put(`/offers/admin/offers/${id}`, offerData),
//   delete: (id) => api.delete(`/offers/admin/offers/${id}`),
// };

// // Order API
// export const orderAPI = {
//   create: (orderData) => api.post('/orders', orderData),
//   getMyOrders: () => api.get('/orders/myorders'),
//   getById: (id) => api.get(`/orders/${id}`),
//   getAll: () => api.get('/orders/admin/orders'),
//   updateStatus: (id, status) => api.put(`/orders/admin/orders/${id}/status`, { status }),
// };

// // Complaint API
// export const complaintAPI = {
//   create: (complaintData) => api.post('/complaints', complaintData),
//   getMyComplaints: () => api.get('/complaints/mycomplaints'),
//   getAll: () => api.get('/complaints/admin/complaints'),
//   respond: (id, response) => api.put(`/complaints/admin/complaints/${id}/respond`, { response }),
//   updateStatus: (id, status) => api.put(`/complaints/admin/complaints/${id}/status`, { status }),
// };

// // Contact API
// export const contactAPI = {
//   get: () => api.get('/contact'),
//   update: (contactData) => api.put('/contact/admin/contact', contactData),
// };

// // User API (Admin)
// export const userAPI = {
//   getAll: () => api.get('/users/admin/users'),
//   getById: (id) => api.get(`/users/admin/users/${id}`),
//   updateRole: (id, role) => api.put(`/users/admin/users/${id}/role`, { role }),
//   delete: (id) => api.delete(`/users/admin/users/${id}`),
// };

// // Review API (Admin)
// export const reviewAPI = {
//   getAll: () => api.get('/reviews/admin/reviews'),
//   delete: (id) => api.delete(`/reviews/admin/reviews/${id}`),
// };

// export default api;

import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Product API - Fix the paths
export const productAPI = {
  getAll: () => api.get('/products'),  // GET /api/products
  getById: (id) => api.get(`/products/${id}`),  // GET /api/products/:id
  create: (productData) => api.post('/products/admin/products', productData),  // POST /api/products/admin/products
  update: (id, productData) => api.put(`/products/admin/products/${id}`, productData),  // PUT /api/products/admin/products/:id
  delete: (id) => api.delete(`/products/admin/products/${id}`),  // DELETE /api/products/admin/products/:id
  createReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
};

// Category API - Fixed endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Offer API
export const offerAPI = {
  getAll: () => api.get('/offers'),
  getById: (id) => api.get(`/offers/${id}`),
  create: (offerData) => api.post('/offers', offerData),
  update: (id, offerData) => api.put(`/offers/${id}`, offerData),
  delete: (id) => api.delete(`/offers/${id}`),
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Complaint API
export const complaintAPI = {
  create: (complaintData) => api.post('/complaints', complaintData),
  getMyComplaints: () => api.get('/complaints/mycomplaints'),
  getAll: () => api.get('/complaints'),
  respond: (id, response) => api.put(`/complaints/${id}/respond`, { response }),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
};

// Contact API
export const contactAPI = {
  get: () => api.get('/contact'),
  update: (contactData) => api.put('/contact', contactData),
};

// User API (Admin)
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
};

// Review API (Admin)
export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;