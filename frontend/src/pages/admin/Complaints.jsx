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


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, MessageSquare, CheckCircle, Clock, XCircle, Send, User, Mail, Calendar, Package, X, Filter } from 'lucide-react';
import { fetchAllComplaints, respondToComplaint, updateComplaintStatus } from '../../features/complaints/complaintSlice';
import toast from 'react-hot-toast';

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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      'in-progress': MessageSquare,
      resolved: CheckCircle,
      rejected: XCircle
    };
    const Icon = icons[status] || AlertTriangle;
    return <Icon className="h-3 w-3 sm:h-4 sm:w-4" />;
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 sticky top-0 z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Customer Complaints</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Manage and respond to customer issues</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Overview - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-yellow-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-blue-600">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-green-600">Resolved</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-red-600">Rejected</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      
        {/* Status Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700 sm:w-auto w-full"
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm">Filter by Status</span>
                {filter !== 'all' && (
                  <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>
            
            {/* Filter Chips */}
            {showFilters && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg capitalize text-xs sm:text-sm font-medium transition-all duration-200 ${
                        filter === status
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'in-progress' ? 'In Progress' : status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      
        {/* Complaints List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-slate-800"></div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500">Loading complaints...</p>
          </div>
        ) : filteredComplaints?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="text-slate-400 mb-3 sm:mb-4">
              <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-1 sm:mb-2">No complaints found</h3>
            <p className="text-sm sm:text-base text-slate-500">
              {filter !== 'all' ? 'No complaints with the selected status' : 'No customer complaints available'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-3 sm:mt-4 text-slate-600 hover:text-slate-700 text-xs sm:text-sm font-medium"
              >
                Show all complaints
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredComplaints?.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className={`p-4 sm:p-6 border-b ${complaint.status === 'pending' ? 'bg-yellow-50' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-white shadow-sm flex-shrink-0">
                          <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            complaint.status === 'pending' ? 'text-yellow-600' :
                            complaint.status === 'in-progress' ? 'text-blue-600' :
                            complaint.status === 'resolved' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-800 break-words">{complaint.subject}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                              <User className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="truncate">{complaint.user?.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="truncate">{complaint.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="whitespace-nowrap">
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            {complaint.order && (
                              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>Order: #{complaint.order.slice(-8)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border self-start ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="p-4 sm:p-6 bg-slate-50">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-words">{complaint.description}</p>
                </div>
                
                {/* Response */}
                {complaint.response && (
                  <div className="p-4 sm:p-6 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">Admin Response:</p>
                        <p className="text-sm sm:text-base text-slate-700 break-words">{complaint.response}</p>
                        <p className="text-xs text-slate-500 mt-1 sm:mt-2">
                          Responded on: {new Date(complaint.resolvedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-t border-slate-200 flex flex-wrap gap-2">
                  {complaint.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'in-progress')}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                        Respond
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {complaint.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                        Edit Response
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
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
      
      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Respond to Complaint</h2>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponse('');
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Complaint from:</p>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="font-semibold text-slate-800">{selectedComplaint.user?.name}</p>
                  <p className="text-xs sm:text-sm text-slate-500 break-words">{selectedComplaint.user?.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Subject:</p>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="font-semibold text-slate-800 break-words">{selectedComplaint.subject}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Complaint Description:</p>
                <div className="bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm sm:text-base text-slate-700 break-words">{selectedComplaint.description}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Response <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all outline-none resize-none"
                  placeholder="Write your response here..."
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl sticky bottom-0">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponse('');
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-white transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedComplaint._id)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <Send className="h-4 w-4" />
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;