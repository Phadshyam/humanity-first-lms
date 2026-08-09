import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Restore session on app mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined' && !storedToken.startsWith('demo_token_')) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.warn('[AuthContext] Session restore failed:', err.response?.data?.message || err.message);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data && res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        setLoading(false);
        navigate('/');
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Login failed. Please check your email and password.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (name, email, password, role = 'volunteer', preferredLanguage = 'EN') => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.post('/auth/register', { name, email, password, role, preferredLanguage });

      if (res.data && res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        setLoading(false);
        navigate('/');
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setError(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, setUser }}>
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
