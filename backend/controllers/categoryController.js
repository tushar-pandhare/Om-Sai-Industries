const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATED: Create category with Cloudinary image upload
const createCategory = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Check if there's an image file uploaded
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL
    } else if (req.body.image) {
      // Fallback to URL if provided
      imageUrl = req.body.image;
    }
    
    // Parse category data (if sent as JSON)
    let categoryData;
    try {
      categoryData = JSON.parse(req.body.categoryData);
    } catch (error) {
      categoryData = req.body;
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name: categoryData.name,
      description: categoryData.description || '',
      image: imageUrl,
      isActive: true
    });
    
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATED: Update category with Cloudinary image upload
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Parse category data
    let categoryData;
    try {
      categoryData = JSON.parse(req.body.categoryData);
    } catch (error) {
      categoryData = req.body;
    }
    
    // Handle image update
    let imageUrl = category.image;
    
    // If new image is uploaded, use it
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (category.image && category.image.includes('cloudinary')) {
        try {
          const publicId = category.image.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      imageUrl = req.file.path;
    } else if (categoryData.image && categoryData.image !== category.image) {
      // If image URL is provided and different from existing
      imageUrl = categoryData.image;
    }
    
    // Update category fields
    if (categoryData.name) category.name = categoryData.name;
    if (categoryData.description !== undefined) category.description = categoryData.description;
    if (imageUrl) category.image = imageUrl;
    if (categoryData.isActive !== undefined) category.isActive = categoryData.isActive;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Delete image from Cloudinary if it exists
    if (category.image && category.image.includes('cloudinary')) {
      try {
        const publicId = category.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }
    
    // Soft delete - set isActive to false
    category.isActive = false;
    await category.save();
    
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};