import { Home, Settings, User, LogOut } from "react-feather";
import './App.css';
import HeaderGlobal from './components/HeaderGlobal';
import Sidebar from './components/SidebarGlobal';

function App() {


  return (
    <>
    <HeaderGlobal 
        title="Task Manager" 
        darkModeEnabled={true} 
        links={[
        { name: "Dashboard", href: "/dashboard" },
        { name: "Tasks", href: "/tasks" },
        { name: "Profile", href: "/profile" },
        { name: "Logout", href: "/logout" }
        ]}
        /> 

<Sidebar 
        links={[
          { name: "Home", href: "/", icon: <Home/> },
          { name: "Profile", href: "/profile", icon: <User/> },
          { name: "Settings", href: "/settings", icon: <Settings/> },
          { name: "Logout", href: "/logout", icon: <LogOut/> }
        ]}
      />

    
   

    </>
  )
}

export default App
