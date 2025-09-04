import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [meals, setMeals] = useState([]);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
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

    if (!mealName || !description || !price || !image) {
      alert("Please fill all fields");
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
    } catch (error) {
      console.error(error);
      alert("Error uploading meal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🍽 Admin Dashboard</h1>

      {/* Add Meal Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto mb-12"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Meal Name</label>
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            placeholder="Enter meal name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            placeholder="Enter meal description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            placeholder="Enter price"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-2"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
        >
          Add Meal
        </button>
      </form>

      {/* Meals List */}
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">📋 All Meals</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id} className="border-b">
                <td className="p-3">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="p-3 font-semibold">{meal.name}</td>
                <td className="p-3">{meal.description}</td>
                <td className="p-3">₹{meal.price}</td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(meal.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {meals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No meals added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
