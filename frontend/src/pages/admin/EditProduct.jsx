import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProductById, updateProduct } from '../../features/prdoducts/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import { 
  ArrowLeft, Save, X, Plus, Trash2, Image as ImageIcon, 
  Upload, AlertCircle, CheckCircle, Package, Tag, DollarSign,
  Layers, FileText, Camera, Loader
} from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    specifications: {}
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // Fetch product and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProductById(id));
      await dispatch(fetchCategories());
      setPageLoading(false);
    };
    fetchData();
  }, [dispatch, id]);

  // Populate form when product is loaded
  useEffect(() => {
    if (selectedProduct && !pageLoading) {
      setFormData({
        name: selectedProduct.name || '',
        description: selectedProduct.description || '',
        price: selectedProduct.price || '',
        category: selectedProduct.category?._id || selectedProduct.category || '',
        stock: selectedProduct.stock || '',
        specifications: selectedProduct.specifications || {}
      });
      setExistingImages(selectedProduct.images || []);
      setImagePreviews(selectedProduct.images || []);
    }
  }, [selectedProduct, pageLoading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle new image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + existingImages.length + newImageFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    
    // Validate file types and sizes
    const invalidFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return !isValidType || !isValidSize;
    });
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload valid images (JPG, PNG, WEBP, max 5MB each)');
      return;
    }
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setNewImageFiles([...newImageFiles, ...files]);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    const removed = existingImages[index];
    setRemovedImages([...removedImages, removed]);
    const newExisting = existingImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setExistingImages(newExisting);
    setImagePreviews(newPreviews);
  };

  // Remove new image
  const removeNewImage = (index) => {
    const offset = existingImages.length;
    const actualIndex = index - offset;
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newFiles = newImageFiles.filter((_, i) => i !== actualIndex);
    setImagePreviews(newPreviews);
    setNewImageFiles(newFiles);
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      removeExistingImage(index);
    } else {
      removeNewImage(index);
    }
    toast.success('Image removed');
  };

  const addSpecification = () => {
    if (!specKey || !specValue) {
      return toast.error('Please fill specification fields');
    }

    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [specKey]: specValue
      }
    });

    setSpecKey('');
    setSpecValue('');
    toast.success('Specification added');
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({
      ...formData,
      specifications: newSpecs
    });
    toast.success('Specification removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      return toast.error('Please fill all required fields');
    }

    if (imagePreviews.length === 0) {
      return toast.error('Please add at least one product image');
    }

    setSubmitting(true);

    const submitData = new FormData();
    
    // Append product data as JSON
    submitData.append('productData', JSON.stringify({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      existingImages: existingImages,
      removedImages: removedImages
    }));
    
    // Append new images
    newImageFiles.forEach(file => {
      submitData.append('images', file);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: submitData
      });

      if (response.ok) {
        toast.success('Product updated successfully!');
        setTimeout(() => {
          navigate('/admin/products/manage');
        }, 1500);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Something went wrong');
    }

    setSubmitting(false);
  };

  if (pageLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to="/admin/products/manage"
                  className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Product</h1>
              </div>
              <p className="text-sm text-gray-500 ml-12">Update product information and images</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/products/${id}`}
                target="_blank"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Product Information</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update the details below to modify your product</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* LEFT COLUMN - Basic Information */}
              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Premium Cotton Saree"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Stock Status Badge */}
                <div className="flex items-center gap-2">
                  {formData.stock > 10 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700">
                      <CheckCircle className="h-3 w-3" />
                      In Stock ({formData.stock} units)
                    </span>
                  ) : formData.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700">
                      <AlertCircle className="h-3 w-3" />
                      Low Stock ({formData.stock} units)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700">
                      <AlertCircle className="h-3 w-3" />
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN - Images & Specifications */}
              <div className="space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Upload Area */}
                  <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-gray-50/30">
                    <div className="space-y-2 text-center">
                      <Camera className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                      <div className="flex flex-col sm:flex-row text-sm text-gray-600">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload new images</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageSelect}
                          />
                        </label>
                        <p className="pl-0 sm:pl-1 mt-1 sm:mt-0">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG, WEBP up to 5MB each (max 10 images total)
                      </p>
                    </div>
                  </div>

                  {/* Images Grid */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        {imagePreviews.length} image(s) - Click X to remove
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative group aspect-square">
                            <img 
                              src={preview} 
                              alt={`Product ${idx + 1}`} 
                              className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            {idx < existingImages.length && (
                              <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-1 rounded-b-lg">
                                Existing
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {imagePreviews.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">* At least one image is required</p>
                  )}
                </div>

                {/* Specifications Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Specifications
                  </label>
                  
                  {/* Add Specification Inputs */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Key (e.g., Material)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Cotton)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={addSpecification} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4 inline-block mr-1" />
                      Add
                    </button>
                  </div>
                  
                  {/* Specifications List */}
                  {Object.keys(formData.specifications).length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200 max-h-64 overflow-y-auto">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-900 text-sm">{key}:</span>
                            <span className="ml-2 text-gray-600 text-sm break-words">{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSpecification(key)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium ml-2 flex-shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {Object.keys(formData.specifications).length === 0 && (
                    <p className="text-xs text-gray-400 mt-2">No specifications added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto order-2 sm:order-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Updating Product...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Update Product
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/products/manage')}
                className="w-full sm:w-auto order-1 sm:order-2 px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Product Update Tips</h4>
              <p className="text-xs text-blue-700">
                • High-quality images help increase sales. Add clear product photos.<br />
                • Keep product descriptions detailed and accurate.<br />
                • Update stock levels regularly to avoid overselling.<br />
                • Adding specifications helps customers make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;