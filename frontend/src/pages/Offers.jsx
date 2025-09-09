import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // 🔹 For modal

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

        {/* Header */}
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
        </div>

        {/* Empty State */}
        {offers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg mt-12"
          >
            <h3 className="text-2xl font-light text-slate-700 mb-3">
              No Current Offers
            </h3>
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
                  <div 
                    className="relative h-64 w-full overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(o.imageUrl)} // 🔹 Open modal
                  >
                    <img
                      src={o.imageUrl}
                      alt={o.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-medium text-slate-800 mb-3 line-clamp-1">
                    {o.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-light mb-6 line-clamp-3 flex-grow">
                    {o.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 🔹 Modal for full-screen image */}
            {/* 🔹 Modal for full-screen image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Full Image */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={selectedImage}
            alt="Offer Full View"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg"
          />
        </div>
      )}

    </div>
  );
};

export default Offers;
