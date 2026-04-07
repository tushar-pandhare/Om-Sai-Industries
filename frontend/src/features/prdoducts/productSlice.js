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
//       const response = await api.post(`/products/${productId}/reviews`, { rating, comment });
//       return { review: response.data, productId };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
//     }
//   }
// );

// // Fetch reviews for a specific product
// // export const fetchProductReviews = createAsyncThunk(
// //   'products/fetchProductReviews',
// //   async (productId, { rejectWithValue }) => {
// //     try {
// //       const response = await api.get(`/reviews/product/${productId}`);
// //       return { reviews: response.data, productId };
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch product reviews');
// //     }
// //   }
// // );

// export const fetchProductReviews = createAsyncThunk(
//   'products/fetchProductReviews',
//   async (productId, { rejectWithValue }) => {
//     try {
//       // CHANGE THIS: Your backend route is /api/reviews/product/:productId
//       // But your slice is calling /reviews/product/${productId} which becomes /api/reviews/product/${productId}
//       // That's actually correct! The issue might be elsewhere
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
//       console.log('Thank Uh for ur response:',response.data)
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
//     productReviews: [], // Reviews for currently selected product
//     reviews: [], // All reviews (admin view)
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
//       // Fetch Products
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
      
//       // Fetch Product By ID
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
      
//       // Create Product
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
      
//       // Update Product
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
      
//       // Delete Product
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
      
//       // Create Review (Submit Review)
//       .addCase(createReview.pending, (state) => {
//         state.reviewSubmitting = true;
//         state.reviewSubmitSuccess = false;
//         state.error = null;
//       })
//       .addCase(createReview.fulfilled, (state, action) => {
//         state.reviewSubmitting = false;
//         state.reviewSubmitSuccess = true;
        
//         // Add the new review to productReviews if it matches current product
//         if (state.selectedProduct?._id === action.payload.productId) {
//           // Refresh product data to get updated rating
//           // This will trigger a re-fetch of the product
//           state.selectedProduct = {
//             ...state.selectedProduct,
//             // The rating and numReviews will be updated when product is re-fetched
//           };
//         }
//       })
//       .addCase(createReview.rejected, (state, action) => {
//         state.reviewSubmitting = false;
//         state.reviewSubmitSuccess = false;
//         state.error = action.payload;
//       })
      
//       // Fetch Product Reviews
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
      
//       // Fetch All Reviews (Admin)
//       .addCase(fetchAllReviews.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllReviews.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reviews = action.payload;
//         console.log('Reviews loaded:', action.payload);
//       })
//       .addCase(fetchAllReviews.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         console.error('Fetch reviews rejected:', action.payload);
//       })
      
//       // Delete Review (Admin)
//       .addCase(deleteReview.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteReview.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reviews = state.reviews.filter(r => r._id !== action.payload);
//         // Also remove from productReviews if present
//         state.productReviews = state.productReviews.filter(r => r._id !== action.payload);
//       })
//       .addCase(deleteReview.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Submit Feedback (General)
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
// frontend/src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Submit a review for a specific product
export const createReview = createAsyncThunk(
  'products/createReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, { rating, comment });
      return { review: response.data, productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

// Fetch reviews for a specific product
export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      return { reviews: response.data, productId };
    } catch (error) {
      console.error('Fetch product reviews error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product reviews');
    }
  }
);

// Fetch all reviews (admin only)
export const fetchAllReviews = createAsyncThunk(
  'products/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews');
      console.log('Reviews loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch reviews error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// Delete a review (admin only)
export const deleteReview = createAsyncThunk(
  'products/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      console.error('Delete review error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

// Submit general feedback (not product-specific)
export const submitFeedback = createAsyncThunk(
  'products/submitFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    productReviews: [],
    reviews: [],
    loading: false,
    error: null,
    reviewSubmitting: false,
    reviewSubmitSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productReviews = [];
    },
    clearReviewSubmitStatus: (state) => {
      state.reviewSubmitSuccess = false;
      state.reviewSubmitting = false;
    },
    clearProductReviews: (state) => {
      state.productReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        if (state.selectedProduct?._id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.reviewSubmitting = true;
        state.reviewSubmitSuccess = false;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewSubmitting = false;
        state.reviewSubmitSuccess = true;
        if (state.selectedProduct?._id === action.payload.productId) {
          state.selectedProduct = {
            ...state.selectedProduct,
          };
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewSubmitting = false;
        state.reviewSubmitSuccess = false;
        state.error = action.payload;
      })
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
        state.productReviews = state.productReviews.filter(r => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSelectedProduct, 
  clearReviewSubmitStatus,
  clearProductReviews 
} = productSlice.actions;

export default productSlice.reducer;