// const Product = require('../models/Product');
// const Offer = require('../models/Offer');

// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('category', 'name');
    
//     // Get all active offers
//     const currentDate = new Date();
//     const activeOffers = await Offer.find({
//       isActive: true,
//       startDate: { $lte: currentDate },
//       endDate: { $gte: currentDate }
//     });
    
//     // Calculate best price for each product based on offers
//     const productsWithBestPrice = products.map(product => {
//       let bestDiscount = 0;
//       let bestDiscountType = null;
//       let bestOfferTitle = null;
//       let bestOfferId = null;
      
//       // Find best applicable offer for this product
//       for (const offer of activeOffers) {
//         const isApplicable = offer.applicableProducts.length === 0 || 
//                             offer.applicableProducts.some(p => p.toString() === product._id.toString());
        
//         if (isApplicable) {
//           let discountedPrice = product.price;
//           if (offer.discountType === 'percentage') {
//             discountedPrice = product.price - (product.price * offer.discountValue / 100);
//           } else {
//             discountedPrice = product.price - offer.discountValue;
//           }
          
//           const discountAmount = product.price - Math.max(0, discountedPrice);
          
//           if (discountAmount > bestDiscount) {
//             bestDiscount = discountAmount;
//             bestDiscountType = offer.discountType;
//             bestOfferTitle = offer.title;
//             bestOfferId = offer._id;
//           }
//         }
//       }
      
//       // Calculate final discounted price
//       let finalPrice = product.price;
//       let discountPercent = 0;
      
//       if (bestDiscount > 0) {
//         finalPrice = product.price - bestDiscount;
//         finalPrice = Math.max(0, finalPrice);
//         discountPercent = Math.round((bestDiscount / product.price) * 100);
//       }
      
//       return {
//         ...product.toObject(),
//         originalPrice: product.price,
//         discountedPrice: finalPrice < product.price ? finalPrice : null,
//         discountPercent: discountPercent,
//         bestOffer: bestDiscount > 0 ? {
//           title: bestOfferTitle,
//           discountValue: bestDiscountType === 'percentage' ? discountPercent : bestDiscount,
//           discountType: bestDiscountType,
//           offerId: bestOfferId
//         } : null
//       };
//     });
    
//     res.json(productsWithBestPrice);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate('category');
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     // Get active offers for this product
//     const currentDate = new Date();
//     const activeOffers = await Offer.find({
//       isActive: true,
//       startDate: { $lte: currentDate },
//       endDate: { $gte: currentDate }
//     });
    
//     // Find best offer for this product
//     let bestDiscount = 0;
//     let bestDiscountType = null;
//     let bestOfferTitle = null;
//     let bestOfferId = null;
    
//     for (const offer of activeOffers) {
//       const isApplicable = offer.applicableProducts.length === 0 || 
//                           offer.applicableProducts.some(p => p.toString() === product._id.toString());
      
//       if (isApplicable) {
//         let discountedPrice = product.price;
//         if (offer.discountType === 'percentage') {
//           discountedPrice = product.price - (product.price * offer.discountValue / 100);
//         } else {
//           discountedPrice = product.price - offer.discountValue;
//         }
        
//         const discountAmount = product.price - Math.max(0, discountedPrice);
//         if (discountAmount > bestDiscount) {
//           bestDiscount = discountAmount;
//           bestDiscountType = offer.discountType;
//           bestOfferTitle = offer.title;
//           bestOfferId = offer._id;
//         }
//       }
//     }
    
//     let finalPrice = product.price;
//     let discountPercent = 0;
    
//     if (bestDiscount > 0) {
//       finalPrice = product.price - bestDiscount;
//       finalPrice = Math.max(0, finalPrice);
//       discountPercent = Math.round((bestDiscount / product.price) * 100);
//     }
    
//     const productWithOffer = {
//       ...product.toObject(),
//       originalPrice: product.price,
//       discountedPrice: finalPrice < product.price ? finalPrice : null,
//       discountPercent: discountPercent,
//       bestOffer: bestDiscount > 0 ? {
//         title: bestOfferTitle,
//         discountValue: bestDiscountType === 'percentage' ? discountPercent : bestDiscount,
//         discountType: bestDiscountType,
//         offerId: bestOfferId
//       } : null
//     };
    
//     res.json(productWithOffer);
//   } catch (error) {
//     console.error('Error fetching product:', error);
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


const Product = require('../models/Product');
const Offer = require('../models/Offer');
const cloudinary = require('../config/cloudinary');

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

// UPDATED: Create product with Cloudinary image upload
const createProduct = async (req, res) => {
  try {
    // Parse product data from form-data
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (error) {
      // If not JSON, use as is (for backward compatibility)
      productData = req.body;
    }
    
    // Get uploaded image URLs from Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }
    
    const product = new Product({
      ...productData,
      images: imageUrls,
      price: Number(productData.price),
      stock: Number(productData.stock || 0)
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATED: Update product with Cloudinary image upload
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Parse product data
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (error) {
      productData = req.body;
    }
    
    // Handle images
    let imageUrls = product.images || [];
    
    // If there are existing images sent from frontend, use them
    if (productData.existingImages) {
      imageUrls = productData.existingImages;
    }
    
    // If new images are uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    // Update product
    Object.assign(product, {
      ...productData,
      images: imageUrls,
      price: Number(productData.price || product.price),
      stock: Number(productData.stock !== undefined ? productData.stock : product.stock)
    });
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// NEW: Delete images from Cloudinary
const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;
    
    // Extract public ID from Cloudinary URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);
    
    // Remove from product document
    const product = await Product.findById(productId);
    if (product) {
      product.images = product.images.filter(img => img !== imageUrl);
      await product.save();
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Delete all images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error('Error deleting image from Cloudinary:', err);
          }
        }
      }
      
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  deleteProductImage
};