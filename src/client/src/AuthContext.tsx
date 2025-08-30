import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      authAPI.getMe().then(response => {
        setUser(response.data);
      }).catch(() => {
        logout();
      });
    }
  }, []);

  const loginWithGoogle = async (googleToken: string) => {
    try {
      const response = await authAPI.googleAuth(googleToken);
      const { access_token } = response.data;
      
      setToken(access_token);
      localStorage.setItem('token', access_token);
      const userResponse = await authAPI.getMe();
      setUser(userResponse.data);
    } catch (error) {
      throw new Error('Google login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loginWithGoogle,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};