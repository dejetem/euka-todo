"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, setToken, removeToken } from '@/utils/token';
import axiosInstance from "@/infrastructure/http/axios";
import { AxiosResponse } from "axios";
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with the token check
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // This runs only once during component initialization
    if (typeof window !== 'undefined') {
      const token = getToken();
      return !!token;
    }
    return false;
  });

//   useEffect(() => {
//     const token = getToken();
//     console.log(token, "hhh")
//     console.log(isAuthenticated, "prohh")
//     setIsAuthenticated(!!token);
//   }, []);
useEffect(() => {
    const validateToken = () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    window.location.href = "/auth"; 
  };

   // Set up Axios interceptor
   useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: { response: { data: { message: string; }; }; }) => {
        if (error.response?.data?.message === "Invalid token") {
          toast.error(error.response?.data?.message)
          console.error("Invalid token detected:", error.response.data.message);
          logout(); // Call the logout function
        }
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the provider unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);