import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tag, 
  Clock, 
  Gift, 
  Percent, 
  ChevronRight,
  Calendar,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Shield,
  Award,
  Search,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import { fetchOffers } from '../../features/offers/offerSlice';
import toast from 'react-hot-toast';

const Offers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { offers, loading } = useSelector((state) => state.offers);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const getActiveOffers = () => {
    return offers?.filter(offer => new Date(offer.endDate) > new Date()) || [];
  };

  const getExpiredOffers = () => {
    return offers?.filter(offer => new Date(offer.endDate) <= new Date()) || [];
  };

  const filteredOffers = () => {
    let filtered = offers || [];
    
    if (selectedFilter === 'active') {
      filtered = getActiveOffers();
    } else if (selectedFilter === 'expired') {
      filtered = getExpiredOffers();
    }
    
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStats = () => {
    const activeOffers = getActiveOffers();
    const expiredOffers = getExpiredOffers();
    const highestDiscount = Math.max(...(offers?.map(o => o.discountValue) || [0]));
    
    return { 
      activeOffers: activeOffers.length, 
      expiredOffers: expiredOffers.length, 
      highestDiscount 
    };
  };

  const stats = getStats();
  const displayOffers = filteredOffers();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    toast.success('Filters cleared', {
      icon: '✨',
      duration: 1500,
      style: {
        background: '#F3F4F6',
        color: '#374151',
        borderRadius: '10px',
      },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedFilter !== 'all') count++;
    return count;
  };

  // Offer Card Component with fixed Shop Now navigation
  const OfferCard = ({ offer, isExpired = false }) => {
    const isActive = new Date(offer.endDate) > new Date();
    const daysLeft = Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    const handleShopNow = () => {
      if (!isActive) {
        toast.error('This offer has expired', {
          icon: '⏰',
          duration: 2000,
        });
        return;
      }
      
      // Navigate to products page with offer details in URL params
      navigate(`/products?offer=${offer._id}&title=${encodeURIComponent(offer.title)}&discount=${offer.discountValue}&type=${offer.discountType}`);
    };
    
    return (
      <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 ${isExpired ? 'opacity-75' : ''}`}>
        {/* Discount Badge */}
        <div className="relative">
          <div className={`absolute top-4 right-4 z-10 ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-slate-500'} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
            {offer.discountType === 'percentage' 
              ? `${offer.discountValue}% OFF` 
              : `₹${offer.discountValue} OFF`}
          </div>
          
          {/* Decorative top bar */}
          <div className={`h-2 ${isActive ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-slate-300'}`}></div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{offer.title}</h3>
            {offer.description && (
              <p className="text-slate-500 text-sm">{offer.description}</p>
            )}
          </div>
          
          {/* Timer / Status */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {isActive ? (
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600 font-medium">
                  {daysLeft > 0 ? `${daysLeft} days left` : 'Ending soon'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400">Expired</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Tag className="h-4 w-4" />
              <span>Limited time</span>
            </div>
          </div>
          
          {/* Validity Period */}
          <div className="bg-slate-50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Valid from:</span>
              <span className="font-medium text-slate-700">
                {new Date(offer.startDate).toLocaleDateString()}
              </span>
              <span className="text-slate-400">→</span>
              <span className="font-medium text-slate-700">
                {new Date(offer.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* CTA Button - Fixed Shop Now */}
          <button
            onClick={handleShopNow}
            disabled={!isActive}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg transform hover:scale-[1.02]' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isActive ? (
              <>
                Shop Now
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              'Offer Expired'
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-light tracking-widest uppercase text-xs">Loading Offers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section - Matching Products Page */}
      <div className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-emerald-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            Limited Time Only
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Offers</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Unlock amazing discounts and save big on your favorite products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        
        {/* Stats Cards - Matching Products Page */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Active Offers</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.activeOffers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Max Discount</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.highestDiscount}%</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Percent className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Offers</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{offers?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar - Matching Products Page */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 md:p-3 mb-8 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search offers by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shrink-0"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-semibold">Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-5 py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                    selectedFilter === 'all'
                      ? 'bg-white shadow-sm text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('active')}
                  className={`px-5 py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                    selectedFilter === 'active'
                      ? 'bg-white shadow-sm text-emerald-600'
                      : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedFilter('expired')}
                  className={`px-5 py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                    selectedFilter === 'expired'
                      ? 'bg-white shadow-sm text-slate-600'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Expired
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filters Indicator */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="text-sm text-slate-500">
                {displayOffers.length} offer{displayOffers.length !== 1 ? 's' : ''} found
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* No Results */}
        {displayOffers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No offers found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No offers matching "${searchTerm}"` 
                : selectedFilter === 'active' 
                  ? 'No active offers at the moment. Check back soon!' 
                  : 'No offers available right now'}
            </p>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md"
              >
                View All Offers
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Active Offers Section */}
            {selectedFilter === 'all' && getActiveOffers().length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-7 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-slate-800">🔥 Active Offers</h2>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {getActiveOffers().length} available
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getActiveOffers().map((offer) => (
                    <OfferCard key={offer._id} offer={offer} isExpired={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Expired Offers Section */}
            {selectedFilter === 'all' && getExpiredOffers().length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-7 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-slate-800">📋 Past Offers</h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {getExpiredOffers().length} expired
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getExpiredOffers().map((offer) => (
                    <OfferCard key={offer._id} offer={offer} isExpired={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Single View */}
            {selectedFilter !== 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayOffers.map((offer) => (
                  <OfferCard 
                    key={offer._id} 
                    offer={offer} 
                    isExpired={selectedFilter === 'expired'} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel - Matching Products Page */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Filter Offers</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Offer Status</label>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Offers', icon: Gift },
                    { id: 'active', label: 'Active Only', icon: Flame },
                    { id: 'expired', label: 'Expired', icon: Calendar }
                  ].map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedFilter(option.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          selectedFilter === option.id
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={clearFilters}
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-slide-left {
          animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Offers;