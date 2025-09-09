// import { useState, useEffect } from "react";
// import logo from "../assets/profile icon.png";

// const LoginRegister = ({ setRole }) => {
//   const [isRegister, setIsRegister] = useState(false);
//   const [form, setForm] = useState({ 
//     username: "", 
//     mobileNumber: "", 
//     password: "" 
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     const username = localStorage.getItem("username");
    
//     if (token && role && username) {
//       setIsLoggedIn(true);
//       setUserInfo({ username, role });
//       setRole(role);
//     }
//   }, [setRole]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // Check for hardcoded admin credentials
//       if (form.username === "admin" && form.password === "adminTukaram@123") {
//         // Admin login with hardcoded credentials
//         localStorage.setItem("token", "admin-hardcoded-token");
//         localStorage.setItem("username", "admin");
//         localStorage.setItem("role", "admin");
//         setRole("admin");
//         setIsLoggedIn(true);
//         setUserInfo({ username: "admin", role: "admin" });
//         setLoading(false);
//         return;
//       }

//       // Prepare data based on whether it's registration or login
//       const requestData = isRegister 
//         ? form 
//         : { username: form.username, password: form.password };

//       const endpoint = isRegister
//         ? "http://localhost:5000/omsai/auth/register"
//         : "http://localhost:5000/omsai/auth/login";

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || data.message || "Something went wrong");
//       }

//       // For login, we expect a token and user info
//       if (!isRegister && data.token) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("username", data.username);
        
//         // If your backend returns role in login response, use it
//         const role = data.role || "user";
//         setRole(role);
//         localStorage.setItem("role", role);
//         setIsLoggedIn(true);
//         setUserInfo({ username: data.username, role });
//       } 
//       // For registration, we just show success message
//       else if (isRegister) {
//         alert("Registration successful! Please login.");
//         setIsRegister(false);
//         setForm({ username: "", mobileNumber: "", password: "" });
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//     localStorage.removeItem("role");
//     setIsLoggedIn(false);
//     setUserInfo(null);
//     setRole(null);
//     setForm({ username: "", mobileNumber: "", password: "" });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // If user is already logged in, show logout option
//   if (isLoggedIn) {
//     return (
//       <div className="flex h-screen bg-gray-50">
//         <div className="m-auto bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
//           <div className="flex justify-center mb-6">
//             <img src={logo} alt="Girni Logo" className="h-14 w-auto" />
//           </div>
          
//           <div className="text-center">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">You're already logged in</h2>
//             <p className="text-gray-600 mb-6">
//               Welcome back, <span className="font-semibold">{userInfo?.username}</span>!
//             </p>
            
//             <div className="space-y-4">
//               <button
//                 onClick={() => {
//                   window.location.href = userInfo?.role === "admin" 
//                     ? "/admin-dashboard" 
//                     : "/home";
//                 }}
//                 className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
//               >
//                 Go to Dashboard
//               </button>
              
//               <button
//                 onClick={handleLogout}
//                 className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen">
//       {/* Left Side - Form */}
//       <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 sm:px-16 lg:px-24 bg-white">
//         <div className="w-full max-w-md">
//           {/* Logo */}
//           <div className="flex justify-center mb-6">
//             <img src={logo} alt="Girni Logo" className="h-14 w-auto" />
//           </div>

//           <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
//             {isRegister ? "Create an account" : "Sign in to your account"}
//           </h2>
//           <p className="text-gray-600 text-sm mb-6 text-center">
//             {isRegister ? (
//               <>
//                 Already a member?{" "}
//                 <button
//                   onClick={() => setIsRegister(false)}
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Sign in
//                 </button>
//               </>
//             ) : (
//               <>
//                 Not a member?{" "}
//                 <button
//                   onClick={() => setIsRegister(true)}
//                   className="text-indigo-600 hover:underline font-medium"
//                 >
//                   Register now
//                 </button>
//               </>
//             )}
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={form.username}
//                 onChange={handleInputChange}
//                 className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//                 required
//               />
//             </div>
            
//             {isRegister && (
//               <div>
//                 <input
//                   type="text"
//                   name="mobileNumber"
//                   placeholder="Mobile number"
//                   value={form.mobileNumber}
//                   onChange={handleInputChange}
//                   className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//                   required={isRegister}
//                 />
//               </div>
//             )}
            
//             <div>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleInputChange}
//                 className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//                 required
//               />
//             </div>

//             {error && (
//               <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : isRegister ? (
//                 "Create Account"
//               ) : (
//                 "Sign in"
//               )}
//             </button>
//           </form>

//           {/* Admin hint (only show on login page) */}
//           {!isRegister && (
//             <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
//               <p className="font-medium">Admin Access:</p>
//               <p>Username: admin</p>
//               <p>Password: adminTukaram@123</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Side - Image */}
//       <div className="hidden md:flex w-1/2 bg-gray-50">
//         <img
//           src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1350&q=80"
//           alt="Factory machinery"
//           className="object-cover w-full h-full"
//         />
//       </div>
//     </div>
//   );
// };

// export default LoginRegister;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/profile icon.png";

const LoginRegister = ({ setRole }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ 
    username: "", 
    mobileNumber: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    
    if (token && role && username) {
      setIsLoggedIn(true);
      setUserInfo({ username, role });
      setRole(role);
    }
  }, [setRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check for hardcoded admin credentials
      if (form.username === "admin" && form.password === "adminTukaram@123") {
        // Admin login with hardcoded credentials
        localStorage.setItem("token", "admin-hardcoded-token");
        localStorage.setItem("username", "admin");
        localStorage.setItem("role", "admin");
        setRole("admin");
        setIsLoggedIn(true);
        setUserInfo({ username: "admin", role: "admin" });
        setLoading(false);
        navigate("/admin-dashboard");
        return;
      }

      // Prepare data based on whether it's registration or login
      const requestData = isRegister 
        ? form 
        : { username: form.username, password: form.password };

      const endpoint = isRegister
        ? "http://localhost:5000/omsai/auth/register"
        : "http://localhost:5000/omsai/auth/login";

      console.log("Sending request to:", endpoint);
      console.log("Request data:", requestData);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }

      // For login, we expect a token and user info
      if (!isRegister && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        
        const role = data.role || "user";
        setRole(role);
        localStorage.setItem("role", role);
        setIsLoggedIn(true);
        setUserInfo({ username: data.username, role });
        
        // Navigate based on role
        navigate(role === "admin" ? "/admin-dashboard" : "/");
      } 
      // For registration, we just show success message
      else if (isRegister) {
        alert("Registration successful! Please login.");
        setIsRegister(false);
        setForm({ username: "", mobileNumber: "", password: "" });
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      setError(err.message || "Failed to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserInfo(null);
    setRole(null);
    setForm({ username: "", mobileNumber: "", password: "" });
    
    // Force a reload to reset the app state
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // If user is already logged in, show logout option
  if (isLoggedIn) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="m-auto bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Girni Logo" className="h-14 w-auto" />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You're already logged in</h2>
            <p className="text-gray-600 mb-6">
              Welcome back, <span className="font-semibold">{userInfo?.username}</span>!
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigate(userInfo?.role === "admin" ? 
                    "/admin-dashboard" : 
                    "/"
                  );
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Girni Logo" className="h-14 w-auto" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {isRegister ? "Create an account" : "Sign in to your account"}
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            {isRegister ? (
              <>
                Already a member?{" "}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Not a member?{" "}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Register now
                </button>
              </>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            
            {isRegister && (
              <div>
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile number"
                  value={form.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  required={isRegister}
                />
              </div>
            )}
            
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Admin hint (only show on login page) */}
          {!isRegister && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              <p className="font-medium">Admin Access:</p>
              <p>Username: admin</p>
              <p>Password: adminTukaram@123</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1350&q=80"
          alt="Factory machinery"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default LoginRegister;