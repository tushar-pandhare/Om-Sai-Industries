// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // Async thunks
// export const createOrder = createAsyncThunk(
//   'orders/createOrder',
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/orders', orderData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create order');
//     }
//   }
// );

// export const fetchMyOrders = createAsyncThunk(
//   'orders/fetchMyOrders',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/orders/myorders');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
//     }
//   }
// );

// export const fetchAllOrders = createAsyncThunk(
//   'orders/fetchAllOrders',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/orders/admin/orders');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
//     }
//   }
// );

// export const updateOrderStatus = createAsyncThunk(
//   'orders/updateOrderStatus',
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/orders/admin/orders/${id}/status`, { status });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
//     }
//   }
// );

// export const cancelOrder = createAsyncThunk(
//   'orders/cancelOrder',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/orders/${id}/cancel`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: 'orders',
//   initialState: {
//     orders: [],
//     currentOrder: null,
//     loading: false,
//     error: null,
//     stockUpdateInProgress: false,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearCurrentOrder: (state) => {
//       state.currentOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create Order
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentOrder = action.payload;
//         state.orders.unshift(action.payload);
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch My Orders
//       .addCase(fetchMyOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchMyOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch All Orders (Admin)
//       .addCase(fetchAllOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(fetchAllOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Update Order Status
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.stockUpdateInProgress = true;
//         state.error = null;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.stockUpdateInProgress = false;
//         const index = state.orders.findIndex(order => order._id === action.payload._id);
//         if (index !== -1) {
//           state.orders[index] = action.payload;
//         }
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.stockUpdateInProgress = false;
//         state.error = action.payload;
//       })
//       // Cancel Order
//       .addCase(cancelOrder.pending, (state) => {
//         state.stockUpdateInProgress = true;
//         state.error = null;
//       })
//       .addCase(cancelOrder.fulfilled, (state, action) => {
//         state.stockUpdateInProgress = false;
//         const index = state.orders.findIndex(order => order._id === action.payload._id);
//         if (index !== -1) {
//           state.orders[index] = action.payload;
//         }
//       })
//       .addCase(cancelOrder.rejected, (state, action) => {
//         state.stockUpdateInProgress = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, clearCurrentOrder } = orderSlice.actions;
// export default orderSlice.reducer;

// features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/myorders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/admin/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// NEW: Fetch single order by ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/admin/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

// NEW: Cancel order with reason
export const cancelOrderWithReason = createAsyncThunk(
  'orders/cancelOrderWithReason',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    stockUpdateInProgress: false,
    orderLoading: false, // NEW: Separate loading for single order
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    // NEW: Clear order loading state
    clearOrderLoading: (state) => {
      state.orderLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // NEW: Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload;
        // Also update in orders array if exists
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload;
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.stockUpdateInProgress = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.stockUpdateInProgress = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update currentOrder if it's the same order
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.stockUpdateInProgress = false;
        state.error = action.payload;
      })
      
      // Cancel Order (original)
      .addCase(cancelOrder.pending, (state) => {
        state.stockUpdateInProgress = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.stockUpdateInProgress = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update currentOrder if it's the same order
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.stockUpdateInProgress = false;
        state.error = action.payload;
      })
      
      // NEW: Cancel Order With Reason
      .addCase(cancelOrderWithReason.pending, (state) => {
        state.stockUpdateInProgress = true;
        state.error = null;
      })
      .addCase(cancelOrderWithReason.fulfilled, (state, action) => {
        state.stockUpdateInProgress = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update currentOrder if it's the same order
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrderWithReason.rejected, (state, action) => {
        state.stockUpdateInProgress = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder, clearOrderLoading } = orderSlice.actions;
export default orderSlice.reducer;