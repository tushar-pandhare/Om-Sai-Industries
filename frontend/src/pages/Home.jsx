import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/omsai/products?limit=3")
      .then(res => setFeaturedProducts(res.data.slice(0, 3)))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/omsai/offers/current")
      .then(res => {
        if (res.data.length > 0) setCurrentOffer(res.data[0]);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 font-sans">
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80')"}}></div>
        <div className="relative z-10 text-center px-6 md:px-12 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
            Premium Flour & Grains
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Direct from our mill to your kitchen. Experience the finest grains and flour for your family's health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
              Browse Products
            </Link>
            <Link to="/offers" className="px-8 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg shadow-lg hover:bg-white/30 transition-colors">
              Special Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Om Sai Industry?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Premium Quality", desc: "Carefully selected grains processed with traditional methods.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Direct from Mill", desc: "Fresh products without middlemen for better prices.", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
              { title: "Fast Delivery", desc: "Quick and reliable delivery to ensure freshness.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-8 rounded-xl bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl transition-shadow">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white mb-4">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      {currentOffer && (
        <section className="py-12 px-6 md:px-12 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-xl mx-6 md:mx-12 my-12 shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentOffer.title}</h2>
              <p className="mb-4">{currentOffer.description}</p>
              <p className="text-sm">Valid till: {new Date(currentOffer.validTill).toLocaleDateString()}</p>
            </div>
            <Link to="/offers" className="px-6 py-2 bg-white text-red-500 font-semibold rounded-lg shadow-lg hover:bg-white/90 transition-colors">
              View Offer
            </Link>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Featured Products</h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">Discover our premium selection of flour and grain products</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 w-full max-w-sm">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-500">₹{product.price}</span>
                    <Link to="/products" className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-sm font-semibold rounded-md hover:scale-105 transition-transform">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-700">Loading our premium products...</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl mx-6 md:mx-12 my-12 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Our Quality Products?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join hundreds of satisfied customers who trust Om Sai Industry for their daily flour and grain needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
              Shop Now
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-white text-red-500 font-semibold rounded-lg shadow-lg hover:bg-white/90 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
