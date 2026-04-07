import React, { useState } from "react";
import AdminProduct from "./AdminProduct";
import AdminOffers from "./AdminOffers";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stats data for dynamic display
  const stats = [
    {
      title: "Total Products",
      value: "245",
      change: "+12%",
      period: "from last month",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Active Offers",
      value: "18",
      change: "+2",
      period: "new this week",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Pending Tasks",
      value: "7",
      change: "3 require",
      period: "attention",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  const navItems = [
    { id: "products", label: "Products", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { id: "offers", label: "Offers", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism Design */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 backdrop-blur-xl z-50 transform transition-all duration-300 ease-out shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">OMSAI</h1>
              <p className="text-xs text-indigo-300/80">Admin Dashboard</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6">
          <div>
            <p className="text-xs font-semibold text-indigo-300/70 uppercase tracking-wider px-3 mb-3">Main</p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-sm"
                      : "text-indigo-200/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${
                    activeTab === item.id ? "text-indigo-300" : ""
                  }`}>
                    {item.icon}
                  </span>
                  <span className="ml-3 font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <span className="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-glow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-indigo-300/70 uppercase tracking-wider px-3 mb-3">Other</p>
            <div className="space-y-1">
              <a href="/" className="flex items-center px-4 py-3 rounded-xl text-indigo-200/80 hover:bg-white/5 hover:text-white transition-all duration-200 group">
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="ml-3">Settings</span>
              </a>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 backdrop-blur-sm bg-black/20">
          <div className="flex items-center p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Admin Profile"
              className="w-10 h-10 rounded-full ring-2 ring-indigo-400/50 group-hover:ring-indigo-400 transition-all"
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">Alex Morgan</p>
              <p className="text-xs text-indigo-300/70">admin@omsai.com</p>
            </div>
            <svg className="w-4 h-4 text-indigo-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors mr-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-gray-400">Pages</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-gray-700 capitalize">{activeTab}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center relative">
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="w-80 pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all text-sm"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Avatar */}
              <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-indigo-100"
                />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center px-6 border-b border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
            <div className="relative px-8 py-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium opacity-90">Welcome back, Alex</p>
                  <h2 className="text-2xl font-bold mt-1">Dashboard Overview</h2>
                  <p className="text-sm opacity-80 mt-1">Here's what's happening with your store today.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium hover:bg-white/30 transition-all">
                    Download Report
                  </button>
                  <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all shadow-lg">
                    Create New
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
                <div className="p-6 text-white relative">
                  <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity">
                    {stat.icon}
                  </div>
                  <p className="text-sm font-medium opacity-90">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center mt-3 text-xs opacity-80">
                    <span className="inline-flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {stat.change}
                    </span>
                    <span className="ml-2">{stat.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-wrap gap-3 bg-gray-50/30">
              <h3 className="font-semibold text-gray-800">
                {activeTab === "products" ? "Product Management" : "Offers Management"}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {activeTab === "products" && <AdminProduct />}
              {activeTab === "offers" && <AdminOffers />}
            </div>
          </div>
        </main>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;