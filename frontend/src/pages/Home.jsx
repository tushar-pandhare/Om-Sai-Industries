import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronRight, Star, Truck, Shield, Clock, TrendingUp, ArrowRight, Package, Zap } from "lucide-react";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, offersRes] = await Promise.all([
          axios.get("http://localhost:5000/omsai/products?limit=4"),
          axios.get("http://localhost:5000/omsai/offers/current")
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 4));
        if (offersRes.data.length > 0) setCurrentOffer(offersRes.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: Truck, title: "Free Delivery", desc: "On orders above ₹999", color: "from-blue-500 to-blue-600" },
    { icon: Shield, title: "Premium Quality", desc: "100% pure & hygienic", color: "from-emerald-500 to-emerald-600" },
    { icon: Clock, title: "Same Day Dispatch", desc: "Orders before 12 PM", color: "from-purple-500 to-purple-600" },
    { icon: TrendingUp, title: "Best Price", desc: "Direct from mill", color: "from-pink-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Since 2010 • Trusted by 10,000+ Customers</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Premium Flour & 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Grains Delivered
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Direct from our mill to your kitchen. Experience the finest quality grains and flour for your family's health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/offers" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              View Offers
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-white/20">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-blue-200 mt-1">Products</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">10k+</div>
              <div className="text-sm text-blue-200 mt-1">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-blue-200 mt-1">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium quality products and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl border border-gray-100"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {currentOffer && (
        <section className="relative mx-4 sm:mx-6 lg:mx-8 mb-16 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="relative py-12 px-6 sm:px-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1 mb-4">
              <span className="text-yellow-200 text-sm font-semibold">🔥 LIMITED TIME OFFER</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{currentOffer.title}</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">{currentOffer.description}</p>
            <Link 
              to="/offers" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Grab Offer
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Featured Products - NO ORANGE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Our best-selling premium collection</p>
            </div>
            <Link 
              to="/products" 
              className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-purple-600 mt-4 sm:mt-0"
            >
              View All
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">₹{product.oldPrice}</span>
                        )}
                      </div>
                      <Link 
                        to={`/product/${product._id}`}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300"
                      >
                        <Package className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their daily needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rajesh Kumar", rating: 5, text: "Excellent quality flour! The taste is just like homemade. Highly recommended!" },
              { name: "Priya Sharma", rating: 5, text: "Fast delivery and great packaging. The grains are fresh and premium quality." },
              { name: "Amit Patel", rating: 5, text: "Best price in the market. Regular customer here for over 2 years!" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-4 sm:mx-6 lg:mx-8 mb-8 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="relative py-16 px-6 sm:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to experience premium quality?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the finest quality flour and grains delivered to your doorstep
          </p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;