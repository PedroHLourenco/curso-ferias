import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Conectado ao WebSocket');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const on = (eventName: string, callback: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(eventName, callback);
  };

  const off = (eventName: string) => {
    if (!socketRef.current) return;
    socketRef.current.off(eventName);
  };

  return { socket: socketRef.current, on, off };
};