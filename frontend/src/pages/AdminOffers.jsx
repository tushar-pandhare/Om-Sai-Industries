import { useState } from 'react';
import axios from 'axios';

const AdminOffers = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('current');
  const [validTill, setValidTill] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !description || !validTill || !image) {
      alert('Please fill all fields and select an image.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('validTill', validTill);
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/omsai/offers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Offer created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setType('current');
      setValidTill('');
      setImage(null);
      setImagePreview(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert('Failed to create offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Create New Offer</h3>
        <button 
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300 mt-2 md:mt-0"
          onClick={() => {
            setTitle('');
            setDescription('');
            setType('current');
            setValidTill('');
            setImage(null);
            setImagePreview(null);
          }}
        >
          Clear Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300"
                placeholder="Enter offer title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300 h-32"
                placeholder="Enter offer description"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300"
                >
                  <option value="current">Current Offer</option>
                  <option value="upcoming">Upcoming Offer</option>
                  <option value="featured">Featured Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
                <input
                  type="date"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-64 flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">Drag & drop an image here or click to browse</p>
                  <label htmlFor="image-upload" className="cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors duration-300">
                    Select Image
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, 600x600 pixels, JPG or PNG format</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-6 rounded-lg flex items-center transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Offer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminOffers;