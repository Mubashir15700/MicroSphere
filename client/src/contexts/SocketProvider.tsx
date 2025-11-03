import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initSocket } from '@/lib/socketClient';

interface SocketContextProps {
  socket: ReturnType<typeof initSocket> | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const SocketProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
  const [socket, setSocket] = useState<ReturnType<typeof initSocket> | null>(null);

  useEffect(() => {
    const s = initSocket(userId);
    s?.connect();
    setSocket(s);

    return () => {
      s?.disconnect();
    };
  }, [userId]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
