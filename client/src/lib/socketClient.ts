import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (typeof window === 'undefined') return null; // SSR guard

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });

    socket.on('connect', () => {
      console.log(`Socket connected: ${socket?.id}`);
      socket!.emit('register', userId); // join private room
    });

    socket.on('disconnect', () => console.log('Socket disconnected'));
    socket.on('connect_error', (err) => console.error('Socket error:', err));
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error('Socket not initialized');
  return socket;
};
