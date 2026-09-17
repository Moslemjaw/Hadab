import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  status?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<UserProfile>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hadab_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hadab_token');
      if (storedToken) {
        // Instantly recover user profile from token payload without waiting for network
        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              // Token actually expired
              localStorage.removeItem('hadab_token');
              setToken(null);
              setUser(null);
              setIsLoading(false);
              return;
            }
            const isSuper = payload.email?.toLowerCase() === 'byhadab@gmail.com';
            setUser({
              id: payload.id,
              name: payload.name || (isSuper ? 'HADAB Admin' : 'Customer'),
              email: payload.email,
              role: isSuper || payload.role === 'admin' ? 'admin' : 'customer',
            });
          }
        } catch (e) {
          console.warn('[Auth] Token decode error:', e);
        }

        // Verify with server in background
        try {
          const profile = await api.getMe();
          if (profile) {
            setUser(profile);
          }
        } catch (err: any) {
          const msg = err?.message || '';
          // Only clear token if the backend explicitly rejected credentials
          if (msg.includes('401') || msg.includes('403') || msg.includes('expired') || msg.includes('Invalid')) {
            localStorage.removeItem('hadab_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const data = await api.login({ email, password });
    localStorage.setItem('hadab_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<UserProfile> => {
    const data = await api.register({ name, email, password, phone });
    localStorage.setItem('hadab_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('hadab_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === 'byhadab@gmail.com';

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
