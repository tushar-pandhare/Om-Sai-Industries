import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { Eye, EyeOff, Mail, Lock, LogIn, Shield, AlertCircle, Store, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });
  const [touchedFields, setTouchedFields] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.role === 'admin' ? '/admin' : '/');
    }
  }, [userInfo, navigate]);

  // Real-time email validation
  useEffect(() => {
    if (touchedFields.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!formData.email) {
        setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      } else if (!emailRegex.test(formData.email)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    }
  }, [formData.email, touchedFields.email]);

  // Real-time password validation
  useEffect(() => {
    if (touchedFields.password) {
      if (!formData.password) {
        setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
      } else if (formData.password.length < 6) {
        setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      } else {
        setFieldErrors(prev => ({ ...prev, password: '' }));
      }
    }
  }, [formData.password, touchedFields.password]);

  // Account lockout mechanism
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
      }, 15 * 60 * 1000); // 15 minutes lockout
      setLockTimer(timer);
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = () => {
    // Mark all fields as touched
    setTouchedFields({ email: true, password: true });
    
    // Check if there are any errors
    const hasErrors = Object.values(fieldErrors).some(error => error !== '');
    const isFormValid = formData.email && formData.password && !hasErrors;
    
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(login(formData)).unwrap();
      // Reset login attempts on success
      setLoginAttempts(0);
    } catch (err) {
      // Increment login attempts on failure
      setLoginAttempts(prev => prev + 1);
    }
  };

  const getRemainingLockTime = () => {
    if (!isLocked) return null;
    return "15 minutes";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account and continue shopping
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6 bg-white rounded-2xl shadow-xl p-8" onSubmit={handleSubmit}>
          {/* Account Locked Alert */}
          {isLocked && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">Account Temporarily Locked</p>
                  <p className="text-xs text-red-600 mt-1">
                    Too many failed login attempts. Please try again in {getRemainingLockTime()}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && !isLocked && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Attempts Warning */}
          {loginAttempts >= 3 && loginAttempts < 5 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
              <p className="text-xs text-yellow-700">
                ⚠️ Warning: {5 - loginAttempts} login attempts remaining before account lockout.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  disabled={isLocked}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-all duration-200 ${
                      fieldErrors.email && touchedFields.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-indigo-300'
                    } ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="tushar@gmail.com"
                />
              </div>
              {fieldErrors.email && touchedFields.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  disabled={isLocked}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-all duration-200 ${
                      fieldErrors.password && touchedFields.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-indigo-300'
                    } ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {fieldErrors.password && touchedFields.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || isLocked}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
              text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 
              hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 
              transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </div>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-blue-800">Secure Login</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Your password is encrypted. We never store or share your credentials.
                </p>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { login } from '../../features/auth/authSlice';
// import { Eye, EyeOff, Mail, Lock, LogIn, Shield, AlertCircle, Store } from 'lucide-react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo, loading, error } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (userInfo) {
//       navigate(userInfo.role === 'admin' ? '/admin' : '/');
//     }
//   }, [userInfo, navigate]);

//   // Load saved email if remember me was checked
//   useEffect(() => {
//     const savedEmail = localStorage.getItem('rememberedEmail');
//     if (savedEmail) {
//       setEmail(savedEmail);
//       setRememberMe(true);
//     }
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (rememberMe) {
//       localStorage.setItem('rememberedEmail', email);
//     } else {
//       localStorage.removeItem('rememberedEmail');
//     }
    
//     dispatch(login({ email, password }));
//   };

//   const fillDemoCredentials = (type) => {
//     if (type === 'admin') {
//       setEmail('admin@omsai.com');
//       setPassword('admin123');
//     } else {
//       setEmail('user@example.com');
//       setPassword('user123');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
//       </div>
      
//       <div className="max-w-md w-full space-y-8 relative z-10">
//         {/* Logo/Brand */}
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
//               <Store className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
//             Welcome Back
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign in to access your account and continue shopping
//           </p>
//         </div>

//         {/* Login Form */}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {/* Error Alert */}
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
//               <div className="flex items-center">
//                 <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Email Field */}
//             <div className="group">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
//                 </div>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
//                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                     transition-all duration-200 hover:border-indigo-300"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="group">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl 
//                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                     transition-all duration-200 hover:border-indigo-300"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
//                   Forgot password?
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
//               text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 
//               hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 
//               focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 
//               transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <div className="flex items-center">
//                 <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 Signing in...
//               </div>
//             ) : (
//               <div className="flex items-center">
//                 <LogIn className="w-4 h-4 mr-2" />
//                 Sign in
//               </div>
//             )}
//           </button>

//           {/* Demo Credentials */}
//           <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//             <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
//               <Shield className="w-3 h-3 mr-1 text-indigo-600" />
//               DEMO CREDENTIALS
//             </p>
//             <div className="space-y-2 text-sm">
//               <button
//                 type="button"
//                 onClick={() => fillDemoCredentials('admin')}
//                 className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-indigo-50 transition-colors group"
//               >
//                 <span className="font-semibold text-indigo-700">Admin:</span>
//                 <span className="text-gray-600 ml-2">admin@omsai.com / admin123</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => fillDemoCredentials('user')}
//                 className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-indigo-50 transition-colors group"
//               >
//                 <span className="font-semibold text-indigo-700">User:</span>
//                 <span className="text-gray-600 ml-2">user@example.com / user123</span>
//               </button>
//             </div>
//           </div>

//           {/* Sign Up Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
//                 Create an account
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
//         .animate-shake {
//           animation: shake 0.3s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;