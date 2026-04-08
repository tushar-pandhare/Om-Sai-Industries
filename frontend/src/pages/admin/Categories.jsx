import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Edit, Trash2, Plus, Image as ImageIcon, Package, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../features/categories/categorySlice';
import toast from 'react-hot-toast';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const { userInfo } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || ''
      });
      setImagePreview(category.image || '');
      setImageFile(null);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: ''
      });
      setImagePreview('');
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: ''
    });
    setImagePreview('');
    setImageFile(null);
    setUploading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, WEBP)');
      return;
    }
    
    // Validate file size (max 2MB for categories)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData({
      ...formData,
      image: '' // Clear URL if file is selected
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return toast.error('Category name is required');
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      
      // Append category data as JSON
      submitData.append('categoryData', JSON.stringify({
        name: formData.name,
        description: formData.description,
        image: formData.image // URL fallback
      }));
      
      // Append image file if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      let result;
      if (editingCategory) {
        result = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${userInfo?.token}`
          },
          body: submitData
        });
        
        if (result.ok) {
          toast.success('Category updated successfully');
          dispatch(fetchCategories());
          handleCloseModal();
        } else {
          const error = await result.json();
          toast.error(error.message || 'Failed to update category');
        }
      } else {
        result = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userInfo?.token}`
          },
          body: submitData
        });
        
        if (result.ok) {
          toast.success('Category created successfully');
          dispatch(fetchCategories());
          handleCloseModal();
        } else {
          const error = await result.json();
          toast.error(error.message || 'Failed to create category');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"? This will also affect products in this category.`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userInfo?.token}`
          }
        });
        
        if (response.ok) {
          toast.success('Category deleted successfully');
          dispatch(fetchCategories());
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Categories</h1>
              <p className="text-slate-500 mt-1">Organize your products with categories</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Add New Category
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {categories?.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Categories</p>
                  <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-slate-500">Loading categories...</p>
          </div>
        ) : categories?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No categories yet</h3>
            <p className="text-slate-500 mb-4">Create your first category to start organizing products</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <div key={category._id} className="group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <ImageIcon className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors text-blue-600"
                      title="Edit Category"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors text-red-600"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {category.description || 'No description provided'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      ID: {category._id?.slice(-6)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder="e.g., Electronics, Clothing, Books"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                      placeholder="Brief description of the category (optional)"
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category Image
                    </label>
                    
                    {/* Image Upload Area */}
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                          <label htmlFor="category-image" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload an image</span>
                            <input
                              id="category-image"
                              name="category-image"
                              type="file"
                              className="sr-only"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleImageSelect}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, JPEG, WEBP up to 2MB
                        </p>
                      </div>
                    </div>

                    {/* OR Divider */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-slate-500">OR use image URL</span>
                      </div>
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        disabled={!!imageFile}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                        placeholder="https://example.com/category-image.jpg"
                      />
                      {imageFile && (
                        <p className="text-xs text-blue-600 mt-1">
                          Using uploaded image. Clear to use URL instead.
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview('');
                            }}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            Clear
                          </button>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Preview
                      </label>
                      <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden">
                        <img
                          src={imagePreview || formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl sticky bottom-0">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {editingCategory ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingCategory ? 'Update Category' : 'Create Category'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;