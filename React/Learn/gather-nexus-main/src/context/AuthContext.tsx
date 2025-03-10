import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, removeToken } from "../utils/storage";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const navigate = useNavigate();

  const login = (token: string, userId: string) => {
    setToken(token, userId);
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
