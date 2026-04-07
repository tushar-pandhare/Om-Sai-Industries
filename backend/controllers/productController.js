// backend/controllers/productController.js
const Product = require('../models/Product');
const Offer = require('../models/Offer');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    
    // Get all active offers
    const currentDate = new Date();
    const activeOffers = await Offer.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    
    // Calculate best price for each product based on offers
    const productsWithBestPrice = products.map(product => {
      let bestDiscount = 0;
      let bestDiscountType = null;
      let bestOfferTitle = null;
      let bestOfferId = null;
      
      // Find best applicable offer for this product
      for (const offer of activeOffers) {
        const isApplicable = offer.applicableProducts.length === 0 || 
                            offer.applicableProducts.some(p => p.toString() === product._id.toString());
        
        if (isApplicable) {
          let discountedPrice = product.price;
          if (offer.discountType === 'percentage') {
            discountedPrice = product.price - (product.price * offer.discountValue / 100);
          } else {
            discountedPrice = product.price - offer.discountValue;
          }
          
          const discountAmount = product.price - Math.max(0, discountedPrice);
          
          if (discountAmount > bestDiscount) {
            bestDiscount = discountAmount;
            bestDiscountType = offer.discountType;
            bestOfferTitle = offer.title;
            bestOfferId = offer._id;
          }
        }
      }
      
      // Calculate final discounted price
      let finalPrice = product.price;
      let discountPercent = 0;
      
      if (bestDiscount > 0) {
        finalPrice = product.price - bestDiscount;
        finalPrice = Math.max(0, finalPrice);
        discountPercent = Math.round((bestDiscount / product.price) * 100);
      }
      
      return {
        ...product.toObject(),
        originalPrice: product.price,
        discountedPrice: finalPrice < product.price ? finalPrice : null,
        discountPercent: discountPercent,
        bestOffer: bestDiscount > 0 ? {
          title: bestOfferTitle,
          discountValue: bestDiscountType === 'percentage' ? discountPercent : bestDiscount,
          discountType: bestDiscountType,
          offerId: bestOfferId
        } : null
      };
    });
    
    res.json(productsWithBestPrice);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get active offers for this product
    const currentDate = new Date();
    const activeOffers = await Offer.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    
    // Find best offer for this product
    let bestDiscount = 0;
    let bestDiscountType = null;
    let bestOfferTitle = null;
    let bestOfferId = null;
    
    for (const offer of activeOffers) {
      const isApplicable = offer.applicableProducts.length === 0 || 
                          offer.applicableProducts.some(p => p.toString() === product._id.toString());
      
      if (isApplicable) {
        let discountedPrice = product.price;
        if (offer.discountType === 'percentage') {
          discountedPrice = product.price - (product.price * offer.discountValue / 100);
        } else {
          discountedPrice = product.price - offer.discountValue;
        }
        
        const discountAmount = product.price - Math.max(0, discountedPrice);
        if (discountAmount > bestDiscount) {
          bestDiscount = discountAmount;
          bestDiscountType = offer.discountType;
          bestOfferTitle = offer.title;
          bestOfferId = offer._id;
        }
      }
    }
    
    let finalPrice = product.price;
    let discountPercent = 0;
    
    if (bestDiscount > 0) {
      finalPrice = product.price - bestDiscount;
      finalPrice = Math.max(0, finalPrice);
      discountPercent = Math.round((bestDiscount / product.price) * 100);
    }
    
    const productWithOffer = {
      ...product.toObject(),
      originalPrice: product.price,
      discountedPrice: finalPrice < product.price ? finalPrice : null,
      discountPercent: discountPercent,
      bestOffer: bestDiscount > 0 ? {
        title: bestOfferTitle,
        discountValue: bestDiscountType === 'percentage' ? discountPercent : bestDiscount,
        discountType: bestDiscountType,
        offerId: bestOfferId
      } : null
    };
    
    res.json(productWithOffer);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct
};
// // backend/controllers/productController.js
// const Product = require('../models/Product');
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('category', 'name');
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate('category');
//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const createProduct = async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     const savedProduct = await product.save();
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       Object.assign(product, req.body);
//       const updatedProduct = await product.save();
//       res.json(updatedProduct);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       await product.deleteOne();
//       res.json({ message: 'Product removed' });
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { 
//   getProducts, 
//   getProductById, 
//   createProduct, 
//   updateProduct, 
//   deleteProduct
// };