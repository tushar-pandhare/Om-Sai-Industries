import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOffers from "./pages/AdminOffers";
import LoginRegister from "./pages/LoginRegister";
// import UserDashboard from "./pages/UserDashboard"; // create this page
import { useState } from "react";
import Cart from "./pages/Cart";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role")); // use role instead of token

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginRegister setRole={setRole} />} />

        {/* Admin-only Pages */}
        {role === "admin" && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-offers" element={<AdminOffers />} />
            <Route path="/cart" element={<Cart />} />
          </>
        )}

        {/* User-only Pages */}
        {role === "user" && (
          <>
            {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
            <Route path="/" element={<Home />} />
    

          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
