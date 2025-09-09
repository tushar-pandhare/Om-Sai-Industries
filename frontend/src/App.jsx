// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import Offers from "./pages/Offers";
// import Contact from "./pages/Contact";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminOffers from "./pages/AdminOffers";
// import LoginRegister from "./pages/LoginRegister";
// // import UserDashboard from "./pages/UserDashboard"; // create this page
// import { useState } from "react";
// import Cart from "./pages/Cart";

// function App() {
//   const [role, setRole] = useState(localStorage.getItem("role")); // use role instead of token

//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Public Pages */}
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/offers" element={<Offers />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/login" element={<LoginRegister setRole={setRole} />} />

//         {/* Admin-only Pages */}
//         {role === "admin" && (
//           <>
//             <Route path="/admin-dashboard" element={<AdminDashboard />} />
//             <Route path="/admin-offers" element={<AdminOffers />} />
//           </>
//         )}

//         {/* User-only Pages */}
//         {role === "user" && (
//           <>
//             {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
//             <Route path="/" element={<Home />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/offers" element={<Offers />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/cart" element={<Cart />} />
//           </>
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOffers from "./pages/AdminOffers";
import LoginRegister from "./pages/LoginRegister";
import Cart from "./pages/Cart";
import { useState, useEffect } from "react";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  // Sync role state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newRole = localStorage.getItem("role");
      setRole(newRole);
    };
    
    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check role on initial load
    const currentRole = localStorage.getItem("role");
    if (currentRole) {
      setRole(currentRole);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Navbar role={role} setRole={setRole} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginRegister setRole={setRole} />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            role === "admin" ? 
              <AdminDashboard /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin-offers" 
          element={
            role === "admin" ? 
              <AdminOffers /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;