// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { login } from '../../features/auth/authSlice';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo, loading, error } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (userInfo) {
//       navigate(userInfo.role === 'admin' ? '/admin' : '/');
//     }
//   }, [userInfo, navigate]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(login({ email, password }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
//               create a new account
//             </Link>
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>
        
//         {/* Demo Credentials */}
//         <div className="mt-4 p-4 bg-blue-50 rounded-md">
//           <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
//           <p className="text-sm text-blue-700">Admin: admin@omsai.com / admin123</p>
//           <p className="text-sm text-blue-700">User: user@example.com / user123</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { Eye, EyeOff, Mail, Lock, LogIn, Shield, AlertCircle, Store } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.role === 'admin' ? '/admin' : '/');
    }
  }, [userInfo, navigate]);

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    dispatch(login({ email, password }));
  };

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@omsai.com');
      setPassword('admin123');
    } else {
      setEmail('user@example.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-all duration-200 hover:border-indigo-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    transition-all duration-200 hover:border-indigo-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
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

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <Shield className="w-3 h-3 mr-1 text-indigo-600" />
              DEMO CREDENTIALS
            </p>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-indigo-50 transition-colors group"
              >
                <span className="font-semibold text-indigo-700">Admin:</span>
                <span className="text-gray-600 ml-2">admin@omsai.com / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-indigo-50 transition-colors group"
              >
                <span className="font-semibold text-indigo-700">User:</span>
                <span className="text-gray-600 ml-2">user@example.com / user123</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
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