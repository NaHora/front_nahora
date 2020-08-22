import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { SocketProvider } from './socket';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>{children}</ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default AppProvider;
