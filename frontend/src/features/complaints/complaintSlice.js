import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const createComplaint = createAsyncThunk(
  'complaints/createComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      console.log('Sending to API:', complaintData);
      const response = await api.post('/complaints', complaintData);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to submit complaint');
    }
  }
);

export const fetchMyComplaints = createAsyncThunk(
  'complaints/fetchMyComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/complaints/mycomplaints');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchAllComplaints = createAsyncThunk(
  'complaints/fetchAllComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/complaints/admin/complaints');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const respondToComplaint = createAsyncThunk(
  'complaints/respondToComplaint',
  async ({ id, response }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/complaints/admin/complaints/${id}/respond`, { response });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send response');
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'complaints/updateComplaintStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/complaints/${id}/status`, { status });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const complaintSlice = createSlice({
  name: 'complaints',
  initialState: {
    complaints: [],
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
      // Create Complaint
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.unshift(action.payload);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Complaints
      .addCase(fetchMyComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchMyComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Complaints (Admin)
      .addCase(fetchAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Respond to Complaint
      .addCase(respondToComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      })
      // Update Complaint Status
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      });
  },
});

export const { clearError } = complaintSlice.actions;
export default complaintSlice.reducer;