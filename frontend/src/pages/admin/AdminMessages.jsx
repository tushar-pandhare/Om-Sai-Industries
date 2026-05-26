// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { useSocket } from '../../context/SocketContext';
// import { 
//   Mail, Send, MessageSquare, CheckCircle, ArrowLeft,
//   Clock, AlertCircle, CheckCheck, Users, UserCheck, 
//   UserX, Loader2, Search, Plus, Filter, MoreVertical,
//   Phone, Mail as MailIcon, Calendar, Smile, Paperclip,
//   CornerDownLeft, Wifi, WifiOff, Maximize2, Minimize2,
//   ChevronLeft, Dot
// } from 'lucide-react';
// import { fetchAllMessages, deleteMessage, markAsRead } from '../../features/messages/messageSlice';
// import { messageAPI } from '../../services/api';
// import toast from 'react-hot-toast';

// const AdminMessages = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { socket, isConnected } = useSocket();
//   const { userInfo } = useSelector((state) => state.auth);
//   const { messages = [], loading = false } = useSelector((state) => state.messages || {});
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [replyMessage, setReplyMessage] = useState('');
//   const [activeChats, setActiveChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [loadingChat, setLoadingChat] = useState(false);
//   const [typingStatus, setTypingStatus] = useState({});
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);
  
//   const messagesEndRef = useRef(null);
//   const replyInputRef = useRef(null);
//   const containerRef = useRef(null);

//   const fetchActiveChats = useCallback(async () => {
//     try {
//       const { data } = await messageAPI.getConversations();
//       const activeCustomerChats = data.filter(chat => 
//         chat.user?.role === 'user' && chat.lastMessage
//       );
//       setActiveChats(activeCustomerChats);
//     } catch (error) {
//       console.error('Error fetching active chats:', error);
//       setActiveChats([]);
//     }
//   }, []);

//   const fetchChatMessages = useCallback(async (userId) => {
//     setLoadingChat(true);
//     try {
//       const { data } = await messageAPI.getMessages(userId);
//       setChatMessages(Array.isArray(data) ? data : []);
//       scrollToBottom();
      
//       const unreadMessages = (Array.isArray(data) ? data : []).filter(m => !m.isRead && m.to?._id === userInfo?._id);
//       if (unreadMessages.length > 0) {
//         const messageIds = unreadMessages.map(m => m._id);
//         await messageAPI.markAsRead(messageIds);
//         socket?.emit('mark_read', { messageIds });
//         setChatMessages(prev => prev.map(m => 
//           messageIds.includes(m._id) ? { ...m, isRead: true } : m
//         ));
//       }
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       setChatMessages([]);
//     } finally {
//       setLoadingChat(false);
//     }
//   }, [userInfo, socket]);

//   const scrollToBottom = () => {
//     setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
//   };

//   const handleSelectChat = useCallback(async (chat) => {
//     if (!chat || !chat.user) return;
//     setSelectedChat(chat.user);
//     await fetchChatMessages(chat.user._id);
//     if (window.innerWidth < 768) setIsSidebarOpen(false);
//   }, [fetchChatMessages]);

//   const handleSendReply = async (e) => {
//     e.preventDefault();
//     if (!replyMessage.trim() || !selectedChat || !socket) return;

//     const tempId = Date.now();
//     const newMessage = {
//       _id: tempId,
//       from: { _id: userInfo._id, name: userInfo.name, role: userInfo.role },
//       to: { _id: selectedChat._id },
//       message: replyMessage.trim(),
//       messageType: 'text',
//       createdAt: new Date(),
//       isRead: false
//     };
    
//     setChatMessages(prev => [...prev, newMessage]);
//     setReplyMessage('');
//     scrollToBottom();

//     socket.emit('send_message', {
//       toUserId: selectedChat._id,
//       message: replyMessage.trim(),
//       type: 'text'
//     });
//   };

//   const handleTyping = (e) => {
//     setReplyMessage(e.target.value);
//     if (e.target.value.length > 0 && socket && selectedChat) {
//       socket.emit('typing', { toUserId: selectedChat._id, isTyping: true });
//       setTimeout(() => {
//         if (socket && selectedChat) {
//           socket.emit('typing', { toUserId: selectedChat._id, isTyping: false });
//         }
//       }, 1000);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendReply(e);
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!isFullscreen) {
//       containerRef.current?.requestFullscreen?.().catch(() => {});
//     } else {
//       document.exitFullscreen?.().catch(() => {});
//     }
//     setIsFullscreen(prev => !prev);
//   };

//   useEffect(() => {
//     const handleFsChange = () => {
//       if (!document.fullscreenElement) setIsFullscreen(false);
//     };
//     document.addEventListener('fullscreenchange', handleFsChange);
//     return () => document.removeEventListener('fullscreenchange', handleFsChange);
//   }, []);

//   useEffect(() => {
//     dispatch(fetchAllMessages());
//     fetchActiveChats();
//   }, [dispatch, fetchActiveChats]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleReceiveMessage = (newMessage) => {
//       if (selectedChat?._id === newMessage.from._id) {
//         setChatMessages(prev => [...prev, newMessage]);
//         scrollToBottom();
//         if (!newMessage.isRead && socket) {
//           socket.emit('mark_read', { messageIds: [newMessage._id] });
//           setChatMessages(prev => prev.map(m => 
//             m._id === newMessage._id ? { ...m, isRead: true } : m
//           ));
//         }
//       }
//       fetchActiveChats();
//       dispatch(fetchAllMessages());
//       if (selectedChat?._id !== newMessage.from._id) {
//         toast.success(`New message from ${newMessage.from.name}`);
//       }
//     };

//     const handleUserTyping = (data) => {
//       if (selectedChat?._id === data.from) {
//         setTypingStatus(prev => ({ ...prev, [data.from]: data.isTyping }));
//         setTimeout(() => {
//           setTypingStatus(prev => ({ ...prev, [data.from]: false }));
//         }, 1500);
//       }
//     };

//     const handleMessagesRead = (data) => {
//       setChatMessages(prev => prev.map(m => 
//         data.messageIds.includes(m._id) ? { ...m, isRead: true } : m
//       ));
//       fetchActiveChats();
//     };

//     const handleActiveUsers = (users) => {
//       setOnlineUsers(Array.isArray(users) ? users : []);
//     };

//     socket.on('receive_message', handleReceiveMessage);
//     socket.on('user_typing', handleUserTyping);
//     socket.on('messages_read', handleMessagesRead);
//     socket.on('active_users', handleActiveUsers);

//     return () => {
//       socket.off('receive_message', handleReceiveMessage);
//       socket.off('user_typing', handleUserTyping);
//       socket.off('messages_read', handleMessagesRead);
//       socket.off('active_users', handleActiveUsers);
//     };
//   }, [socket, selectedChat, fetchActiveChats, dispatch]);

//   const formatTime = (date) => {
//     if (!date) return '';
//     const now = new Date();
//     const msgDate = new Date(date);
//     const diffHours = Math.abs(now - msgDate) / 36e5;
//     if (diffHours < 24) return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
//   };

//   const formatMessageDate = (date, prevDate) => {
//     if (!date) return null;
//     const current = new Date(date).toDateString();
//     const prev = prevDate ? new Date(prevDate).toDateString() : null;
//     if (current !== prev) {
//       const today = new Date().toDateString();
//       const yesterday = new Date(Date.now() - 864e5).toDateString();
//       if (current === today) return 'Today';
//       if (current === yesterday) return 'Yesterday';
//       return new Date(date).toLocaleDateString([], { month: 'long', day: 'numeric' });
//     }
//     return null;
//   };

//   const isUserOnline = (userId) => Array.isArray(onlineUsers) && onlineUsers.some(u => u.userId === userId);

//   const filteredChats = activeChats.filter(chat =>
//     chat.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     chat.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const stats = {
//     total: activeChats.length,
//     unread: activeChats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0),
//     online: onlineUsers.filter(u => u.userRole === 'user').length
//   };

//   if (loading && !activeChats.length) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
//           <p className="text-zinc-400 text-sm tracking-widest uppercase">Loading</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`flex flex-col bg-[#0f1117] text-white ${isFullscreen ? 'fixed inset-0 z-[9999]' : 'min-h-screen'}`}
//       ref={containerRef}
//       style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
//     >
//       {/* Top bar — hidden in fullscreen */}
//       {!isFullscreen && (
//         <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate('/admin')}
//               className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Admin
//             </button>
//             <span className="text-zinc-700">/</span>
//             <span className="text-zinc-200 font-medium text-sm">Support</span>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Stat pills */}
//             <div className="hidden sm:flex items-center gap-2">
//               <StatPill label="Chats" value={stats.total} color="violet" />
//               <StatPill label="Unread" value={stats.unread} color="amber" />
//               <StatPill label="Online" value={stats.online} color="emerald" />
//             </div>

//             {/* Connection */}
//             <div className="flex items-center gap-1.5">
//               <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
//               <span className="text-xs text-zinc-500">{isConnected ? 'Live' : 'Reconnecting'}</span>
//             </div>

//             {/* Fullscreen toggle */}
//             <button
//               onClick={toggleFullscreen}
//               className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
//               title="Enter fullscreen"
//             >
//               <Maximize2 className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main content — fills remaining space */}
//       <div className={`flex flex-1 overflow-hidden ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-65px)]'}`}>

//         {/* Sidebar */}
//         <aside
//           className={`
//             flex-shrink-0 flex flex-col border-r border-white/5 bg-[#13151f]
//             transition-all duration-300 ease-in-out
//             ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}
//           `}
//         >
//           {/* Sidebar header */}
//           <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm font-semibold text-zinc-200 tracking-wide">Conversations</span>
//               {isFullscreen && (
//                 <button
//                   onClick={toggleFullscreen}
//                   className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
//                   title="Exit fullscreen"
//                 >
//                   <Minimize2 className="h-3.5 w-3.5" />
//                 </button>
//               )}
//             </div>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
//               <input
//                 type="text"
//                 placeholder="Search…"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
//               />
//             </div>
//           </div>

//           {/* Chat list */}
//           <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
//             {filteredChats.length === 0 ? (
//               <div className="p-8 text-center">
//                 <MessageSquare className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
//                 <p className="text-sm text-zinc-600">No conversations yet</p>
//               </div>
//             ) : (
//               filteredChats.map((chat) => {
//                 const isSelected = selectedChat?._id === chat.user?._id;
//                 const online = isUserOnline(chat.user?._id);
//                 return (
//                   <button
//                     key={chat.user?._id}
//                     onClick={() => handleSelectChat(chat)}
//                     className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/[0.04] ${isSelected ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : ''}`}
//                   >
//                     <div className="relative flex-shrink-0">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-bold">
//                         {chat.user?.name?.charAt(0).toUpperCase() || '?'}
//                       </div>
//                       {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#13151f]" />}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-zinc-200 truncate">{chat.user?.name || 'Unknown'}</span>
//                         <span className="text-[10px] text-zinc-600 flex-shrink-0 ml-1">{formatTime(chat.lastMessageTime)}</span>
//                       </div>
//                       <p className="text-xs text-zinc-600 truncate mt-0.5">{chat.lastMessage?.substring(0, 45) || '—'}</p>
//                     </div>
//                     {chat.unreadCount > 0 && (
//                       <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] flex items-center justify-center font-bold">
//                         {chat.unreadCount}
//                       </span>
//                     )}
//                   </button>
//                 );
//               })
//             )}
//           </div>
//         </aside>

//         {/* Chat area */}
//         <div className="flex-1 flex flex-col min-w-0">
//           {selectedChat ? (
//             <>
//               {/* Chat header */}
//               <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#13151f]">
//                 <div className="flex items-center gap-3">
//                   {!isSidebarOpen && (
//                     <button
//                       onClick={() => setIsSidebarOpen(true)}
//                       className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </button>
//                   )}
//                   <div className="relative">
//                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-bold">
//                       {selectedChat.name?.charAt(0).toUpperCase()}
//                     </div>
//                     {isUserOnline(selectedChat._id) && (
//                       <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#13151f]" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-zinc-100">{selectedChat.name}</p>
//                     <p className="text-xs text-zinc-600 flex items-center gap-1">
//                       {isUserOnline(selectedChat._id)
//                         ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online</>
//                         : <><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" /> Offline</>
//                       }
//                       {selectedChat.email && <><span className="mx-1 text-zinc-700">·</span>{selectedChat.email}</>}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${isConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
//                     {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
//                     {isConnected ? 'Live' : 'Reconnecting'}
//                   </div>
//                   {!isFullscreen ? (
//                     <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors" title="Fullscreen">
//                       <Maximize2 className="h-4 w-4" />
//                     </button>
//                   ) : (
//                     <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors" title="Exit fullscreen">
//                       <Minimize2 className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-[#0f1117]">
//                 {loadingChat ? (
//                   <div className="flex justify-center pt-20">
//                     <Loader2 className="h-7 w-7 animate-spin text-violet-400" />
//                   </div>
//                 ) : chatMessages.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full gap-3">
//                     <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
//                       <MessageSquare className="h-8 w-8 text-violet-400" />
//                     </div>
//                     <p className="text-zinc-500 text-sm">No messages yet — say hello!</p>
//                   </div>
//                 ) : (
//                   <div className="max-w-3xl mx-auto space-y-1">
//                     {chatMessages.map((msg, idx) => {
//                       const dateHeader = formatMessageDate(msg.createdAt, chatMessages[idx - 1]?.createdAt);
//                       const isMine = msg.from?._id === userInfo?._id;
//                       return (
//                         <React.Fragment key={msg._id || idx}>
//                           {dateHeader && (
//                             <div className="flex justify-center py-4">
//                               <span className="px-3 py-1 bg-white/5 rounded-full text-[11px] text-zinc-500">{dateHeader}</span>
//                             </div>
//                           )}
//                           <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
//                             {!isMine && (
//                               <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold mb-1">
//                                 {selectedChat.name?.charAt(0).toUpperCase()}
//                               </div>
//                             )}
//                             <div className={`max-w-[68%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
//                               isMine
//                                 ? 'bg-violet-600 text-white rounded-br-sm'
//                                 : 'bg-[#1e2130] text-zinc-200 rounded-bl-sm'
//                             }`}>
//                               <p className="break-words">{msg.message}</p>
//                               <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${isMine ? 'text-violet-300' : 'text-zinc-600'}`}>
//                                 <span>{formatTime(msg.createdAt)}</span>
//                                 {isMine && <CheckCheck className={`h-3 w-3 ${msg.isRead ? 'text-emerald-400' : 'text-violet-400'}`} />}
//                               </div>
//                             </div>
//                           </div>
//                         </React.Fragment>
//                       );
//                     })}

//                     {typingStatus[selectedChat._id] && (
//                       <div className="flex items-end gap-2 justify-start">
//                         <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold">
//                           {selectedChat.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="bg-[#1e2130] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
//                           {[0, 150, 300].map(d => (
//                             <span key={d} className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                   </div>
//                 )}
//               </div>

//               {/* Input */}
//               <div className="flex-shrink-0 px-5 py-4 border-t border-white/5 bg-[#13151f]">
//                 <form onSubmit={handleSendReply}>
//                   <div className="flex items-end gap-3 max-w-3xl mx-auto">
//                     <textarea
//                       ref={replyInputRef}
//                       value={replyMessage}
//                       onChange={handleTyping}
//                       onKeyPress={handleKeyPress}
//                       placeholder={`Reply to ${selectedChat.name}…`}
//                       rows={1}
//                       className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none transition-all"
//                       style={{ maxHeight: '120px' }}
//                     />
//                     <button
//                       type="submit"
//                       disabled={!replyMessage.trim()}
//                       className="w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
//                     >
//                       <Send className="h-4 w-4 text-white" />
//                     </button>
//                   </div>
//                   <p className="text-center text-[10px] text-zinc-700 mt-2">
//                     <CornerDownLeft className="h-3 w-3 inline mr-1" />Enter to send · Shift+Enter for new line
//                   </p>
//                 </form>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center gap-4">
//               <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center">
//                 <MessageSquare className="h-10 w-10 text-violet-400" />
//               </div>
//               <div className="text-center">
//                 <p className="text-zinc-300 font-medium">Select a conversation</p>
//                 <p className="text-zinc-600 text-sm mt-1">Choose a customer from the sidebar</p>
//               </div>
//               {!isSidebarOpen && (
//                 <button onClick={() => setIsSidebarOpen(true)} className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm text-white transition-colors">
//                   Show conversations
//                 </button>
//               )}
//               {isFullscreen && (
//                 <button onClick={toggleFullscreen} className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-zinc-400 transition-colors flex items-center gap-2">
//                   <Minimize2 className="h-4 w-4" /> Exit fullscreen
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatPill = ({ label, value, color }) => {
//   const colors = {
//     violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
//     amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
//     emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
//   };
//   return (
//     <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colors[color]}`}>
//       <span className="text-current opacity-60">{label}</span>
//       <span className="font-bold">{value}</span>
//     </div>
//   );
// };

// export default AdminMessages;
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import {
  Mail, Send, MessageSquare, CheckCheck, ArrowLeft, Clock,
  UserCheck, UserX, Loader2, Search, CornerDownLeft,
  Wifi, WifiOff, Maximize2, Minimize2, ChevronLeft, Users
} from 'lucide-react';
import { fetchAllMessages } from '../../features/messages/messageSlice';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  // FIX: track pending temp messages for reconciliation
  const pendingMap = useRef({});

  const fetchActiveChats = useCallback(async () => {
    try {
      const { data } = await messageAPI.getConversations();
      setActiveChats(data.filter(c => c.user?.role === 'user' && c.lastMessage));
    } catch { setActiveChats([]); }
  }, []);

  const fetchChatMessages = useCallback(async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await messageAPI.getMessages(userId);
      const msgs = Array.isArray(data) ? data : [];
      setChatMessages(msgs);
      scrollToBottom();
      const unread = msgs.filter(m => !m.isRead && m.to?._id === userInfo?._id);
      if (unread.length > 0) {
        const ids = unread.map(m => m._id);
        await messageAPI.markAsRead(ids);
        socket?.emit('mark_read', { messageIds: ids });
        setChatMessages(prev => prev.map(m => ids.includes(m._id) ? { ...m, isRead: true } : m));
      }
    } catch { setChatMessages([]); }
    finally { setLoadingChat(false); }
  }, [userInfo, socket]);

  const scrollToBottom = () => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

  const handleSelectChat = useCallback(async (chat) => {
    if (!chat?.user) return;
    setSelectedChat(chat.user);
    await fetchChatMessages(chat.user._id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [fetchChatMessages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedChat || !socket) return;

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _id: tempId,
      from: { _id: userInfo._id, name: userInfo.name, role: userInfo.role },
      to: { _id: selectedChat._id },
      message: replyMessage.trim(),
      messageType: 'text',
      createdAt: new Date(),
      isRead: false,
      _isPending: true
    };

    pendingMap.current[tempId] = true;
    setChatMessages(prev => [...prev, optimistic]);
    setReplyMessage('');
    scrollToBottom();

    socket.emit('send_message', {
      toUserId: selectedChat._id,
      message: optimistic.message,
      type: 'text'
    });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) containerRef.current?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
    setIsFullscreen(p => !p);
  };

  useEffect(() => {
    const h = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  useEffect(() => {
    dispatch(fetchAllMessages());
    fetchActiveChats();
  }, [dispatch, fetchActiveChats]);

  useEffect(() => {
    if (!socket) return;

    // FIX: message_sent → replace optimistic message with real saved one
    const handleSent = (savedMsg) => {
      setChatMessages(prev =>
        prev.map(m => pendingMap.current[m._id] ? { ...savedMsg } : m)
      );
      pendingMap.current = {};
      fetchActiveChats();
    };

    // FIX: receive_message → only add messages FROM the other party, never echo own sends
    const handleReceiveMessage = (msg) => {
      const fromId = msg.from?._id?.toString();
      const myId = userInfo?._id?.toString();

      // Ignore messages sent by myself (those are handled by message_sent)
      if (fromId === myId) return;

      if (selectedChat?._id === fromId || selectedChat?._id?.toString() === fromId) {
        setChatMessages(prev => {
          if (prev.some(m => m._id?.toString() === msg._id?.toString())) return prev;
          return [...prev, msg];
        });
        scrollToBottom();
        if (!msg.isRead && socket) {
          socket.emit('mark_read', { messageIds: [msg._id] });
          setChatMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
        }
      }

      fetchActiveChats();
      dispatch(fetchAllMessages());

      if (selectedChat?._id !== fromId) {
        toast.success(`📩 New message from ${msg.from?.name}`);
      }
    };

    const handleUserTyping = (data) => {
      if (selectedChat?._id === data.from || selectedChat?._id?.toString() === data.from) {
        setTypingStatus(prev => ({ ...prev, [data.from]: data.isTyping }));
        setTimeout(() => setTypingStatus(prev => ({ ...prev, [data.from]: false })), 1500);
      }
    };

    const handleMessagesRead = (data) => {
      setChatMessages(prev => prev.map(m => data.messageIds.includes(m._id) ? { ...m, isRead: true } : m));
      fetchActiveChats();
    };

    const handleActiveUsers = (users) => setOnlineUsers(Array.isArray(users) ? users : []);

    socket.on('message_sent', handleSent);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_read', handleMessagesRead);
    socket.on('active_users', handleActiveUsers);

    return () => {
      socket.off('message_sent', handleSent);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_read', handleMessagesRead);
      socket.off('active_users', handleActiveUsers);
    };
  }, [socket, selectedChat, fetchActiveChats, dispatch, userInfo]);

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return Math.abs(new Date() - d) / 36e5 < 24
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatMessageDate = (date, prevDate) => {
    if (!date) return null;
    const cur = new Date(date).toDateString();
    const prev = prevDate ? new Date(prevDate).toDateString() : null;
    if (cur === prev) return null;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    if (cur === today) return 'Today';
    if (cur === yesterday) return 'Yesterday';
    return new Date(date).toLocaleDateString([], { month: 'long', day: 'numeric' });
  };

  const isUserOnline = (userId) => Array.isArray(onlineUsers) && onlineUsers.some(u => u.userId === userId?.toString());

  const filteredChats = activeChats.filter(c =>
    c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: activeChats.length,
    unread: activeChats.reduce((s, c) => s + (c.unreadCount || 0), 0),
    online: onlineUsers.filter(u => u.userRole === 'user').length
  };

  if (loading && !activeChats.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-[#0f1117] text-white ${isFullscreen ? 'fixed inset-0 z-[9999]' : 'min-h-screen'}`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" /> Admin
            </button>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 font-medium text-sm">Support</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {[
                { label: 'Chats', value: stats.total, color: 'violet' },
                { label: 'Unread', value: stats.unread, color: 'amber' },
                { label: 'Online', value: stats.online, color: 'emerald' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium
                  ${color === 'violet' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    : color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  <span className="opacity-60">{label}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span className="text-xs text-zinc-500">{isConnected ? 'Live' : 'Reconnecting'}</span>
            </div>
            <button onClick={toggleFullscreen} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-65px)]'}`}>
        {/* Sidebar */}
        <aside className={`flex-shrink-0 flex flex-col border-r border-white/5 bg-[#13151f] transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
          <div className="px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-zinc-200">Conversations</span>
              {isFullscreen && (
                <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white">
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <input type="text" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-600">No conversations yet</p>
              </div>
            ) : filteredChats.map((chat) => {
              const isSelected = selectedChat?._id === chat.user?._id;
              const online = isUserOnline(chat.user?._id);
              return (
                <button key={chat.user?._id} onClick={() => handleSelectChat(chat)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/[0.04]
                    ${isSelected ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-bold">
                      {chat.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#13151f]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-200 truncate">{chat.user?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-zinc-600 ml-1">{formatTime(chat.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs text-zinc-600 truncate mt-0.5">{chat.lastMessage?.substring(0, 45) || '—'}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#13151f]">
                <div className="flex items-center gap-3">
                  {!isSidebarOpen && (
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-bold">
                      {selectedChat.name?.charAt(0).toUpperCase()}
                    </div>
                    {isUserOnline(selectedChat._id) && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#13151f]" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{selectedChat.name}</p>
                    <p className="text-xs text-zinc-600 flex items-center gap-1">
                      {isUserOnline(selectedChat._id)
                        ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online</>
                        : <><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" /> Offline</>
                      }
                      {selectedChat.email && <><span className="mx-1 text-zinc-700">·</span>{selectedChat.email}</>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${isConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {isConnected ? 'Live' : 'Reconnecting'}
                  </div>
                  <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-[#0f1117]">
                {loadingChat ? (
                  <div className="flex justify-center pt-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-violet-400" />
                    </div>
                    <p className="text-zinc-500 text-sm">No messages yet — say hello!</p>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-1">
                    {chatMessages.map((msg, idx) => {
                      const dateHeader = formatMessageDate(msg.createdAt, chatMessages[idx - 1]?.createdAt);
                      const isMine = msg.from?._id?.toString() === userInfo?._id?.toString();
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
                                {selectedChat.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`max-w-[68%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                              ${isMine ? 'bg-violet-600 text-white rounded-br-sm' : 'bg-[#1e2130] text-zinc-200 rounded-bl-sm'}
                              ${msg._isPending ? 'opacity-60' : 'opacity-100'}`}>
                              <p className="break-words">{msg.message}</p>
                              <div className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${isMine ? 'text-violet-300' : 'text-zinc-600'}`}>
                                <span>{formatTime(msg.createdAt)}</span>
                                {isMine && <CheckCheck className={`h-3 w-3 ${msg.isRead ? 'text-emerald-400' : 'text-violet-400'}`} />}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {typingStatus[selectedChat._id] && (
                      <div className="flex items-end gap-2 justify-start">
                        <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xs font-bold">
                          {selectedChat.name?.charAt(0).toUpperCase()}
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
                <form onSubmit={handleSendReply}>
                  <div className="flex items-end gap-3 max-w-3xl mx-auto">
                    <textarea
                      value={replyMessage}
                      onChange={e => setReplyMessage(e.target.value)}
                      onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(e); } }}
                      placeholder={`Reply to ${selectedChat.name}…`}
                      rows={1}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none"
                      style={{ maxHeight: '120px' }}
                    />
                    <button type="submit" disabled={!replyMessage.trim()}
                      className="w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0">
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-zinc-700 mt-2">
                    <CornerDownLeft className="h-3 w-3 inline mr-1" />Enter to send · Shift+Enter for new line
                  </p>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-violet-400" />
              </div>
              <div className="text-center">
                <p className="text-zinc-300 font-medium">Select a conversation</p>
                <p className="text-zinc-600 text-sm mt-1">Choose a customer from the sidebar</p>
              </div>
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm text-white transition-colors">
                  Show conversations
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
