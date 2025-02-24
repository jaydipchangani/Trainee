import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import UpdateProduct from "./pages/UpdateProduct";
import DeleteProduct from "./pages/DeleteProduct";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/products",
    element: <ProtectedRoute><Products /></ProtectedRoute>,
  },
  {
    path: "/products/update/:id",
    element: <ProtectedRoute><UpdateProduct /></ProtectedRoute>,
  },
  {
    path: "/products/delete/:id",
    element: <ProtectedRoute><DeleteProduct /></ProtectedRoute>,
  },
  {
    path: "/users",
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  },
  {
    path: "/products/add",
    element: <ProtectedRoute><AddProduct /></ProtectedRoute>,
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
