import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProduct } from '../../features/prdoducts/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    specifications: {}
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const addImage = () => {
    if (!imageUrl) {
      return toast.error('Please enter image URL');
    }

    setFormData({
      ...formData,
      images: [...formData.images, imageUrl]
    });

    setImageUrl('');
    toast.success('Image added');
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages
    });
    toast.success('Image removed');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: [],
      specifications: {}
    });
    setSpecKey('');
    setSpecValue('');
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      const result = await dispatch(createProduct(productData));

      if (createProduct.fulfilled.match(result)) {
        toast.success('Product added successfully!');
        resetForm();
        setTimeout(() => {
          navigate('/admin/products/manage');
        }, 1500);
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Add New Product</h1>
          <p className="text-slate-500 mt-1">Create and manage your product inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-lg font-semibold text-slate-800">Product Information</h2>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the details below</p>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN - Basic Info */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Premium Cotton Saree"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN - Media & Specs */}
              <div className="space-y-6">
                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Specifications
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      placeholder="Key (e.g., Material)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <input
                      placeholder="Value (e.g., Cotton)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={addSpecification} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  
                  {Object.keys(formData.specifications).length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-white p-2 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-slate-700">{key}:</span>
                            <span className="ml-2 text-slate-600">{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSpecification(key)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Images
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      placeholder="Image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={addImage} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img} 
                            alt={`Product ${idx + 1}`} 
                            className="w-full h-24 object-cover rounded-xl border border-slate-200"
                            onError={(e) => {
                              e.target.src = 'https://fakeimg.pl/80x80?text=Invalid+URL';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                'Add Product'
              )}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;