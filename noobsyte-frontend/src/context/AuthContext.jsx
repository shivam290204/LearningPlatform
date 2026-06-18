import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ns_jwt_token'));
  const [loading, setLoading] = useState(true);

  // Endpoint configuration
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/api/v1/auth/me`);
        setUser(response.data.data.user);
      } catch (error) {
        console.error('Session validation failed. Clearing tokens.');
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });
      const { token: userToken, data } = response.data;
      const userData = data.user;
      
      localStorage.setItem('ns_jwt_token', userToken);
      setToken(userToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login credentials invalid'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register`, { name, email, password });
      const { token: userToken, data } = response.data;
      const userData = data.user;

      localStorage.setItem('ns_jwt_token', userToken);
      setToken(userToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ns_jwt_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
