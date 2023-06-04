import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { GameInfoProvider } from './gameInfo';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <GameInfoProvider>
        {children}
      </GameInfoProvider>
    </ToastProvider>
  </AuthProvider>
);
