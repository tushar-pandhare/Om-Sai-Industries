import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import { 
  Send, MessageSquare, CheckCheck, Clock,
  Headphones, Shield, Award, Globe,
  Minimize2, Maximize2,
  Users, Wifi, WifiOff, CornerDownLeft
} from 'lucide-react';
import { fetchContactInfo } from '../../features/contact/contactSlice';
import toast from 'react-hot-toast';
import { messageAPI } from '../../services/api';

const ContactUs = () => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();
  const { contactInfo, loading: contactLoading } = useSelector((state) => state.contact);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => { dispatch(fetchContactInfo()); }, [dispatch]);

  useEffect(() => {
    if (!socket) return;
    const h = (users) => setOnlineUsers(Array.isArray(users) ? users : []);
    socket.on('active_users', h);
    return () => socket.off('active_users', h);
  }, [socket]);

  useEffect(() => {
    if (userInfo && !isInitialized) { setIsInitialized(true); initializeChat(); }
  }, [userInfo]);

  const initializeChat = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const { data: conversations } = await messageAPI.getConversations();
      if (conversations?.length > 0) {
        const conv = conversations[0];
        setConversation({ user: conv.user, lastMessage: conv.lastMessage, lastMessageTime: conv.lastMessageTime, unreadCount: conv.unreadCount });
        if (Array.isArray(conv.messages)) {
          setMessages(conv.messages);
          const unread = conv.messages.filter(m => !m.isRead && m.to?._id === userInfo._id);
          if (unread.length > 0 && socket) {
            const ids = unread.map(m => m._id);
            socket.emit('mark_read', { messageIds: ids });
            setMessages(prev => prev.map(m => ids.includes(m._id) ? { ...m, isRead: true } : m));
          }
        }
      } else {
        const { data: admins } = await messageAPI.getUsers();
        if (!admins?.length) { toast.error('No support staff available.'); return; }
        let admin = admins[0];
        if (onlineUsers.length > 0) {
          const online = admins.find(a => onlineUsers.some(o => o.userId === a._id));
          if (online) admin = online;
        }
        setConversation({ user: admin, lastMessage: null, lastMessageTime: null, unreadCount: 0 });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to support.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      setMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
      setTimeout(scrollToBottom, 100);
      if (!msg.isRead && socket) {
        socket.emit('mark_read', { messageIds: [msg._id] });
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      }
      toast.success(`Support: ${msg.message.substring(0, 40)}…`);
    };
    const handleTyping = (data) => {
      if (data.from !== userInfo?._id) {
        setAdminTyping(data.isTyping);
        setTimeout(() => setAdminTyping(false), 1500);
      }
    };
    const handleRead = (data) => {
      setMessages(prev => prev.map(m => data.messageIds.includes(m._id) ? { ...m, isRead: true } : m));
    };

    socket.on('receive_message', handleReceive);
    socket.on('user_typing', handleTyping);
    socket.on('messages_read', handleRead);
    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('user_typing', handleTyping);
      socket.off('messages_read', handleRead);
    };
  }, [socket, userInfo]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!socket?.connected) { toast.error('Connection issue. Please refresh.'); return; }
    if (!conversation?.user) { toast.error('No support staff available'); return; }

    const tempId = Date.now();
    setMessages(prev => [...prev, {
      _id: tempId,
      from: { _id: userInfo._id, name: userInfo.name, role: userInfo.role },
      to: { _id: conversation.user._id },
      message: message.trim(),
      messageType: 'text',
      createdAt: new Date(),
      isRead: false
    }]);
    setMessage('');
    scrollToBottom();
    socket.emit('send_message', { message: message.trim(), type: 'text' });
  };

  const handleTypingInput = (e) => {
    setMessage(e.target.value);
    if (!typing && e.target.value.length > 0 && socket && conversation?.user) {
      setTyping(true);
      socket.emit('typing', { toUserId: conversation.user._id, isTyping: true });
      setTimeout(() => {
        if (socket && conversation?.user) {
          socket.emit('typing', { toUserId: conversation.user._id, isTyping: false });
          setTyping(false);
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      chatRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsFullscreen(prev => !prev);
  };

  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const formatTime = (date) => {
    if (!date) return '';
    const msgDate = new Date(date);
    const diffH = Math.abs(new Date() - msgDate) / 36e5;
    return diffH < 24
      ? msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatMessageDate = (date, prevDate) => {
    if (!date) return null;
    const cur = new Date(date).toDateString();
    const prev = prevDate ? new Date(prevDate).toDateString() : null;
    if (cur !== prev) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 864e5).toDateString();
      if (cur === today) return 'Today';
      if (cur === yesterday) return 'Yesterday';
      return new Date(date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return null;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // your contact form submission
      toast.success('Message sent!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contactLoading && !contactInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (userInfo) {
    const adminAgents = onlineUsers.filter(u => u.userRole === 'admin').length;

    return (
      <div
        className="min-h-screen bg-[#0f1117] text-white"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Hero */}
        {!isFullscreen && (
          <div className="relative bg-[#13151f] border-b border-white/5 pt-16 pb-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Headphones className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs text-violet-300 font-medium tracking-wide">24 / 7 Premium Support</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Live <span className="text-violet-400">Chat</span> Support
              </h1>
              <p className="text-zinc-500 max-w-lg mx-auto">
                Real-time help from our team — usually replies within minutes.
              </p>
            </div>
          </div>
        )}

        {/* Chat card */}
        <div className={`${isFullscreen ? '' : 'container mx-auto px-4 -mt-14 pb-16 relative z-10'}`}>
          <div className={`${isFullscreen ? '' : 'max-w-3xl mx-auto'}`}>
            <div
              ref={chatRef}
              className={`bg-[#13151f] border border-white/8 overflow-hidden flex flex-col
                ${isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : 'rounded-2xl shadow-2xl'}
              `}
              style={isFullscreen ? {} : {}}
            >
              {/* Chat header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-[#13151f] ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-100">Customer Support</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isConnected ? (
                        <>
                          <Wifi className="h-3 w-3 text-emerald-400" />
                          <span className="text-xs text-zinc-500">Online · Usually replies in minutes</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3 w-3 text-zinc-600" />
                          <span className="text-xs text-zinc-600">Connecting…</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
                    <Users className="h-3 w-3 text-violet-400" />
                    <span className="text-xs text-violet-300">{adminAgents} agent{adminAgents !== 1 ? 's' : ''}</span>
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-5 py-4 bg-[#0f1117]"
                style={isFullscreen ? {} : { height: '480px' }}
              >
                {loading ? (
                  <div className="flex justify-center pt-20">
                    <div className="w-8 h-8 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                    <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                      <MessageSquare className="h-10 w-10 text-violet-400" />
                    </div>
                    <p className="text-zinc-300 font-medium">Start a conversation</p>
                    <p className="text-zinc-600 text-sm text-center max-w-xs">
                      Send a message — our support team typically replies within minutes.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto space-y-1">
                    {messages.map((msg, idx) => {
                      const dateHeader = formatMessageDate(msg.createdAt, messages[idx - 1]?.createdAt);
                      const isMine = msg.from?._id === userInfo._id;
                      return (
                        <React.Fragment key={msg._id || idx}>
                          {dateHeader && (
                            <div className="flex justify-center py-4">
                              <span className="px-3 py-1 bg-white/5 rounded-full text-[11px] text-zinc-500">{dateHeader}</span>
                            </div>
                          )}
                          <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            {!isMine && (
                              <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold mb-1">
                                S
                              </div>
                            )}
                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMine
                                ? 'bg-violet-600 text-white rounded-br-sm'
                                : 'bg-[#1e2130] text-zinc-200 rounded-bl-sm'
                            }`}>
                              <p className="break-words">{msg.message}</p>
                              <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${isMine ? 'text-violet-300' : 'text-zinc-600'}`}>
                                <Clock className="h-2.5 w-2.5" />
                                <span>{formatTime(msg.createdAt)}</span>
                                {isMine && <CheckCheck className={`h-3 w-3 ${msg.isRead ? 'text-emerald-400' : 'text-violet-400'}`} />}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}

                    {adminTyping && (
                      <div className="flex items-end gap-2 justify-start">
                        <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold">
                          S
                        </div>
                        <div className="bg-[#1e2130] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                          {[0, 150, 300].map(d => (
                            <span key={d} className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-white/5 bg-[#13151f]">
                <form onSubmit={handleSendMessage}>
                  <div className="flex items-end gap-3 max-w-2xl mx-auto">
                    <textarea
                      ref={inputRef}
                      value={message}
                      onChange={handleTypingInput}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message…"
                      rows={1}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none transition-all"
                      style={{ maxHeight: '120px' }}
                      disabled={!conversation?.user}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || !conversation?.user}
                      className="w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-zinc-700 mt-2">
                    <CornerDownLeft className="h-3 w-3 inline mr-1" />Enter to send · Shift+Enter for new line
                  </p>
                </form>
              </div>
            </div>

            {/* Feature pills — hidden in fullscreen */}
            {!isFullscreen && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {[
                  { icon: Headphones, title: '24/7 Support', desc: 'Always available' },
                  { icon: Shield, title: 'Secure', desc: 'End-to-end encrypted' },
                  { icon: Award, title: 'Expert Team', desc: 'Trained professionals' },
                  { icon: Globe, title: 'Multi-language', desc: 'In your language' }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#13151f] border border-white/5 rounded-xl p-3 hover:border-violet-500/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-300">{f.title}</p>
                      <p className="text-[10px] text-zinc-600">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Non-logged-in contact form
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center py-20 px-4"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-lg">
        <div className="bg-[#13151f] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-8 border-b border-white/5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Get in Touch</h2>
            <p className="text-sm text-zinc-500 mt-1">We'll get back within 24 hours</p>
          </div>

          <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Full Name *</label>
                <input
                  type="text" name="name" required value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Email *</label>
                <input
                  type="email" name="email" required value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Phone (optional)</label>
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                placeholder="+91 1234567890"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Message *</label>
              <textarea
                name="message" required rows={4} value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
                placeholder="Describe your inquiry…"
              />
            </div>
            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Sending…</span></>
                : <><Send className="h-4 w-4" /><span>Send Message</span></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;