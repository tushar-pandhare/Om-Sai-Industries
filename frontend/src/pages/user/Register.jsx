import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { 
  Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Building2, 
  Globe, Home, AlertCircle, CheckCircle, Store, ArrowRight,
  CreditCard, Truck, Shield, Award, XCircle, Key
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '', color: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  
  // Real-time validation states
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [touchedFields, setTouchedFields] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  // Real-time validations
  useEffect(() => {
    // Name validation
    if (touchedFields.name) {
      if (!formData.name.trim()) {
        setFieldErrors(prev => ({ ...prev, name: 'Name is required' }));
      } else if (formData.name.length < 2) {
        setFieldErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      } else if (formData.name.length > 50) {
        setFieldErrors(prev => ({ ...prev, name: 'Name must be less than 50 characters' }));
      } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
        setFieldErrors(prev => ({ ...prev, name: 'Name can only contain letters and spaces' }));
      } else {
        setFieldErrors(prev => ({ ...prev, name: '' }));
      }
    }

    // Email validation
    if (touchedFields.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!formData.email) {
        setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      } else if (!emailRegex.test(formData.email)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (formData.email.length > 100) {
        setFieldErrors(prev => ({ ...prev, email: 'Email must be less than 100 characters' }));
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    }

    // Phone validation - Indian mobile numbers only
    if (touchedFields.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!formData.phone) {
        setFieldErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      } else if (!phoneRegex.test(formData.phone)) {
        setFieldErrors(prev => ({ ...prev, phone: 'Enter a valid 10-digit Indian mobile number (starts with 6-9)' }));
      } else {
        setFieldErrors(prev => ({ ...prev, phone: '' }));
      }
    }

    // Password match validation
    if (touchedFields.confirmPassword || formData.confirmPassword) {
      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (formData.confirmPassword && formData.password === formData.confirmPassword) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    // Address validations
    if (touchedFields.street && !formData.address.street) {
      setFieldErrors(prev => ({ ...prev, street: 'Street address is required' }));
    } else if (touchedFields.street && formData.address.street.length > 200) {
      setFieldErrors(prev => ({ ...prev, street: 'Street address must be less than 200 characters' }));
    } else if (touchedFields.street) {
      setFieldErrors(prev => ({ ...prev, street: '' }));
    }

    if (touchedFields.city && !formData.address.city) {
      setFieldErrors(prev => ({ ...prev, city: 'City is required' }));
    } else if (touchedFields.city && !/^[a-zA-Z\s]+$/.test(formData.address.city)) {
      setFieldErrors(prev => ({ ...prev, city: 'City can only contain letters and spaces' }));
    } else if (touchedFields.city) {
      setFieldErrors(prev => ({ ...prev, city: '' }));
    }

    if (touchedFields.state && !formData.address.state) {
      setFieldErrors(prev => ({ ...prev, state: 'State is required' }));
    } else if (touchedFields.state && !/^[a-zA-Z\s]+$/.test(formData.address.state)) {
      setFieldErrors(prev => ({ ...prev, state: 'State can only contain letters and spaces' }));
    } else if (touchedFields.state) {
      setFieldErrors(prev => ({ ...prev, state: '' }));
    }

    if (touchedFields.pincode) {
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!formData.address.pincode) {
        setFieldErrors(prev => ({ ...prev, pincode: 'PIN code is required' }));
      } else if (!pincodeRegex.test(formData.address.pincode)) {
        setFieldErrors(prev => ({ ...prev, pincode: 'Enter a valid 6-digit PIN code (cannot start with 0)' }));
      } else {
        setFieldErrors(prev => ({ ...prev, pincode: '' }));
      }
    }
  }, [formData, touchedFields]);

  // Password strength checker
  useEffect(() => {
    const checkPasswordStrength = (pwd) => {
      let score = 0;
      let message = '';
      let color = '';
      
      if (pwd.length >= 8) score++;
      if (pwd.length >= 12) score++;
      if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) score++;
      if (pwd.match(/[0-9]/)) score++;
      if (pwd.match(/[^a-zA-Z0-9]/)) score++;
      
      if (score === 0 || (score === 1 && pwd.length < 8)) {
        message = 'Very Weak';
        color = 'bg-red-500';
      } else if (score <= 2) {
        message = 'Weak';
        color = 'bg-orange-500';
      } else if (score <= 3) {
        message = 'Fair';
        color = 'bg-yellow-500';
      } else if (score <= 4) {
        message = 'Good';
        color = 'bg-blue-500';
      } else {
        message = 'Strong';
        color = 'bg-emerald-500';
      }
      
      setPasswordStrength({ score, message, color });
    };
    
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const validateForm = () => {
    // Mark all fields as touched
    const allFields = {
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      street: true,
      city: true,
      state: true,
      pincode: true
    };
    setTouchedFields(allFields);
    
    // Check if there are any errors
    const hasErrors = Object.values(fieldErrors).some(error => error !== '');
    
    if (hasErrors) {
      // Scroll to first error
      const firstErrorField = Object.keys(fieldErrors).find(key => fieldErrors[key] !== '');
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return false;
    }
    
    if (!acceptedTerms) {
      return false;
    }
    
    // Check password strength - require at least "Fair" strength
    if (passwordStrength.score <= 2) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Rate limiting - prevent multiple rapid registrations
    if (registrationAttempts >= 3) {
      alert('Too many registration attempts. Please try again later.');
      return;
    }
    
    if (!validateForm()) return;
    
    setRegistrationAttempts(prev => prev + 1);
    
    const { confirmPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  const getPasswordStrengthColor = () => passwordStrength.color;

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name && formData.email && formData.password && formData.confirmPassword &&
             !fieldErrors.name && !fieldErrors.email && !fieldErrors.password && !fieldErrors.confirmPassword &&
             passwordStrength.score >= 3;
    }
    if (currentStep === 2) {
      return formData.phone && !fieldErrors.phone;
    }
    if (currentStep === 3) {
      return formData.address.street && formData.address.city && formData.address.state && formData.address.pincode &&
             !fieldErrors.street && !fieldErrors.city && !fieldErrors.state && !fieldErrors.pincode;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Om Sai Industries and start your shopping journey
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span className={currentStep === 1 ? 'text-indigo-600 font-semibold' : ''}>Account Info</span>
            <span className={currentStep === 2 ? 'text-indigo-600 font-semibold' : ''}>Contact Details</span>
            <span className={currentStep === 3 ? 'text-indigo-600 font-semibold' : ''}>Address</span>
          </div>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6 bg-white rounded-2xl shadow-xl p-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Step 1: Account Info */}
            <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Account Information
              </h3>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${fieldErrors.name ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.name && touchedFields.name
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="Tushar Pandhare"
                    />
                  </div>
                  {fieldErrors.name && touchedFields.name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
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
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.email && touchedFields.email
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="tushar@example.com"
                    />
                  </div>
                  {fieldErrors.email && touchedFields.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.password && touchedFields.password
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.message === 'Strong' ? 'text-emerald-600' :
                          passwordStrength.message === 'Good' ? 'text-blue-600' :
                          passwordStrength.message === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength.message}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Use 8+ characters with uppercase, lowercase, numbers & symbols
                      </p>
                      {passwordStrength.score <= 2 && formData.password.length > 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Please choose a stronger password
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className={`h-5 w-5 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.confirmPassword && touchedFields.confirmPassword
                            ? 'border-red-500 bg-red-50'
                            : formData.confirmPassword && !fieldErrors.confirmPassword
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  {formData.confirmPassword && !fieldErrors.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match ✓
                    </p>
                  )}
                  
                  {fieldErrors.confirmPassword && touchedFields.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-shake">
                      <XCircle className="w-3 h-3" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className={`h-5 w-5 ${fieldErrors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.phone && touchedFields.phone
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {fieldErrors.phone && touchedFields.phone && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {fieldErrors.phone}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">Enter a valid 10-digit Indian mobile number</p>
                </div>

                {/* Benefits Cards */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
                    <Truck className="w-5 h-5 text-emerald-600 mb-1" />
                    <p className="text-xs font-medium text-emerald-700">Free Shipping</p>
                    <p className="text-xs text-emerald-600">On orders ₹999+</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                    <Shield className="w-5 h-5 text-indigo-600 mb-1" />
                    <p className="text-xs font-medium text-indigo-700">Secure Payments</p>
                    <p className="text-xs text-indigo-600">100% protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Address */}
            <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                Shipping Address
              </h3>
              
              <div className="space-y-4">
                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className={`h-5 w-5 ${fieldErrors.street ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="address.street"
                      required
                      value={formData.address.street}
                      onChange={handleChange}
                      onBlur={() => handleBlur('street')}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.street && touchedFields.street
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="House No., Street Name"
                    />
                  </div>
                  {fieldErrors.street && touchedFields.street && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {fieldErrors.street}
                    </p>
                  )}
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className={`h-5 w-5 ${fieldErrors.city ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="address.city"
                        required
                        value={formData.address.city}
                        onChange={handleChange}
                        onBlur={() => handleBlur('city')}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          transition-all duration-200 ${
                            fieldErrors.city && touchedFields.city
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 hover:border-indigo-300'
                          }`}
                        placeholder="City"
                      />
                    </div>
                    {fieldErrors.city && touchedFields.city && (
                      <p className="mt-1 text-xs text-red-500">{fieldErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className={`h-5 w-5 ${fieldErrors.state ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="address.state"
                        required
                        value={formData.address.state}
                        onChange={handleChange}
                        onBlur={() => handleBlur('state')}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          transition-all duration-200 ${
                            fieldErrors.state && touchedFields.state
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 hover:border-indigo-300'
                          }`}
                        placeholder="State"
                      />
                    </div>
                    {fieldErrors.state && touchedFields.state && (
                      <p className="mt-1 text-xs text-red-500">{fieldErrors.state}</p>
                    )}
                  </div>
                </div>

                {/* PIN Code and Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      required
                      value={formData.address.pincode}
                      onChange={handleChange}
                      onBlur={() => handleBlur('pincode')}
                      className={`block w-full px-3 py-3 border rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 ${
                          fieldErrors.pincode && touchedFields.pincode
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      placeholder="123456"
                    />
                    {fieldErrors.pincode && touchedFields.pincode && (
                      <p className="mt-1 text-xs text-red-500">{fieldErrors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        transition-all duration-200 bg-gray-50"
                      placeholder="India"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <a href="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            {/* Password Requirement Notice */}
            {!acceptedTerms && currentStep === 3 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please accept terms and conditions to continue
              </p>
            )}
            
            {currentStep === 3 && passwordStrength.score <= 2 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please choose a stronger password before registering
              </p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 
                  font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 
                  text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4 inline-block ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepValid() || !acceptedTerms || passwordStrength.score <= 2}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 
                  text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="flex justify-center items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Quality Assured</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-500" />
            <span>Easy Returns</span>
          </div>
        </div>
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

export default Register;

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { register } from '../../features/auth/authSlice';
// import { 
//   Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Building2, 
//   Globe, Home, AlertCircle, CheckCircle, Store, ArrowRight,
//   CreditCard, Truck, Shield, Award, XCircle
// } from 'lucide-react';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       pincode: '',
//       country: 'India'
//     }
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordError, setPasswordError] = useState('');
//   const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
  
//   // Real-time validation states
//   const [fieldErrors, setFieldErrors] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     street: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });
  
//   const [touchedFields, setTouchedFields] = useState({});
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo, loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (userInfo) {
//       navigate('/');
//     }
//   }, [userInfo, navigate]);

//   // Real-time password match validation
//   useEffect(() => {
//     if (touchedFields.confirmPassword || formData.confirmPassword) {
//       if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
//         setFieldErrors(prev => ({
//           ...prev,
//           confirmPassword: 'Passwords do not match'
//         }));
//       } else {
//         setFieldErrors(prev => ({
//           ...prev,
//           confirmPassword: ''
//         }));
//       }
//     }
//   }, [formData.password, formData.confirmPassword, touchedFields.confirmPassword]);

//   // Real-time field validations
//   useEffect(() => {
//     // Name validation
//     if (touchedFields.name) {
//       if (!formData.name.trim()) {
//         setFieldErrors(prev => ({ ...prev, name: 'Name is required' }));
//       } else if (formData.name.length < 2) {
//         setFieldErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
//       } else {
//         setFieldErrors(prev => ({ ...prev, name: '' }));
//       }
//     }

//     // Email validation
//     if (touchedFields.email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!formData.email) {
//         setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
//       } else if (!emailRegex.test(formData.email)) {
//         setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
//       } else {
//         setFieldErrors(prev => ({ ...prev, email: '' }));
//       }
//     }

//     // Phone validation
//     if (touchedFields.phone) {
//       const phoneRegex = /^[0-9]{10}$/;
//       if (!formData.phone) {
//         setFieldErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
//       } else if (!phoneRegex.test(formData.phone)) {
//         setFieldErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }));
//       } else {
//         setFieldErrors(prev => ({ ...prev, phone: '' }));
//       }
//     }

//     // Password validation
//     if (touchedFields.password) {
//       if (!formData.password) {
//         setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
//       } else if (formData.password.length < 6) {
//         setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
//       } else {
//         setFieldErrors(prev => ({ ...prev, password: '' }));
//       }
//     }

//     // Address validations
//     if (touchedFields.street && !formData.address.street) {
//       setFieldErrors(prev => ({ ...prev, street: 'Street address is required' }));
//     } else if (touchedFields.street) {
//       setFieldErrors(prev => ({ ...prev, street: '' }));
//     }

//     if (touchedFields.city && !formData.address.city) {
//       setFieldErrors(prev => ({ ...prev, city: 'City is required' }));
//     } else if (touchedFields.city) {
//       setFieldErrors(prev => ({ ...prev, city: '' }));
//     }

//     if (touchedFields.state && !formData.address.state) {
//       setFieldErrors(prev => ({ ...prev, state: 'State is required' }));
//     } else if (touchedFields.state) {
//       setFieldErrors(prev => ({ ...prev, state: '' }));
//     }

//     if (touchedFields.pincode) {
//       const pincodeRegex = /^[0-9]{6}$/;
//       if (!formData.address.pincode) {
//         setFieldErrors(prev => ({ ...prev, pincode: 'PIN code is required' }));
//       } else if (!pincodeRegex.test(formData.address.pincode)) {
//         setFieldErrors(prev => ({ ...prev, pincode: 'Please enter a valid 6-digit PIN code' }));
//       } else {
//         setFieldErrors(prev => ({ ...prev, pincode: '' }));
//       }
//     }
//   }, [formData, touchedFields]);

//   // Password strength checker
//   useEffect(() => {
//     const checkPasswordStrength = (pwd) => {
//       let score = 0;
//       let message = '';
      
//       if (pwd.length >= 8) score++;
//       if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) score++;
//       if (pwd.match(/[0-9]/)) score++;
//       if (pwd.match(/[^a-zA-Z0-9]/)) score++;
      
//       if (score === 0) message = 'Very Weak';
//       else if (score === 1) message = 'Weak';
//       else if (score === 2) message = 'Fair';
//       else if (score === 3) message = 'Good';
//       else message = 'Strong';
      
//       setPasswordStrength({ score, message });
//     };
    
//     checkPasswordStrength(formData.password);
//   }, [formData.password]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData({
//         ...formData,
//         [parent]: {
//           ...formData[parent],
//           [child]: value
//         }
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   const handleBlur = (fieldName) => {
//     setTouchedFields(prev => ({
//       ...prev,
//       [fieldName]: true
//     }));
//   };

//   const validateForm = () => {
//     // Mark all fields as touched to show errors
//     const allFields = {
//       name: true,
//       email: true,
//       phone: true,
//       password: true,
//       confirmPassword: true,
//       street: true,
//       city: true,
//       state: true,
//       pincode: true
//     };
//     setTouchedFields(allFields);
    
//     // Check if there are any errors
//     const hasErrors = Object.values(fieldErrors).some(error => error !== '');
    
//     if (hasErrors) {
//       // Scroll to first error
//       const firstErrorField = Object.keys(fieldErrors).find(key => fieldErrors[key] !== '');
//       const element = document.querySelector(`[name="${firstErrorField}"]`);
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         element.focus();
//       }
//       return false;
//     }
    
//     if (!acceptedTerms) {
//       setPasswordError('Please accept the terms and conditions');
//       return false;
//     }
    
//     setPasswordError('');
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     const { confirmPassword, ...registerData } = formData;
//     dispatch(register(registerData));
//   };

//   const getPasswordStrengthColor = () => {
//     switch(passwordStrength.message) {
//       case 'Strong': return 'bg-emerald-500';
//       case 'Good': return 'bg-blue-500';
//       case 'Fair': return 'bg-yellow-500';
//       default: return 'bg-red-500';
//     }
//   };

//   const isStepValid = () => {
//     if (currentStep === 1) {
//       return formData.name && formData.email && formData.password && formData.confirmPassword &&
//              !fieldErrors.name && !fieldErrors.email && !fieldErrors.password && !fieldErrors.confirmPassword;
//     }
//     if (currentStep === 2) {
//       return formData.phone && !fieldErrors.phone;
//     }
//     if (currentStep === 3) {
//       return formData.address.street && formData.address.city && formData.address.state && formData.address.pincode &&
//              !fieldErrors.street && !fieldErrors.city && !fieldErrors.state && !fieldErrors.pincode;
//     }
//     return false;
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
//       {/* Animated Background */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="max-w-4xl w-full space-y-8 relative z-10">
//         {/* Header */}
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
//               <Store className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
//             Create Account
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Join Om Sai Industries and start your shopping journey
//           </p>
//         </div>

//         {/* Progress Steps */}
//         <div className="max-w-md mx-auto">
//           <div className="flex items-center justify-between">
//             <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
//             <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
//             <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
//           </div>
//           <div className="flex justify-between mt-2 text-xs text-gray-600">
//             <span className={currentStep === 1 ? 'text-indigo-600 font-semibold' : ''}>Account Info</span>
//             <span className={currentStep === 2 ? 'text-indigo-600 font-semibold' : ''}>Contact Details</span>
//             <span className={currentStep === 3 ? 'text-indigo-600 font-semibold' : ''}>Address</span>
//           </div>
//         </div>

//         {/* Registration Form */}
//         <form className="mt-8 space-y-6 bg-white rounded-2xl shadow-xl p-8" onSubmit={handleSubmit}>
//           {/* Error Alert */}
//           {passwordError && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
//               <div className="flex items-center">
//                 <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
//                 <p className="text-sm text-red-700">{passwordError}</p>
//               </div>
//             </div>
//           )}

//           <div className="space-y-6">
//             {/* Step 1: Account Info */}
//             <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <User className="w-5 h-5 mr-2 text-indigo-600" />
//                 Account Information
//               </h3>
              
//               <div className="space-y-4">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <User className={`h-5 w-5 ${fieldErrors.name ? 'text-red-400' : 'text-gray-400'}`} />
//                     </div>
//                     <input
//                       type="text"
//                       name="name"
//                       required
//                       value={formData.name}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('name')}
//                       className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.name && touchedFields.name
//                             ? 'border-red-500 bg-red-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   {fieldErrors.name && touchedFields.name && (
//                     <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//                       <XCircle className="w-3 h-3" />
//                       {fieldErrors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
//                     </div>
//                     <input
//                       type="email"
//                       name="email"
//                       required
//                       value={formData.email}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('email')}
//                       className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.email && touchedFields.email
//                             ? 'border-red-500 bg-red-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="john@example.com"
//                     />
//                   </div>
//                   {fieldErrors.email && touchedFields.email && (
//                     <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//                       <XCircle className="w-3 h-3" />
//                       {fieldErrors.email}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
//                     </div>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       required
//                       value={formData.password}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('password')}
//                       className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.password && touchedFields.password
//                             ? 'border-red-500 bg-red-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="Create a strong password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                       ) : (
//                         <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                       )}
//                     </button>
//                   </div>
                  
//                   {/* Password Strength Indicator */}
//                   {formData.password && (
//                     <div className="mt-2">
//                       <div className="flex items-center gap-2">
//                         <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                           <div 
//                             className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
//                             style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
//                           />
//                         </div>
//                         <span className={`text-xs font-medium ${
//                           passwordStrength.message === 'Strong' ? 'text-emerald-600' :
//                           passwordStrength.message === 'Good' ? 'text-blue-600' :
//                           passwordStrength.message === 'Fair' ? 'text-yellow-600' : 'text-red-600'
//                         }`}>
//                           {passwordStrength.message}
//                         </span>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Use 8+ characters with letters, numbers & symbols
//                       </p>
//                     </div>
//                   )}
//                   {fieldErrors.password && touchedFields.password && (
//                     <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//                       <XCircle className="w-3 h-3" />
//                       {fieldErrors.password}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password - REAL-TIME MISMATCH ERROR */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className={`h-5 w-5 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
//                     </div>
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       required
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('confirmPassword')}
//                       className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.confirmPassword && touchedFields.confirmPassword
//                             ? 'border-red-500 bg-red-50'
//                             : formData.confirmPassword && !fieldErrors.confirmPassword
//                             ? 'border-emerald-500 bg-emerald-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="Confirm your password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                       ) : (
//                         <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                       )}
//                     </button>
//                   </div>
                  
//                   {/* Real-time Password Match Indicator */}
//                   {formData.confirmPassword && !fieldErrors.confirmPassword && formData.password === formData.confirmPassword && (
//                     <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
//                       <CheckCircle className="w-3 h-3" />
//                       Passwords match ✓
//                     </p>
//                   )}
                  
//                   {/* Real-time Password Mismatch Error - Shows immediately */}
//                   {fieldErrors.confirmPassword && touchedFields.confirmPassword && (
//                     <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-shake">
//                       <XCircle className="w-3 h-3" />
//                       {fieldErrors.confirmPassword}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Step 2: Contact Details */}
//             <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <Phone className="w-5 h-5 mr-2 text-indigo-600" />
//                 Contact Information
//               </h3>
              
//               <div className="space-y-4">
//                 {/* Phone Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Phone className={`h-5 w-5 ${fieldErrors.phone ? 'text-red-400' : 'text-gray-400'}`} />
//                     </div>
//                     <input
//                       type="tel"
//                       name="phone"
//                       required
//                       value={formData.phone}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('phone')}
//                       className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.phone && touchedFields.phone
//                             ? 'border-red-500 bg-red-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="9876543210"
//                     />
//                   </div>
//                   {fieldErrors.phone && touchedFields.phone && (
//                     <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//                       <XCircle className="w-3 h-3" />
//                       {fieldErrors.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* Benefits Cards */}
//                 <div className="grid grid-cols-2 gap-3 mt-4">
//                   <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
//                     <Truck className="w-5 h-5 text-emerald-600 mb-1" />
//                     <p className="text-xs font-medium text-emerald-700">Free Shipping</p>
//                     <p className="text-xs text-emerald-600">On orders ₹999+</p>
//                   </div>
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
//                     <Shield className="w-5 h-5 text-indigo-600 mb-1" />
//                     <p className="text-xs font-medium text-indigo-700">Secure Payments</p>
//                     <p className="text-xs text-indigo-600">100% protected</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Step 3: Address */}
//             <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
//                 Shipping Address
//               </h3>
              
//               <div className="space-y-4">
//                 {/* Street Address */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Street Address *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Home className={`h-5 w-5 ${fieldErrors.street ? 'text-red-400' : 'text-gray-400'}`} />
//                     </div>
//                     <input
//                       type="text"
//                       name="address.street"
//                       required
//                       value={formData.address.street}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('street')}
//                       className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.street && touchedFields.street
//                             ? 'border-red-500 bg-red-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="House No., Street Name"
//                     />
//                   </div>
//                   {fieldErrors.street && touchedFields.street && (
//                     <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
//                       <XCircle className="w-3 h-3" />
//                       {fieldErrors.street}
//                     </p>
//                   )}
//                 </div>

//                 {/* City and State */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Building2 className={`h-5 w-5 ${fieldErrors.city ? 'text-red-400' : 'text-gray-400'}`} />
//                       </div>
//                       <input
//                         type="text"
//                         name="address.city"
//                         required
//                         value={formData.address.city}
//                         onChange={handleChange}
//                         onBlur={() => handleBlur('city')}
//                         className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
//                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                           transition-all duration-200 ${
//                             fieldErrors.city && touchedFields.city
//                               ? 'border-red-500 bg-red-50'
//                               : 'border-gray-300 hover:border-indigo-300'
//                           }`}
//                         placeholder="City"
//                       />
//                     </div>
//                     {fieldErrors.city && touchedFields.city && (
//                       <p className="mt-1 text-xs text-red-500">{fieldErrors.city}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Globe className={`h-5 w-5 ${fieldErrors.state ? 'text-red-400' : 'text-gray-400'}`} />
//                       </div>
//                       <input
//                         type="text"
//                         name="address.state"
//                         required
//                         value={formData.address.state}
//                         onChange={handleChange}
//                         onBlur={() => handleBlur('state')}
//                         className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
//                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                           transition-all duration-200 ${
//                             fieldErrors.state && touchedFields.state
//                               ? 'border-red-500 bg-red-50'
//                               : 'border-gray-300 hover:border-indigo-300'
//                           }`}
//                         placeholder="State"
//                       />
//                     </div>
//                     {fieldErrors.state && touchedFields.state && (
//                       <p className="mt-1 text-xs text-red-500">{fieldErrors.state}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* PIN Code and Country */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       PIN Code *
//                     </label>
//                     <input
//                       type="text"
//                       name="address.pincode"
//                       required
//                       value={formData.address.pincode}
//                       onChange={handleChange}
//                       onBlur={() => handleBlur('pincode')}
//                       className={`block w-full px-3 py-3 border rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 ${
//                           fieldErrors.pincode && touchedFields.pincode
//                             ? 'border-red-500 bg-red-50'
//                             : 'border-gray-300 hover:border-indigo-300'
//                         }`}
//                       placeholder="123456"
//                     />
//                     {fieldErrors.pincode && touchedFields.pincode && (
//                       <p className="mt-1 text-xs text-red-500">{fieldErrors.pincode}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Country
//                     </label>
//                     <input
//                       type="text"
//                       name="address.country"
//                       value={formData.address.country}
//                       onChange={handleChange}
//                       className="block w-full px-3 py-3 border border-gray-300 rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
//                         transition-all duration-200 bg-gray-50"
//                       placeholder="India"
//                       disabled
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Terms and Conditions */}
//             <div className="flex items-start">
//               <div className="flex items-center h-5">
//                 <input
//                   id="terms"
//                   type="checkbox"
//                   checked={acceptedTerms}
//                   onChange={(e) => setAcceptedTerms(e.target.checked)}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
//                 />
//               </div>
//               <label htmlFor="terms" className="ml-3 text-sm text-gray-600 cursor-pointer">
//                 I agree to the{' '}
//                 <a href="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
//                   Terms of Service
//                 </a>{' '}
//                 and{' '}
//                 <a href="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex gap-3">
//             {currentStep > 1 && (
//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(currentStep - 1)}
//                 className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 
//                   font-medium hover:bg-gray-50 transition-all duration-200"
//               >
//                 Back
//               </button>
//             )}
            
//             {currentStep < 3 ? (
//               <button
//                 type="button"
//                 onClick={() => setCurrentStep(currentStep + 1)}
//                 disabled={!isStepValid()}
//                 className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 
//                   text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 
//                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Continue
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 disabled={loading || !isStepValid()}
//                 className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 
//                   text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 
//                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
//                   flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating account...
//                   </>
//                 ) : (
//                   <>
//                     Create Account
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>
//             )}
//           </div>

//           {/* Login Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </form>

//         {/* Trust Badges */}
//         <div className="flex justify-center items-center gap-6 text-xs text-gray-500">
//           <div className="flex items-center gap-2">
//             <CheckCircle className="w-4 h-4 text-emerald-500" />
//             <span>100% Secure</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Award className="w-4 h-4 text-emerald-500" />
//             <span>Quality Assured</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <CreditCard className="w-4 h-4 text-emerald-500" />
//             <span>Easy Returns</span>
//           </div>
//         </div>
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
//         .animation-delay-4000 {
//           animation-delay: 4s;
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

// export default Register;