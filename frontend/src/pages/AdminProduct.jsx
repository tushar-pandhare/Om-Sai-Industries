import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProduct = () => {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [meals, setMeals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("add"); // "add" or "view"

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Fetch meals from backend
  const fetchMeals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/omsai/products");
      setMeals(res.data);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!mealName || !description || !price || !image) {
      alert("Please fill all fields");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", mealName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/omsai/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Meal added successfully!");
      setMealName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setPreview(null);
      fetchMeals();
      setActiveTab("view");
    } catch (error) {
      console.error(error);
      alert("Error uploading meal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setMealName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Tabs for Add Product and View Products */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 font-medium transition-all duration-300 relative ${
            activeTab === "add"
              ? "text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Add New Product
          {activeTab === "add" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 font-medium transition-all duration-300 relative ${
            activeTab === "view"
              ? "text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          View Products ({meals.length})
          {activeTab === "view" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
          )}
        </button>
      </div>

      {/* Add Product Form */}
      {activeTab === "add" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Add New Meal</h3>
            <button 
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300 mt-2 md:mt-0"
              onClick={clearForm}
            >
              Clear Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300"
                    placeholder="Enter meal name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300 h-32"
                    placeholder="Enter meal description"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors duration-300"
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-64 flex flex-col items-center justify-center">
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setPreview(null);
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
                          onChange={handleFileChange}
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
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Meal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Products Table */}
      {activeTab === "view" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">All Meals ({meals.length})</h3>
            <div className="relative mt-4 md:mt-0">
              <input 
                type="text" 
                placeholder="Search meals..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {meals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {meals.map((meal) => (
                    <tr key={meal._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{meal.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">{meal.description}</td>
                      <td className="px-4 py-3 font-semibold">₹{meal.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(meal.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-700">No meals added yet</h4>
              <p className="text-gray-500 mt-2">Get started by adding your first meal</p>
              <button 
                onClick={() => setActiveTab("add")}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                Add Your First Meal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProduct;