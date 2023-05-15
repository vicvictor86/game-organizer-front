/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext, useCallback, useContext, useState,
} from 'react';

import { api } from '../services/api';

interface UserSettings {
  id: string;
  userId: string;
  lastDatabaseSelectedId?: string;
  statusName: string;
}

export interface UserProps {
  id: string;
  username: string;
  notionUserConnections: object[];
}

interface AuthState {
  token: string;
  user: UserProps;
  userSettings: UserSettings;
}

interface signInCredentials {
  username: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: UserProps;
  userSettings: UserSettings;
  signIn(credentials: signInCredentials): Promise<boolean>;
  signOut(): void;
  signUp(credentials: SignUpCredentials): Promise<boolean>;
  getUserUpdate(): Promise<void>;
  updateUserSettings(statusName: string): Promise<void>;
}

interface AuthProviderData {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC<AuthProviderData> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Game-Organizer:jwt-token');
    const user = localStorage.getItem('@Game-Organizer:user');
    const userSettings = localStorage.getItem('@Game-Organizer:user-settings');

    if (token && user && userSettings) {
      return { token, user: JSON.parse(user), userSettings: JSON.parse(userSettings) };
    }

    return {} as AuthState;
  });

  const getUserUpdate = useCallback(async (): Promise<void> => {
    const response = await api.get('users/', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
      },
    });

    if (response.status === 200) {
      const { user } = response.data;

      localStorage.setItem('@Game-Organizer:user', JSON.stringify(user));
      setData({ ...data, user });
    }
  }, [data]);

  const signIn = useCallback(
    async ({ username, password }: signInCredentials): Promise<boolean> => {
      const response = await api.post('login', {
        username,
        password,
      });

      if (response.status === 401) {
        return false;
      }

      const { token, user, userSettings } = response.data;

      api.defaults.headers.authorization = `Bearer ${token}`;

      localStorage.setItem('@Game-Organizer:jwt-token', token);
      localStorage.setItem('@Game-Organizer:user', JSON.stringify(user));
      localStorage.setItem('@Game-Organizer:user-settings', JSON.stringify(userSettings));

      setData({ token, user, userSettings });

      return true;
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@Game-Organizer:jwt-token');
    localStorage.removeItem('@Game-Organizer:user');
    localStorage.removeItem('@Game-Organizer:user-settings');

    setData({} as AuthState);
  }, []);

  const signUp = useCallback(
    async ({ password, username }: SignUpCredentials): Promise<boolean> => {
      const response = await api.post('users/', {
        username,
        password,
      });

      if (response.status === 400) {
        return false;
      }

      const signInSuccessful = await signIn({ username, password });

      return signInSuccessful;
    },
    [signIn],
  );

  const updateUserSettings = useCallback(async (statusName: string): Promise<void> => {
    const response = await api.put('users/settings', {
      statusName,

      headers: {
        authorization: `Bearer ${localStorage.getItem(
          '@Game-Organizer:jwt-token',
        )}`,
      },
    });

    if (response.status === 200) {
      const userSettings = response.data;

      localStorage.setItem('@Game-Organizer:user-settings', JSON.stringify(userSettings));
      setData({ ...data, userSettings });
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        userSettings: data.userSettings,
        updateUserSettings,
        signIn,
        signOut,
        signUp,
        getUserUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an context');
  }

  return context;
}
