// frontend/src/features/offers/offerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/offers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch offers');
    }
  }
);

// Fetch products for a specific offer
export const fetchOfferProducts = createAsyncThunk(
  'offers/fetchOfferProducts',
  async (offerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/offers/${offerId}/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch offer products');
    }
  }
);

// Fetch all offers for admin
export const fetchAllOffers = createAsyncThunk(
  'offers/fetchAllOffers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/offers/admin/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch offers');
    }
  }
);

export const createOffer = createAsyncThunk(
  'offers/createOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      console.log('Sending to API:', offerData);
      const response = await api.post('/offers', offerData);
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to create offer');
    }
  }
);

export const updateOffer = createAsyncThunk(
  'offers/updateOffer',
  async ({ id, offerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/offers/${id}`, offerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update offer');
    }
  }
);

export const deleteOffer = createAsyncThunk(
  'offers/deleteOffer',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/offers/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete offer');
    }
  }
);

const offerSlice = createSlice({
  name: 'offers',
  initialState: {
    offers: [],
    selectedOffer: null,
    offerProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOffer: (state) => {
      state.selectedOffer = null;
      state.offerProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOfferProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOffer = action.payload.offer;
        state.offerProducts = action.payload.products;
      })
      .addCase(fetchOfferProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.offers.push(action.payload);
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        const index = state.offers.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.offers = state.offers.filter(o => o._id !== action.payload);
      });
  },
});

export const { clearError, clearSelectedOffer } = offerSlice.actions;
export default offerSlice.reducer;

// // frontend/src/features/offers/offerSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // Async thunks
// export const fetchOffers = createAsyncThunk(
//   'offers/fetchOffers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/offers');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch offers');
//     }
//   }
// );

// // New: Fetch products for a specific offer
// export const fetchOfferProducts = createAsyncThunk(
//   'offers/fetchOfferProducts',
//   async (offerId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/offers/${offerId}/products`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch offer products');
//     }
//   }
// );

// // Fetch all offers for admin
// export const fetchAllOffers = createAsyncThunk(
//   'offers/fetchAllOffers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/offers/admin/all');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch offers');
//     }
//   }
// );

// export const createOffer = createAsyncThunk(
//   'offers/createOffer',
//   async (offerData, { rejectWithValue }) => {
//     try {
//       console.log('Sending to API:', offerData);
//       const response = await api.post('/offers', offerData);
//       console.log('Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('API Error:', error.response?.data);
//       return rejectWithValue(error.response?.data?.message || 'Failed to create offer');
//     }
//   }
// );

// export const updateOffer = createAsyncThunk(
//   'offers/updateOffer',
//   async ({ id, offerData }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/offers/${id}`, offerData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update offer');
//     }
//   }
// );

// export const deleteOffer = createAsyncThunk(
//   'offers/deleteOffer',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/offers/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete offer');
//     }
//   }
// );

// const offerSlice = createSlice({
//   name: 'offers',
//   initialState: {
//     offers: [],
//     selectedOffer: null,
//     offerProducts: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSelectedOffer: (state) => {
//       state.selectedOffer = null;
//       state.offerProducts = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Offers
//       .addCase(fetchOffers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOffers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.offers = action.payload;
//       })
//       .addCase(fetchOffers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch All Offers (Admin)
//       .addCase(fetchAllOffers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllOffers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.offers = action.payload;
//       })
//       .addCase(fetchAllOffers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch Offer Products
//       .addCase(fetchOfferProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOfferProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedOffer = action.payload.offer;
//         state.offerProducts = action.payload.products;
//       })
//       .addCase(fetchOfferProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Create Offer
//       .addCase(createOffer.fulfilled, (state, action) => {
//         state.offers.push(action.payload);
//       })
//       // Update Offer
//       .addCase(updateOffer.fulfilled, (state, action) => {
//         const index = state.offers.findIndex(o => o._id === action.payload._id);
//         if (index !== -1) {
//           state.offers[index] = action.payload;
//         }
//       })
//       // Delete Offer
//       .addCase(deleteOffer.fulfilled, (state, action) => {
//         state.offers = state.offers.filter(o => o._id !== action.payload);
//       });
//   },
// });

// export const { clearError, clearSelectedOffer } = offerSlice.actions;
// export default offerSlice.reducer;