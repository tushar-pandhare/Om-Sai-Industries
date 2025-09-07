import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import profileIcon from "../assets/profile icon.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-md shadow-md font-sans">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      {/* Logo */}
      <div className="flex-shrink-0 flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            className="h-8 w-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-xl font-bold text-gray-900 hover:text-red-500 transition-colors">
            Om Sai Industry
          </span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        {["Home", "Products", "Offers", "Contact"].map((name) => {
          const path = "/" + name.toLowerCase();
          return (
            <Link
              key={name}
              to={path === "/home" ? "/" : path}
              className={`relative px-3 py-2 font-medium text-gray-800 hover:text-red-500 transition-colors ${
                isActiveLink(path === "/home" ? "/" : path)
                  ? "text-red-500 font-semibold"
                  : ""
              }`}
            >
              {name}
              {isActiveLink(path === "/home" ? "/" : path) && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-red-500 rounded-full"></span>
              )}
            </Link>
          );
        })}

        {/* Profile Icon */}
        <Link
          to="/login"
          className="ml-4 flex items-center p-1 rounded-full border-2 border-gray-300 hover:border-red-500 transition-all"
        >
          <img
            src={profileIcon}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <span className="sr-only">Open main menu</span>
          {!isMenuOpen ? (
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile menu */}
  {isMenuOpen && (
    <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg font-sans">
      <div className="px-4 pt-4 pb-3 space-y-2">
        {["Home", "Products", "Offers", "Contact"].map((name) => {
          const path = "/" + name.toLowerCase();
          return (
            <Link
              key={name}
              to={path === "/home" ? "/" : path}
              className={`block px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors ${
                isActiveLink(path === "/home" ? "/" : path)
                  ? "text-red-500 font-semibold"
                  : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {name}
            </Link>
          );
        })}
        <Link
          to="/login"
          className="flex items-center px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src={profileIcon}
            alt="Profile"
            className="h-7 w-7 rounded-full object-cover mr-2"
          />
          <span>Login</span>
        </Link>
      </div>
    </div>
  )}
</nav>

  );
};

export default Navbar;
