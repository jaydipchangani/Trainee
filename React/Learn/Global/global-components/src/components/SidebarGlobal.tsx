import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { List, X, Moon, Sun } from "react-feather";


{/* <Sidebar 
        links={[
          { name: "Home", href: "/", icon: <Home/> },
          { name: "Profile", href: "/profile", icon: <User/> },
          { name: "Settings", href: "/settings", icon: <Settings/> },
          { name: "Logout", href: "/logout", icon: <LogOut/> }
        ]}
      /> */}

interface SidebarProps {
  links: { name: string; href: string; icon?: React.ReactNode }[];
  darkModeEnabled?: boolean;
  defaultExpanded?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  links, 
  darkModeEnabled = false, 
  defaultExpanded = true 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [darkMode, setDarkMode] = useState(darkModeEnabled);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
  };

  return (
    <div 
      className={`d-flex flex-column p-3 border-end shadow ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`} 
      style={{ width: expanded ? "250px" : "80px", height: "100vh", transition: "width 0.3s ease-in-out" }}>
      
      {/* Toggle Sidebar Button */}
      <Button variant={darkMode ? "light" : "dark"} className="mb-3" onClick={() => setExpanded(!expanded)}>
        {expanded ? <X /> : <List />}
      </Button>

      {/* Sidebar Navigation Links */}
      <Nav className="flex-column">
        {links.map((link, index) => (
          <Nav.Link key={index} href={link.href} className={`d-flex align-items-center ${darkMode ? "text-light" : "text-dark"}`}>
            {link.icon && <span className="me-2">{link.icon}</span>}
            {expanded && link.name}
          </Nav.Link>
        ))}
      </Nav>

      {/* Dark Mode Toggle Button */}
      <Button variant={darkMode ? "light" : "dark"} className="mt-auto" onClick={toggleDarkMode}>
        {darkMode ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
};

export default Sidebar;
