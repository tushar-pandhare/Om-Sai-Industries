import { useState } from "react";

export default function adminNavbar() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Main Navbar */}
      <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">MyApp</div>
        <ul className="flex space-x-6 items-center">
          <li><a href="/" className="hover:text-gray-300">Home</a></li>
          <li><a href="/about" className="hover:text-gray-300">About</a></li>
          <li>
            {/* Profile Image Button */}
            <button onClick={() => setIsImageOpen(true)}>
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white hover:scale-105 transition"
              />
            </button>
          </li>
        </ul>
      </nav>

      {/* Secondary Navbar (only visible when image is open) */}
      {isImageOpen && (
        <div className="bg-gray-700 text-white px-6 py-2 flex justify-center space-x-8">
          <button
            onClick={() => alert("Go to Profile Page")}
            className="hover:text-gray-300"
          >
            View Profile
          </button>
          <button
            onClick={() => setIsImageOpen(false)}
            className="hover:text-gray-300"
          >
            Close Image
          </button>
        </div>
      )}

      {/* Image Modal */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src="https://via.placeholder.com/400"
              alt="Profile Large"
              className="rounded-lg shadow-lg max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
