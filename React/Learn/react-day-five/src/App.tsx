import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/products",
    element: <ProtectedRoute><Products /></ProtectedRoute>,
  },
  {
    path: "/users",
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
