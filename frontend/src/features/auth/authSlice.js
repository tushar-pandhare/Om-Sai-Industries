// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // Get user from localStorage
// const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

// // Async thunks
// export const register = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/register', userData);
//       localStorage.setItem('userInfo', JSON.stringify(response.data));
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// export const login = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       localStorage.setItem('userInfo', JSON.stringify(response.data));
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );

// export const updateProfile = createAsyncThunk(
//   'auth/updateProfile',
//   async (userData, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await api.put('/users/profile', userData);
//       localStorage.setItem('userInfo', JSON.stringify(response.data));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Update failed');
//     }
//   }
// );

// export const fetchAllUsers = createAsyncThunk(
//   'auth/fetchAllUsers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/users/admin/users');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
//     }
//   }
// );

// export const updateUserRole = createAsyncThunk(
//   'auth/updateUserRole',
//   async ({ id, role }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/users/admin/users/${id}/role`, { role });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update role');
//     }
//   }
// );

// export const deleteUser = createAsyncThunk(
//   'auth/deleteUser',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/admin/users/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     userInfo: userInfo,
//     users: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('token');
//       state.userInfo = null;
//       state.users = [];
//       state.error = null;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Update Profile
//       .addCase(updateProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userInfo = action.payload;
//         localStorage.setItem('userInfo', JSON.stringify(action.payload));
//       })
//       .addCase(updateProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch All Users
//       .addCase(fetchAllUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchAllUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Update User Role
//       .addCase(updateUserRole.fulfilled, (state, action) => {
//         const index = state.users.findIndex(user => user._id === action.payload._id);
//         if (index !== -1) {
//           state.users[index] = action.payload;
//         }
//       })
//       // Delete User
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.users = state.users.filter(user => user._id !== action.payload);
//       });
//   },
// });

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;

// frontend/src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get user from localStorage
const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      // FIXED: Removed ID from URL - backend uses token
      const response = await api.put('/auth/profile', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfo,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      state.userInfo = null;
      state.users = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;