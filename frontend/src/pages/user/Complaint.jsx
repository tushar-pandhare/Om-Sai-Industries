import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AlertCircle, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  Send,
  Plus,
  History,
  Bell,
  Headphones,
  Mail,
  Phone,
  Shield,
  Zap,
  TrendingUp,
  RotateCcw,
  LayoutGrid,
  List
} from 'lucide-react';
import { createComplaint, fetchMyComplaints } from '../../features/complaints/complaintSlice';
import toast from 'react-hot-toast';

const Complaint = () => {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.complaints);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    order: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [focusedField, setFocusedField] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    dispatch(fetchMyComplaints());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description) {
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
    const loadingToast = toast.loading('Submitting your ticket...');
    
    try {
      const complaintData = {
        subject: formData.subject,
        description: formData.description,
        order: formData.order || null
      };
      
      await dispatch(createComplaint(complaintData)).unwrap();
      
      toast.dismiss(loadingToast);
      toast.success(
        (t) => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Ticket Created! 🎫</p>
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
      
      setFormData({
        subject: '',
        description: '',
        order: '',
        priority: 'medium'
      });
      
      await dispatch(fetchMyComplaints());
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error || 'Failed to submit complaint. Please try again.', {
        duration: 3000,
        icon: '❌',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          borderRadius: '12px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: {
        icon: Clock,
        label: 'Pending',
        color: '#f59e0b',
        bgColor: '#fef3c7',
        borderColor: '#fde68a',
        badgeColor: 'bg-amber-100 text-amber-700'
      },
      'in-progress': {
        icon: TrendingUp,
        label: 'In Progress',
        color: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#bfdbfe',
        badgeColor: 'bg-blue-100 text-blue-700'
      },
      resolved: {
        icon: CheckCircle,
        label: 'Resolved',
        color: '#10b981',
        bgColor: '#d1fae5',
        borderColor: '#a7f3d0',
        badgeColor: 'bg-emerald-100 text-emerald-700'
      },
      rejected: {
        icon: XCircle,
        label: 'Rejected',
        color: '#ef4444',
        bgColor: '#fee2e2',
        borderColor: '#fecaca',
        badgeColor: 'bg-red-100 text-red-700'
      }
    };
    return config[status] || config.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComplaints = () => {
    if (activeTab === 'all') return complaints;
    return complaints?.filter(c => c.status === activeTab);
  };

  const stats = {
    total: complaints?.length || 0,
    pending: complaints?.filter(c => c.status === 'pending').length || 0,
    inProgress: complaints?.filter(c => c.status === 'in-progress').length || 0,
    resolved: complaints?.filter(c => c.status === 'resolved').length || 0
  };

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
            Support Center
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Need <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Help?</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            We're here to assist you with any issues or concerns. Our support team is available 24/7.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
        {/* Stats Cards - Similar to Products Page */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Tickets</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Styled like Products page filters */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 mb-8 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { id: 'all', label: 'All Tickets', icon: MessageSquare, count: stats.total },
                { id: 'pending', label: 'Pending', icon: Clock, count: stats.pending },
                { id: 'in-progress', label: 'In Progress', icon: TrendingUp, count: stats.inProgress },
                { id: 'resolved', label: 'Resolved', icon: CheckCircle, count: stats.resolved }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="hidden md:flex bg-slate-50 p-1 rounded-xl gap-1 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Complaint Form - Styled like product card */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Plus className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Raise a Ticket</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Fill out the form below</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all
                    ${focusedField === 'subject' 
                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-indigo-300'
                    }
                  `}
                  placeholder="What's the issue about?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all resize-none
                    ${focusedField === 'description' 
                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-indigo-300'
                    }
                  `}
                  placeholder="Please provide detailed information about your issue..."
                />
                <p className="text-xs text-slate-400 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Order ID <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('order')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none transition-all
                    ${focusedField === 'order' 
                      ? 'border-indigo-400 ring-4 ring-indigo-100' 
                      : 'border-slate-200 hover:border-indigo-300'
                    }
                  `}
                  placeholder="ORD-12345"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Only enter if your complaint is related to a specific order
                </p>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-4 flex items-start gap-3 border border-indigo-100">
                <Bell className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-indigo-900 mb-1">⚡ Response Time Guarantee</p>
                  <p className="text-indigo-700">We aim to respond to all complaints within 24 hours during business days.</p>
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
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* My Complaints List - Styled like product grid */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <History className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">My Tickets</h2>
                    <p className="text-slate-300 text-sm mt-0.5">Track your support requests</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">{filteredComplaints()?.length || 0} tickets</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 text-sm">Loading tickets...</p>
                  </div>
                </div>
              ) : filteredComplaints()?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No tickets yet</h3>
                  <p className="text-slate-500 text-sm">
                    You haven't raised any tickets. Use the form to create one.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {filteredComplaints()?.map((complaint) => {
                    const statusConfig = getStatusConfig(complaint.status);
                    const StatusIcon = statusConfig.icon;
                    const isExpanded = expandedComplaint === complaint._id;
                    
                    return (
                      <div
                        key={complaint._id}
                        className={`rounded-xl transition-all duration-300 cursor-pointer bg-white border ${
                          isExpanded ? 'shadow-lg border-indigo-200' : 'shadow-sm hover:shadow-md border-slate-200'
                        }`}
                        onClick={() => setExpandedComplaint(isExpanded ? null : complaint._id)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.badgeColor}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {statusConfig.label}
                                </span>
                                {complaint.order && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    <FileText className="h-3 w-3" />
                                    {complaint.order}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-slate-800 mb-1 text-base">{complaint.subject}</h3>
                              <p className={`text-sm text-slate-600 ${!isExpanded && 'line-clamp-2'}`}>
                                {complaint.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(complaint.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {isExpanded && complaint.response && (
                          <div className="border-t border-indigo-100 p-4 rounded-b-xl bg-indigo-50">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 bg-emerald-100 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800 mb-1">Support Team Response</p>
                                <p className="text-sm text-slate-600">{complaint.response}</p>
                                {complaint.resolvedAt && (
                                  <p className="text-xs text-slate-400 mt-2">
                                    Resolved on: {formatDate(complaint.resolvedAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section - Styled like product features */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Headphones className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Need immediate assistance?</h3>
                <p className="text-sm text-slate-500 mt-0.5">Our support team is available 24/7</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="tel:+911234567890"
                  className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Phone className="h-4 w-4" />
                  Call Support
                </a>
                <a
                  href="mailto:support@omsai.com"
                  className="flex-1 sm:flex-none px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </a>
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">Response time:</span> Within 24 hours
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Complaint;