const LogoutButton = () => {
    const handleLogout = () => {
      window.location.href = "http://localhost:5000/Saml/Logout";
    };
  
    return <button onClick={handleLogout}>Logout</button>;
  };
  
  export default LogoutButton;
  