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

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   Menu, 
//   X, 
//   ShoppingCart, 
//   User, 
//   LogOut, 
//   LayoutDashboard, 
//   Package, 
//   Tag, 
//   Phone,
//   Home,
//   ShoppingBag,
//   ClipboardList,
//   LogIn,
//   UserPlus,
//   ChevronDown
// } from 'lucide-react';
// import { logout } from '../features/auth/authSlice';

// const Navbar = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setIsMenuOpen(false);
//     setIsProfileOpen(false);
//   }, [location]);

//   // Get cart count from localStorage and listen for cart updates
//   const updateCartCount = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     setCartCount(cart.length);
//   };

//   useEffect(() => {
//     updateCartCount();
    
//     // Listen for cart updates (when items are added/removed)
//     window.addEventListener('cartUpdated', updateCartCount);
//     window.addEventListener('storage', updateCartCount);
    
//     return () => {
//       window.removeEventListener('cartUpdated', updateCartCount);
//       window.removeEventListener('storage', updateCartCount);
//     };
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//     setIsProfileOpen(false);
//     setIsMenuOpen(false);
//   };

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const navLinks = [
//     { path: '/', name: 'Home', icon: Home },
//     { path: '/products', name: 'Products', icon: Package },
//     { path: '/offers', name: 'Offers', icon: Tag },
//     { path: '/contact', name: 'Contact', icon: Phone },
//   ];

//   return (
//     <>
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled 
//           ? 'bg-white/95 backdrop-blur-md shadow-lg' 
//           : 'bg-white shadow-md'
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16 sm:h-20">
            
//             {/* Logo */}
//             <Link 
//               to="/" 
//               className="flex items-center gap-2 group"
//             >
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
//                 <span className="text-white font-bold text-lg sm:text-xl">OS</span>
//               </div>
//               <div>
//                 <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                   Om Sai
//                 </span>
//                 <span className="hidden sm:inline text-lg sm:text-xl font-bold text-slate-600"> Industries</span>
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-1 lg:gap-2">
//               {navLinks.map((link) => {
//                 const Icon = link.icon;
//                 return (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     className={`relative px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
//                       ${isActive(link.path) 
//                         ? 'text-slate-800 bg-slate-100' 
//                         : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
//                       }`}
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span>{link.name}</span>
//                     {isActive(link.path) && (
//                       <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-slate-800 rounded-full"></span>
//                     )}
//                   </Link>
//                 );
//               })}

//               {/* Cart Icon for all users */}
//               <Link
//                 to="/cart"
//                 className={`relative p-2 rounded-lg transition-all duration-200 flex items-center gap-1
//                   ${isActive('/cart') 
//                     ? 'text-slate-800 bg-slate-100' 
//                     : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
//                   }`}
//               >
//                 <ShoppingCart className="h-5 w-5" />
//                 <span className="hidden lg:inline text-sm font-medium">Cart</span>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
//                     {cartCount > 99 ? '99+' : cartCount}
//                   </span>
//                 )}
//               </Link>

//               {/* User Section */}
//               {userInfo ? (
//                 <div className="relative ml-2">
//                   <button
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200"
//                   >
//                     <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold">
//                       {userInfo.name?.charAt(0).toUpperCase() || 'U'}
//                     </div>
//                     <span className="text-slate-700 font-medium hidden lg:block">
//                       {userInfo.name?.split(' ')[0]}
//                     </span>
//                     <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   {/* Dropdown Menu */}
//                   {isProfileOpen && (
//                     <>
//                       <div 
//                         className="fixed inset-0 z-40"
//                         onClick={() => setIsProfileOpen(false)}
//                       />
//                       <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
//                         <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
//                           <p className="text-sm font-medium text-slate-800">{userInfo.name}</p>
//                           <p className="text-xs text-slate-500 mt-0.5">{userInfo.email}</p>
//                           {userInfo.phone && (
//                             <p className="text-xs text-slate-500 mt-0.5">{userInfo.phone}</p>
//                           )}
//                         </div>
                        
//                         <div className="py-2">
//                           {userInfo.role === 'admin' && (
//                             <Link
//                               to="/admin"
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
//                               onClick={() => setIsProfileOpen(false)}
//                             >
//                               <LayoutDashboard className="h-4 w-4" />
//                               Admin Dashboard
//                             </Link>
//                           )}
                          
//                           <Link
//                             to="/orders"
//                             className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <ClipboardList className="h-4 w-4" />
//                             My Orders
//                           </Link>
                          
//                           <Link
//                             to="/cart"
//                             className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
//                             onClick={() => setIsProfileOpen(false)}
//                           >
//                             <ShoppingCart className="h-4 w-4" />
//                             My Cart
//                             {cartCount > 0 && (
//                               <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
//                                 {cartCount}
//                               </span>
//                             )}
//                           </Link>
                          
//                           <button
//                             onClick={handleLogout}
//                             className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200 mt-1"
//                           >
//                             <LogOut className="h-4 w-4" />
//                             Sign Out
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 ml-2">
//                   <Link
//                     to="/login"
//                     className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 flex items-center gap-2"
//                   >
//                     <LogIn className="h-4 w-4" />
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
//                   >
//                     <UserPlus className="h-4 w-4" />
//                     Register
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-white border-t border-slate-200 shadow-lg animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
//             <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
//               {/* Navigation Links */}
//               {navLinks.map((link) => {
//                 const Icon = link.icon;
//                 return (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
//                       isActive(link.path)
//                         ? 'bg-slate-100 text-slate-800'
//                         : 'text-slate-600 hover:bg-slate-50'
//                     }`}
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <Icon className="h-5 w-5" />
//                     <span className="font-medium">{link.name}</span>
//                   </Link>
//                 );
//               })}

//               {/* Cart Link - Prominent in mobile menu */}
//               <Link
//                 to="/cart"
//                 className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
//                   isActive('/cart')
//                     ? 'bg-slate-100 text-slate-800'
//                     : 'text-slate-600 hover:bg-slate-50'
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <ShoppingCart className="h-5 w-5" />
//                 <span className="font-medium">Shopping Cart</span>
//                 {cartCount > 0 && (
//                   <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>

//               {/* Orders Link for logged in users */}
//               {userInfo && (
//                 <Link
//                   to="/orders"
//                   className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
//                     isActive('/orders')
//                       ? 'bg-slate-100 text-slate-800'
//                       : 'text-slate-600 hover:bg-slate-50'
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <ClipboardList className="h-5 w-5" />
//                   <span className="font-medium">My Orders</span>
//                 </Link>
//               )}

//               {/* Admin Link */}
//               {userInfo?.role === 'admin' && (
//                 <Link
//                   to="/admin"
//                   className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
//                     isActive('/admin')
//                       ? 'bg-slate-100 text-slate-800'
//                       : 'text-slate-600 hover:bg-slate-50'
//                   }`}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   <LayoutDashboard className="h-5 w-5" />
//                   <span className="font-medium">Admin Dashboard</span>
//                 </Link>
//               )}

//               {/* User Info & Auth Section */}
//               <div className="pt-3 mt-2 border-t border-slate-200">
//                 {userInfo ? (
//                   <>
//                     <div className="flex items-center gap-3 px-3 py-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold">
//                         {userInfo.name?.charAt(0).toUpperCase() || 'U'}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-slate-800">{userInfo.name}</p>
//                         <p className="text-xs text-slate-500">{userInfo.email}</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//                     >
//                       <LogOut className="h-5 w-5" />
//                       <span className="font-medium">Sign Out</span>
//                     </button>
//                   </>
//                 ) : (
//                   <div className="space-y-2">
//                     <Link
//                       to="/login"
//                       className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <LogIn className="h-5 w-5" />
//                       <span className="font-medium">Login</span>
//                     </Link>
//                     <Link
//                       to="/register"
//                       className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <UserPlus className="h-5 w-5" />
//                       <span className="font-medium">Register</span>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Spacer to prevent content from going under fixed navbar */}
//       <div className="h-16 sm:h-20" />
//     </>
//   );
// };

// export default Navbar;