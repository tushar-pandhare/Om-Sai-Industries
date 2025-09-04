import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);

  useEffect(() => {
    // Fetch exactly 3 featured products
    axios.get("http://localhost:5000/omsai/products?limit=3")
      .then(res => setFeaturedProducts(res.data.slice(0, 3))) // Ensure only 3 products
      .catch(err => console.error(err));
    
    // Fetch a current offer if available
    axios.get("http://localhost:5000/omsai/offers/current")
      .then(res => {
        if (res.data.length > 0) setCurrentOffer(res.data[0]);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center pt-20 pb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80')"}}
        ></div>
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
            Premium Flour & Grains
          </h1>
          <p className="text-lg md:text-xl text-blue-800 mb-8">
            Directly from our mill to your kitchen. Experience the finest quality grains and flour for your family's health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
            <Link 
              to="/offers" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Special Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            Why Choose Om Sai Industry?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Premium Quality</h3>
              <p className="text-blue-600">Carefully selected grains processed with traditional methods for the best nutrition.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Direct from Mill</h3>
              <p className="text-blue-600">Get fresh products directly from our mill without any middlemen for better prices.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Fast Delivery</h3>
              <p className="text-blue-600">Quick and reliable delivery services to ensure you get the freshest products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {currentOffer && (
        <section className="py-12 px-4 md:px-8 bg-blue-700 text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentOffer.title}</h2>
              <p className="mb-4">{currentOffer.description}</p>
              <p className="text-sm">Valid till: {new Date(currentOffer.validTill).toLocaleDateString()}</p>
            </div>
            <Link 
              to="/offers" 
              className="px-6 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              View Offer
            </Link>
          </div>
        </section>
      )}

      {/* Featured Products - Limited to 3 */}
      <section className="py-16 px-4 md:px-8 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-4">
            Featured Products
          </h2>
          <p className="text-center text-blue-700 max-w-2xl mx-auto mb-12">
            Discover our premium selection of flour and grain products
          </p>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {featuredProducts.slice(0, 3).map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 w-full max-w-sm">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">{product.name}</h3>
                    <p className="text-blue-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-700">₹{product.price}</span>
                      <Link 
                        to="/products" 
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-blue-700">Loading our premium products...</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              View All Products
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              About Om Sai Industry
            </h2>
            <p className="text-blue-700 mb-4">
              With years of experience in grain processing, Om Sai Industry has established itself as a trusted name for quality flour and grains. We combine traditional methods with modern technology to bring you the finest products.
            </p>
            <p className="text-blue-700 mb-6">
              Our commitment to quality ensures that every packet that leaves our mill meets the highest standards of purity and nutrition.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
              Learn more about us
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://media.istockphoto.com/id/2088223899/photo/young-woman-enjoys-vegan-salad-at-outdoor-cafe.jpg?s=2048x2048&w=is&k=20&c=7_dcn1cF8CFeIeEqyNUGQghR-nOnFYVp5Cf3D9AT2rM=" 
              alt="Flour mill process" 
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Our Quality Products?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join hundreds of satisfied customers who trust Om Sai Industry for their daily flour and grain needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="px-8 py-3 bg-white text-blue-800 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg shadow-md border border-white hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;