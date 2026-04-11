// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   PlusCircle,
//   Package,
//   Tags,
//   Gift,
//   ClipboardList,
//   Star,
//   AlertTriangle,
//   Users,
//   User,
//   Phone,
//   Mail,
//   Settings,
//   HelpCircle,
//   LogOut,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';

// const Sidebar = () => {
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if screen is mobile
//   useEffect(() => {
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (mobile) {
//         setIsCollapsed(false);
//         setIsMobileMenuOpen(false);
//       }
//     };
    
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
    
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   const menuItems = [
//     { path: '/admin', name: 'Dashboard', icon: LayoutDashboard },
//     { path: '/admin/products/add', name: 'Add Product', icon: PlusCircle },
//     { path: '/admin/products/manage', name: 'Manage Products', icon: Package },
//     { path: '/admin/categories', name: 'Categories', icon: Tags },
//     { path: '/admin/offers', name: 'Offers', icon: Gift },
//     { path: '/admin/orders', name: 'Orders', icon: ClipboardList },
//     { path: '/admin/reviews', name: 'Reviews', icon: Star },
//     { path: '/admin/complaints', name: 'Complaints', icon: AlertTriangle },
//     { path: '/admin/customers', name: 'Customers', icon: Users },
//     { path: '/admin/users', name: 'Users', icon: User },
//     { path: '/admin/contact', name: 'Contact', icon: Phone },
//     { path: '/admin/messages', name: 'Messages', icon: Mail },
//   ];

//   const bottomItems = [
//     { path: '/admin/settings', name: 'Settings', icon: Settings },
//     { path: '/admin/help', name: 'Help', icon: HelpCircle },
//     { path: '/logout', name: 'Logout', icon: LogOut },
//   ];

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full relative">
//       {/* Toggle Button - Desktop only */}
//       {!isMobile && (
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="absolute -right-3 top-20 z-50 bg-slate-800 border border-slate-700 rounded-full p-1 hover:bg-slate-700 transition-colors hidden md:block"
//         >
//           {isCollapsed ? (
//             <ChevronRight className="h-4 w-4 text-white" />
//           ) : (
//             <ChevronLeft className="h-4 w-4 text-white" />
//           )}
//         </button>
//       )}

//       {/* LOGO SECTION */}
//       <div className={`p-4 ${isCollapsed && !isMobile ? 'px-2' : 'sm:p-6'} border-b border-slate-800 bg-slate-900/50`}>
//         <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'gap-2'}`}>
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
//             <span className="text-white font-bold text-base sm:text-lg">OS</span>
//           </div>
//           {(!isCollapsed || isMobile) && (
//             <div className="min-w-0">
//               <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
//                 Om Sai
//               </h2>
//               <p className="text-xs text-slate-400 mt-0.5 truncate">Admin Dashboard</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN MENU */}
//       <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
//         {(!isCollapsed || isMobile) && (
//           <div className="mb-4 px-3">
//             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//               Main Navigation
//             </p>
//           </div>
//         )}
        
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`
//                 flex items-center gap-2 sm:gap-3 px-2 py-2 rounded-lg transition-all duration-200 group
//                 ${isCollapsed && !isMobile ? 'justify-center' : ''}
//                 ${isActive 
//                   ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
//                   : 'hover:bg-slate-800 hover:text-slate-200'
//                 }
//               `}
//               title={isCollapsed && !isMobile ? item.name : undefined}
//             >
//               <Icon 
//                 className={`h-5 w-5 transition-all duration-200 flex-shrink-0 ${
//                   isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
//                 }`}
//               />
//               {(!isCollapsed || isMobile) && (
//                 <>
//                   <span className="text-sm font-medium flex-1 truncate">{item.name}</span>
//                   {isActive && (
//                     <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm flex-shrink-0" />
//                   )}
//                 </>
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* BOTTOM MENU */}
//       <div className="border-t border-slate-800 bg-slate-900/30">
//         <div className="p-2 space-y-1">
//           {bottomItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`
//                   flex items-center gap-2 sm:gap-3 px-2 py-2 rounded-lg transition-all duration-200
//                   ${isCollapsed && !isMobile ? 'justify-center' : ''}
//                   ${isActive 
//                     ? 'bg-blue-600 text-white' 
//                     : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
//                   }
//                 `}
//                 title={isCollapsed && !isMobile ? item.name : undefined}
//               >
//                 <Icon className="h-5 w-5 flex-shrink-0" />
//                 {(!isCollapsed || isMobile) && (
//                   <span className="text-sm font-medium truncate">{item.name}</span>
//                 )}
//               </Link>
//             );
//           })}
//         </div>

//         {/* FOOTER INFO */}
//         {(!isCollapsed || isMobile) && (
//           <div className="hidden sm:block p-4 border-t border-slate-800">
//             <div className="bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm">
//               <p className="text-xs font-medium text-slate-300 truncate">Om Sai Industries</p>
//               <p className="text-xs text-slate-500 mt-1">Version 2.0.0</p>
//               <div className="mt-2 flex items-center gap-2">
//                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                 <span className="text-[10px] text-slate-500">System Online</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Mobile Menu Button
//   const MobileMenuButton = () => (
//     <button
//       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//       className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
//     >
//       {isMobileMenuOpen ? (
//         <X className="h-6 w-6 text-white" />
//       ) : (
//         <Menu className="h-6 w-6 text-white" />
//       )}
//     </button>
//   );

//   // Overlay for mobile
//   const MobileOverlay = () => (
//     <div
//       className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
//         isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
//       }`}
//       onClick={() => setIsMobileMenuOpen(false)}
//     />
//   );

//   return (
//     <>
//       <MobileMenuButton />
//       <MobileOverlay />
      
//       {/* Desktop Sidebar */}
//       <div 
//         className={`
//           hidden md:block min-h-screen bg-slate-900 text-slate-300 shadow-2xl border-r border-slate-800 flex-shrink-0 transition-all duration-300
//           ${isCollapsed ? 'w-20' : 'w-64'}
//         `}
//       >
//         <SidebarContent />
//       </div>

//       {/* Mobile Sidebar */}
//       <div
//         className={`
//           fixed md:hidden top-0 left-0 z-45 w-72 h-full bg-slate-900 text-slate-300 shadow-2xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out
//           ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//       >
//         <SidebarContent />
//       </div>

//       {/* Spacer for mobile */}
//       <div className="md:hidden h-16 flex-shrink-0" />
//     </>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Tags,
  Gift,
  ClipboardList,
  Star,
  AlertTriangle,
  Users,
  User,
  Phone,
  Mail,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  Edit,
  Layers,
  BarChart3,
  TrendingUp,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: LayoutDashboard },
    { divider: true, label: 'PRODUCTS' },
    { path: '/admin/products/add', name: 'Add Product', icon: PlusCircle },
    { path: '/admin/products/manage', name: 'Manage Products', icon: Package },
    { path: '/admin/categories', name: 'Categories', icon: Layers },
    { divider: true, label: 'MARKETING' },
    { path: '/admin/offers', name: 'Offers', icon: Gift },
    { divider: true, label: 'SALES' },
    { path: '/admin/orders', name: 'Orders', icon: ClipboardList },
    { divider: true, label: 'CUSTOMER CARE' },
    { path: '/admin/reviews', name: 'Reviews', icon: Star },
    { path: '/admin/complaints', name: 'Complaints', icon: AlertTriangle },
    { path: '/admin/messages', name: 'Messages', icon: MessageSquare },
    { divider: true, label: 'USERS' },
    { path: '/admin/customers', name: 'Customers', icon: Users },
    { path: '/admin/users', name: 'Users', icon: User },
    { divider: true, label: 'SETTINGS' },
    { path: '/admin/contact', name: 'Contact Editor', icon: Edit },
    { path: '/admin/settings', name: 'Settings', icon: Settings },
    { path: '/admin/help', name: 'Help & Support', icon: HelpCircle },
  ];

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full relative">
      {/* Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 bg-slate-800 border border-slate-700 rounded-full p-1.5 hover:bg-slate-700 transition-all duration-300 shadow-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      )}

      {/* Logo Section */}
      <div className={`p-5 ${isCollapsed && !isMobile ? 'px-3' : ''} border-b border-slate-800 bg-slate-900/50`}>
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-lg">OS</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Om Sai</h2>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, idx) => {
          if (item.divider) {
            return (!isCollapsed || isMobile) ? (
              <div key={idx} className="px-3 pt-4 pb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ) : (
              <div key={idx} className="h-px bg-slate-800 my-2"></div>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isCollapsed && !isMobile ? 'justify-center' : ''}
                ${active 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
              `}
              title={isCollapsed && !isMobile ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? 'text-white' : 'group-hover:scale-110'}`} />
              {(!isCollapsed || isMobile) && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
              {active && (!isCollapsed || isMobile) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        {(!isCollapsed || isMobile) ? (
          <div className="bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-medium text-slate-300">Secure Connection</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] text-slate-500">System Online</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`
          hidden md:block bg-slate-900 text-slate-300 shadow-2xl border-r border-slate-800 flex-shrink-0 transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className="md:hidden">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;