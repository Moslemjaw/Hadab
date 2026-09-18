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

// Cookie helpers for persistent PWA & iOS Safari state sharing
const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('hadab_token') || getCookie('hadab_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check both localStorage and cookies (crucial for iOS Safari PWA standalone isolation)
      let storedToken = localStorage.getItem('hadab_token') || getCookie('hadab_token');

      if (storedToken) {
        // Sync to both storages
        localStorage.setItem('hadab_token', storedToken);
        setCookie('hadab_token', storedToken);

        // Instantly recover user profile from token payload without waiting for network
        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              // Token actually expired
              localStorage.removeItem('hadab_token');
              localStorage.removeItem('hadab_is_admin');
              removeCookie('hadab_token');
              removeCookie('hadab_is_admin');
              setToken(null);
              setUser(null);
              setIsLoading(false);
              return;
            }

            const isSuper = payload.email?.toLowerCase() === 'byhadab@gmail.com';
            const userRole = isSuper || payload.role === 'admin' ? 'admin' : 'customer';

            if (userRole === 'admin') {
              localStorage.setItem('hadab_is_admin', 'true');
              setCookie('hadab_is_admin', 'true');
            }

            setUser({
              id: payload.id,
              name: payload.name || (isSuper ? 'HADAB Admin' : 'Customer'),
              email: payload.email,
              role: userRole,
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
            if (profile.role === 'admin' || profile.email?.toLowerCase() === 'byhadab@gmail.com') {
              localStorage.setItem('hadab_is_admin', 'true');
              setCookie('hadab_is_admin', 'true');
            }
          }
        } catch (err: any) {
          const msg = err?.message || '';
          // Only clear token if the backend explicitly rejected credentials
          if (msg.includes('401') || msg.includes('403') || msg.includes('expired') || msg.includes('Invalid')) {
            localStorage.removeItem('hadab_token');
            localStorage.removeItem('hadab_is_admin');
            removeCookie('hadab_token');
            removeCookie('hadab_is_admin');
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
    
    // Save to localStorage, sessionStorage, and persistent Cookie
    localStorage.setItem('hadab_token', data.token);
    setCookie('hadab_token', data.token, 365);
    setToken(data.token);
    setUser(data.user);

    if (data.user.role === 'admin' || email.toLowerCase() === 'byhadab@gmail.com') {
      localStorage.setItem('hadab_is_admin', 'true');
      setCookie('hadab_is_admin', 'true', 365);
    }

    return data.user;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<UserProfile> => {
    const data = await api.register({ name, email, password, phone });
    localStorage.setItem('hadab_token', data.token);
    setCookie('hadab_token', data.token, 365);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('hadab_token');
    localStorage.removeItem('hadab_is_admin');
    removeCookie('hadab_token');
    removeCookie('hadab_is_admin');
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
