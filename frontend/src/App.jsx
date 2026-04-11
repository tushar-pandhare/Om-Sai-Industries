import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// User Pages
import Home from './pages/user/Home';
import Products from './pages/user/Products';
import ProductDetails from './pages/user/ProductDetails';
import Offers from './pages/user/Offers';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import UserOrders from './pages/user/Orders';  // Renamed to UserOrders
import Complaint from './pages/user/Complaint';
import Feedback from './pages/user/Feedback';
import ContactUs from './pages/user/ContactUs';
import Profile from './pages/user/Profile';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ManageProducts from './pages/admin/ManageProducts';
import Categories from './pages/admin/Categories';
import OffersManagement from './pages/admin/OffersManagement';
import Reviews from './pages/admin/Reviews';
import Complaints from './pages/admin/Complaints';
import AdminOrders from './pages/admin/Orders';  // Renamed to AdminOrders
import CustomerProfiles from './pages/admin/CustomerProfiles';
import ContactEditor from './pages/admin/ContactEditor';
import Users from './pages/admin/Users';
import AdminMessages from './pages/admin/AdminMessages';
import ManageOrderUserSide from './pages/user/ManageOrderUserSide';
import EditProduct from './pages/admin/EditProduct';
import OrderDetails from './pages/admin/OrderDetails';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path='/orders/:id' element={<ManageOrderUserSide />}/>
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={userInfo?.role === 'admin' ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/admin/products/add" element={userInfo?.role === 'admin' ? <AddProduct /> : <Navigate to="/" />} />
        <Route path="/admin/products/manage" element={userInfo?.role === 'admin' ? <ManageProducts /> : <Navigate to="/" />} />
        <Route path="/admin/products/edit/:id" element={userInfo?.role === 'admin' ? <EditProduct /> : <Navigate to="/" />} />
        <Route path="/admin/categories" element={userInfo?.role === 'admin' ? <Categories /> : <Navigate to="/" />} />
        <Route path="/admin/offers" element={userInfo?.role === 'admin' ? <OffersManagement /> : <Navigate to="/" />} />
        <Route path="/admin/reviews" element={userInfo?.role === 'admin' ? <Reviews /> : <Navigate to="/" />} />
        <Route path="/admin/complaints" element={userInfo?.role === 'admin' ? <Complaints /> : <Navigate to="/" />} />
        <Route path="/admin/orders" element={userInfo?.role === 'admin' ? <AdminOrders /> : <Navigate to="/" />} />
        <Route path="/admin/orders/:id" element={userInfo?.role === 'admin' ? <OrderDetails /> : <Navigate to="/" />} />
        <Route path="/admin/customers" element={userInfo?.role === 'admin' ? <CustomerProfiles /> : <Navigate to="/" />} />
        <Route path="/admin/contact" element={userInfo?.role === 'admin' ? <ContactEditor /> : <Navigate to="/" />} />
        <Route path="/admin/users" element={userInfo?.role === 'admin' ? <Users /> : <Navigate to="/" />} />
        <Route path='/admin/messages' element={userInfo?.role == 'admin' ? <AdminMessages /> : <Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import Offers from "./pages/Offers";
// import Contact from "./pages/Contact";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminOffers from "./pages/AdminOffers";
// import LoginRegister from "./pages/LoginRegister";
// import Cart from "./pages/Cart";
// import { useState, useEffect } from "react";

// function App() {
//   const [role, setRole] = useState(localStorage.getItem("role") || null);

//   // Sync role state with localStorage
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const newRole = localStorage.getItem("role");
//       setRole(newRole);
//     };
    
//     // Listen for storage events (changes from other tabs/windows)
//     window.addEventListener('storage', handleStorageChange);
    
//     // Also check role on initial load
//     const currentRole = localStorage.getItem("role");
//     if (currentRole) {
//       setRole(currentRole);
//     }
    
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   return (
//     <Router>
//       <Navbar role={role} setRole={setRole} />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/offers" element={<Offers />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/login" element={<LoginRegister setRole={setRole} />} />
//         <Route path="/cart" element={<Cart />} />
        
//         {/* Protected Admin Routes */}
//         <Route 
//           path="/admin-dashboard" 
//           element={
//             role === "admin" ? 
//               <AdminDashboard /> : 
//               <Navigate to="/login" replace />
//           } 
//         />
//         <Route 
//           path="/admin-offers" 
//           element={
//             role === "admin" ? 
//               <AdminOffers /> : 
//               <Navigate to="/login" replace />
//           } 
//         />
        
//         {/* Catch-all route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;