/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import { api } from '../services/api';

export interface UserProps {
  id: string;
  username: string;
  notionUserConnections: object[];
}

interface AuthState {
  token: string;
  user: UserProps;
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
  signIn(credentials: signInCredentials): Promise<boolean>;
  signOut(): void;
  signUp(credentials: SignUpCredentials): Promise<boolean>;
  getUserUpdate(userId: string): Promise<void>;
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

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const getUserUpdate = useCallback(async (userId: string): Promise<void> => {
    const response = await api.get(`users/${userId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
      },
    });

    if (response.status === 200) {
      const { user } = response.data;

      localStorage.setItem('@Game-Organizer:user', JSON.stringify(user));
      setData({ ...data, user });
    } else {
      alert(response.statusText);
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

      const { token, user } = response.data;

      api.defaults.headers.authorization = `Bearer ${token}`;

      localStorage.setItem('@Game-Organizer:jwt-token', token);
      localStorage.setItem('@Game-Organizer:user', JSON.stringify(user));

      setData({ token, user });

      return true;
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@Game-Organizer:jwt-token');
    localStorage.removeItem('@Game-Organizer:user');

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

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
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
