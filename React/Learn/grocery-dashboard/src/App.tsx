import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import { ThemeProvider } from "./context/ThemeContext"; // Import Theme Context
import "./styles/global.scss";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
