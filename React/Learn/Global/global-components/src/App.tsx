import React from "react";
import Sidebar from "./components/SidebarGlobal";
import HeaderGlobal from "./components/HeaderGlobal";
import { ThemeProvider } from "./components/ThemeContext"; // Import ThemeProvider
import { Home, Settings, User, LogOut } from "react-feather";
import LoginForm from "./components/LoginForm";

const App: React.FC = () => {
  return (

    <>
    <ThemeProvider> {/* Wrap entire app inside ThemeProvider */}
      <div className="d-flex">
        {/* Sidebar Component */}
        <Sidebar 
          links={[
            { name: "Home", href: "/", icon: <Home /> },
            { name: "Profile", href: "/profile", icon: <User /> },
            { name: "Settings", href: "/settings", icon: <Settings /> },
            { name: "Logout", href: "/logout", icon: <LogOut /> }
          ]}
        />

        <div className="flex-grow-1">
          {/* Header Component */}
          <HeaderGlobal 
            title="Task Manager" 
            links={[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Tasks", href: "/tasks" },
              { name: "Profile", href: "/profile" },
              { name: "Logout", href: "/logout" }
            ]}
          />

          {/* Main Content */}
          <div className="p-4">
          <LoginForm 
  title="Admin Login" 
  buttonText="Sign In" 
  forgotPasswordLink="/admin-reset-password"
  onSubmit={(data) => console.log("Admin Login:", data)}
/>


          </div>
        </div>
      </div>
    </ThemeProvider>




</>
  );
};

export default App;
