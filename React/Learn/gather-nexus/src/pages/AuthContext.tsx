import React, { createContext, useState } from 'react';

interface AuthContextType {
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
    // Perform logout logic here
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
};