// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/auth/authSlice';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Building2, 
  Globe, 
  Shield, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  Edit2, 
  Save, 
  X, 
  CheckCircle,
  Truck,
  Clock,
  Award,
  Camera,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Package,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  
  // Mock stats data - replace with actual API calls
  const stats = {
    totalOrders: 12,
    pendingComplaints: 2,
    reviewsWritten: 8,
    wishlistItems: 5,
    totalSpent: 24580
  };

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        }
      });
    }
  }, [userInfo]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.dismiss(loadingToast);
      toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Profile Updated! 🎉</p>
              <p className="text-sm text-gray-600">Your changes have been saved</p>
            </div>
          </div>
        ),
        {
          duration: 4000,
          style: {
            background: '#F0FDF4',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid #86EFAC',
          },
        }
      );
      setIsEditing(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error || 'Failed to update profile', {
        duration: 3000,
        icon: '❌',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: userInfo.name || '',
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      address: userInfo.address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      }
    });
    setIsEditing(false);
    toast.success('Edit cancelled', {
      icon: '✖️',
      duration: 1500,
    });
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section - Matching Products Page */}
      <div className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-emerald-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Avatar and User Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white">
                  <span className="text-3xl md:text-4xl font-bold">
                    {getInitials(formData.name)}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{formData.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <p className="text-slate-300 text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {formData.email}
                  </p>
                  {formData.phone && (
                    <p className="text-slate-300 text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {formData.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-indigo-500/20 backdrop-blur-sm rounded-full text-xs text-indigo-300">
                    Member since 2024
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-sm rounded-full text-xs text-emerald-300">
                    Verified Account
                  </span>
                </div>
              </div>
            </div>
            
            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Stats Cards - Matching Products Page Style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalOrders}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-medium">Pending Complaints</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingComplaints}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-medium">Reviews Written</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.reviewsWritten}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-slate-100 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-medium">Wishlist Items</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{stats.wishlistItems}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-xs font-medium">Total Spent</p>
                  <p className="text-xl font-bold text-white mt-1">₹{stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Manage your personal details and address</p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        Personal Details
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                  focusedField === 'name' 
                                    ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                    : 'border-slate-200 hover:border-indigo-300'
                                }
                              `}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                  focusedField === 'phone' 
                                    ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                    : 'border-slate-200 hover:border-indigo-300'
                                }
                              `}
                            />
                          </div>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Email cannot be changed
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Address Information */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        Shipping Address
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Street Address
                          </label>
                          <div className="relative">
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('street')}
                              onBlur={() => setFocusedField(null)}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                  focusedField === 'street' 
                                    ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                    : 'border-slate-200 hover:border-indigo-300'
                                }
                              `}
                              placeholder="House number, street name"
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              City
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('city')}
                                onBlur={() => setFocusedField(null)}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                  ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                    focusedField === 'city' 
                                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                      : 'border-slate-200 hover:border-indigo-300'
                                  }
                                `}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('state')}
                              onBlur={() => setFocusedField(null)}
                              disabled={!isEditing}
                              className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                  focusedField === 'state' 
                                    ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                    : 'border-slate-200 hover:border-indigo-300'
                                }
                              `}
                            />
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              PIN Code
                            </label>
                            <input
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleChange}
                              onFocus={() => setFocusedField('pincode')}
                              onBlur={() => setFocusedField(null)}
                              disabled={!isEditing}
                              className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                  focusedField === 'pincode' 
                                    ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                    : 'border-slate-200 hover:border-indigo-300'
                                }
                              `}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Country
                            </label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('country')}
                                onBlur={() => setFocusedField(null)}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all
                                  ${!isEditing ? 'bg-slate-50 border-slate-200 text-slate-500' : 
                                    focusedField === 'country' 
                                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                                      : 'border-slate-200 hover:border-indigo-300'
                                  }
                                `}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border-2 border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Account Status Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 text-white border border-emerald-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Verified</span>
                </div>
                <h3 className="text-lg font-bold">Account Status</h3>
                <p className="text-emerald-100 text-sm mt-1">Your account is fully verified</p>
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Email verified</span>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completeness</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="mt-1 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-700">Order #ORD-1234 delivered</p>
                      <p className="text-xs text-slate-400">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-700">Reviewed "Premium Headphones"</p>
                      <p className="text-xs text-slate-400">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-slate-700">Added 2 items to wishlist</p>
                      <p className="text-xs text-slate-400">1 week ago</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors">
                  View All Activity
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              {/* Quick Tips */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Pro Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">✓</span>
                    Complete your profile to get personalized offers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">✓</span>
                    Write reviews to earn loyalty points
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">✓</span>
                    Add address for faster checkout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;