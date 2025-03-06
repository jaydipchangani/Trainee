import React, { useContext } from "react";
import { Layout, Button } from "antd";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const auth = useContext(AuthContext);
  const userId = localStorage.getItem("userId");

  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", color: "#fff", padding: "0 20px" }}>
      <h2 style={{ color: "#fff" }}>Company Name</h2>
      <div>
        <span style={{ marginRight: "20px" }}>User ID: {userId}</span>
        {getToken() && <Button type="primary" onClick={auth?.logout}>Logout</Button>}
      </div>
    </Header>
  );
};

export default AppHeader;
