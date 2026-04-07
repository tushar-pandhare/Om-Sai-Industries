// src/pages/admin/AdminMessages.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Phone, User, Calendar, Search, Filter, Trash2, Eye, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { fetchAllMessages, deleteMessage, markAsRead } from '../../features/messages/messageSlice';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { messages = [], loading = false, error = null } = useSelector((state) => state.messages || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAllMessages());
  }, [dispatch]);

  const filteredMessages = Array.isArray(messages) ? messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.phone?.includes(searchTerm);
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'read' ? message.isRead :
      filter === 'unread' ? !message.isRead : true;
    
    return matchesSearch && matchesFilter;
  }) : [];

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete message from ${name}?`)) {
      const result = await dispatch(deleteMessage(id));
      if (deleteMessage.fulfilled.match(result)) {
        toast.success('Message deleted successfully');
        if (selectedMessage?._id === id) setSelectedMessage(null);
      } else {
        toast.error('Failed to delete message');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    const result = await dispatch(markAsRead(id));
    if (markAsRead.fulfilled.match(result)) {
      toast.success('Message marked as read');
    }
  };

  const getStatusColor = (isRead) => {
    return isRead 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isRead) => {
    return isRead ? 'Read' : 'Unread';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: filteredMessages?.length || 0,
    unread: filteredMessages?.filter(m => !m.isRead).length || 0,
    read: filteredMessages?.filter(m => m.isRead).length || 0
  };

  if (loading && !messages.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Contact Messages</h1>
          <p className="text-slate-500 mt-1">View and manage customer inquiries</p>
        </div>

        {/* Stats Overview */}
        {filteredMessages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Messages</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Unread</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Mail className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Read</p>
                  <p className="text-2xl font-bold text-green-600">{stats.read}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-slate-700"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Filter</span>
              {filter !== 'all' && (
                <span className="ml-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status Filter
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Messages' },
                    { value: 'unread', label: 'Unread' },
                    { value: 'read', label: 'Read' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filter === option.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      
        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Mail className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No messages found</h3>
            <p className="text-slate-500">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No contact messages yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMessages.map((message) => (
              <div 
                key={message._id} 
                className={`bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                  !message.isRead ? 'border-yellow-400 bg-yellow-50/30' : 'border-slate-200'
                }`}
                onClick={() => setSelectedMessage(selectedMessage?._id === message._id ? null : message)}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {message.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{message.name || 'Unknown'}</h3>
                          <p className="text-xs text-slate-500">{message.email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(message.isRead)}`}>
                        {getStatusText(message.isRead)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message Preview */}
                  <div className="mb-3">
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {message.message || 'No message content'}
                    </p>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-1 mb-3">
                    {message.phone && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="h-3 w-3" />
                        <span>{message.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    {!message.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(message._id);
                        }}
                        className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message._id, message.name);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Expanded Message Details */}
                {selectedMessage?._id === message._id && (
                  <div className="border-t border-slate-200 bg-slate-50 p-5">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Full Message
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-2">Contact Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium text-slate-600">Name:</span> {message.name}</p>
                        <p><span className="font-medium text-slate-600">Email:</span> {message.email}</p>
                        {message.phone && <p><span className="font-medium text-slate-600">Phone:</span> {message.phone}</p>}
                        <p><span className="font-medium text-slate-600">Received:</span> {formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;