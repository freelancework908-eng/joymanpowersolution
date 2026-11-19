import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, getAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const token = getAuthToken();
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data, error } = await apiRequest('/api/auth/me');
        if (mounted) {
          if (!error && data?.admin) {
            setUser({
              id: data.admin.id,
              email: data.admin.email,
              name: data.admin.name,
              role: 'admin',
            });
          } else {
            // Token expired or invalid
            setAuthToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        if (mounted) {
          setAuthToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      setAuthToken(data.token);
      setUser({
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.name,
        role: 'admin',
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login connection failed' };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
