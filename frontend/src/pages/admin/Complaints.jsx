// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AlertTriangle, MessageSquare, CheckCircle, Clock, XCircle, Send, User, Mail, Calendar, Package, X, Filter } from 'lucide-react';
// import Sidebar from '../../components/Sidebar';
// import { fetchAllComplaints, respondToComplaint, updateComplaintStatus } from '../../features/complaints/complaintSlice';
// import toast from 'react-hot-toast';

// const Complaints = () => {
//   const dispatch = useDispatch();
//   const { complaints, loading } = useSelector((state) => state.complaints);
//   const [filter, setFilter] = useState('all');
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [response, setResponse] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllComplaints());
//   }, [dispatch]);

//   const filteredComplaints = complaints?.filter(complaint => {
//     if (filter === 'all') return true;
//     return complaint.status === filter;
//   });

//   const handleStatusUpdate = async (id, status) => {
//     const result = await dispatch(updateComplaintStatus({ id, status }));
//     if (updateComplaintStatus.fulfilled.match(result)) {
//       toast.success(`Complaint marked as ${status}`);
//     } else {
//       toast.error('Failed to update status');
//     }
//   };

//   const handleRespond = async (id) => {
//     if (!response.trim()) {
//       return toast.error('Please enter a response message');
//     }
    
//     const result = await dispatch(respondToComplaint({ id, response }));
//     if (respondToComplaint.fulfilled.match(result)) {
//       toast.success('Response sent successfully');
//       setSelectedComplaint(null);
//       setResponse('');
//     } else {
//       toast.error('Failed to send response');
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
//       resolved: 'bg-green-100 text-green-800 border-green-200',
//       rejected: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       pending: Clock,
//       'in-progress': MessageSquare,
//       resolved: CheckCircle,
//       rejected: XCircle
//     };
//     const Icon = icons[status] || AlertTriangle;
//     return <Icon className="h-4 w-4" />;
//   };

//   const getStats = () => {
//     return {
//       total: complaints?.length || 0,
//       pending: complaints?.filter(c => c.status === 'pending').length || 0,
//       inProgress: complaints?.filter(c => c.status === 'in-progress').length || 0,
//       resolved: complaints?.filter(c => c.status === 'resolved').length || 0,
//       rejected: complaints?.filter(c => c.status === 'rejected').length || 0
//     };
//   };

//   const stats = getStats();

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />
      
//       <div className="flex-1">
//         {/* Header */}
//         <div className="bg-white border-b border-slate-200 px-8 py-6">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">Customer Complaints</h1>
//             <p className="text-slate-500 mt-1">Manage and respond to customer issues</p>
//           </div>
//         </div>

//         <div className="p-8">
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500">Total</p>
//                   <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
//                 </div>
//                 <div className="p-2 bg-slate-100 rounded-lg">
//                   <AlertTriangle className="h-5 w-5 text-slate-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-yellow-600">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
//                 </div>
//                 <div className="p-2 bg-yellow-100 rounded-lg">
//                   <Clock className="h-5 w-5 text-yellow-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-blue-600">In Progress</p>
//                   <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
//                 </div>
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <MessageSquare className="h-5 w-5 text-blue-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-green-600">Resolved</p>
//                   <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
//                 </div>
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-red-600">Rejected</p>
//                   <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
//                 </div>
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <XCircle className="h-5 w-5 text-red-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
        
//           {/* Status Filter Bar */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
//             <div className="p-4">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700 md:w-auto w-full"
//                 >
//                   <Filter className="h-5 w-5" />
//                   Filter by Status
//                   {filter !== 'all' && (
//                     <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
//                       Active
//                     </span>
//                   )}
//                 </button>
//               </div>
              
//               {/* Filter Chips */}
//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-slate-200">
//                   <div className="flex flex-wrap gap-2">
//                     {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map((status) => (
//                       <button
//                         key={status}
//                         onClick={() => setFilter(status)}
//                         className={`px-4 py-2 rounded-lg capitalize font-medium transition-all duration-200 ${
//                           filter === status
//                             ? 'bg-blue-600 text-white shadow-md'
//                             : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                         }`}
//                       >
//                         {status === 'in-progress' ? 'In Progress' : status}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
        
//           {/* Complaints List */}
//           {loading ? (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-3 text-slate-500">Loading complaints...</p>
//             </div>
//           ) : filteredComplaints?.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
//               <div className="text-slate-400 mb-4">
//                 <MessageSquare className="h-16 w-16 mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-slate-800 mb-2">No complaints found</h3>
//               <p className="text-slate-500">
//                 {filter !== 'all' ? 'No complaints with the selected status' : 'No customer complaints available'}
//               </p>
//               {filter !== 'all' && (
//                 <button
//                   onClick={() => setFilter('all')}
//                   className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                 >
//                   Show all complaints
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredComplaints?.map((complaint) => (
//                 <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
//                   {/* Header */}
//                   <div className={`p-6 border-b ${complaint.status === 'pending' ? 'bg-yellow-50' : ''}`}>
//                     <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-start gap-3 mb-3">
//                           <div className="p-2 rounded-lg bg-white shadow-sm">
//                             <AlertTriangle className={`h-5 w-5 ${
//                               complaint.status === 'pending' ? 'text-yellow-600' :
//                               complaint.status === 'in-progress' ? 'text-blue-600' :
//                               complaint.status === 'resolved' ? 'text-green-600' : 'text-red-600'
//                             }`} />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="text-lg font-semibold text-slate-800">{complaint.subject}</h3>
//                             <div className="flex flex-wrap items-center gap-3 mt-1">
//                               <div className="flex items-center gap-1 text-sm text-slate-600">
//                                 <User className="h-4 w-4" />
//                                 {complaint.user?.name}
//                               </div>
//                               <div className="flex items-center gap-1 text-sm text-slate-600">
//                                 <Mail className="h-4 w-4" />
//                                 {complaint.user?.email}
//                               </div>
//                               <div className="flex items-center gap-1 text-sm text-slate-600">
//                                 <Calendar className="h-4 w-4" />
//                                 {new Date(complaint.createdAt).toLocaleDateString('en-US', {
//                                   year: 'numeric',
//                                   month: 'short',
//                                   day: 'numeric',
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })}
//                               </div>
//                               {complaint.order && (
//                                 <div className="flex items-center gap-1 text-sm text-slate-600">
//                                   <Package className="h-4 w-4" />
//                                   Order: #{complaint.order.slice(-8)}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(complaint.status)}`}>
//                         {getStatusIcon(complaint.status)}
//                         {complaint.status.toUpperCase()}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Description */}
//                   <div className="p-6 bg-slate-50">
//                     <p className="text-slate-700 leading-relaxed">{complaint.description}</p>
//                   </div>
                  
//                   {/* Response */}
//                   {complaint.response && (
//                     <div className="p-6 bg-blue-50 border-t border-blue-100">
//                       <div className="flex items-start gap-3">
//                         <div className="p-1.5 bg-blue-100 rounded-lg">
//                           <MessageSquare className="h-4 w-4 text-blue-600" />
//                         </div>
//                         <div className="flex-1">
//                           <p className="font-semibold text-blue-800 mb-1">Admin Response:</p>
//                           <p className="text-slate-700">{complaint.response}</p>
//                           <p className="text-xs text-slate-500 mt-2">
//                             Responded on: {new Date(complaint.resolvedAt).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Actions */}
//                   <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap gap-2">
//                     {complaint.status === 'pending' && (
//                       <>
//                         <button
//                           onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
//                           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
//                         >
//                           <MessageSquare className="h-4 w-4" />
//                           Mark In Progress
//                         </button>
//                         <button
//                           onClick={() => setSelectedComplaint(complaint)}
//                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
//                         >
//                           <Send className="h-4 w-4" />
//                           Respond
//                         </button>
//                         <button
//                           onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
//                           className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
                    
//                     {complaint.status === 'in-progress' && (
//                       <>
//                         <button
//                           onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
//                           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
//                         >
//                           <CheckCircle className="h-4 w-4" />
//                           Mark Resolved
//                         </button>
//                         <button
//                           onClick={() => setSelectedComplaint(complaint)}
//                           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
//                         >
//                           <Send className="h-4 w-4" />
//                           Edit Response
//                         </button>
//                         <button
//                           onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
//                           className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Response Modal */}
//         {selectedComplaint && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
//               <div className="flex justify-between items-center p-6 border-b border-slate-200">
//                 <h2 className="text-xl font-bold text-slate-800">Respond to Complaint</h2>
//                 <button
//                   onClick={() => {
//                     setSelectedComplaint(null);
//                     setResponse('');
//                   }}
//                   className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
//                 >
//                   <X className="h-5 w-5 text-slate-500" />
//                 </button>
//               </div>
              
//               <div className="p-6">
//                 <div className="mb-4">
//                   <p className="text-sm font-medium text-slate-700 mb-2">Complaint from:</p>
//                   <div className="bg-slate-50 rounded-lg p-3 mb-4">
//                     <p className="font-semibold text-slate-800">{selectedComplaint.user?.name}</p>
//                     <p className="text-sm text-slate-500">{selectedComplaint.user?.email}</p>
//                   </div>
//                 </div>
                
//                 <div className="mb-4">
//                   <p className="text-sm font-medium text-slate-700 mb-2">Subject:</p>
//                   <div className="bg-slate-50 rounded-lg p-3 mb-4">
//                     <p className="font-semibold text-slate-800">{selectedComplaint.subject}</p>
//                   </div>
//                 </div>
                
//                 <div className="mb-4">
//                   <p className="text-sm font-medium text-slate-700 mb-2">Complaint Description:</p>
//                   <div className="bg-slate-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
//                     <p className="text-slate-700">{selectedComplaint.description}</p>
//                   </div>
//                 </div>
                
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Your Response <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     rows="4"
//                     value={response}
//                     onChange={(e) => setResponse(e.target.value)}
//                     className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
//                     placeholder="Write your response here..."
//                     autoFocus
//                   />
//                 </div>
//               </div>
              
//               <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
//                 <button
//                   onClick={() => {
//                     setSelectedComplaint(null);
//                     setResponse('');
//                   }}
//                   className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-white transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleRespond(selectedComplaint._id)}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
//                 >
//                   <Send className="h-4 w-4" />
//                   Send Response
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Complaints;


// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AlertTriangle, MessageSquare, CheckCircle, Clock, XCircle, Send, User, Mail, Calendar, Package, X, Filter } from 'lucide-react';
// import { fetchAllComplaints, respondToComplaint, updateComplaintStatus } from '../../features/complaints/complaintSlice';
// import toast from 'react-hot-toast';

// const Complaints = () => {
//   const dispatch = useDispatch();
//   const { complaints, loading } = useSelector((state) => state.complaints);
//   const [filter, setFilter] = useState('all');
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [response, setResponse] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllComplaints());
//   }, [dispatch]);

//   const filteredComplaints = complaints?.filter(complaint => {
//     if (filter === 'all') return true;
//     return complaint.status === filter;
//   });

//   const handleStatusUpdate = async (id, status) => {
//     const result = await dispatch(updateComplaintStatus({ id, status }));
//     if (updateComplaintStatus.fulfilled.match(result)) {
//       toast.success(`Complaint marked as ${status}`);
//     } else {
//       toast.error('Failed to update status');
//     }
//   };

//   const handleRespond = async (id) => {
//     if (!response.trim()) {
//       return toast.error('Please enter a response message');
//     }
    
//     const result = await dispatch(respondToComplaint({ id, response }));
//     if (respondToComplaint.fulfilled.match(result)) {
//       toast.success('Response sent successfully');
//       setSelectedComplaint(null);
//       setResponse('');
//     } else {
//       toast.error('Failed to send response');
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
//       resolved: 'bg-green-100 text-green-800 border-green-200',
//       rejected: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       pending: Clock,
//       'in-progress': MessageSquare,
//       resolved: CheckCircle,
//       rejected: XCircle
//     };
//     const Icon = icons[status] || AlertTriangle;
//     return <Icon className="h-3 w-3 sm:h-4 sm:w-4" />;
//   };

//   const getStats = () => {
//     return {
//       total: complaints?.length || 0,
//       pending: complaints?.filter(c => c.status === 'pending').length || 0,
//       inProgress: complaints?.filter(c => c.status === 'in-progress').length || 0,
//       resolved: complaints?.filter(c => c.status === 'resolved').length || 0,
//       rejected: complaints?.filter(c => c.status === 'rejected').length || 0
//     };
//   };

//   const stats = getStats();

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customer Complaints</h1>
//           <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and respond to customer issues</p>
//         </div>
//       </div>

//       <div className="p-4 sm:p-6 lg:p-8">
//         {/* Stats Overview - Responsive Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm text-slate-500">Total</p>
//                 <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.total}</p>
//               </div>
//               <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
//                 <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm text-yellow-600">Pending</p>
//                 <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
//               </div>
//               <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
//                 <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm text-blue-600">In Progress</p>
//                 <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
//               </div>
//               <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
//                 <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm text-green-600">Resolved</p>
//                 <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.resolved}</p>
//               </div>
//               <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
//                 <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs sm:text-sm text-red-600">Rejected</p>
//                 <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.rejected}</p>
//               </div>
//               <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
//                 <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
//               </div>
//             </div>
//           </div>
//         </div>
      
//         {/* Status Filter Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
//           <div className="p-3 sm:p-4">
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700 sm:w-auto w-full"
//               >
//                 <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
//                 <span className="text-sm">Filter by Status</span>
//                 {filter !== 'all' && (
//                   <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
//                     Active
//                   </span>
//                 )}
//               </button>
//             </div>
            
//             {/* Filter Chips */}
//             {showFilters && (
//               <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
//                 <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                   {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => setFilter(status)}
//                       className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg capitalize text-xs sm:text-sm font-medium transition-all duration-200 ${
//                         filter === status
//                           ? 'bg-slate-800 text-white shadow-md'
//                           : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                       }`}
//                     >
//                       {status === 'in-progress' ? 'In Progress' : status}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
      
//         {/* Complaints List */}
//         {loading ? (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
//             <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading complaints...</p>
//           </div>
//         ) : filteredComplaints?.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
//             <div className="text-slate-400 mb-3 sm:mb-4">
//               <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
//             </div>
//             <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-1 sm:mb-2">No complaints found</h3>
//             <p className="text-sm sm:text-base text-slate-500">
//               {filter !== 'all' ? 'No complaints with the selected status' : 'No customer complaints available'}
//             </p>
//             {filter !== 'all' && (
//               <button
//                 onClick={() => setFilter('all')}
//                 className="mt-3 sm:mt-4 text-slate-600 hover:text-slate-700 text-xs sm:text-sm font-medium"
//               >
//                 Show all complaints
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-3 sm:space-y-4">
//             {filteredComplaints?.map((complaint) => (
//               <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
//                 {/* Header */}
//                 <div className={`p-4 sm:p-6 border-b ${complaint.status === 'pending' ? 'bg-yellow-50' : ''}`}>
//                   <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
//                         <div className="p-1.5 sm:p-2 rounded-lg bg-white shadow-sm flex-shrink-0">
//                           <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${
//                             complaint.status === 'pending' ? 'text-yellow-600' :
//                             complaint.status === 'in-progress' ? 'text-blue-600' :
//                             complaint.status === 'resolved' ? 'text-green-600' : 'text-red-600'
//                           }`} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-base sm:text-lg font-semibold text-slate-800 break-words">{complaint.subject}</h3>
//                           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
//                             <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
//                               <User className="h-3 w-3 sm:h-4 sm:w-4" />
//                               <span className="truncate">{complaint.user?.name}</span>
//                             </div>
//                             <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
//                               <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
//                               <span className="truncate">{complaint.user?.email}</span>
//                             </div>
//                             <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
//                               <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
//                               <span className="whitespace-nowrap">
//                                 {new Date(complaint.createdAt).toLocaleDateString('en-US', {
//                                   year: 'numeric',
//                                   month: 'short',
//                                   day: 'numeric'
//                                 })}
//                               </span>
//                             </div>
//                             {complaint.order && (
//                               <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
//                                 <Package className="h-3 w-3 sm:h-4 sm:w-4" />
//                                 <span>Order: #{complaint.order.slice(-8)}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border self-start ${getStatusColor(complaint.status)}`}>
//                       {getStatusIcon(complaint.status)}
//                       {complaint.status.toUpperCase()}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Description */}
//                 <div className="p-4 sm:p-6 bg-slate-50">
//                   <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-words">{complaint.description}</p>
//                 </div>
                
//                 {/* Response */}
//                 {complaint.response && (
//                   <div className="p-4 sm:p-6 bg-blue-50 border-t border-blue-100">
//                     <div className="flex items-start gap-2 sm:gap-3">
//                       <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
//                         <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">Admin Response:</p>
//                         <p className="text-sm sm:text-base text-slate-700 break-words">{complaint.response}</p>
//                         <p className="text-xs text-slate-500 mt-1 sm:mt-2">
//                           Responded on: {new Date(complaint.resolvedAt).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Actions */}
//                 <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-slate-200 flex flex-wrap gap-2">
//                   {complaint.status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
//                       >
//                         <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
//                         Mark In Progress
//                       </button>
//                       <button
//                         onClick={() => setSelectedComplaint(complaint)}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
//                       >
//                         <Send className="h-3 w-3 sm:h-4 sm:w-4" />
//                         Respond
//                       </button>
//                       <button
//                         onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
                  
//                   {complaint.status === 'in-progress' && (
//                     <>
//                       <button
//                         onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
//                       >
//                         <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
//                         Mark Resolved
//                       </button>
//                       <button
//                         onClick={() => setSelectedComplaint(complaint)}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
//                       >
//                         <Send className="h-3 w-3 sm:h-4 sm:w-4" />
//                         Edit Response
//                       </button>
//                       <button
//                         onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
//                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Response Modal */}
//       {selectedComplaint && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white">
//               <h2 className="text-lg sm:text-xl font-bold text-slate-800">Respond to Complaint</h2>
//               <button
//                 onClick={() => {
//                   setSelectedComplaint(null);
//                   setResponse('');
//                 }}
//                 className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
//               >
//                 <X className="h-5 w-5 text-slate-500" />
//               </button>
//             </div>
            
//             <div className="p-4 sm:p-6 space-y-4">
//               <div>
//                 <p className="text-sm font-medium text-slate-700 mb-2">Complaint from:</p>
//                 <div className="bg-slate-50 rounded-lg p-3">
//                   <p className="font-semibold text-slate-800">{selectedComplaint.user?.name}</p>
//                   <p className="text-xs sm:text-sm text-slate-500 break-words">{selectedComplaint.user?.email}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-sm font-medium text-slate-700 mb-2">Subject:</p>
//                 <div className="bg-slate-50 rounded-lg p-3">
//                   <p className="font-semibold text-slate-800 break-words">{selectedComplaint.subject}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-sm font-medium text-slate-700 mb-2">Complaint Description:</p>
//                 <div className="bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto">
//                   <p className="text-sm sm:text-base text-slate-700 break-words">{selectedComplaint.description}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Your Response <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   rows="4"
//                   value={response}
//                   onChange={(e) => setResponse(e.target.value)}
//                   className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none"
//                   placeholder="Write your response here..."
//                   autoFocus
//                 />
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl sticky bottom-0">
//               <button
//                 onClick={() => {
//                   setSelectedComplaint(null);
//                   setResponse('');
//                 }}
//                 className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-white transition-colors order-2 sm:order-1"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleRespond(selectedComplaint._id)}
//                 className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
//               >
//                 <Send className="h-4 w-4" />
//                 Send Response
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Complaints;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, MessageSquare, CheckCircle, Clock, XCircle, 
  Send, User, Mail, Calendar, Package, X, Filter, ArrowLeft
} from 'lucide-react';
import { fetchAllComplaints, respondToComplaint, updateComplaintStatus } from '../../features/complaints/complaintSlice';
import toast from 'react-hot-toast';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Pending' },
    'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: MessageSquare, label: 'In Progress' },
    resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Resolved' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'Rejected' }
  };
  const { bg, text, border, icon: Icon, label } = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${bg} ${text} ${border}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const Complaints = () => {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.complaints);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  const filteredComplaints = complaints?.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  const handleStatusUpdate = async (id, status) => {
    const result = await dispatch(updateComplaintStatus({ id, status }));
    if (updateComplaintStatus.fulfilled.match(result)) {
      toast.success(`Complaint marked as ${status}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleRespond = async (id) => {
    if (!response.trim()) {
      return toast.error('Please enter a response message');
    }
    
    const result = await dispatch(respondToComplaint({ id, response }));
    if (respondToComplaint.fulfilled.match(result)) {
      toast.success('Response sent successfully');
      setSelectedComplaint(null);
      setResponse('');
    } else {
      toast.error('Failed to send response');
    }
  };

  const getStats = () => {
    return {
      total: complaints?.length || 0,
      pending: complaints?.filter(c => c.status === 'pending').length || 0,
      inProgress: complaints?.filter(c => c.status === 'in-progress').length || 0,
      resolved: complaints?.filter(c => c.status === 'resolved').length || 0,
      rejected: complaints?.filter(c => c.status === 'rejected').length || 0
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - Consistent with other pages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Complaints</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and respond to customer issues</p>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 ml-12">
            <Link to="/admin" className="hover:text-gray-700 transition-colors">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Complaints</span>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
          <StatCard 
            title="Total Complaints" 
            value={stats.total} 
            icon={AlertTriangle} 
            bgColor="bg-gradient-to-r from-gray-600 to-gray-700"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Clock} 
            bgColor="bg-gradient-to-r from-amber-500 to-amber-600"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={MessageSquare} 
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard 
            title="Resolved" 
            value={stats.resolved} 
            icon={CheckCircle} 
            bgColor="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejected} 
            icon={XCircle} 
            bgColor="bg-gradient-to-r from-rose-500 to-rose-600"
          />
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by Status</span>
                {filter !== 'all' && (
                  <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
                )}
              </button>
            </div>
            
            {/* Filter Chips */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                        filter === status
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'in-progress' ? 'In Progress' : status}
                      <span className="ml-1 text-xs opacity-70">
                        ({status === 'all' ? stats.total : 
                          status === 'pending' ? stats.pending :
                          status === 'in-progress' ? stats.inProgress :
                          status === 'resolved' ? stats.resolved : stats.rejected})
                      </span>
                    </button>
                  ))}
                </div>
                {filter !== 'all' && (
                  <button 
                    onClick={() => setFilter('all')} 
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Complaints List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-500">Loading complaints...</p>
          </div>
        ) : filteredComplaints?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No complaints found</h3>
            <p className="text-gray-500 text-sm">
              {filter !== 'all' ? 'No complaints with the selected status' : 'No customer complaints available'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Show all complaints
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints?.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-1.5 rounded-lg bg-white shadow-sm flex-shrink-0">
                          <AlertTriangle className={`h-5 w-5 ${
                            complaint.status === 'pending' ? 'text-amber-600' :
                            complaint.status === 'in-progress' ? 'text-blue-600' :
                            complaint.status === 'resolved' ? 'text-emerald-600' : 'text-rose-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 break-words">{complaint.subject}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{complaint.user?.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span>{complaint.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            {complaint.order && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Package className="h-3 w-3" />
                                <span>Order: #{complaint.order.slice(-8)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={complaint.status} />
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="px-5 py-4 bg-gray-50">
                  <p className="text-sm text-gray-700 leading-relaxed break-words">{complaint.description}</p>
                </div>
                
                {/* Response */}
                {complaint.response && (
                  <div className="px-5 py-4 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded-lg flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-800 mb-1 text-sm">Admin Response:</p>
                        <p className="text-sm text-gray-700 break-words">{complaint.response}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Responded on: {new Date(complaint.resolvedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="px-5 py-3 bg-white border-t border-gray-100 flex flex-wrap gap-2">
                  {complaint.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                        className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Respond
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                        className="px-4 py-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {complaint.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Edit Response
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                        className="px-4 py-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Response Modal - Consistent with other modals */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Respond to Complaint</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Send a response to the customer</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponse('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Complaint from:</p>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="font-semibold text-gray-800">{selectedComplaint.user?.name}</p>
                  <p className="text-xs text-gray-500 break-words">{selectedComplaint.user?.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Subject:</p>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="font-semibold text-gray-800 break-words">{selectedComplaint.subject}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Complaint Description:</p>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 max-h-32 overflow-y-auto custom-scroll">
                  <p className="text-sm text-gray-700 break-words">{selectedComplaint.description}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  placeholder="Write your response here..."
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponse('');
                }}
                className="px-5 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-white transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedComplaint._id)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Complaints;