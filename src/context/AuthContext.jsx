import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (error) {
        console.error('User hydration failed:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminAuth'); // Clean up old system
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    setUser(data);
    return data;
  };

  const updateAddresses = async (addresses) => {
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/auth/addresses`, { addresses }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedUser = { ...user, addresses: data };
    setUser(updatedUser);
    return data;
  };

  const setAuthToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setAuthToken, updateProfile, updateAddresses }}>
      {children}
    </AuthContext.Provider>
  );
};
