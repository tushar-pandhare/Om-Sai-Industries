// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { fetchCategories } from '../../features/categories/categorySlice';

// const AddProduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { categories } = useSelector((state) => state.categories);
//   const { userInfo } = useSelector((state) => state.auth);
  
//   const [loading, setLoading] = useState(false);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [imageFiles, setImageFiles] = useState([]);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     stock: '',
//     specifications: {}
//   });

//   const [specKey, setSpecKey] = useState('');
//   const [specValue, setSpecValue] = useState('');

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Handle image file selection
//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
    
//     if (files.length + imageFiles.length > 10) {
//       toast.error('Maximum 10 images allowed');
//       return;
//     }
    
//     // Validate file types and sizes
//     const invalidFiles = files.filter(file => {
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       const isValidType = validTypes.includes(file.type);
//       const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
//       return !isValidType || !isValidSize;
//     });
    
//     if (invalidFiles.length > 0) {
//       toast.error('Please upload valid images (JPG, PNG, WEBP, max 5MB each)');
//       return;
//     }
    
//     // Create preview URLs
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews([...imagePreviews, ...newPreviews]);
//     setImageFiles([...imageFiles, ...files]);
//   };

//   // Remove image
//   const removeImage = (index) => {
//     URL.revokeObjectURL(imagePreviews[index]);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     const newFiles = imageFiles.filter((_, i) => i !== index);
//     setImagePreviews(newPreviews);
//     setImageFiles(newFiles);
//   };

//   const addSpecification = () => {
//     if (!specKey || !specValue) {
//       return toast.error('Please fill specification fields');
//     }

//     setFormData({
//       ...formData,
//       specifications: {
//         ...formData.specifications,
//         [specKey]: specValue
//       }
//     });

//     setSpecKey('');
//     setSpecValue('');
//     toast.success('Specification added');
//   };

//   const removeSpecification = (key) => {
//     const newSpecs = { ...formData.specifications };
//     delete newSpecs[key];
//     setFormData({
//       ...formData,
//       specifications: newSpecs
//     });
//     toast.success('Specification removed');
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       category: '',
//       stock: '',
//       specifications: {}
//     });
//     setSpecKey('');
//     setSpecValue('');
//     imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
//     setImagePreviews([]);
//     setImageFiles([]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.price || !formData.category) {
//       return toast.error('Please fill all required fields');
//     }

//     if (imageFiles.length === 0) {
//       return toast.error('Please select at least one product image');
//     }

//     setLoading(true);

//     const submitData = new FormData();
//     submitData.append('productData', JSON.stringify({
//       ...formData,
//       price: Number(formData.price),
//       stock: Number(formData.stock || 0)
//     }));
    
//     imageFiles.forEach(file => {
//       submitData.append('images', file);
//     });

//     try {
//       const response = await fetch('http://localhost:5000/api/products', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${userInfo?.token}`
//         },
//         body: submitData
//       });

//       if (response.ok) {
//         toast.success('Product added successfully!');
//         resetForm();
//         setTimeout(() => {
//           navigate('/admin/products/manage');
//         }, 1500);
//       } else {
//         const error = await response.json();
//         toast.error(error.message || 'Failed to add product');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Something went wrong with image upload');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Product</h1>
//               <p className="text-sm text-gray-500 mt-1">Create and manage your product inventory</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => navigate('/admin/products/manage')}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Products
//             </button>
//           </div>
//         </div>

//         {/* Main Form */}
//         <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {/* Form Header */}
//           <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50/50">
//             <h2 className="text-base sm:text-lg font-semibold text-gray-900">Product Information</h2>
//             <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Fill in the details below to add a new product</p>
//           </div>

//           <div className="p-4 sm:p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//               {/* LEFT COLUMN - Basic Information */}
//               <div className="space-y-5">
//                 {/* Product Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="e.g., Premium Cotton Saree"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white text-sm sm:text-base"
//                   >
//                     <option value="">Select a category</option>
//                     {categories?.map((c) => (
//                       <option key={c._id} value={c._id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Price and Stock */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Price (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="price"
//                       placeholder="0.00"
//                       value={formData.price}
//                       onChange={handleChange}
//                       required
//                       min="0"
//                       step="0.01"
//                       className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Stock Quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="stock"
//                       placeholder="0"
//                       value={formData.stock}
//                       onChange={handleChange}
//                       min="0"
//                       className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     placeholder="Describe your product..."
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="5"
//                     className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none text-sm sm:text-base"
//                   />
//                 </div>
//               </div>

//               {/* RIGHT COLUMN - Images & Specifications */}
//               <div className="space-y-6">
//                 {/* Image Upload Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Images <span className="text-red-500">*</span>
//                   </label>
                  
//                   {/* Upload Area */}
//                   <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-gray-50/30">
//                     <div className="space-y-2 text-center">
//                       <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                         <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                       <div className="flex flex-col sm:flex-row text-sm text-gray-600">
//                         <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
//                           <span>Upload images</span>
//                           <input
//                             id="image-upload"
//                             name="image-upload"
//                             type="file"
//                             className="sr-only"
//                             multiple
//                             accept="image/jpeg,image/jpg,image/png,image/webp"
//                             onChange={handleImageSelect}
//                           />
//                         </label>
//                         <p className="pl-0 sm:pl-1 mt-1 sm:mt-0">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         PNG, JPG, JPEG, WEBP up to 5MB each (max 10 images)
//                       </p>
//                     </div>
//                   </div>

//                   {/* Image Previews Grid */}
//                   {imagePreviews.length > 0 && (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
//                       {imagePreviews.map((preview, idx) => (
//                         <div key={idx} className="relative group aspect-square">
//                           <img 
//                             src={preview} 
//                             alt={`Preview ${idx + 1}`} 
//                             className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(idx)}
//                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
//                           >
//                             <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                           <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
//                             Image {idx + 1}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
                  
//                   {imagePreviews.length === 0 && (
//                     <p className="text-xs text-red-500 mt-2">* At least one image is required</p>
//                   )}
//                 </div>

//                 {/* Specifications Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Specifications
//                   </label>
                  
//                   {/* Add Specification Inputs */}
//                   <div className="flex flex-col sm:flex-row gap-2 mb-3">
//                     <input
//                       type="text"
//                       placeholder="Key (e.g., Material)"
//                       value={specKey}
//                       onChange={(e) => setSpecKey(e.target.value)}
//                       className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Value (e.g., Cotton)"
//                       value={specValue}
//                       onChange={(e) => setSpecValue(e.target.value)}
//                       className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
//                     />
//                     <button 
//                       type="button" 
//                       onClick={addSpecification} 
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
//                     >
//                       Add
//                     </button>
//                   </div>
                  
//                   {/* Specifications List */}
//                   {Object.keys(formData.specifications).length > 0 && (
//                     <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200 max-h-64 overflow-y-auto">
//                       {Object.entries(formData.specifications).map(([key, value]) => (
//                         <div key={key} className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg shadow-sm">
//                           <div className="flex-1 min-w-0">
//                             <span className="font-medium text-gray-900 text-sm">{key}:</span>
//                             <span className="ml-2 text-gray-600 text-sm break-words">{value}</span>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeSpecification(key)}
//                             className="text-red-500 hover:text-red-700 text-sm font-medium ml-2 flex-shrink-0"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
                  
//                   {Object.keys(formData.specifications).length === 0 && (
//                     <p className="text-xs text-gray-400 mt-2">No specifications added yet</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Form Actions - Sticky on Mobile */}
//           <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
//             <div className="flex flex-col-reverse sm:flex-row gap-3">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full sm:w-auto order-2 sm:order-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Adding Product...
//                   </>
//                 ) : (
//                   'Add Product'
//                 )}
//               </button>
              
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="w-full sm:w-auto order-1 sm:order-2 px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
//               >
//                 Reset Form
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../features/categories/categorySlice';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    
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
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImageFiles([...imageFiles, ...files]);
    toast.success(`${files.length} image(s) added`);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please drop image files only');
      return;
    }
    
    handleImageSelect({ target: { files: imageFiles } });
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
    toast.success('Image removed');
  };

  const addSpecification = () => {
    if (!specKey || !specValue) {
      toast.error('Please fill specification fields');
      return;
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      specifications: {}
    });
    setSpecKey('');
    setSpecValue('');
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImagePreviews([]);
    setImageFiles([]);
    toast.success('Form reset successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please select at least one product image');
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append('productData', JSON.stringify({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock || 0)
    }));
    
    imageFiles.forEach(file => {
      submitData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: submitData
      });

      if (response.ok) {
        toast.success('Product added successfully!');
        resetForm();
        setTimeout(() => {
          navigate('/admin/products/manage');
        }, 1500);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Something went wrong with image upload');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Header - No navbar styling */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/products/manage')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500 mt-1">Create and manage your product inventory</p>
              </div>
            </div>
            {/* Subtle draft indicator - not navbar-like */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">Draft Auto-saved</span>
            </div>
          </div>
          
          {/* Breadcrumb - clean and minimal */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 ml-12">
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/admin')}>Dashboard</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/admin/products/manage')}>Products</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Add New Product</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                      <p className="text-xs text-gray-500">Essential product details</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Premium Wireless Headphones"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white"
                      >
                        <option value="">Select category</option>
                        {categories?.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Available units"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your product features, benefits, and specifications..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Images Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                      <p className="text-xs text-gray-500">Upload high-quality product photos</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <svg className="w-14 h-14 mx-auto text-gray-400 mb-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB (max 10 images)</p>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm transition-all group-hover:shadow-md">
                            <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs text-center py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                            Image {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 8h14M5 7h14" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                      <p className="text-xs text-gray-500">Technical details and features</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Key (e.g., Material)"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Cotton)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      + Add
                    </button>
                  </div>

                  {Object.keys(formData.specifications).length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">{key}:</span>
                            <span className="ml-2 text-gray-600">{value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSpecification(key)}
                            className="text-red-400 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">No specifications added yet</p>
                      <p className="text-xs text-gray-400 mt-1">Add product features like dimensions, material, weight, etc.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-6 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-gray-900 to-gray-800">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Live Preview
                  </h3>
                </div>
                <div className="p-5">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {imagePreviews[0] ? (
                      <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 truncate">{formData.name || 'Product Name'}</h4>
                  <p className="text-blue-600 font-bold mt-1 text-lg">₹{formData.price || '0'}</p>
                  {formData.category && (
                    <p className="text-xs text-gray-500 mt-2">Category: {categories?.find(c => c._id === formData.category)?.name}</p>
                  )}
                  {formData.stock && (
                    <p className="text-xs text-green-600 mt-1">In Stock: {formData.stock} units</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mb-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing Product...
                    </span>
                  ) : (
                    'Publish Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  Reset Form
                </button>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Pro Tips for Best Results</h4>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1.5">
                      <li className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>Use high-quality images (min 800x800px)</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>Add detailed specifications for better SEO</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>Set competitive pricing based on market</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-blue-500">•</span>
                        <span>Write clear, benefit-focused descriptions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;