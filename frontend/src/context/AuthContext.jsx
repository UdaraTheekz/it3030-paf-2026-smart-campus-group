import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            console.warn("Token expired, logging out");
            logout();
          } else {
            setUser(decoded.sub);
            // Standardize role to uppercase string if it exists
            const decodedRole = decoded.role ? String(decoded.role).toUpperCase() : null;
            setRole(decodedRole);
            localStorage.setItem('token', token);
          }
        } catch (error) {
          console.error("Malformed token, logging out", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (data) => {
    setToken(data.token);
    setUser(data.email);
    // Standardize role from API response as well
    const apiRole = data.role ? String(data.role).toUpperCase() : null;
    setRole(apiRole);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  const googleLogin = async (credential) => {
    try {
      const { data } = await axiosInstance.post('/auth/google-login', { credential });
      login(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
