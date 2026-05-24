// // frontend/src/features/auth/authSlice.js
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
//       // FIXED: Removed ID from URL - backend uses token
//       const response = await api.put('/auth/profile', userData);
//       localStorage.setItem('userInfo', JSON.stringify(response.data));
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Update failed');
//     }
//   }
// );
// export const updatePassword = createAsyncThunk(
//   'auth/updatePassword',
//   async ({ currentPassword, newPassword }, { rejectWithValue, getState }) => {
//     try {
//       const response = await api.put('/auth/password', { currentPassword, newPassword });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Password update failed');
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
//       .addCase(updatePassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updatePassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updatePassword.rejected, (state, action) => {
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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { authAPI } from '../../services/api';

const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put('/auth/profile', userData);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Password update failed');
  }
});

// ─── Forgot Password Thunks ───────────────────────────────────────────────────

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await authAPI.forgotPassword(email);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await authAPI.verifyOTP(email, otp);
    return response.data; // { resetToken }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ resetToken, newPassword }, { rejectWithValue }) => {
  try {
    const response = await authAPI.resetPassword(resetToken, newPassword);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Password reset failed');
  }
});

// ─── Admin Thunks ─────────────────────────────────────────────────────────────

export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/admin/users');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const updateUserRole = createAsyncThunk('auth/updateUserRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/admin/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update role');
  }
});

export const deleteUser = createAsyncThunk('auth/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo,
    users: [],
    loading: false,
    error: null,
    // Forgot password state
    forgotPasswordSent: false,
    otpVerified: false,
    resetToken: null,
    passwordReset: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      state.userInfo = null;
      state.users = [];
      state.error = null;
    },
    clearError: (state) => { state.error = null; },
    clearForgotPassword: (state) => {
      state.forgotPasswordSent = false;
      state.otpVerified = false;
      state.resetToken = null;
      state.passwordReset = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(register.rejected, rejected)

      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(login.rejected, rejected)

      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, rejected)

      .addCase(updatePassword.pending, pending)
      .addCase(updatePassword.fulfilled, (state) => { state.loading = false; })
      .addCase(updatePassword.rejected, rejected)

      // Forgot Password
      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.fulfilled, (state) => { state.loading = false; state.forgotPasswordSent = true; })
      .addCase(forgotPassword.rejected, rejected)

      .addCase(verifyOTP.pending, pending)
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.resetToken = action.payload.resetToken;
      })
      .addCase(verifyOTP.rejected, rejected)

      .addCase(resetPassword.pending, pending)
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false; state.passwordReset = true; })
      .addCase(resetPassword.rejected, rejected)

      // Admin
      .addCase(fetchAllUsers.pending, pending)
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, rejected)

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const i = state.users.findIndex(u => u._id === action.payload._id);
        if (i !== -1) state.users[i] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      });
  },
});

export const { logout, clearError, clearForgotPassword } = authSlice.actions;
export default authSlice.reducer;
