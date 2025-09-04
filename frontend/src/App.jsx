import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useState } from "react";
import AdminOffers from "./pages/AdminOffers";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminLogin setToken={setToken} />} />
        {token && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
        {token && <Route path="/admin-offers" element={<AdminOffers />} />}
      </Routes>
    </Router>
  );
}

export default App;
