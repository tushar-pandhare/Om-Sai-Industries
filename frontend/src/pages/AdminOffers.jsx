import { useState } from 'react';
import axios from 'axios';

const AdminOffers = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('current');
  const [validTill, setValidTill] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !validTill || !image) {
      alert('Please fill all fields and select an image.');
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
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert('Failed to create offer.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Offer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="current">Current</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Valid Till</label>
          <input
            type="date"
            value={validTill}
            onChange={(e) => setValidTill(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Offer Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Offer
        </button>
      </form>
    </div>
  );
};

export default AdminOffers;
