import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  RefreshCw, 
  CreditCard, 
  ArrowRight, 
  Star, 
  TrendingUp,
  Shield,
  Clock,
  Gift,
  ChevronRight,
  Sparkles,
  Flame,
  Heart,
  Eye,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Gem,
  Leaf,
  Zap
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import OfferBanner from '../../components/OfferBanner';
import { fetchProducts } from '../../features/prdoducts/productSlice';
import { fetchOffers } from '../../features/offers/offerSlice';

// Simple placeholder component
const PlaceholderImage = ({ width = 80, height = 80, text }) => (
  <div 
    style={{ 
      width: `${width}px`, 
      height: `${height}px`, 
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '12px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }}
  >
    {text || `${width}×${height}`}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { offers, loading: offersLoading } = useSelector((state) => state.offers);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOffers());
  }, [dispatch]);

  const featuredProducts = products?.slice(0, 8) || [];
  const activeOffers = offers?.filter(offer => new Date(offer.endDate) > new Date()) || [];
  const newArrivals = products?.slice(0, 4) || [];
  const bestSellers = products?.slice(4, 8) || [];

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️', color: 'blue', count: products?.length || 0 },
    { id: 'electronics', name: 'Electronics', icon: '📱', color: 'indigo', count: 120 },
    { id: 'clothing', name: 'Fashion', icon: '👕', color: 'violet', count: 85 },
    { id: 'home', name: 'Home & Living', icon: '🏠', color: 'teal', count: 64 },
    { id: 'beauty', name: 'Beauty', icon: '💄', color: 'pink', count: 42 },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'cyan', count: 38 },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders above ₹999',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure transactions',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Customer service anytime',
      color: 'rose',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: Heart, gradient: 'from-pink-500 to-rose-500' },
    { value: '500+', label: 'Products', icon: ShoppingBag, gradient: 'from-blue-500 to-indigo-500' },
    { value: '50+', label: 'Categories', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
    { value: '99%', label: 'Satisfaction', icon: Gem, gradient: 'from-violet-500 to-purple-500' },
  ];

  // Auto-rotate offers carousel
  useEffect(() => {
    if (activeOffers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % Math.min(activeOffers.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeOffers.length]);

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % Math.min(activeOffers.length, 3));
  };

  const prevOffer = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + Math.min(activeOffers.length, 3)) % Math.min(activeOffers.length, 3));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section - No orange, using blue/purple gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-indigo-300" />
                <span className="text-sm font-medium text-indigo-100">Summer Sale is Live! Up to 50% OFF</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Om Sai Industries
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover quality products at unbeatable prices. Shop the latest collection with exclusive discounts up to 50% off.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5 group-hover:animate-bounce" />
                  Shop Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <Gift className="h-5 w-5" />
                  View Offers
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="group relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      <Icon className="h-10 w-10 mx-auto mb-3 text-indigo-300 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-indigo-200">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-4 py-1.5 mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Shop by Category</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Browse Categories</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Explore our wide range of products across different categories</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const colorClasses = {
              blue: 'hover:border-blue-500 group-hover:bg-blue-50',
              indigo: 'hover:border-indigo-500 group-hover:bg-indigo-50',
              violet: 'hover:border-violet-500 group-hover:bg-violet-50',
              teal: 'hover:border-teal-500 group-hover:bg-teal-50',
              pink: 'hover:border-pink-500 group-hover:bg-pink-50',
              cyan: 'hover:border-cyan-500 group-hover:bg-cyan-50'
            };
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative bg-white rounded-2xl p-6 text-center border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity ${colorClasses[category.color]}`}></div>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{category.name}</h3>
                <p className="text-xs text-slate-400">{category.count} items</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Offers Carousel - No orange, using rose/pink/red gradient */}
      {activeOffers.length > 0 && (
        <section className="bg-gradient-to-r from-rose-50 via-pink-50 to-indigo-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full px-4 py-1.5 mb-4 shadow-lg">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-medium">Limited Time Offers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Special Deals & Discounts</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Grab these amazing deals before they're gone!</p>
            </div>
            
            {offersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="relative">
                {activeOffers.length > 1 && (
                  <>
                    <button
                      onClick={prevOffer}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
                    >
                      <ChevronLeft className="h-6 w-6 text-slate-600" />
                    </button>
                    <button
                      onClick={nextOffer}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
                    >
                      <ChevronRight className="h-6 w-6 text-slate-600" />
                    </button>
                  </>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeOffers.slice(currentOfferIndex, currentOfferIndex + 3).map((offer) => (
                    <OfferBanner key={offer._id} offer={offer} />
                  ))}
                </div>
                
                {activeOffers.length > 3 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {[...Array(Math.min(activeOffers.length, 3))].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentOfferIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          currentOfferIndex === idx ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center mt-10">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-md"
              >
                View All Offers
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {/* <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Best Sellers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Featured Products</h2>
            <p className="text-slate-500">Handpicked just for you from our premium collection</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold group"
          >
            View All Products
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section> */}

      {/* New Arrivals & Best Sellers */}
<section className="bg-white py-16">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12">
      {/* New Arrivals */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-800">New Arrivals</h2>
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">Fresh Collection</span>
        </div>
        <div className="space-y-4">
          {newArrivals.map((product) => {
            const displayPrice = product.discountedPrice || product.price;
            const originalPrice = product.originalPrice || product.price;
            const hasDiscount = product.discountedPrice && product.discountedPrice < product.originalPrice;
            
            return (
              <div key={product._id} className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-all flex gap-4 border border-slate-100">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <PlaceholderImage width={80} height={80} text="No Image" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{product.description?.substring(0, 60)}...</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</span>
                          <span className="text-sm text-gray-400 line-through">₹{Math.round(originalPrice).toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</span>
                      )}
                    </div>
                    <Link to={`/product/${product._id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View Details →</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Sellers */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-800">Best Sellers</h2>
          <span className="bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full">Top Rated</span>
        </div>
        <div className="space-y-4">
          {bestSellers.map((product) => {
            const displayPrice = product.discountedPrice || product.price;
            const originalPrice = product.originalPrice || product.price;
            const hasDiscount = product.discountedPrice && product.discountedPrice < product.originalPrice;
            
            return (
              <div key={product._id} className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-all flex gap-4 border border-slate-100">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <PlaceholderImage width={80} height={80} text="No Image" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < (product.rating || 4) ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">({product.reviewCount || 128})</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{product.name}</h3>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</span>
                          <span className="text-sm text-gray-400 line-through">₹{Math.round(originalPrice).toLocaleString()}</span>
                          <span className="text-xs text-green-600">-{product.discountPercent}%</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-indigo-600">₹{Math.round(displayPrice).toLocaleString()}</span>
                      )}
                    </div>
                    <Link to={`/product/${product._id}`} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section - Updated colors */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Why Choose Us?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Experience the best shopping experience with our premium services</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group text-center p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Updated to indigo/purple gradient */}
      {/* <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Stay Updated</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Subscribe to Our Newsletter</h2>
            <p className="text-indigo-100 mb-6">Get the latest updates on new products, exclusive offers, and upcoming sales</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105">
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-indigo-200 mt-4">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section> */}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;