// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Phone, Mail, MapPin, Clock, Map, Save, CheckCircle, Globe, AlertCircle } from 'lucide-react';
// import { fetchContactInfo, updateContactInfo } from '../../features/contact/contactSlice';
// import toast from 'react-hot-toast';
// import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

// const ContactEditor = () => {
//   const dispatch = useDispatch();
//   const { contactInfo, loading, error } = useSelector((state) => state.contact);
//   const [formData, setFormData] = useState({
//     phone: '',
//     email: '',
//     address: '',
//     businessHours: '',
//     socialMedia: {
//       facebook: '',
//       instagram: '',
//       twitter: ''
//     },
//     mapEmbed: ''
//   });
//   const [activeTab, setActiveTab] = useState('basic');
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     dispatch(fetchContactInfo());
//   }, [dispatch]);

//   useEffect(() => {
//     if (contactInfo) {
//       setFormData({
//         phone: contactInfo.phone || '',
//         email: contactInfo.email || '',
//         address: contactInfo.address || '',
//         businessHours: contactInfo.businessHours || '',
//         socialMedia: {
//           facebook: contactInfo.socialMedia?.facebook || '',
//           instagram: contactInfo.socialMedia?.instagram || '',
//           twitter: contactInfo.socialMedia?.twitter || ''
//         },
//         mapEmbed: contactInfo.mapEmbed || ''
//       });
//     }
//   }, [contactInfo]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//     }
//   }, [error]);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.phone && !formData.email && !formData.address) {
//       return toast.error('Please provide at least one contact method');
//     }
    
//     setIsSaving(true);
    
//     try {
//       const result = await dispatch(updateContactInfo(formData));
      
//       if (updateContactInfo.fulfilled.match(result)) {
//         toast.success('Contact information updated successfully!');
//         await dispatch(fetchContactInfo());
//         setTimeout(() => {
//           toast.success('Changes are now live on the contact page!');
//         }, 1000);
//       } else {
//         toast.error(result.payload || 'Failed to update contact information');
//       }
//     } catch (error) {
//       toast.error('Something went wrong');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleReset = () => {
//     if (contactInfo) {
//       setFormData({
//         phone: contactInfo.phone || '',
//         email: contactInfo.email || '',
//         address: contactInfo.address || '',
//         businessHours: contactInfo.businessHours || '',
//         socialMedia: {
//           facebook: contactInfo.socialMedia?.facebook || '',
//           instagram: contactInfo.socialMedia?.instagram || '',
//           twitter: contactInfo.socialMedia?.twitter || ''
//         },
//         mapEmbed: contactInfo.mapEmbed || ''
//       });
//       toast.info('Form reset to last saved state');
//     }
//   };

//   const tabs = [
//     { id: 'basic', label: 'Basic Info', icon: Phone },
//     { id: 'social', label: 'Social Media', icon: Globe },
//     { id: 'map', label: 'Map Settings', icon: Map },
//     { id: 'preview', label: 'Preview', icon: CheckCircle }
//   ];

//   const isValidUrl = (url) => {
//     if (!url) return true;
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Contact Page Editor</h1>
//           <p className="text-sm sm:text-base text-slate-500 mt-1">Manage your business contact information</p>
//         </div>
//         {contactInfo && (
//           <p className="text-xs text-slate-400 mt-2">
//             Last updated: {new Date(contactInfo.updatedAt).toLocaleString()}
//           </p>
//         )}
//       </div>

//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* Loading State */}
//         {loading && !contactInfo && (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
//             <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading contact information...</p>
//           </div>
//         )}

//         {/* Main Form */}
//         {!loading && (
//           <>
//             {/* Tab Navigation - Horizontal Scroll on Mobile */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-x-auto">
//               <div className="flex min-w-max sm:min-w-0">
//                 {tabs.map((tab) => {
//                   const Icon = tab.icon;
//                   return (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-base font-medium transition-all relative ${
//                         activeTab === tab.id
//                           ? 'text-slate-800 border-b-2 border-slate-800'
//                           : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
//                       }`}
//                     >
//                       <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
//                       <span className="hidden xs:inline">{tab.label}</span>
//                       <span className="xs:hidden">{tab.label.charAt(0)}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
            
//             <form onSubmit={handleSubmit}>
//               {/* Basic Information Tab */}
//               {activeTab === 'basic' && (
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                   <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                     <div className="flex items-center gap-2">
//                       <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
//                       <h2 className="text-base sm:text-xl font-semibold text-slate-800">Contact Information</h2>
//                     </div>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">Update your business contact details</p>
//                   </div>
                  
//                   <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//                       <div>
//                         <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                           <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleChange}
//                           className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
//                           placeholder="+91 1234567890"
//                         />
//                         <p className="text-xs text-slate-500 mt-1">Include country code</p>
//                       </div>
                      
//                       <div>
//                         <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                           <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
//                           placeholder="info@omsaiindustries.com"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                         <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
//                         Full Address
//                       </label>
//                       <textarea
//                         name="address"
//                         rows={3}
//                         value={formData.address}
//                         onChange={handleChange}
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none"
//                         placeholder="Street address, City, State, Pincode"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                         <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
//                         Business Hours
//                       </label>
//                       <textarea
//                         name="businessHours"
//                         rows={4}
//                         value={formData.businessHours}
//                         onChange={handleChange}
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none font-mono"
//                         placeholder="Monday - Friday: 9:00 AM - 7:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
//                       />
//                       <div className="flex items-center gap-2 mt-2">
//                         <AlertCircle className="h-3 w-3 text-slate-400" />
//                         <p className="text-xs text-slate-500">
//                           Use HTML line breaks (&lt;br&gt;) for formatting
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Social Media Tab */}
//               {activeTab === 'social' && (
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                   <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                     <div className="flex items-center gap-2">
//                       <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
//                       <h2 className="text-base sm:text-xl font-semibold text-slate-800">Social Media Links</h2>
//                     </div>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">Connect your social media profiles</p>
//                   </div>
                  
//                   <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                         <FaFacebook className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                         Facebook URL
//                       </label>
//                       <input
//                         type="url"
//                         name="socialMedia.facebook"
//                         value={formData.socialMedia.facebook}
//                         onChange={handleChange}
//                         className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg transition-all outline-none focus:ring-2 focus:ring-slate-800 ${
//                           formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook)
//                             ? 'border-red-500 focus:border-red-500'
//                             : 'border-slate-300 focus:border-slate-800'
//                         }`}
//                         placeholder="https://facebook.com/omsaiindustries"
//                       />
//                       {formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook) && (
//                         <p className="text-xs text-red-500 mt-1">Please enter a valid URL</p>
//                       )}
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                         <FaInstagram className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600" />
//                         Instagram URL
//                       </label>
//                       <input
//                         type="url"
//                         name="socialMedia.instagram"
//                         value={formData.socialMedia.instagram}
//                         onChange={handleChange}
//                         className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg transition-all outline-none focus:ring-2 focus:ring-slate-800 ${
//                           formData.socialMedia.instagram && !isValidUrl(formData.socialMedia.instagram)
//                             ? 'border-red-500 focus:border-red-500'
//                             : 'border-slate-300 focus:border-slate-800'
//                         }`}
//                         placeholder="https://instagram.com/omsaiindustries"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
//                         <FaTwitter className="h-3 w-3 sm:h-4 sm:w-4 text-sky-500" />
//                         Twitter/X URL
//                       </label>
//                       <input
//                         type="url"
//                         name="socialMedia.twitter"
//                         value={formData.socialMedia.twitter}
//                         onChange={handleChange}
//                         className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg transition-all outline-none focus:ring-2 focus:ring-slate-800 ${
//                           formData.socialMedia.twitter && !isValidUrl(formData.socialMedia.twitter)
//                             ? 'border-red-500 focus:border-red-500'
//                             : 'border-slate-300 focus:border-slate-800'
//                         }`}
//                         placeholder="https://twitter.com/omsaiindustries"
//                       />
//                     </div>
                    
//                     <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
//                       <p className="text-xs sm:text-sm text-blue-800">
//                         <strong>Tip:</strong> Leave fields empty to hide social media icons on the contact page.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Map Settings Tab */}
//               {activeTab === 'map' && (
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                   <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                     <div className="flex items-center gap-2">
//                       <Map className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
//                       <h2 className="text-base sm:text-xl font-semibold text-slate-800">Google Maps Integration</h2>
//                     </div>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">Embed a map to show your location</p>
//                   </div>
                  
//                   <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
//                     <div>
//                       <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
//                         Map Embed Code
//                       </label>
//                       <textarea
//                         name="mapEmbed"
//                         rows={6}
//                         value={formData.mapEmbed}
//                         onChange={handleChange}
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none font-mono"
//                         placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
//                       />
//                     </div>
                    
//                     <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
//                       <p className="text-xs sm:text-sm text-amber-800">
//                         <strong>How to get embed code:</strong>
//                       </p>
//                       <ol className="text-xs sm:text-sm text-amber-700 mt-2 space-y-1 list-decimal list-inside">
//                         <li>Go to Google Maps</li>
//                         <li>Search for your business location</li>
//                         <li>Click "Share" → "Embed a map"</li>
//                         <li>Copy the iframe code and paste it above</li>
//                       </ol>
//                     </div>
                    
//                     {formData.mapEmbed && (
//                       <div className="mt-4">
//                         <h3 className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Preview:</h3>
//                         <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
//                           <div className="aspect-video w-full" dangerouslySetInnerHTML={{ __html: formData.mapEmbed }} />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
              
//               {/* Preview Tab */}
//               {activeTab === 'preview' && (
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                   <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                     <div className="flex items-center gap-2">
//                       <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
//                       <h2 className="text-base sm:text-xl font-semibold text-slate-800">Live Preview</h2>
//                     </div>
//                     <p className="text-xs sm:text-sm text-slate-500 mt-1">See how your contact information will appear</p>
//                   </div>
                  
//                   <div className="p-4 sm:p-6">
//                     <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6">
//                       <h3 className="text-base sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Contact Us</h3>
                      
//                       <div className="space-y-3 sm:space-y-4">
//                         {formData.phone && (
//                           <div className="flex items-start gap-2 sm:gap-3">
//                             <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
//                             <div>
//                               <p className="text-xs sm:text-sm font-medium text-slate-700">Phone</p>
//                               <p className="text-sm sm:text-base text-slate-600 break-words">{formData.phone}</p>
//                             </div>
//                           </div>
//                         )}
                        
//                         {formData.email && (
//                           <div className="flex items-start gap-2 sm:gap-3">
//                             <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
//                             <div>
//                               <p className="text-xs sm:text-sm font-medium text-slate-700">Email</p>
//                               <p className="text-sm sm:text-base text-slate-600 break-words">{formData.email}</p>
//                             </div>
//                           </div>
//                         )}
                        
//                         {formData.address && (
//                           <div className="flex items-start gap-2 sm:gap-3">
//                             <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
//                             <div>
//                               <p className="text-xs sm:text-sm font-medium text-slate-700">Address</p>
//                               <p className="text-sm sm:text-base text-slate-600 whitespace-pre-line break-words">{formData.address}</p>
//                             </div>
//                           </div>
//                         )}
                        
//                         {formData.businessHours && (
//                           <div className="flex items-start gap-2 sm:gap-3">
//                             <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
//                             <div>
//                               <p className="text-xs sm:text-sm font-medium text-slate-700">Business Hours</p>
//                               <div className="text-sm sm:text-base text-slate-600" dangerouslySetInnerHTML={{ __html: formData.businessHours }} />
//                             </div>
//                           </div>
//                         )}
                        
//                         {/* Social Media Preview */}
//                         {(formData.socialMedia.facebook || formData.socialMedia.instagram || formData.socialMedia.twitter) && (
//                           <div className="flex items-start gap-2 sm:gap-3 pt-2">
//                             <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
//                             <div>
//                               <p className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Follow Us</p>
//                               <div className="flex gap-2 sm:gap-3">
//                                 {formData.socialMedia.facebook && (
//                                   <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
//                                     <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
//                                   </a>
//                                 )}
//                                 {formData.socialMedia.instagram && (
//                                   <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
//                                     <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5" />
//                                   </a>
//                                 )}
//                                 {formData.socialMedia.twitter && (
//                                   <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
//                                     <FaTwitter className="h-4 w-4 sm:h-5 sm:w-5" />
//                                   </a>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {/* Action Buttons */}
//               <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
//                 >
//                   {isSaving ? (
//                     <>
//                       <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-3 w-3 sm:h-4 sm:w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContactEditor;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Map, Save, CheckCircle, Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import { fetchContactInfo, updateContactInfo } from '../../features/contact/contactSlice';
import toast from 'react-hot-toast';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const ContactEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contactInfo, loading, error } = useSelector((state) => state.contact);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    businessHours: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    mapEmbed: ''
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchContactInfo());
  }, [dispatch]);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        address: contactInfo.address || '',
        businessHours: contactInfo.businessHours || '',
        socialMedia: {
          facebook: contactInfo.socialMedia?.facebook || '',
          instagram: contactInfo.socialMedia?.instagram || '',
          twitter: contactInfo.socialMedia?.twitter || ''
        },
        mapEmbed: contactInfo.mapEmbed || ''
      });
    }
  }, [contactInfo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone && !formData.email && !formData.address) {
      return toast.error('Please provide at least one contact method');
    }
    
    setIsSaving(true);
    
    try {
      const result = await dispatch(updateContactInfo(formData));
      
      if (updateContactInfo.fulfilled.match(result)) {
        toast.success('Contact information updated successfully!');
        await dispatch(fetchContactInfo());
        setTimeout(() => {
          toast.success('Changes are now live on the contact page!');
        }, 1000);
      } else {
        toast.error(result.payload || 'Failed to update contact information');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        address: contactInfo.address || '',
        businessHours: contactInfo.businessHours || '',
        socialMedia: {
          facebook: contactInfo.socialMedia?.facebook || '',
          instagram: contactInfo.socialMedia?.instagram || '',
          twitter: contactInfo.socialMedia?.twitter || ''
        },
        mapEmbed: contactInfo.mapEmbed || ''
      });
      toast.success('Form reset to last saved state');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Phone, color: 'from-blue-500 to-blue-600' },
    { id: 'social', label: 'Social Media', icon: Globe, color: 'from-purple-500 to-purple-600' },
    { id: 'map', label: 'Map Settings', icon: Map, color: 'from-emerald-500 to-emerald-600' },
    { id: 'preview', label: 'Preview', icon: CheckCircle, color: 'from-green-500 to-green-600' }
  ];

  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Matching AddProduct style */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Page Editor</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your business contact information</p>
              </div>
            </div>
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">
                {contactInfo ? `Last updated: ${new Date(contactInfo.updatedAt).toLocaleDateString()}` : 'Ready to edit'}
              </span>
            </div>
          </div>
          
          {/* Breadcrumb - Matching AddProduct style */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 ml-12">
            <span className="hover:text-gray-700 cursor-pointer" onClick={() => navigate('/admin')}>Dashboard</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Contact Editor</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && !contactInfo && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500">Loading contact information...</p>
          </div>
        )}

        {/* Main Form */}
        {!loading && (
          <>
            {/* Tab Navigation - Matching AddProduct card style */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Contact Information Manager</h2>
                    <p className="text-xs text-gray-500">Update your business contact details and social media links</p>
                  </div>
                </div>
              </div>
              
              <div className="flex overflow-x-auto border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        activeTab === tab.id ? `bg-gradient-to-r ${tab.color} shadow-md` : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                        <p className="text-xs text-gray-500">Update your business contact details</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="+91 1234567890"
                        />
                        <p className="text-xs text-gray-500 mt-1">Include country code for international numbers</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="info@company.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        Full Address
                      </label>
                      <textarea
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                        placeholder="Street address, City, State, Pincode"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        Business Hours
                      </label>
                      <textarea
                        name="businessHours"
                        rows={4}
                        value={formData.businessHours}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                        placeholder="Monday - Friday: 9:00 AM - 7:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        <p className="text-xs text-gray-500">
                          Use HTML line breaks (&lt;br&gt;) for better formatting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Social Media Links</h2>
                        <p className="text-xs text-gray-500">Connect your social media profiles</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaFacebook className="h-4 w-4 text-blue-600" />
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        name="socialMedia.facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook)
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="https://facebook.com/yourpage"
                      />
                      {formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook) && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Please enter a valid URL
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaInstagram className="h-4 w-4 text-pink-600" />
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          formData.socialMedia.instagram && !isValidUrl(formData.socialMedia.instagram)
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaTwitter className="h-4 w-4 text-sky-500" />
                        Twitter/X URL
                      </label>
                      <input
                        type="url"
                        name="socialMedia.twitter"
                        value={formData.socialMedia.twitter}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          formData.socialMedia.twitter && !isValidUrl(formData.socialMedia.twitter)
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800">Pro Tip</p>
                          <p className="text-xs text-blue-700 mt-1">
                            Leave fields empty to hide social media icons on the contact page. Only filled URLs will be displayed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Map Settings Tab */}
              {activeTab === 'map' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        <Map className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Google Maps Integration</h2>
                        <p className="text-xs text-gray-500">Embed a map to show your location</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Map Embed Code
                      </label>
                      <textarea
                        name="mapEmbed"
                        rows={6}
                        value={formData.mapEmbed}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none font-mono"
                        placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                      />
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Map className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800">How to get embed code:</p>
                          <ol className="text-xs text-amber-700 mt-2 space-y-1 list-decimal list-inside">
                            <li>Go to Google Maps</li>
                            <li>Search for your business location</li>
                            <li>Click "Share" → "Embed a map"</li>
                            <li>Copy the iframe code and paste it above</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    {formData.mapEmbed && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Live Preview:
                        </h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                          <div className="aspect-video w-full" dangerouslySetInnerHTML={{ __html: formData.mapEmbed }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                        <p className="text-xs text-gray-500">See how your contact information will appear</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        Contact Us
                      </h3>
                      
                      <div className="space-y-4">
                        {formData.phone && (
                          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                              <p className="text-base text-gray-900 font-medium break-words">{formData.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.email && (
                          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Mail className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                              <p className="text-base text-gray-900 break-words">{formData.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.address && (
                          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</p>
                              <p className="text-base text-gray-900 whitespace-pre-line break-words">{formData.address}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.businessHours && (
                          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Clock className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Hours</p>
                              <div className="text-base text-gray-900" dangerouslySetInnerHTML={{ __html: formData.businessHours }} />
                            </div>
                          </div>
                        )}
                        
                        {/* Social Media Preview */}
                        {(formData.socialMedia.facebook || formData.socialMedia.instagram || formData.socialMedia.twitter) && (
                          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Globe className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Follow Us</p>
                              <div className="flex gap-3">
                                {formData.socialMedia.facebook && (
                                  <a href="#" className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200">
                                    <FaFacebook className="h-4 w-4" />
                                  </a>
                                )}
                                {formData.socialMedia.instagram && (
                                  <a href="#" className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 hover:bg-pink-100 hover:scale-110 transition-all duration-200">
                                    <FaInstagram className="h-4 w-4" />
                                  </a>
                                )}
                                {formData.socialMedia.twitter && (
                                  <a href="#" className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 hover:bg-sky-100 hover:scale-110 transition-all duration-200">
                                    <FaTwitter className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons - Matching AddProduct style */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Publish Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactEditor;