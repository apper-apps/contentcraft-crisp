import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const savedUser = localStorage.getItem('contentcraft_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      localStorage.removeItem('contentcraft_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem('contentcraft_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('contentcraft_user');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};