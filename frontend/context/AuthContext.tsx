

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

export type UserRole = 'Admin' | 'Staff' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  department: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ecotwin_token');

    if (storedToken) {
      setToken(storedToken);
      // Rehydrate user from backend using the stored JWT
      api
        .get('/auth/me')
        .then((res) => {
          if (res.data && res.data.user) {
            const u = res.data.user;
            const hydratedUser: User = {
              id: u._id || u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              organization: u.organization,
              department: u.department,
            };
            setUser(hydratedUser);
            localStorage.setItem('ecotwin_user', JSON.stringify(hydratedUser));
          } else {
            localStorage.removeItem('ecotwin_token');
            localStorage.removeItem('ecotwin_user');
            setToken(null);
          }
        })
        .catch(() => {
          const storedUser = localStorage.getItem('ecotwin_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('ecotwin_token');
            setToken(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        const u = res.data.user;
        const loggedInUser: User = {
          id: u._id || u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          organization: u.organization,
          department: u.department,
        };
        setToken(res.data.token);
        setUser(loggedInUser);
        localStorage.setItem('ecotwin_token', res.data.token);
        localStorage.setItem('ecotwin_user', JSON.stringify(loggedInUser));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (e) {
      setLoading(false);
      return false;
    }
  };

  // NEW: real registration — actually creates a user in the database,
  // then logs them in with the real password they typed.
  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', payload);

      if (res.data && res.data.success !== false) {
        // If the backend returns a token directly on register, use it.
        if (res.data.token && res.data.user) {
          const u = res.data.user;
          const registeredUser: User = {
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            organization: u.organization,
            department: u.department,
          };
          setToken(res.data.token);
          setUser(registeredUser);
          localStorage.setItem('ecotwin_token', res.data.token);
          localStorage.setItem('ecotwin_user', JSON.stringify(registeredUser));
          setLoading(false);
          return { success: true };
        }

        // Otherwise, fall back to a real login call with the actual typed password.
        const loggedIn = await login(payload.email, payload.password);
        return { success: loggedIn, message: loggedIn ? undefined : 'Account created, but login failed. Please sign in manually.' };
      }

      setLoading(false);
      return { success: false, message: res.data?.message || 'Registration failed.' };
    } catch (e: any) {
      setLoading(false);
      return {
        success: false,
        message: e.response?.data?.message || 'Registration failed. Email may already be in use.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecotwin_token');
    localStorage.removeItem('ecotwin_user');
  };

  // NOTE: the old switchRole() function was removed. It only changed the
  // role shown in the UI on the client, with no backend involvement -
  // a fake control that didn't reflect a real permission change.
  // Actual role changes now happen through the real
  // PUT /api/admin/users/:id/role endpoint (Admin panel).

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};