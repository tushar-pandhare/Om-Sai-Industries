import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { 
  Mail, Send, MessageSquare, CheckCircle, ArrowLeft,
  Clock, AlertCircle, CheckCheck, Users, UserCheck, 
  UserX, Loader2, Search, Plus, Filter, MoreVertical,
  Phone, Mail as MailIcon, Calendar, Smile, Paperclip,
  CornerDownLeft, Wifi, WifiOff, Star, StarOff
} from 'lucide-react';
import { fetchAllMessages, deleteMessage, markAsRead } from '../../features/messages/messageSlice';
import { messageAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { userInfo } = useSelector((state) => state.auth);
  const { messages = [], loading = false } = useSelector((state) => state.messages || {});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [typingStatus, setTypingStatus] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef(null);
  const replyInputRef = useRef(null);

  const fetchActiveChats = useCallback(async () => {
    try {
      const { data } = await messageAPI.getConversations();
      const activeCustomerChats = data.filter(chat => 
        chat.user?.role === 'user' && chat.lastMessage
      );
      setActiveChats(activeCustomerChats);
    } catch (error) {
      console.error('Error fetching active chats:', error);
      setActiveChats([]);
    }
  }, []);

  const fetchChatMessages = useCallback(async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await messageAPI.getMessages(userId);
      setChatMessages(Array.isArray(data) ? data : []);
      scrollToBottom();
      
      const unreadMessages = (Array.isArray(data) ? data : []).filter(m => !m.isRead && m.to?._id === userInfo?._id);
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(m => m._id);
        await messageAPI.markAsRead(messageIds);
        socket?.emit('mark_read', { messageIds });
        setChatMessages(prev => prev.map(m => 
          messageIds.includes(m._id) ? { ...m, isRead: true } : m
        ));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setChatMessages([]);
    } finally {
      setLoadingChat(false);
    }
  }, [userInfo, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectChat = useCallback(async (chat) => {
    if (!chat || !chat.user) return;
    setSelectedChat(chat.user);
    await fetchChatMessages(chat.user._id);
  }, [fetchChatMessages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedChat || !socket) return;

    const tempId = Date.now();
    const newMessage = {
      _id: tempId,
      from: { _id: userInfo._id, name: userInfo.name, role: userInfo.role },
      to: { _id: selectedChat._id },
      message: replyMessage.trim(),
      messageType: 'text',
      createdAt: new Date(),
      isRead: false
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setReplyMessage('');
    scrollToBottom();

    socket.emit('send_message', {
      toUserId: selectedChat._id,
      message: replyMessage.trim(),
      type: 'text'
    });
  };

  const handleTyping = (e) => {
    setReplyMessage(e.target.value);
    if (e.target.value.length > 0 && socket && selectedChat) {
      socket.emit('typing', { toUserId: selectedChat._id, isTyping: true });
      setTimeout(() => {
        if (socket && selectedChat) {
          socket.emit('typing', { toUserId: selectedChat._id, isTyping: false });
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(e);
    }
  };

  useEffect(() => {
    dispatch(fetchAllMessages());
    fetchActiveChats();
  }, [dispatch, fetchActiveChats]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      if (selectedChat?._id === newMessage.from._id) {
        setChatMessages(prev => [...prev, newMessage]);
        scrollToBottom();
        
        if (!newMessage.isRead && socket) {
          socket.emit('mark_read', { messageIds: [newMessage._id] });
          setChatMessages(prev => prev.map(m => 
            m._id === newMessage._id ? { ...m, isRead: true } : m
          ));
        }
      }
      fetchActiveChats();
      dispatch(fetchAllMessages());
      
      if (selectedChat?._id !== newMessage.from._id) {
        toast.success(`📩 New message from ${newMessage.from.name}`);
      }
    };

    const handleUserTyping = (data) => {
      if (selectedChat?._id === data.from) {
        setTypingStatus(prev => ({ ...prev, [data.from]: data.isTyping }));
        setTimeout(() => {
          setTypingStatus(prev => ({ ...prev, [data.from]: false }));
        }, 1000);
      }
    };

    const handleMessagesRead = (data) => {
      setChatMessages(prev => prev.map(m => 
        data.messageIds.includes(m._id) ? { ...m, isRead: true } : m
      ));
      fetchActiveChats();
    };

    const handleActiveUsers = (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_read', handleMessagesRead);
    socket.on('active_users', handleActiveUsers);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_read', handleMessagesRead);
      socket.off('active_users', handleActiveUsers);
    };
  }, [socket, selectedChat, fetchActiveChats, dispatch]);

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);
    const diffHours = Math.abs(now - msgDate) / 36e5;
    
    if (diffHours < 24) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatMessageDate = (date, prevDate) => {
    if (!date) return null;
    const current = new Date(date).toDateString();
    const prev = prevDate ? new Date(prevDate).toDateString() : null;
    
    if (current !== prev) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 864e5).toDateString();
      
      if (current === today) return 'Today';
      if (current === yesterday) return 'Yesterday';
      return new Date(date).toLocaleDateString([], { month: 'long', day: 'numeric' });
    }
    return null;
  };

  const isUserOnline = (userId) => {
    return Array.isArray(onlineUsers) && onlineUsers.some(u => u.userId === userId);
  };

  const stats = {
    total: activeChats.length,
    unread: activeChats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0),
    online: onlineUsers.filter(u => u.userRole === 'user').length
  };

  if (loading && !activeChats.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/admin')} 
                className="p-2 hover:bg-white rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage customer conversations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs font-medium text-gray-600">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Conversations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Online Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.online}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex h-[620px]">
            {/* Sidebar - Active Chats */}
            <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} border-r border-gray-100 flex flex-col transition-all duration-300 overflow-hidden`}>
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" />
                    Conversations
                  </h3>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors lg:hidden"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search customers..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {activeChats.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No active conversations</p>
                    <p className="text-xs text-gray-400 mt-1">Customer messages will appear here</p>
                  </div>
                ) : (
                  activeChats.map((chat) => (
                    <button 
                      key={chat.user?._id} 
                      onClick={() => handleSelectChat(chat)} 
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-all border-b border-gray-50 ${
                        selectedChat?._id === chat.user?._id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {chat.user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          {isUserOnline(chat.user?._id) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-900 truncate text-sm">{chat.user?.name || 'Unknown'}</p>
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatTime(chat.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage?.substring(0, 50) || 'No messages'}</p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors lg:hidden"
                      >
                        <Users className="h-4 w-4 text-gray-500" />
                      </button>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                          {selectedChat.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        {isUserOnline(selectedChat._id) && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedChat.name || 'Customer'}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {isUserOnline(selectedChat._id) ? (
                            <>
                              <UserCheck className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">Online</span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-400">Offline</span>
                            </>
                          )}
                          {selectedChat.email && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{selectedChat.email}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg shadow-sm">
                        <Wifi className={`h-3 w-3 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-xs text-gray-600">
                          {isConnected ? 'Real-time' : 'Reconnecting...'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                    {loadingChat ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                          <MessageSquare className="h-10 w-10 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-700 mb-1">No messages yet</h4>
                        <p className="text-sm text-gray-500">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-3xl mx-auto">
                        {chatMessages.map((msg, idx) => {
                          const dateHeader = formatMessageDate(msg.createdAt, chatMessages[idx - 1]?.createdAt);
                          return (
                            <React.Fragment key={msg._id || idx}>
                              {dateHeader && (
                                <div className="flex justify-center my-4">
                                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                                    <span className="text-xs font-medium text-gray-500">{dateHeader}</span>
                                  </div>
                                </div>
                              )}
                              <div className={`flex ${msg.from?._id === userInfo?._id ? 'justify-end' : 'justify-start'}`}>
                                {msg.from?._id !== userInfo?._id && (
                                  <div className="flex-shrink-0 mr-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                                      <span className="text-white text-xs font-bold">
                                        {selectedChat.name?.charAt(0).toUpperCase() || 'C'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                <div className={`max-w-[70%] group`}>
                                  <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                                    msg.from?._id === userInfo?._id 
                                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                  }`}>
                                    <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                      msg.from?._id === userInfo?._id ? 'text-indigo-200' : 'text-gray-400'
                                    }`}>
                                      <Clock className="h-2.5 w-2.5" />
                                      <span>{formatTime(msg.createdAt)}</span>
                                      {msg.from?._id === userInfo?._id && (
                                        <CheckCheck className={`h-3 w-3 ${msg.isRead ? 'text-green-400' : 'text-indigo-300'}`} />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                        {typingStatus[selectedChat._id] && (
                          <div className="flex justify-start">
                            <div className="flex-shrink-0 mr-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                            </div>
                            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                              <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Reply Input */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendReply}>
                      <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                          <textarea
                            ref={replyInputRef}
                            value={replyMessage}
                            onChange={handleTyping}
                            onKeyPress={handleKeyPress}
                            placeholder={`Reply to ${selectedChat.name || 'customer'}...`}
                            rows="1"
                            className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm transition-all"
                            style={{ maxHeight: '100px' }}
                          />
                          <button
                            type="button"
                            className="absolute right-2 bottom-2 p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <Smile className="h-5 w-5" />
                          </button>
                        </div>
                        <button 
                          type="submit" 
                          disabled={!replyMessage.trim()} 
                          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2 px-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <CornerDownLeft className="h-3 w-3" />
                            Press Enter to send
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                          <span className="text-[10px] text-gray-400">
                            {isConnected ? 'Connected' : 'Reconnecting...'}
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">Select a conversation</h3>
                    <p className="text-sm text-gray-500">Choose a customer from the sidebar to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;