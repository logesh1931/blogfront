import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

// Normalize user so we always have both .id and ._id
function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id:  user.id  || user._id,
    _id: user._id || user.id,
  };
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('inkwell_token');
    const saved  = localStorage.getItem('inkwell_user');
    if (token && saved) {
      try { setUser(normalizeUser(JSON.parse(saved))); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const u = normalizeUser(data.user);
    localStorage.setItem('inkwell_token', data.token);
    localStorage.setItem('inkwell_user',  JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    const u = normalizeUser(data.user);
    localStorage.setItem('inkwell_token', data.token);
    localStorage.setItem('inkwell_user',  JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('inkwell_token');
    localStorage.removeItem('inkwell_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const next = normalizeUser({ ...prev, ...updates });
      localStorage.setItem('inkwell_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
