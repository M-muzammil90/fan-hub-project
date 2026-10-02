import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/auth.api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fanhub_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('fanhub_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync token & verify user session on mount
  useEffect(() => {
    let isMounted = true;
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('fanhub_token');
      if (!storedToken) {
        if (isMounted) {
          setCurrentUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.success && isMounted) {
          const userObj = {
            id: res.user.id || res.user._id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            avatar: res.user.avatar || '',
            favoriteCategories: res.user.favoriteCategories || []
          };
          setCurrentUser(userObj);
          localStorage.setItem('fanhub_user', JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('fanhub_token', res.token);
        const userObj = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          avatar: res.user.avatar || '',
          favoriteCategories: res.user.favoriteCategories || []
        };
        localStorage.setItem('fanhub_user', JSON.stringify(userObj));
        setToken(res.token);
        setCurrentUser(userObj);
        return { success: true, user: userObj };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to authenticate with server' };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success) {
        if (res.token && res.user) {
          localStorage.setItem('fanhub_token', res.token);
          const userObj = {
            id: res.user.id || res.user._id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            avatar: res.user.avatar || ''
          };
          localStorage.setItem('fanhub_user', JSON.stringify(userObj));
          setToken(res.token);
          setCurrentUser(userObj);
          return { success: true, user: userObj };
        }
        return await login(email, password);
      }
      return { success: false, error: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fanhub_token');
    localStorage.removeItem('fanhub_user');
    setToken(null);
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('fanhub_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isLoading,
        isAuthenticated: !!currentUser && !!token,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
