import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchContactInfo = createAsyncThunk(
  'contact/fetchContactInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact info');
    }
  }
);

export const updateContactInfo = createAsyncThunk(
  'contact/updateContactInfo',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.put('/contact/admin/contact', contactData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update contact info');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contactInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contact Info
      .addCase(fetchContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.contactInfo = action.payload;
      })
      .addCase(fetchContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Contact Info
      .addCase(updateContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.contactInfo = action.payload;
      })
      .addCase(updateContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = contactSlice.actions;
export default contactSlice.reducer;