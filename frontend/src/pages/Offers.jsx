import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/omsai/offers")
      .then((res) => {
        setOffers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 pt-32">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="w-full h-full border-4 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent rounded-full border-t-amber-500 animate-spin"></div>
          </div>
          <div className="text-lg font-light text-slate-600 tracking-wide">
            Curating exclusive offers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-32 pb-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header with increased margin */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-light font-serif text-slate-800 sm:text-6xl tracking-wide"
          >
            Exclusive <span className="font-medium">Offers</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 font-light"
          >
            Premium deals and limited-time promotions crafted for our discerning clients
          </motion.p>
        </div>

        {/* Empty State */}
        {offers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg mt-12"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mb-8">
              <svg
                className="w-16 h-16 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-slate-700 mb-3">
              No Current Offers
            </h3>
            <p className="text-slate-500 font-light max-w-md mx-auto text-center mb-8">
              Our exclusive offers are currently being prepared. Check back soon for premium deals.
            </p>
            <button className="px-8 py-3 bg-slate-800 text-sm text-white tracking-wider rounded-full hover:bg-slate-900 transition-all duration-300 shadow-md">
              NOTIFY ME
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12"
          >
            {offers.map((o, index) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 relative"
              >
                {o.imageUrl && (
                  <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    <img
                      src={o.imageUrl}
                      alt={o.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider shadow-md ${
                          o.type === "current"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.type.charAt(0).toUpperCase() + o.type.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-medium text-slate-800 mb-3 line-clamp-1">
                    {o.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-light mb-6 line-clamp-3 flex-grow">
                    {o.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <p className="text-sm font-light text-slate-500">
                      Valid until: {new Date(o.validTill).toLocaleDateString()}
                    </p>
                    <button className="px-5 py-2.5 bg-slate-800 text-xs text-white tracking-widest uppercase rounded-full hover:bg-slate-900 transition-all duration-300 shadow-md hover:shadow-lg flex items-center">
                      Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Offers;