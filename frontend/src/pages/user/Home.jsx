import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Sparkles,
  Flame,
  Heart,
  ChevronLeft,
  ChevronRight,
  Package,
  Award,
  CheckCircle
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import OfferBanner from '../../components/OfferBanner';
import { fetchProducts } from '../../features/prdoducts/productSlice';
import { fetchOffers } from '../../features/offers/offerSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { offers, loading: offersLoading } = useSelector((state) => state.offers);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOffers());
  }, [dispatch]);

  const featuredProducts = products?.slice(0, 8) || [];
  const activeOffers = offers?.filter(offer => new Date(offer.endDate) > new Date()) || [];

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

  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: Heart },
    { value: '500+', label: 'Products', icon: Package },
    { value: '50+', label: 'Brands', icon: Award },
    { value: '99%', label: 'Satisfaction', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
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
                <span className="text-sm font-medium text-indigo-100">Welcome to Om Sai Industries</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Quality Products at{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Best Prices
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover premium quality products with exclusive discounts. Shop trusted brands with secure delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Shop Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  View Offers
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                      <Icon className="h-10 w-10 mx-auto mb-3 text-indigo-300" />
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
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Featured Offers Section - Improved Styling */}
      {activeOffers.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-5 py-2 mb-5 shadow-lg">
                <Flame className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-wide">LIMITED TIME OFFERS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Special Deals & Discounts
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Grab these amazing deals before they're gone!
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-6 rounded-full"></div>
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all hidden md:block"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextOffer}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all hidden md:block"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                  </>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeOffers.slice(currentOfferIndex, currentOfferIndex + 3).map((offer) => (
                    <OfferBanner key={offer._id} offer={offer} />
                  ))}
                </div>
                
                {activeOffers.length > 3 && (
                  <div className="flex justify-center gap-3 mt-8">
                    {[...Array(Math.min(activeOffers.length, 3))].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentOfferIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          currentOfferIndex === idx ? 'w-10 bg-indigo-600' : 'w-2.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg border border-indigo-200"
              >
                View All Offers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section - Improved Styling */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-5 py-2 mb-5 shadow-lg">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide">FEATURED COLLECTION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked just for you from our premium collection
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </section>

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
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Home;