import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Tag,
  Phone,
  Home,
  ClipboardList,
  LogIn,
  UserPlus,
  ChevronDown,
  PlusCircle,
  Gift,
  Star,
  AlertTriangle,
  Users,
  Mail,
  Settings,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Heart,
  Shield,
  Layers,
  Edit,
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const profileRef = useRef(null);

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/products', name: 'Products', icon: Package },
    { path: '/offers', name: 'Offers', icon: Tag },
    { path: '/contact', name: 'Contact', icon: Phone },
  ];

  // Complete Admin Routes from App.jsx
  const adminLinks = [
    { 
      category: 'Dashboard',
      items: [
        { path: '/admin', name: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    { 
      category: 'Product Management',
      items: [
        { path: '/admin/products/add', name: 'Add Product', icon: PlusCircle },
        { path: '/admin/products/manage', name: 'Manage Products', icon: Package },
        { path: '/admin/categories', name: 'Categories', icon: Layers }
      ]
    },
    { 
      category: 'Offer Management',
      items: [
        { path: '/admin/offers', name: 'Offers', icon: Gift }
      ]
    },
    { 
      category: 'Order & Review Management',
      items: [
        { path: '/admin/orders', name: 'Orders', icon: ClipboardList },
        { path: '/admin/reviews', name: 'Reviews', icon: Star },
        { path: '/admin/complaints', name: 'Complaints', icon: AlertTriangle }
      ]
    },
    { 
      category: 'Customer Management',
      items: [
        { path: '/admin/customers', name: 'Customers', icon: Users },
        { path: '/admin/users', name: 'Users', icon: User }
      ]
    },
    { 
      category: 'Communication',
      items: [
        { path: '/admin/messages', name: 'Messages', icon: MessageSquare },
        { path: '/admin/contact', name: 'Contact Editor', icon: Edit }
      ]
    }
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 lg:h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                OS
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 leading-none">
                  Om Sai
                </h1>
                <p className="text-xs text-indigo-600 font-medium">
                  Industries
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {userInfo ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-indigo-50 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {userInfo.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {userInfo.name?.split(' ')[0]}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {userInfo.role === 'admin' ? 'Administrator' : userInfo.role || 'Customer'}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn max-h-[80vh] overflow-y-auto">
                      {/* User Header */}
                      <div className="p-5 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-slate-100 sticky top-0">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                            {userInfo.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{userInfo.name}</p>
                            <p className="text-sm text-gray-500">{userInfo.email}</p>
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                              <Shield className="w-3 h-3" />
                              {userInfo.role === 'admin' ? 'Admin Access' : 'Verified Account'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {/* User Section */}
                        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Account
                        </p>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                        >
                          <User className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                        >
                          <ClipboardList className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">My Orders</span>
                        </Link>

                        <Link
                          to="/complaint"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                        >
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">Support Tickets</span>
                        </Link>

                        <Link
                          to="/feedback"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                        >
                          <Star className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">Give Feedback</span>
                        </Link>

                        {/* Admin Section - Complete */}
                        {userInfo.role === 'admin' && (
                          <>
                            <div className="my-2 border-t border-slate-100"></div>
                            
                            {adminLinks.map((section, idx) => (
                              <div key={idx}>
                                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  {section.category}
                                </p>
                                {section.items.map((item) => {
                                  const Icon = item.icon;
                                  return (
                                    <Link
                                      key={item.path}
                                      to={item.path}
                                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                                    >
                                      <Icon className="w-4 h-4 text-indigo-600" />
                                      <span className="text-sm font-medium">{item.name}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            ))}
                          </>
                        )}

                        <div className="my-2 border-t border-slate-100"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium text-sm shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 hover:shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-indigo-50 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg animate-slideDown max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* User Info in Mobile */}
              {userInfo && (
                <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md">
                      {userInfo.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userInfo.name}</p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}

              <Link
                to="/cart"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
              >
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                  >
                    <User className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                  >
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Orders</span>
                  </Link>

                  <Link
                    to="/complaint"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700"
                  >
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Support</span>
                  </Link>

                  {userInfo.role === 'admin' && (
                    <>
                      <div className="my-2 border-t border-slate-100"></div>
                      <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Admin Panel
                      </p>
                      
                      {/* All Admin Links in Mobile */}
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      
                      <Link to="/admin/products/add" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <PlusCircle className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Add Product</span>
                      </Link>
                      
                      <Link to="/admin/products/manage" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <Package className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Manage Products</span>
                      </Link>
                      
                      <Link to="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Categories</span>
                      </Link>
                      
                      <Link to="/admin/offers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <Gift className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Offers</span>
                      </Link>
                      
                      <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <ClipboardList className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Orders</span>
                      </Link>
                      
                      <Link to="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <Star className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Reviews</span>
                      </Link>
                      
                      <Link to="/admin/complaints" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <AlertTriangle className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Complaints</span>
                      </Link>
                      
                      <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Customers</span>
                      </Link>
                      
                      <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <User className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Users</span>
                      </Link>
                      
                      <Link to="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Messages</span>
                      </Link>
                      
                      <Link to="/admin/contact" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 text-gray-700">
                        <Edit className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Contact Editor</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium shadow-md"
                  >
                    <UserPlus className="w-5 h-5" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
