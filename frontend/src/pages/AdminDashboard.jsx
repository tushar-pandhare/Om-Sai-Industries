import React, { useState } from "react";
import AdminProduct from "./AdminProduct";
import AdminOffers from "./AdminOffers";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 🔹 Sidebar */}
      <div className={`bg-gradient-to-b from-indigo-800 to-purple-900 text-white w-64 fixed inset-y-0 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wide">OMSAI Admin</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="mt-10 px-4">
          <div className="mb-8">
            <p className="text-purple-300 uppercase text-xs font-semibold tracking-wider mb-4 pl-3">Main Navigation</p>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center px-3 py-3 rounded-lg mb-2 transition-all duration-200 ${
                activeTab === "products"
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-purple-200 hover:bg-purple-800"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Products
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`w-full flex items-center px-3 py-3 rounded-lg mb-2 transition-all duration-200 ${
                activeTab === "offers"
                  ? "bg-white text-indigo-700 shadow-lg"
                  : "text-purple-200 hover:bg-purple-800"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Offers
            </button>
          </div>
          
          <div className="mb-8">
            <p className="text-purple-300 uppercase text-xs font-semibold tracking-wider mb-4 pl-3">Other</p>
            <a href="/" className="flex items-center text-purple-200 hover:bg-purple-800 px-3 py-3 rounded-lg mb-2 transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-purple-700">
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40"
              alt="Admin Profile"
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-purple-300">admin@omsai.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* 🔹 Top Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 focus:outline-none mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === "products" ? "Product Management" : "Offers Management"}
              </h2>
            </div>
            
            <div className="flex items-center">
              <div className="relative mr-4">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button className="p-2 text-gray-500 hover:text-indigo-600 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
          
          {/* 🔹 Secondary Navigation */}
          <div className="flex px-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-3 font-medium transition-all duration-300 relative ${
                activeTab === "products"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Products
              {activeTab === "products" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-4 py-3 font-medium transition-all duration-300 relative ${
                activeTab === "offers"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Offers
              {activeTab === "offers" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
              )}
            </button>
          </div>
        </div>

        {/* 🔹 Dashboard Content */}
        <main className="p-6 bg-gray-50 min-h-screen">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === "products" ? "All Products" : "Special Offers"}
              </h3>
              {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300 mt-4 md:mt-0">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New
              </button> */}
            </div>
            
            {activeTab === "products" && <AdminProduct />}
            {activeTab === "offers" && <AdminOffers />}
          </div>
          
          {/* 🔹 Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-md text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Total Products</p>
                  <p className="text-2xl font-bold mt-1">245</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
              <p className="text-xs mt-3 opacity-80">+12% from last month</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Active Offers</p>
                  <p className="text-2xl font-bold mt-1">18</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <p className="text-xs mt-3 opacity-80">+2 new this week</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-md text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Pending Tasks</p>
                  <p className="text-2xl font-bold mt-1">7</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs mt-3 opacity-80">3 require attention</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;