import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute"; // Protect Routes
import MultiEntityDisplay from "../pages/MultiEntityDisplay";
import MapGroup from "../pages/MapGroup";



const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/multi" element={<PrivateRoute><MultiEntityDisplay /></PrivateRoute>} />
     <Route path="/ " element={<MapGroup title="tony US" />} /> 
      <Route path="*" element={<h1>404 Not Found</h1>} />
  

    </Routes>
  );
};

export default AppRoutes;
