import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SocketProvider } from './context/SocketContext';

// User Pages
import Home from './pages/user/Home';
import Products from './pages/user/Products';
import ProductDetails from './pages/user/ProductDetails';
import Offers from './pages/user/Offers';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import UserOrders from './pages/user/Orders';
import Complaint from './pages/user/Complaint';
import Feedback from './pages/user/Feedback';
import ContactUs from './pages/user/ContactUs';
import Profile from './pages/user/Profile';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import ForgotPassword from './pages/user/ForgotPassword';   // ← NEW
import ManageOrderUserSide from './pages/user/ManageOrderUserSide';
import Settings from './pages/Settings';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ManageProducts from './pages/admin/ManageProducts';
import EditProduct from './pages/admin/EditProduct';
import Categories from './pages/admin/Categories';
import OffersManagement from './pages/admin/OffersManagement';
import Reviews from './pages/admin/Reviews';
import Complaints from './pages/admin/Complaints';
import AdminOrders from './pages/admin/Orders';
import OrderDetails from './pages/admin/OrderDetails';
import CustomerProfiles from './pages/admin/CustomerProfiles';
import ContactEditor from './pages/admin/ContactEditor';
import Users from './pages/admin/Users';
import AdminMessages from './pages/admin/AdminMessages';

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === 'admin';

  return (
    <Router>
      <SocketProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />   {/* ← NEW */}

          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/orders/:id" element={<ManageOrderUserSide />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/admin/products/add" element={isAdmin ? <AddProduct /> : <Navigate to="/" />} />
          <Route path="/admin/products/manage" element={isAdmin ? <ManageProducts /> : <Navigate to="/" />} />
          <Route path="/admin/products/edit/:id" element={isAdmin ? <EditProduct /> : <Navigate to="/" />} />
          <Route path="/admin/categories" element={isAdmin ? <Categories /> : <Navigate to="/" />} />
          <Route path="/admin/offers" element={isAdmin ? <OffersManagement /> : <Navigate to="/" />} />
          <Route path="/admin/reviews" element={isAdmin ? <Reviews /> : <Navigate to="/" />} />
          <Route path="/admin/complaints" element={isAdmin ? <Complaints /> : <Navigate to="/" />} />
          <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <Navigate to="/" />} />
          <Route path="/admin/orders/:id" element={isAdmin ? <OrderDetails /> : <Navigate to="/" />} />
          <Route path="/admin/customers" element={isAdmin ? <CustomerProfiles /> : <Navigate to="/" />} />
          <Route path="/admin/contact" element={isAdmin ? <ContactEditor /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={isAdmin ? <Users /> : <Navigate to="/" />} />
          <Route path="/admin/messages" element={isAdmin ? <AdminMessages /> : <Navigate to="/" />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </SocketProvider>
    </Router>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // User Pages
// import Home from './pages/user/Home';
// import Products from './pages/user/Products';
// import ProductDetails from './pages/user/ProductDetails';
// import Offers from './pages/user/Offers';
// import Cart from './pages/user/Cart';
// import Checkout from './pages/user/Checkout';
// import UserOrders from './pages/user/Orders';  // Renamed to UserOrders
// import Complaint from './pages/user/Complaint';
// import Feedback from './pages/user/Feedback';
// import ContactUs from './pages/user/ContactUs';
// import Profile from './pages/user/Profile';
// import Login from './pages/user/Login';
// import Register from './pages/user/Register';

// // Admin Pages
// import Dashboard from './pages/admin/Dashboard';
// import AddProduct from './pages/admin/AddProduct';
// import ManageProducts from './pages/admin/ManageProducts';
// import Categories from './pages/admin/Categories';
// import OffersManagement from './pages/admin/OffersManagement';
// import Reviews from './pages/admin/Reviews';
// import Complaints from './pages/admin/Complaints';
// import AdminOrders from './pages/admin/Orders';  // Renamed to AdminOrders
// import CustomerProfiles from './pages/admin/CustomerProfiles';
// import ContactEditor from './pages/admin/ContactEditor';
// import Users from './pages/admin/Users';
// import AdminMessages from './pages/admin/AdminMessages';
// import ManageOrderUserSide from './pages/user/ManageOrderUserSide';
// import EditProduct from './pages/admin/EditProduct';
// import OrderDetails from './pages/admin/OrderDetails';
// import Settings from './pages/Settings';
// import { SocketProvider } from './context/SocketContext';

// function App() {
//   const { userInfo } = useSelector((state) => state.auth);

//   return (
//     <Router>
//       <SocketProvider>
//       <Navbar />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
        
//         {/* User Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/offers" element={<Offers />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/orders" element={<UserOrders />} />
//         <Route path='/orders/:id' element={<ManageOrderUserSide />}/>
//         <Route path="/complaint" element={<Complaint />} />
//         <Route path="/feedback" element={<Feedback />} />
//         <Route path="/contact" element={<ContactUs />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/settings" element={<Settings />} />
        
//         {/* Admin Routes */}
//         <Route path="/admin" element={userInfo?.role === 'admin' ? <Dashboard /> : <Navigate to="/" />} />
//         <Route path="/admin/products/add" element={userInfo?.role === 'admin' ? <AddProduct /> : <Navigate to="/" />} />
//         <Route path="/admin/products/manage" element={userInfo?.role === 'admin' ? <ManageProducts /> : <Navigate to="/" />} />
//         <Route path="/admin/products/edit/:id" element={userInfo?.role === 'admin' ? <EditProduct /> : <Navigate to="/" />} />
//         <Route path="/admin/categories" element={userInfo?.role === 'admin' ? <Categories /> : <Navigate to="/" />} />
//         <Route path="/admin/offers" element={userInfo?.role === 'admin' ? <OffersManagement /> : <Navigate to="/" />} />
//         <Route path="/admin/reviews" element={userInfo?.role === 'admin' ? <Reviews /> : <Navigate to="/" />} />
//         <Route path="/admin/complaints" element={userInfo?.role === 'admin' ? <Complaints /> : <Navigate to="/" />} />
//         <Route path="/admin/orders" element={userInfo?.role === 'admin' ? <AdminOrders /> : <Navigate to="/" />} />
//         <Route path="/admin/orders/:id" element={userInfo?.role === 'admin' ? <OrderDetails /> : <Navigate to="/" />} />
//         <Route path="/admin/customers" element={userInfo?.role === 'admin' ? <CustomerProfiles /> : <Navigate to="/" />} />
//         <Route path="/admin/contact" element={userInfo?.role === 'admin' ? <ContactEditor /> : <Navigate to="/" />} />
//         <Route path="/admin/users" element={userInfo?.role === 'admin' ? <Users /> : <Navigate to="/" />} />
//         <Route path='/admin/messages' element={userInfo?.role == 'admin' ? <AdminMessages /> : <Navigate to="/" />} />
//       </Routes>
//       </ SocketProvider>
//       <Footer />
      
//     </Router>
//   );
// }

// export default App;