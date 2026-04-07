import React from 'react';
import { Link } from 'react-router-dom';

const OfferBanner = ({ offer }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
        <p className="mb-4">{offer.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">
            {offer.discountType === 'percentage' 
              ? `${offer.discountValue}% OFF` 
              : `₹${offer.discountValue} OFF`}
          </span>
          <Link 
            to="/products" 
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;