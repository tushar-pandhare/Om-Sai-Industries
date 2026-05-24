import axios from 'axios';

// Vite uses import.meta.env - use VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API_URL:', API_URL); // Debug log

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
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, error.response?.status, error.message);
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

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products/admin/products', productData),
  update: (id, productData) => api.put(`/products/admin/products/${id}`, productData),
  delete: (id) => api.delete(`/products/admin/products/${id}`),
  createReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
};

// Category API
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

// Message API
export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  getUsers: () => api.get('/messages/users/all'),
  getUnreadCount: () => api.get('/messages/unread/count'),
  markAsRead: (messageIds) => api.put('/messages/mark-read', { messageIds }),
  sendContact: (data) => api.post('/messages/contact', data),
};

export default api;
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

// // Product API - Fix the paths
// export const productAPI = {
//   getAll: () => api.get('/products'),  // GET /api/products
//   getById: (id) => api.get(`/products/${id}`),  // GET /api/products/:id
//   create: (productData) => api.post('/products/admin/products', productData),  // POST /api/products/admin/products
//   update: (id, productData) => api.put(`/products/admin/products/${id}`, productData),  // PUT /api/products/admin/products/:id
//   delete: (id) => api.delete(`/products/admin/products/${id}`),  // DELETE /api/products/admin/products/:id
//   createReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
// };

// // Category API - Fixed endpoints
// export const categoryAPI = {
//   getAll: () => api.get('/categories'),
//   getById: (id) => api.get(`/categories/${id}`),
//   create: (categoryData) => api.post('/categories', categoryData),
//   update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
//   delete: (id) => api.delete(`/categories/${id}`),
// };

// // Offer API
// export const offerAPI = {
//   getAll: () => api.get('/offers'),
//   getById: (id) => api.get(`/offers/${id}`),
//   create: (offerData) => api.post('/offers', offerData),
//   update: (id, offerData) => api.put(`/offers/${id}`, offerData),
//   delete: (id) => api.delete(`/offers/${id}`),
// };

// // Order API
// export const orderAPI = {
//   create: (orderData) => api.post('/orders', orderData),
//   getMyOrders: () => api.get('/orders/myorders'),
//   getById: (id) => api.get(`/orders/${id}`),
//   getAll: () => api.get('/orders'),
//   updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
// };

// // Complaint API
// export const complaintAPI = {
//   create: (complaintData) => api.post('/complaints', complaintData),
//   getMyComplaints: () => api.get('/complaints/mycomplaints'),
//   getAll: () => api.get('/complaints'),
//   respond: (id, response) => api.put(`/complaints/${id}/respond`, { response }),
//   updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
// };

// // Contact API
// export const contactAPI = {
//   get: () => api.get('/contact'),
//   update: (contactData) => api.put('/contact', contactData),
// };

// // User API (Admin)
// export const userAPI = {
//   getAll: () => api.get('/users'),
//   getById: (id) => api.get(`/users/${id}`),
//   updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
//   delete: (id) => api.delete(`/users/${id}`),
// };

// // Review API (Admin)
// export const reviewAPI = {
//   getAll: () => api.get('/reviews'),
//   delete: (id) => api.delete(`/reviews/${id}`),
// };

// export default api;