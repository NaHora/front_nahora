import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { SocketProvider } from './socket';
import { LoadProvider } from './load';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <SocketProvider>
        <LoadProvider>
          <ToastProvider>{children}</ToastProvider>
        </LoadProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default AppProvider;
