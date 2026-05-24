import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo?.token) {
      if (socket) {
        console.log('Disconnecting socket - no user token');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    console.log('🔌 Connecting to socket at:', SOCKET_URL);
    console.log('👤 User:', userInfo.name);
    
    const newSocket = io(SOCKET_URL, {
      auth: { token: userInfo.token },
      transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully! ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('connection_status', (data) => {
      console.log('📡 Connection status:', data);
    });

    // Keep connection alive with ping
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 30000);

    setSocket(newSocket);

    return () => {
      clearInterval(pingInterval);
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userInfo?.token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};