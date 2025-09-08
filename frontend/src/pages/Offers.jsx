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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
        <div className="animate-pulse text-2xl font-semibold text-indigo-600">
          Fetching latest offers...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            ✨ Exclusive Offers ✨
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don’t miss out on our premium deals and limited-time promotions crafted just for you.
          </p>
        </div>

        {/* Empty State */}
        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl">
            <svg
              className="mx-auto h-28 w-28 text-gray-400"
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
            <h3 className="mt-6 text-2xl font-semibold text-gray-800">
              No offers available
            </h3>
            <p className="mt-2 text-gray-500 text-center">
              Please check back later for exciting deals!
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {offers.map((o, index) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
              >
                {o.imageUrl && (
                  <div className="relative h-56 w-full">
                    <img
                      src={o.imageUrl}
                      alt={o.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold shadow-md ${
                          o.type === "current"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {o.type.charAt(0).toUpperCase() + o.type.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-1">
                    {o.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {o.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-sm font-medium text-red-600">
                      Valid till: {new Date(o.validTill).toLocaleDateString()}
                    </p>
                    <button className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-all">
                      View Details
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
