import React, { createContext, useContext, useMemo } from 'react';
import socketio from 'socket.io-client';
import { useAuth } from './auth';

interface SocketContextData {
  socket: any;
}

const SocketContext = createContext<SocketContextData>({} as SocketContextData);

export const SocketProvider: React.FC = ({ children }) => {
  const { user } = useAuth();

  const socket = useMemo(() => {
    if (user) {
      return socketio(process.env.REACT_APP_API as string, {
        query: {
          user_id: user.id,
        },
      });
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export function useSocket(): SocketContextData {
  const context = useContext(SocketContext);

  return context;
}
