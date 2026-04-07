import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import productReducer from './features/prdoducts/productSlice';
import cartReducer from './features/cart/cartSlice';
import orderReducer from './features/orders/orderSlice';
import complaintReducer from './features/complaints/complaintSlice';
import categoryReducer from './features/categories/categorySlice';
import offerReducer from './features/offers/offerSlice';
import contactReducer from './features/contact/contactSlice';
import messageReducer from './features/messages/messageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    complaints: complaintReducer,
    categories: categoryReducer,
    offers: offerReducer,
    contact: contactReducer,
    messages: messageReducer,
  },
});