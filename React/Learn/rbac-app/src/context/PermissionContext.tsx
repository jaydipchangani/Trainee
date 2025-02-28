import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const PermissionContext = createContext<string[]>([]);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const permissions = authContext?.user?.permissions || [];

  return <PermissionContext.Provider value={permissions}>{children}</PermissionContext.Provider>;
};
