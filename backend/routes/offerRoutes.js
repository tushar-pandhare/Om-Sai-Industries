const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Get all active offers (public)
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date();
    const offers = await Offer.find({ 
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    }).populate('applicableProducts', 'name');
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all offers for admin (including inactive/expired)
router.get('/admin/all', protect, adminMiddleware, async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching all offers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get products for a specific offer (public) - FIXED
router.get('/:id/products', async (req, res) => {
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
      // If offer applies to all products, fetch all products
      products = await Product.find({}).populate('category', 'name');
    }
    
    // Add offer discount info to each product
    const productsWithDiscount = products.map(product => {
      let discountedPrice = product.price;
      let discountAmount = 0;
      let discountPercent = 0;
      
      if (offer.discountType === 'percentage') {
        discountedPrice = product.price - (product.price * offer.discountValue / 100);
        discountAmount = product.price * offer.discountValue / 100;
        discountPercent = offer.discountValue;
      } else if (offer.discountType === 'fixed') {
        discountedPrice = product.price - offer.discountValue;
        discountAmount = offer.discountValue;
        discountPercent = Math.round((offer.discountValue / product.price) * 100);
      }
      
      discountedPrice = Math.max(0, discountedPrice);
      discountAmount = Math.max(0, discountAmount);
      
      return {
        ...product.toObject(),
        originalPrice: product.price,
        discountedPrice: discountedPrice,
        discountAmount: discountAmount,
        discountPercent: discountPercent,
        hasOffer: true,
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
});

// Get single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('applicableProducts');
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create offer (admin only)
router.post('/', protect, adminMiddleware, async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const { title, description, discountType, discountValue, startDate, endDate, applicableProducts } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!discountType) {
      return res.status(400).json({ error: 'Discount type is required' });
    }
    if (!discountValue) {
      return res.status(400).json({ error: 'Discount value is required' });
    }
    if (!startDate) {
      return res.status(400).json({ error: 'Start date is required' });
    }
    if (!endDate) {
      return res.status(400).json({ error: 'End date is required' });
    }
    
    const offer = new Offer({
      title,
      description: description || '',
      discountType,
      discountValue: Number(discountValue),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applicableProducts: applicableProducts || [],
      isActive: true
    });
    
    const savedOffer = await offer.save();
    console.log('Offer created successfully:', savedOffer);
    res.status(201).json(savedOffer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update offer (admin only)
router.put('/:id', protect, adminMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    const { title, description, discountType, discountValue, startDate, endDate, applicableProducts, isActive } = req.body;
    
    if (title) offer.title = title;
    if (description !== undefined) offer.description = description;
    if (discountType) offer.discountType = discountType;
    if (discountValue) offer.discountValue = Number(discountValue);
    if (startDate) offer.startDate = new Date(startDate);
    if (endDate) offer.endDate = new Date(endDate);
    if (applicableProducts) offer.applicableProducts = applicableProducts;
    if (isActive !== undefined) offer.isActive = isActive;
    
    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete offer (admin only)
router.delete('/:id', protect, adminMiddleware, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    await offer.deleteOne();
    res.json({ message: 'Offer removed' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Offer = require('../models/Offer');
// const Product = require('../models/Product');
// const { protect } = require('../middleware/authMiddleware');
// const { adminMiddleware } = require('../middleware/adminMiddleware');

// // Get all active offers (public)
// router.get('/', async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const offers = await Offer.find({ 
//       isActive: true,
//       startDate: { $lte: currentDate },
//       endDate: { $gte: currentDate }
//     }).populate('applicableProducts', 'name');
//     res.json(offers);
//   } catch (error) {
//     console.error('Error fetching offers:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get all offers for admin (including inactive/expired)
// router.get('/admin/all', protect, adminMiddleware, async (req, res) => {
//   try {
//     const offers = await Offer.find({}).sort({ createdAt: -1 });
//     res.json(offers);
//   } catch (error) {
//     console.error('Error fetching all offers:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get products for a specific offer (public)
// router.get('/:id/products', async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id).populate('applicableProducts');
    
//     if (!offer) {
//       return res.status(404).json({ error: 'Offer not found' });
//     }
    
//     let products = [];
    
//     // If offer applies to specific products
//     if (offer.applicableProducts && offer.applicableProducts.length > 0) {
//       products = offer.applicableProducts;
//     } else {
//       // If offer applies to all products, fetch all products
//       const Product = require('../models/Product');
//       products = await Product.find({}).populate('category', 'name');
//     }
    
//     // Add offer discount info to each product
//     const productsWithDiscount = products.map(product => {
//       let discountedPrice = product.price;
//       if (offer.discountType === 'percentage') {
//         discountedPrice = product.price - (product.price * offer.discountValue / 100);
//       } else if (offer.discountType === 'fixed') {
//         discountedPrice = product.price - offer.discountValue;
//       }
      
//       return {
//         ...product.toObject(),
//         offerDiscount: {
//           type: offer.discountType,
//           value: offer.discountValue,
//           discountedPrice: Math.max(0, discountedPrice),
//           offerTitle: offer.title,
//           offerId: offer._id
//         }
//       };
//     });
    
//     res.json({
//       offer: {
//         _id: offer._id,
//         title: offer.title,
//         description: offer.description,
//         discountType: offer.discountType,
//         discountValue: offer.discountValue
//       },
//       products: productsWithDiscount
//     });
//   } catch (error) {
//     console.error('Error fetching offer products:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get single offer
// router.get('/:id', async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id).populate('applicableProducts');
//     if (!offer) {
//       return res.status(404).json({ error: 'Offer not found' });
//     }
//     res.json(offer);
//   } catch (error) {
//     console.error('Error fetching offer:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create offer (admin only)
// router.post('/', protect, adminMiddleware, async (req, res) => {
//   try {
//     console.log('Received request body:', req.body);
    
//     const { title, description, discountType, discountValue, startDate, endDate, applicableProducts } = req.body;
    
//     // Validate required fields
//     if (!title) {
//       return res.status(400).json({ error: 'Title is required' });
//     }
//     if (!discountType) {
//       return res.status(400).json({ error: 'Discount type is required' });
//     }
//     if (!discountValue) {
//       return res.status(400).json({ error: 'Discount value is required' });
//     }
//     if (!startDate) {
//       return res.status(400).json({ error: 'Start date is required' });
//     }
//     if (!endDate) {
//       return res.status(400).json({ error: 'End date is required' });
//     }
    
//     const offer = new Offer({
//       title,
//       description: description || '',
//       discountType,
//       discountValue: Number(discountValue),
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       applicableProducts: applicableProducts || [],
//       isActive: true
//     });
    
//     const savedOffer = await offer.save();
//     console.log('Offer created successfully:', savedOffer);
//     res.status(201).json(savedOffer);
//   } catch (error) {
//     console.error('Error creating offer:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update offer (admin only)
// router.put('/:id', protect, adminMiddleware, async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id);
//     if (!offer) {
//       return res.status(404).json({ error: 'Offer not found' });
//     }
    
//     const { title, description, discountType, discountValue, startDate, endDate, applicableProducts, isActive } = req.body;
    
//     if (title) offer.title = title;
//     if (description !== undefined) offer.description = description;
//     if (discountType) offer.discountType = discountType;
//     if (discountValue) offer.discountValue = Number(discountValue);
//     if (startDate) offer.startDate = new Date(startDate);
//     if (endDate) offer.endDate = new Date(endDate);
//     if (applicableProducts) offer.applicableProducts = applicableProducts;
//     if (isActive !== undefined) offer.isActive = isActive;
    
//     const updatedOffer = await offer.save();
//     res.json(updatedOffer);
//   } catch (error) {
//     console.error('Error updating offer:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete offer (admin only)
// router.delete('/:id', protect, adminMiddleware, async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id);
//     if (!offer) {
//       return res.status(404).json({ error: 'Offer not found' });
//     }
    
//     await offer.deleteOne();
//     res.json({ message: 'Offer removed' });
//   } catch (error) {
//     console.error('Error deleting offer:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;