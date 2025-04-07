import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Card, Row, Col } from "antd";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import AccountData from "./components/AccountData";
import AddAccount from "./components/AddAccount";
import Menu from "./components/Menu";

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("quickbooks_access_token")
  );
  const [realmId, setRealmId] = useState<string | null>(
    localStorage.getItem("quickbooks_realm_id")
  );

  return (
    <Router>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        <Card bordered style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <h1>QuickBooks OAuth Integration</h1>
            </Col>
            <Col>
              <Auth setToken={setToken} setRealmId={setRealmId} />
            </Col>
          </Row>

          {token && realmId ? (
            <Row>
              <Col span={6}>
                <Menu />
              </Col>
              <Col span={18}>
                <Routes>
                  <Route path="/account-data" element={<AccountData token={token} realmId={realmId} />} />
                  <Route path="/add-account" element={<AddAccount />} />
                  <Route path="/" element={<Dashboard token={token} realmId={realmId} />} />
                </Routes>
              </Col>
            </Row>
          ) : (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <p>Please connect to QuickBooks first!</p>
            </div>
          )}
        </Card>
      </div>
    </Router>
  );
};

export default App;
