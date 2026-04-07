// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   Phone, 
//   Mail, 
//   MapPin, 
//   Clock, 
//   Send, 
//   User, 
//   MessageSquare, 
//   AlertCircle, 
//   Globe 
// } from 'lucide-react';
// import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
// import { fetchContactInfo } from '../../features/contact/contactSlice';
// import { sendContactMessage } from '../../features/messages/messageSlice';
// import toast from 'react-hot-toast';

// const ContactUs = () => {
//   const dispatch = useDispatch();
//   const { contactInfo, loading: contactLoading } = useSelector((state) => state.contact);
//   const { userInfo } = useSelector((state) => state.auth);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     dispatch(fetchContactInfo());
//   }, [dispatch]);

//   useEffect(() => {
//     if (userInfo) {
//       setFormData(prev => ({
//         ...prev,
//         name: userInfo.name || '',
//         email: userInfo.email || '',
//         phone: userInfo.phone || ''
//       }));
//     }
//   }, [userInfo]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.email || !formData.message) {
//       return toast.error('Please fill in all required fields');
//     }

//     setIsSubmitting(true);

//     try {
//       const result = await dispatch(sendContactMessage(formData));
      
//       if (sendContactMessage.fulfilled.match(result)) {
//         toast.success('Message sent successfully! We\'ll get back to you soon.');
        
//         if (userInfo) {
//           setFormData(prev => ({
//             ...prev,
//             message: ''
//           }));
//         } else {
//           setFormData({
//             name: '',
//             email: '',
//             phone: '',
//             message: ''
//           });
//         }
//       } else {
//         toast.error(result.payload || 'Failed to send message. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Something went wrong. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (contactLoading && !contactInfo) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-slate-600">Loading contact information...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3">
//             Contact Us
//           </h1>
//           <p className="text-base sm:text-lg text-center text-blue-100 max-w-2xl mx-auto">
//             Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          
//           {/* Contact Information */}
//           <div className="space-y-5 sm:space-y-6">
//             {/* Contact Details Card */}
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
//                   <MapPin className="h-5 w-5 text-blue-600" />
//                   Get in Touch
//                 </h2>
//                 <p className="text-sm text-slate-500 mt-1">Visit us or reach out through any of these channels</p>
//               </div>
              
//               <div className="p-5 sm:p-6 space-y-5">
//                 {/* Address */}
//                 <div className="flex items-start gap-3 sm:gap-4 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
//                   <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <MapPin className="h-5 w-5 text-red-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Address</h3>
//                     <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
//                       {contactInfo?.address || 'Loading address...'}
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Phone */}
//                 <div className="flex items-start gap-3 sm:gap-4 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
//                   <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <Phone className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Phone</h3>
//                     <a href={`tel:${contactInfo?.phone}`} className="text-slate-600 text-xs sm:text-sm hover:text-blue-600 transition-colors block mt-1">
//                       {contactInfo?.phone || 'Loading...'}
//                     </a>
//                     <p className="text-xs text-slate-400 mt-0.5">Mon-Sat, 9AM-7PM</p>
//                   </div>
//                 </div>
                
//                 {/* Email */}
//                 <div className="flex items-start gap-3 sm:gap-4 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
//                   <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <Mail className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Email</h3>
//                     <a href={`mailto:${contactInfo?.email}`} className="text-slate-600 text-xs sm:text-sm hover:text-blue-600 transition-colors block mt-1">
//                       {contactInfo?.email || 'Loading...'}
//                     </a>
//                     <p className="text-xs text-slate-400 mt-0.5">We reply within 24 hours</p>
//                   </div>
//                 </div>
                
//                 {/* Business Hours */}
//                 <div className="flex items-start gap-3 sm:gap-4 group hover:bg-slate-50 p-2 rounded-lg transition-colors">
//                   <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <Clock className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Business Hours</h3>
//                     <div className="text-slate-600 text-xs sm:text-sm mt-1" 
//                          dangerouslySetInnerHTML={{ __html: contactInfo?.businessHours || 'Loading...' }} />
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Social Media Links */}
//             {(contactInfo?.socialMedia?.facebook || contactInfo?.socialMedia?.instagram || contactInfo?.socialMedia?.twitter) && (
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="px-5 sm:px-6 py-4 border-b border-slate-200">
//                   <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
//                     <Share2 className="h-5 w-5 text-blue-600" />
//                     Connect With Us
//                   </h2>
//                   <p className="text-sm text-slate-500 mt-1">Follow us on social media</p>
//                 </div>
//                 <div className="p-5 sm:p-6">
//                   <div className="flex gap-4 sm:gap-6 justify-center sm:justify-start">
//                     {contactInfo?.socialMedia?.facebook && (
//                       <a
//                         href={contactInfo.socialMedia.facebook}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
//                       >
//                         <FaFacebook className="h-6 w-6 text-white" />
//                       </a>
//                     )}
//                     {contactInfo?.socialMedia?.instagram && (
//                       <a
//                         href={contactInfo.socialMedia.instagram}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
//                       >
//                         <Instagram className="h-6 w-6 text-white" />
//                       </a>
//                     )}
//                     {contactInfo?.socialMedia?.twitter && (
//                       <a
//                         href={contactInfo.socialMedia.twitter}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-all hover:scale-110"
//                       >
//                         <Twitter className="h-6 w-6 text-white" />
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Map */}
//             {contactInfo?.mapEmbed && (
//               <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 <div className="px-5 sm:px-6 py-4 border-b border-slate-200">
//                   <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
//                     <MapPin className="h-5 w-5 text-blue-600" />
//                     Find Us
//                   </h2>
//                   <p className="text-sm text-slate-500 mt-1">Our location on Google Maps</p>
//                 </div>
//                 <div className="p-0">
//                   <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
//                     <iframe
//                       src={contactInfo.mapEmbed}
//                       className="w-full h-full"
//                       style={{ border: 0 }}
//                       allowFullScreen
//                       loading="lazy"
//                       referrerPolicy="no-referrer-when-downgrade"
//                       title="Business Location"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Contact Form */}
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200">
//               <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
//                 <MessageSquare className="h-5 w-5 text-blue-600" />
//                 Send us a Message
//               </h2>
//               <p className="text-sm text-slate-500 mt-1">Fill out the form and we'll get back to you</p>
//             </div>
            
//             <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
//                     <User className="h-4 w-4 text-slate-500" />
//                     Your Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                     placeholder="John Doe"
//                     disabled={!!userInfo}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
//                     <Mail className="h-4 w-4 text-slate-500" />
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                     placeholder="john@example.com"
//                     disabled={!!userInfo}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
//                   <Phone className="h-4 w-4 text-slate-500" />
//                   Phone Number <span className="text-slate-400 text-xs">(Optional)</span>
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                   placeholder="+91 1234567890"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
//                   <MessageSquare className="h-4 w-4 text-slate-500" />
//                   Message <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="message"
//                   required
//                   rows="5"
//                   value={formData.message}
//                   onChange={handleChange}
//                   className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
//                   placeholder="Tell us details about your inquiry..."
//                 />
//               </div>
              
//               <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
//                 <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-xs text-blue-800">
//                   We typically respond within 24 hours during business days.
//                 </p>
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="h-5 w-5" />
//                     Send Message
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  MessageSquare, 
  AlertCircle,
  Globe,
  RotateCcw,
  ChevronRight,
  Building2,
  Headphones,
  Shield,
  Award
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { fetchContactInfo } from '../../features/contact/contactSlice';
import { sendContactMessage } from '../../features/messages/messageSlice';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const dispatch = useDispatch();
  const { contactInfo, loading: contactLoading } = useSelector((state) => state.contact);
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    dispatch(fetchContactInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || ''
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields', {
        duration: 3000,
        icon: '⚠️',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          borderRadius: '12px',
        },
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your message...');

    try {
      const result = await dispatch(sendContactMessage(formData));
      
      if (sendContactMessage.fulfilled.match(result)) {
        toast.dismiss(loadingToast);
        toast.success(
          (t) => (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Message Sent! 🎉</p>
                <p className="text-sm text-gray-600">We'll get back to you within 24 hours</p>
              </div>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: '#F0FDF4',
              borderRadius: '12px',
              padding: '12px',
              border: '1px solid #86EFAC',
            },
          }
        );
        
        if (userInfo) {
          setFormData(prev => ({ ...prev, message: '' }));
        } else {
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
          });
        }
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.payload || 'Failed to send message. Please try again.', {
          duration: 3000,
          icon: '❌',
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong. Please try again later.', {
        duration: 3000,
        icon: '⚠️',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contactLoading && !contactInfo) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-light tracking-widest uppercase text-xs">Loading Contact Info</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Headphones, title: '24/7 Support', description: 'Round the clock customer service' },
    { icon: Shield, title: 'Secure Communication', description: 'Your data is safe with us' },
    { icon: Award, title: 'Trusted Since 2010', description: 'Years of excellence' },
    { icon: Globe, title: 'Global Reach', description: 'Serving customers worldwide' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section - Matching Products Page */}
      <div className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[70%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[70%] bg-emerald-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Conversation.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Have questions about our products or services? Our team is here to help. Reach out to us anytime.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        {/* Features Bar */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-4 md:p-6 mb-8 border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{feature.title}</p>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Contact Information - Styled like product cards */}
          <div className="space-y-6">
            {/* Main Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-5 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Contact Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">Reach us through any of these channels</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4 group hover:bg-slate-50 p-3 rounded-xl transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Visit Our Store</h3>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      {contactInfo?.address || 'Loading address...'}
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start gap-4 group hover:bg-slate-50 p-3 rounded-xl transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Call Us</h3>
                    <a href={`tel:${contactInfo?.phone}`} className="text-slate-600 text-sm hover:text-indigo-600 transition-colors block mt-1 font-medium">
                      {contactInfo?.phone || 'Loading...'}
                    </a>
                    <p className="text-xs text-slate-400 mt-1">Mon-Sat, 9AM-7PM</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start gap-4 group hover:bg-slate-50 p-3 rounded-xl transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Email Us</h3>
                    <a href={`mailto:${contactInfo?.email}`} className="text-slate-600 text-sm hover:text-indigo-600 transition-colors block mt-1">
                      {contactInfo?.email || 'Loading...'}
                    </a>
                    <p className="text-xs text-slate-400 mt-1">We reply within 24 hours</p>
                  </div>
                </div>
                
                {/* Business Hours */}
                <div className="flex items-start gap-4 group hover:bg-slate-50 p-3 rounded-xl transition-all cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Business Hours</h3>
                    <div className="text-slate-600 text-sm mt-1 space-y-0.5" 
                         dangerouslySetInnerHTML={{ __html: contactInfo?.businessHours || 'Loading...' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media Section - Styled like product grid */}
            {(contactInfo?.socialMedia?.facebook || contactInfo?.socialMedia?.instagram || contactInfo?.socialMedia?.twitter) && (
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    Connect With Us
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Follow us on social media</p>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 justify-center sm:justify-start">
                    {contactInfo?.socialMedia?.facebook && (
                      <a
                        href={contactInfo.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6 shadow-md"
                      >
                        <FaFacebook className="h-7 w-7 text-white" />
                      </a>
                    )}
                    {contactInfo?.socialMedia?.instagram && (
                      <a
                        href={contactInfo.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6 shadow-md"
                      >
                        <FaInstagram className="h-7 w-7 text-white" />
                      </a>
                    )}
                    {contactInfo?.socialMedia?.twitter && (
                      <a
                        href={contactInfo.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-sky-500 hover:bg-sky-600 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6 shadow-md"
                      >
                        <FaTwitter className="h-7 w-7 text-white" />
                      </a>
                    )}
                    {contactInfo?.socialMedia?.linkedin && (
                      <a
                        href={contactInfo.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-blue-800 hover:bg-blue-900 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:-rotate-6 shadow-md"
                      >
                        <FaLinkedin className="h-7 w-7 text-white" />
                      </a>
                    )}
                    {contactInfo?.socialMedia?.youtube && (
                      <a
                        href={contactInfo.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6 shadow-md"
                      >
                        <FaYoutube className="h-7 w-7 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Section */}
            {contactInfo?.mapEmbed && (
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    Find Us Here
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Our location on Google Maps</p>
                </div>
                <div className="relative">
                  <div className="w-full h-80 lg:h-96 overflow-hidden">
                    <iframe
                      src={contactInfo.mapEmbed}
                      className="w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Business Location"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Form - Styled like product card */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                Send us a Message
              </h2>
              <p className="text-sm text-slate-500 mt-1">Fill out the form and we'll get back to you</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <User className="h-4 w-4 text-slate-400" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all
                      ${focusedField === 'name' 
                        ? 'border-indigo-400 ring-4 ring-indigo-100' 
                        : 'border-slate-200 hover:border-indigo-300'
                      }
                      ${userInfo ? 'bg-slate-50 text-slate-500' : 'bg-white'}
                    `}
                    placeholder="John Doe"
                    disabled={!!userInfo}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all
                      ${focusedField === 'email' 
                        ? 'border-indigo-400 ring-4 ring-indigo-100' 
                        : 'border-slate-200 hover:border-indigo-300'
                      }
                      ${userInfo ? 'bg-slate-50 text-slate-500' : 'bg-white'}
                    `}
                    placeholder="john@example.com"
                    disabled={!!userInfo}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <Phone className="h-4 w-4 text-slate-400" />
                  Phone Number <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all
                    ${focusedField === 'phone' 
                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-indigo-300'
                    }
                  `}
                  placeholder="+91 1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all resize-none
                    ${focusedField === 'message' 
                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-indigo-300'
                    }
                  `}
                  placeholder="Tell us details about your inquiry..."
                />
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <span>{formData.message.length}/500 characters</span>
                </p>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-4 flex items-start gap-3 border border-indigo-100">
                <AlertCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">Response Time</p>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    We typically respond within 24 hours during business days. All messages are confidential.
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-slate-400 pt-2">
                By submitting, you agree to our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;