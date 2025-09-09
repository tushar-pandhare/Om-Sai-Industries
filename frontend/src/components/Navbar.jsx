// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import profileIcon from "../assets/profile icon.png";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   const isActiveLink = (path) => location.pathname === path;

//   return (
//     <nav className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-md shadow-md font-sans">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="flex justify-between h-16 items-center">
//       {/* Logo */}
//       <div className="flex-shrink-0 flex items-center">
//         <Link to="/" className="flex items-center space-x-2">
//           <svg
//             className="h-8 w-8 text-red-500"
//             fill="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//           </svg>
//           <span className="text-xl font-bold text-gray-900 hover:text-red-500 transition-colors">
//             Om Sai Industry
//           </span>
//         </Link>
//       </div>

//       {/* Desktop Links */}
//       <div className="hidden md:flex items-center space-x-6">
//         {["Home", "Products", "Offers", "Contact"].map((name) => {
//           const path = "/" + name.toLowerCase();
//           return (
//             <Link
//               key={name}
//               to={path === "/home" ? "/" : path}
//               className={`relative px-3 py-2 font-medium text-gray-800 hover:text-red-500 transition-colors ${
//                 isActiveLink(path === "/home" ? "/" : path)
//                   ? "text-red-500 font-semibold"
//                   : ""
//               }`}
//             >
//               {name}
//               {isActiveLink(path === "/home" ? "/" : path) && (
//                 <span className="absolute left-0 bottom-0 w-full h-0.5 bg-red-500 rounded-full"></span>
//               )}
//             </Link>
//           );
//         })}

//         {/* Profile Icon */}
//         <Link
//           to="/login"
//           className="ml-4 flex items-center p-1 rounded-full border-2 border-gray-300 hover:border-red-500 transition-all"
//         >
//           <img
//             src={profileIcon}
//             alt="Profile"
//             className="h-8 w-8 rounded-full object-cover"
//           />
//         </Link>
//       </div>

//       {/* Mobile menu button */}
//       <div className="md:hidden flex items-center">
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:bg-gray-200 transition-colors"
//         >
//           <span className="sr-only">Open main menu</span>
//           {!isMenuOpen ? (
//             <svg
//               className="block h-6 w-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             </svg>
//           ) : (
//             <svg
//               className="block h-6 w-6"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           )}
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* Mobile menu */}
//   {isMenuOpen && (
//     <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg font-sans">
//       <div className="px-4 pt-4 pb-3 space-y-2">
//         {["Home", "Products", "Offers", "Contact"].map((name) => {
//           const path = "/" + name.toLowerCase();
//           return (
//             <Link
//               key={name}
//               to={path === "/home" ? "/" : path}
//               className={`block px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors ${
//                 isActiveLink(path === "/home" ? "/" : path)
//                   ? "text-red-500 font-semibold"
//                   : ""
//               }`}
//               onClick={() => setIsMenuOpen(false)}
//             >
//               {name}
//             </Link>
//           );
//         })}
//         <Link
//           to="/login"
//           className="flex items-center px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           <img
//             src={profileIcon}
//             alt="Profile"
//             className="h-7 w-7 rounded-full object-cover mr-2"
//           />
//           <span>Login</span>
//         </Link>
//       </div>
//     </div>
//   )}
// </nav>

//   );
// };

// export default Navbar;
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import profileIcon from "../assets/profile icon.png";

const Navbar = ({ role, setRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    // Close menus when route changes
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    if (setRole) setRole(null);
    navigate("/");
    setIsProfileMenuOpen(false);
  };

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

            {/* Cart Link for Users */}
            {role === "user" && (
              <Link
                to="/cart"
                className={`relative px-3 py-2 font-medium text-gray-800 hover:text-red-500 transition-colors ${
                  isActiveLink("/cart") ? "text-red-500 font-semibold" : ""
                }`}
              >
                Cart
                {isActiveLink("/cart") && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-red-500 rounded-full"></span>
                )}
              </Link>
            )}

            {/* Admin Dashboard Link */}
            {role === "admin" && (
              <Link
                to="/admin-dashboard"
                className={`relative px-3 py-2 font-medium text-gray-800 hover:text-red-500 transition-colors ${
                  isActiveLink("/admin-dashboard")
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
              >
                Admin
                {isActiveLink("/admin-dashboard") && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-red-500 rounded-full"></span>
                )}
              </Link>
            )}

            {/* Profile Icon with Dropdown */}
            <div className="ml-4 relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center p-1 rounded-full border-2 border-gray-300 hover:border-red-500 transition-all"
              >
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {role ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Signed in as <strong>{username}</strong>
                      </div>
                      {role === "admin" && (
                        <Link
                          to="/admin-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              )}
            </div>
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

            {/* Cart Link for Users in Mobile */}
            {role === "user" && (
              <Link
                to="/cart"
                className={`block px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors ${
                  isActiveLink("/cart") ? "text-red-500 font-semibold" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>
            )}

            {/* Admin Dashboard Link in Mobile */}
            {role === "admin" && (
              <Link
                to="/admin-dashboard"
                className={`block px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors ${
                  isActiveLink("/admin-dashboard")
                    ? "text-red-500 font-semibold"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            {/* Authentication in Mobile */}
            {role ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500 border-t">
                  Signed in as <strong>{username}</strong>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-800 hover:text-red-500 font-medium transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
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
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;