import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import Permissions from "./pages/Permissions";
import { isAuthenticated } from "./utils/authHelper";

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Layout><Dashboard /></Layout>} />} />
        <Route path="/users" element={<PrivateRoute element={<Layout><Users /></Layout>} />} />
        <Route path="/employees" element={<PrivateRoute element={<Layout><Employees /></Layout>} />} />
        <Route path="/projects" element={<PrivateRoute element={<Layout><Projects /></Layout>} />} />
        <Route path="/permissions" element={<PrivateRoute element={<Layout><Permissions /></Layout>} />} />
      </Routes>
    </Router>
  );
};

export default App;
