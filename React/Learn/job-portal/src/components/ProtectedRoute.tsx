import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/"  />;
};

export default ProtectedRoute;
