// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Phone, Mail, MapPin, Clock, Map, Save, CheckCircle, Globe, AlertCircle, MailIcon, MailCheckIcon } from 'lucide-react';
// import Sidebar from '../../components/Sidebar';
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

//   // Fetch contact info on mount
//   useEffect(() => {
//     dispatch(fetchContactInfo());
//   }, [dispatch]);

//   // Update form when contactInfo changes
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

//   // Show error if any
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
//       // Update contact info
//       const result = await dispatch(updateContactInfo(formData));
      
//       if (updateContactInfo.fulfilled.match(result)) {
//         toast.success('Contact information updated successfully!');
        
//         // CRITICAL FIX: Refetch fresh data after update
//         await dispatch(fetchContactInfo());
        
//         // Optional: Show a success message with refresh suggestion
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
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />
      
//       <div className="flex-1 min-w-0">
//         {/* Header */}
//         <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Contact Page Editor</h1>
//             <p className="text-sm sm:text-base text-slate-500 mt-1">Manage your business contact information</p>
//           </div>
//           {contactInfo && (
//             <p className="text-xs text-slate-400 mt-2">
//               Last updated: {new Date(contactInfo.updatedAt).toLocaleString()}
//             </p>
//           )}
//         </div>

//         <div className="p-4 sm:p-6 lg:p-8">
//           {/* Loading State */}
//           {loading && !contactInfo && (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-3 text-slate-500">Loading contact information...</p>
//             </div>
//           )}

//           {/* Main Form */}
//           {!loading && (
//             <>
//               {/* Tab Navigation */}
//               <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-x-auto">
//                 <div className="flex min-w-max sm:min-w-0">
//                   {tabs.map((tab) => {
//                     const Icon = tab.icon;
//                     return (
//                       <button
//                         key={tab.id}
//                         onClick={() => setActiveTab(tab.id)}
//                         className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all relative ${
//                           activeTab === tab.id
//                             ? 'text-blue-600 border-b-2 border-blue-600'
//                             : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
//                         }`}
//                       >
//                         <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
//                         <span className="hidden sm:inline">{tab.label}</span>
//                         <span className="sm:hidden">{tab.label.charAt(0)}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
              
//               <form onSubmit={handleSubmit}>
//                 {/* Basic Information Tab */}
//                 {activeTab === 'basic' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                     <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                       <div className="flex items-center gap-2">
//                         <Phone className="h-5 w-5 text-blue-600" />
//                         <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Contact Information</h2>
//                       </div>
//                       <p className="text-sm text-slate-500 mt-1">Update your business contact details</p>
//                     </div>
                    
//                     <div className="p-4 sm:p-6 space-y-5">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                             <Phone className="h-4 w-4 text-slate-500" />
//                             Phone Number
//                           </label>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                             placeholder="+91 1234567890"
//                           />
//                           <p className="text-xs text-slate-500 mt-1">Include country code</p>
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                             <Mail className="h-4 w-4 text-slate-500" />
//                             Email Address
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
//                             placeholder="info@omsaiindustries.com"
//                           />
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                           <MapPin className="h-4 w-4 text-slate-500" />
//                           Full Address
//                         </label>
//                         <textarea
//                           name="address"
//                           rows="3"
//                           value={formData.address}
//                           onChange={handleChange}
//                           className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
//                           placeholder="Street address, City, State, Pincode"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-slate-500" />
//                           Business Hours
//                         </label>
//                         <textarea
//                           name="businessHours"
//                           rows="4"
//                           value={formData.businessHours}
//                           onChange={handleChange}
//                           className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none font-mono"
//                           placeholder="Monday - Friday: 9:00 AM - 7:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
//                         />
//                         <div className="flex items-center gap-2 mt-2">
//                           <AlertCircle className="h-3 w-3 text-slate-400" />
//                           <p className="text-xs text-slate-500">
//                             Use HTML line breaks (&lt;br&gt;) for formatting
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Social Media Tab */}
//                 {activeTab === 'social' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                     <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                       <div className="flex items-center gap-2">
//                         <Globe className="h-5 w-5 text-blue-600" />
//                         <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Social Media Links</h2>
//                       </div>
//                       <p className="text-sm text-slate-500 mt-1">Connect your social media profiles</p>
//                     </div>
                    
//                     <div className="p-4 sm:p-6 space-y-5">
//                       <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                           <MailIcon className="h-4 w-4 text-blue-600" />
//                           Facebook URL
//                         </label>
//                         <input
//                           type="url"
//                           name="socialMedia.facebook"
//                           value={formData.socialMedia.facebook}
//                           onChange={handleChange}
//                           className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
//                             formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook)
//                               ? 'border-red-500 focus:border-red-500'
//                               : 'border-slate-300 focus:border-blue-500'
//                           }`}
//                           placeholder="https://facebook.com/omsaiindustries"
//                         />
//                         {formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook) && (
//                           <p className="text-xs text-red-500 mt-1">Please enter a valid URL</p>
//                         )}
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                           <Instagram className="h-4 w-4 text-pink-600" />
//                           Instagram URL
//                         </label>
//                         <input
//                           type="url"
//                           name="socialMedia.instagram"
//                           value={formData.socialMedia.instagram}
//                           onChange={handleChange}
//                           className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
//                             formData.socialMedia.instagram && !isValidUrl(formData.socialMedia.instagram)
//                               ? 'border-red-500 focus:border-red-500'
//                               : 'border-slate-300 focus:border-blue-500'
//                           }`}
//                           placeholder="https://instagram.com/omsaiindustries"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                           <Twitter className="h-4 w-4 text-sky-500" />
//                           Twitter/X URL
//                         </label>
//                         <input
//                           type="url"
//                           name="socialMedia.twitter"
//                           value={formData.socialMedia.twitter}
//                           onChange={handleChange}
//                           className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
//                             formData.socialMedia.twitter && !isValidUrl(formData.socialMedia.twitter)
//                               ? 'border-red-500 focus:border-red-500'
//                               : 'border-slate-300 focus:border-blue-500'
//                           }`}
//                           placeholder="https://twitter.com/omsaiindustries"
//                         />
//                       </div>
                      
//                       <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
//                         <p className="text-xs sm:text-sm text-blue-800">
//                           <strong>Tip:</strong> Leave fields empty to hide social media icons on the contact page.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Map Settings Tab */}
//                 {activeTab === 'map' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                     <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                       <div className="flex items-center gap-2">
//                         <Map className="h-5 w-5 text-blue-600" />
//                         <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Google Maps Integration</h2>
//                       </div>
//                       <p className="text-sm text-slate-500 mt-1">Embed a map to show your location</p>
//                     </div>
                    
//                     <div className="p-4 sm:p-6 space-y-5">
//                       <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-2">
//                           Map Embed Code
//                         </label>
//                         <textarea
//                           name="mapEmbed"
//                           rows="6"
//                           value={formData.mapEmbed}
//                           onChange={handleChange}
//                           className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none font-mono"
//                           placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
//                         />
//                       </div>
                      
//                       <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
//                         <p className="text-xs sm:text-sm text-amber-800">
//                           <strong>How to get embed code:</strong>
//                         </p>
//                         <ol className="text-xs sm:text-sm text-amber-700 mt-2 space-y-1 list-decimal list-inside">
//                           <li>Go to Google Maps</li>
//                           <li>Search for your business location</li>
//                           <li>Click "Share" → "Embed a map"</li>
//                           <li>Copy the iframe code and paste it above</li>
//                         </ol>
//                       </div>
                      
//                       {formData.mapEmbed && (
//                         <div className="mt-4">
//                           <h3 className="text-sm font-medium text-slate-700 mb-2">Preview:</h3>
//                           <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
//                             <div className="aspect-video w-full" dangerouslySetInnerHTML={{ __html: formData.mapEmbed }} />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Preview Tab */}
//                 {activeTab === 'preview' && (
//                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                     <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-5 w-5 text-blue-600" />
//                         <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Live Preview</h2>
//                       </div>
//                       <p className="text-sm text-slate-500 mt-1">See how your contact information will appear</p>
//                     </div>
                    
//                     <div className="p-4 sm:p-6">
//                       <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6">
//                         <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Contact Us</h3>
                        
//                         <div className="space-y-4">
//                           {formData.phone && (
//                             <div className="flex items-start gap-3">
//                               <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                               <div>
//                                 <p className="text-sm font-medium text-slate-700">Phone</p>
//                                 <p className="text-sm sm:text-base text-slate-600">{formData.phone}</p>
//                               </div>
//                             </div>
//                           )}
                          
//                           {formData.email && (
//                             <div className="flex items-start gap-3">
//                               <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                               <div>
//                                 <p className="text-sm font-medium text-slate-700">Email</p>
//                                 <p className="text-sm sm:text-base text-slate-600">{formData.email}</p>
//                               </div>
//                             </div>
//                           )}
                          
//                           {formData.address && (
//                             <div className="flex items-start gap-3">
//                               <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                               <div>
//                                 <p className="text-sm font-medium text-slate-700">Address</p>
//                                 <p className="text-sm sm:text-base text-slate-600 whitespace-pre-line">{formData.address}</p>
//                               </div>
//                             </div>
//                           )}
                          
//                           {formData.businessHours && (
//                             <div className="flex items-start gap-3">
//                               <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                               <div>
//                                 <p className="text-sm font-medium text-slate-700">Business Hours</p>
//                                 <div className="text-sm sm:text-base text-slate-600" dangerouslySetInnerHTML={{ __html: formData.businessHours }} />
//                               </div>
//                             </div>
//                           )}
                          
//                           {/* Social Media Preview */}
//                           {(formData.socialMedia.facebook || formData.socialMedia.instagram || formData.socialMedia.twitter) && (
//                             <div className="flex items-start gap-3 pt-2">
//                               <Globe className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                               <div>
//                                 <p className="text-sm font-medium text-slate-700 mb-2">Follow Us</p>
//                                 <div className="flex gap-3">
//                                   {formData.socialMedia.facebook && (
//                                     <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
//                                       <MailCheckIcon className="h-5 w-5" />
//                                     </a>
//                                   )}
//                                   {formData.socialMedia.instagram && (
//                                     <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
//                                       <Instagram className="h-5 w-5" />
//                                     </a>
//                                   )}
//                                   {formData.socialMedia.twitter && (
//                                     <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
//                                       <Twitter className="h-5 w-5" />
//                                     </a>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Action Buttons */}
//                 <div className="mt-6 flex justify-end gap-3">
//                   <button
//                     type="button"
//                     onClick={handleReset}
//                     className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors text-sm sm:text-base"
//                   >
//                     Reset
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSaving}
//                     className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
//                   >
//                     {isSaving ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="h-4 w-4" />
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactEditor;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, Mail, MapPin, Clock, Map, Save, CheckCircle, Globe, AlertCircle } from 'lucide-react';
import { fetchContactInfo, updateContactInfo } from '../../features/contact/contactSlice';
import toast from 'react-hot-toast';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const ContactEditor = () => {
  const dispatch = useDispatch();
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
      toast.info('Form reset to last saved state');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'map', label: 'Map Settings', icon: Map },
    { id: 'preview', label: 'Preview', icon: CheckCircle }
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Contact Page Editor</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Manage your business contact information</p>
        </div>
        {contactInfo && (
          <p className="text-xs text-slate-400 mt-2">
            Last updated: {new Date(contactInfo.updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Loading State */}
        {loading && !contactInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading contact information...</p>
          </div>
        )}

        {/* Main Form */}
        {!loading && (
          <>
            {/* Tab Navigation - Horizontal Scroll on Mobile */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-x-auto">
              <div className="flex min-w-max sm:min-w-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-base font-medium transition-all relative ${
                        activeTab === tab.id
                          ? 'text-slate-800 border-b-2 border-slate-800'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      <span className="hidden xs:inline">{tab.label}</span>
                      <span className="xs:hidden">{tab.label.charAt(0)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                      <h2 className="text-base sm:text-xl font-semibold text-slate-800">Contact Information</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Update your business contact details</p>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
                          placeholder="+91 1234567890"
                        />
                        <p className="text-xs text-slate-500 mt-1">Include country code</p>
                      </div>
                      
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none"
                          placeholder="info@omsaiindustries.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                        Full Address
                      </label>
                      <textarea
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none"
                        placeholder="Street address, City, State, Pincode"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                        Business Hours
                      </label>
                      <textarea
                        name="businessHours"
                        rows={4}
                        value={formData.businessHours}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none font-mono"
                        placeholder="Monday - Friday: 9:00 AM - 7:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <AlertCircle className="h-3 w-3 text-slate-400" />
                        <p className="text-xs text-slate-500">
                          Use HTML line breaks (&lt;br&gt;) for formatting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                      <h2 className="text-base sm:text-xl font-semibold text-slate-800">Social Media Links</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Connect your social media profiles</p>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                        <FaFacebook className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        name="socialMedia.facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg transition-all outline-none focus:ring-2 focus:ring-slate-800 ${
                          formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook)
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:border-slate-800'
                        }`}
                        placeholder="https://facebook.com/omsaiindustries"
                      />
                      {formData.socialMedia.facebook && !isValidUrl(formData.socialMedia.facebook) && (
                        <p className="text-xs text-red-500 mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                        <FaInstagram className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600" />
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg transition-all outline-none focus:ring-2 focus:ring-slate-800 ${
                          formData.socialMedia.instagram && !isValidUrl(formData.socialMedia.instagram)
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:border-slate-800'
                        }`}
                        placeholder="https://instagram.com/omsaiindustries"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                        <FaTwitter className="h-3 w-3 sm:h-4 sm:w-4 text-sky-500" />
                        Twitter/X URL
                      </label>
                      <input
                        type="url"
                        name="socialMedia.twitter"
                        value={formData.socialMedia.twitter}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg transition-all outline-none focus:ring-2 focus:ring-slate-800 ${
                          formData.socialMedia.twitter && !isValidUrl(formData.socialMedia.twitter)
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:border-slate-800'
                        }`}
                        placeholder="https://twitter.com/omsaiindustries"
                      />
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-blue-800">
                        <strong>Tip:</strong> Leave fields empty to hide social media icons on the contact page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Map Settings Tab */}
              {activeTab === 'map' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                      <h2 className="text-base sm:text-xl font-semibold text-slate-800">Google Maps Integration</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Embed a map to show your location</p>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Map Embed Code
                      </label>
                      <textarea
                        name="mapEmbed"
                        rows={6}
                        value={formData.mapEmbed}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none font-mono"
                        placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                      />
                    </div>
                    
                    <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                      <p className="text-xs sm:text-sm text-amber-800">
                        <strong>How to get embed code:</strong>
                      </p>
                      <ol className="text-xs sm:text-sm text-amber-700 mt-2 space-y-1 list-decimal list-inside">
                        <li>Go to Google Maps</li>
                        <li>Search for your business location</li>
                        <li>Click "Share" → "Embed a map"</li>
                        <li>Copy the iframe code and paste it above</li>
                      </ol>
                    </div>
                    
                    {formData.mapEmbed && (
                      <div className="mt-4">
                        <h3 className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Preview:</h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                          <div className="aspect-video w-full" dangerouslySetInnerHTML={{ __html: formData.mapEmbed }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                      <h2 className="text-base sm:text-xl font-semibold text-slate-800">Live Preview</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">See how your contact information will appear</p>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6">
                      <h3 className="text-base sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Contact Us</h3>
                      
                      <div className="space-y-3 sm:space-y-4">
                        {formData.phone && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-slate-700">Phone</p>
                              <p className="text-sm sm:text-base text-slate-600 break-words">{formData.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.email && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-slate-700">Email</p>
                              <p className="text-sm sm:text-base text-slate-600 break-words">{formData.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.address && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-slate-700">Address</p>
                              <p className="text-sm sm:text-base text-slate-600 whitespace-pre-line break-words">{formData.address}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.businessHours && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-slate-700">Business Hours</p>
                              <div className="text-sm sm:text-base text-slate-600" dangerouslySetInnerHTML={{ __html: formData.businessHours }} />
                            </div>
                          </div>
                        )}
                        
                        {/* Social Media Preview */}
                        {(formData.socialMedia.facebook || formData.socialMedia.instagram || formData.socialMedia.twitter) && (
                          <div className="flex items-start gap-2 sm:gap-3 pt-2">
                            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Follow Us</p>
                              <div className="flex gap-2 sm:gap-3">
                                {formData.socialMedia.facebook && (
                                  <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                                    <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
                                  </a>
                                )}
                                {formData.socialMedia.instagram && (
                                  <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
                                    <FaInstagram className="h-4 w-4 sm:h-5 sm:w-5" />
                                  </a>
                                )}
                                {formData.socialMedia.twitter && (
                                  <a href="#" className="text-sky-500 hover:text-sky-600 transition-colors">
                                    <FaTwitter className="h-4 w-4 sm:h-5 sm:w-5" />
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
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactEditor;