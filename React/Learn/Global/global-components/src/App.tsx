
import './App.css';
import HeaderGlobal from './components/HeaderGlobal';

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
    
   

    </>
  )
}

export default App
