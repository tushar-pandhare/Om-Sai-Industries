// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // Async thunks
// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/products');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
//     }
//   }
// );

// export const fetchProductById = createAsyncThunk(
//   'products/fetchProductById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/products/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
//     }
//   }
// );

// export const createProduct = createAsyncThunk(
//   'products/createProduct',
//   async (productData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/products', productData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create product');
//     }
//   }
// );

// export const updateProduct = createAsyncThunk(
//   'products/updateProduct',
//   async ({ id, productData }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/products/${id}`, productData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update product');
//     }
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   'products/deleteProduct',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/products/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
//     }
//   }
// );

// // Submit a review for a specific product
// export const createReview = createAsyncThunk(
//   'products/createReview',
//   async ({ productId, rating, comment }, { rejectWithValue }) => {
//     try {
      
//       console.log('Submitting review for product:', productId);
      
//       const response = await api.post(`/reviews/product/${productId}`, { 
//         rating: Number(rating), 
//         comment: comment.trim() 
//       });
      
//       console.log('Review submitted successfully:', response.data);
//       return { review: response.data, productId };
//     } catch (error) {
//       console.error('Create review error:', error);
//       return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
//     }
//   }
// );

// // Fetch reviews for a specific product
// export const fetchProductReviews = createAsyncThunk(
//   'products/fetchProductReviews',
//   async (productId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/reviews/product/${productId}`);
//       return { reviews: response.data, productId };
//     } catch (error) {
//       console.error('Fetch product reviews error:', error);
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch product reviews');
//     }
//   }
// );

// // Fetch all reviews (admin only)
// export const fetchAllReviews = createAsyncThunk(
//   'products/fetchAllReviews',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/reviews');
//       console.log('Reviews loaded:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Fetch reviews error:', error);
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
//     }
//   }
// );

// // Delete a review (admin only)
// export const deleteReview = createAsyncThunk(
//   'products/deleteReview',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/reviews/${id}`);
//       return id;
//     } catch (error) {
//       console.error('Delete review error:', error);
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
//     }
//   }
// );

// // Submit general feedback (not product-specific)
// export const submitFeedback = createAsyncThunk(
//   'products/submitFeedback',
//   async (feedbackData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/feedback', feedbackData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
//     }
//   }
// );

// const productSlice = createSlice({
//   name: 'products',
//   initialState: {
//     products: [],
//     selectedProduct: null,
//     productReviews: [],
//     reviews: [],
//     loading: false,
//     error: null,
//     reviewSubmitting: false,
//     reviewSubmitSuccess: false,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSelectedProduct: (state) => {
//       state.selectedProduct = null;
//       state.productReviews = [];
//     },
//     clearReviewSubmitStatus: (state) => {
//       state.reviewSubmitSuccess = false;
//       state.reviewSubmitting = false;
//     },
//     clearProductReviews: (state) => {
//       state.productReviews = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchProductById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProductById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedProduct = action.payload;
//       })
//       .addCase(fetchProductById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products.push(action.payload);
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.products.findIndex(p => p._id === action.payload._id);
//         if (index !== -1) {
//           state.products[index] = action.payload;
//         }
//         if (state.selectedProduct?._id === action.payload._id) {
//           state.selectedProduct = action.payload;
//         }
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = state.products.filter(p => p._id !== action.payload);
//         if (state.selectedProduct?._id === action.payload) {
//           state.selectedProduct = null;
//         }
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createReview.pending, (state) => {
//         state.reviewSubmitting = true;
//         state.reviewSubmitSuccess = false;
//         state.error = null;
//       })
//       .addCase(createReview.fulfilled, (state, action) => {
//         state.reviewSubmitting = false;
//         state.reviewSubmitSuccess = true;
//         if (state.selectedProduct?._id === action.payload.productId) {
//           state.selectedProduct = {
//             ...state.selectedProduct,
//           };
//         }
//       })
//       .addCase(createReview.rejected, (state, action) => {
//         state.reviewSubmitting = false;
//         state.reviewSubmitSuccess = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchProductReviews.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProductReviews.fulfilled, (state, action) => {
//         state.loading = false;
//         state.productReviews = action.payload.reviews;
//       })
//       .addCase(fetchProductReviews.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchAllReviews.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllReviews.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reviews = action.payload;
//       })
//       .addCase(fetchAllReviews.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteReview.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteReview.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reviews = state.reviews.filter(r => r._id !== action.payload);
//         state.productReviews = state.productReviews.filter(r => r._id !== action.payload);
//       })
//       .addCase(deleteReview.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(submitFeedback.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(submitFeedback.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(submitFeedback.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { 
//   clearError, 
//   clearSelectedProduct, 
//   clearReviewSubmitStatus,
//   clearProductReviews 
// } = productSlice.actions;

// export default productSlice.reducer;

// features/prdoducts/productSlice.js — FIXED
// Bug: fetchProductReviews returned { reviews, averageRating, totalReviews, ratingDistribution }
// but the fulfilled handler was doing `state.productReviews = action.payload.reviews`
// which is correct IF the server response has a `reviews` key — but the thunk was returning
// response.data which is the full object. Fixed to always extract .reviews array safely.
// Also: createReview now optimistically adds the new review to productReviews so the list
// updates instantly without needing a full refetch.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
  }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', productData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

// ─── Review Thunks ────────────────────────────────────────────────────────────

export const createReview = createAsyncThunk(
  'products/createReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/reviews/product/${productId}`, {
        rating: Number(rating),
        comment: comment.trim()
      });
      return { review: data.review, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

// FIXED: response.data is { success, reviews, averageRating, totalReviews, ratingDistribution }
// so we return the full data and extract .reviews in the fulfilled handler
export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      // data = { success, reviews: [...], averageRating, totalReviews, ratingDistribution }
      return { reviews: Array.isArray(data.reviews) ? data.reviews : [], productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchAllReviews = createAsyncThunk('products/fetchAllReviews', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/reviews');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
  }
});

export const deleteReview = createAsyncThunk('products/deleteReview', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/reviews/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
  }
});

export const submitFeedback = createAsyncThunk('products/submitFeedback', async (feedbackData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/feedback', feedbackData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    productReviews: [],
    reviews: [],
    loading: false,
    reviewsLoading: false,
    error: null,
    reviewSubmitting: false,
    reviewSubmitSuccess: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSelectedProduct: (state) => { state.selectedProduct = null; state.productReviews = []; },
    clearReviewSubmitStatus: (state) => { state.reviewSubmitSuccess = false; state.reviewSubmitting = false; },
    clearProductReviews: (state) => { state.productReviews = []; },
  },
  extraReducers: (builder) => {
    const p = (state) => { state.loading = true; state.error = null; };
    const r = (state, a) => { state.loading = false; state.error = a.payload; };

    builder
      .addCase(fetchProducts.pending, p)
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected, r)

      .addCase(fetchProductById.pending, p)
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductById.rejected, r)

      .addCase(createProduct.pending, p)
      .addCase(createProduct.fulfilled, (state, action) => { state.loading = false; state.products.push(action.payload); })
      .addCase(createProduct.rejected, r)

      .addCase(updateProduct.pending, p)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const i = state.products.findIndex(p => p._id === action.payload._id);
        if (i !== -1) state.products[i] = action.payload;
        if (state.selectedProduct?._id === action.payload._id) state.selectedProduct = action.payload;
      })
      .addCase(updateProduct.rejected, r)

      .addCase(deleteProduct.pending, p)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        if (state.selectedProduct?._id === action.payload) state.selectedProduct = null;
      })
      .addCase(deleteProduct.rejected, r)

      // createReview — optimistically add to productReviews
      .addCase(createReview.pending, (state) => { state.reviewSubmitting = true; state.reviewSubmitSuccess = false; state.error = null; })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewSubmitting = false;
        state.reviewSubmitSuccess = true;
        if (action.payload.review) {
          state.productReviews = [action.payload.review, ...state.productReviews];
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewSubmitting = false;
        state.reviewSubmitSuccess = false;
        state.error = action.payload;
      })

      // fetchProductReviews — FIXED: extracts .reviews from payload
      .addCase(fetchProductReviews.pending, (state) => { state.reviewsLoading = true; state.error = null; })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.productReviews = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllReviews.pending, p)
      .addCase(fetchAllReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
      .addCase(fetchAllReviews.rejected, r)

      .addCase(deleteReview.pending, p)
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.productReviews = state.productReviews.filter(r => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, r)

      .addCase(submitFeedback.pending, p)
      .addCase(submitFeedback.fulfilled, (state) => { state.loading = false; })
      .addCase(submitFeedback.rejected, r);
  },
});

export const { clearError, clearSelectedProduct, clearReviewSubmitStatus, clearProductReviews } = productSlice.actions;
export default productSlice.reducer;
