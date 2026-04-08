// const Offer = require('../models/Offer');

// const getOffers = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const offers = await Offer.find({ 
//       isActive: true,
//       startDate: { $lte: currentDate },
//       endDate: { $gte: currentDate }
//     }).populate('applicableProducts', 'name');
//     res.json(offers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getOfferById = async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id).populate('applicableProducts');
//     if (offer) {
//       res.json(offer);
//     } else {
//       res.status(404).json({ message: 'Offer not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const createOffer = async (req, res) => {
//   try {
//     const offer = new Offer(req.body);
//     const savedOffer = await offer.save();
//     res.status(201).json(savedOffer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateOffer = async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id);
//     if (offer) {
//       Object.assign(offer, req.body);
//       const updatedOffer = await offer.save();
//       res.json(updatedOffer);
//     } else {
//       res.status(404).json({ message: 'Offer not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteOffer = async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id);
//     if (offer) {
//       await offer.deleteOne();
//       res.json({ message: 'Offer removed' });
//     } else {
//       res.status(404).json({ message: 'Offer not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getOffers, getOfferById, createOffer, updateOffer, deleteOffer };

// backend/controllers/offerController.js
const Offer = require('../models/Offer');
const Product = require('../models/Product');

const getOffers = async (req, res) => {
  try {
    const currentDate = new Date();
    const offers = await Offer.find({ 
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).populate('applicableProducts', 'name');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('applicableProducts');
    if (offer) {
      res.json(offer);
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products for a specific offer with discounted prices
const getOfferProducts = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    let products = [];
    
    // If offer applies to specific products
    if (offer.applicableProducts && offer.applicableProducts.length > 0) {
      products = await Product.find({ 
        _id: { $in: offer.applicableProducts } 
      }).populate('category', 'name');
    } else {
      // If offer applies to all products
      products = await Product.find({}).populate('category', 'name');
    }
    
    // Add offer discount info to each product
    const productsWithDiscount = products.map(product => {
      let discountedPrice = product.price;
      let discountAmount = 0;
      
      if (offer.discountType === 'percentage') {
        discountedPrice = product.price - (product.price * offer.discountValue / 100);
        discountAmount = product.price * offer.discountValue / 100;
      } else {
        discountedPrice = product.price - offer.discountValue;
        discountAmount = offer.discountValue;
      }
      
      discountedPrice = Math.max(0, discountedPrice);
      discountAmount = Math.max(0, discountAmount);
      
      return {
        ...product.toObject(),
        originalPrice: product.price,
        discountedPrice: discountedPrice,
        discountAmount: discountAmount,
        discountPercent: offer.discountType === 'percentage' ? offer.discountValue : Math.round((discountAmount / product.price) * 100),
        offerApplied: {
          id: offer._id,
          title: offer.title,
          type: offer.discountType,
          value: offer.discountValue
        }
      };
    });
    
    res.json({
      offer: {
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue
      },
      products: productsWithDiscount
    });
  } catch (error) {
    console.error('Error fetching offer products:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all offers for admin
const getAllOffersAdmin = async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (offer) {
      Object.assign(offer, req.body);
      const updatedOffer = await offer.save();
      res.json(updatedOffer);
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (offer) {
      await offer.deleteOne();
      res.json({ message: 'Offer removed' });
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getOffers, 
  getOfferById, 
  getOfferProducts,
  getAllOffersAdmin,
  createOffer, 
  updateOffer, 
  deleteOffer
};
