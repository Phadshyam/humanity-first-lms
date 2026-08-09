import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

// Helper: Parse base64 JWT payload safely without external dependencies
const parseJwtToken = (tokenStr) => {
  try {
    if (!tokenStr || typeof tokenStr !== 'string') return null;
    const base64Url = tokenStr.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const logoutTimerRef = useRef(null);
  const navigate = useNavigate();

  const logout = useCallback((expired = false) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('demoUser');
    setUser(null);
    setToken(null);
    setError(null);

    if (expired) {
      navigate('/login?sessionExpired=true');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Schedule auto logout timer based on token exp timestamp
  const scheduleAutoLogout = useCallback((tokenStr) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const decoded = parseJwtToken(tokenStr);
    if (!decoded || !decoded.exp) return;

    const timeoutMs = decoded.exp * 1000 - Date.now();

    if (timeoutMs <= 0) {
      logout(true);
    } else {
      logoutTimerRef.current = setTimeout(() => {
        logout(true);
      }, timeoutMs);
    }
  }, [logout]);

  // Listen for custom auth:session-expired event from Axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      logout(true);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [logout]);

  // Restore session & schedule 3-hour logout timer on app mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined' && !storedToken.startsWith('demo_token_')) {
        const decoded = parseJwtToken(storedToken);
        if (decoded && decoded.exp && decoded.exp * 1000 <= Date.now()) {
          logout(true);
          setLoading(false);
          return;
        }

        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
            setToken(storedToken);
            scheduleAutoLogout(storedToken);
          } else {
            logout(false);
          }
        } catch (err) {
          console.warn('[AuthContext] Session restore failed:', err.response?.data?.message || err.message);
          logout(err.response?.status === 401 || err.response?.data?.code === 'TOKEN_EXPIRED');
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [logout, scheduleAutoLogout]);

  // Login handler
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data && res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        scheduleAutoLogout(newToken);
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
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        scheduleAutoLogout(newToken);
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
