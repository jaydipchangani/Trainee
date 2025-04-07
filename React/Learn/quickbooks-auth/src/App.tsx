<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Card, Row, Col, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Account {
  id: string;
  name: string;
  accountType: string;
  accountSubType: string;
  fullyQualifiedName: string;
  classification: string;
  quickBooksId: string;
  currentBalance?: number;
  bankBalance?: number;
}
=======
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Card, Row, Col } from "antd";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import AccountData from "./components/AccountData";
import AddAccount from "./components/AddAccount";
import Menu from "./components/Menu";
>>>>>>> b0b99b40050afc4278297d78f99683eb81d7c477


const App = () => {

  const [mongoAccounts, setMongoAccounts] = useState([]);

  const fetchMongoData = () => {
    axios
      .get("https://localhost:7254/api/quickbooks/accounts/mongo")
      .then((response) => {
        setMongoAccounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching MongoDB data:", error.response?.data || error);
      });
  };

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("quickbooks_access_token")
  );
  const [realmId, setRealmId] = useState<string | null>(
    localStorage.getItem("quickbooks_realm_id")
  );
<<<<<<< HEAD
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dataSource, setDataSource] = useState<"quickbooks" | "mongo" | null>(null);

  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const authCode = getQueryParam("code");
    const realmIdFromUrl = getQueryParam("realmId");

    if (realmIdFromUrl) setRealmId(realmIdFromUrl);

    if (authCode) {
      axios
        .get(`https://localhost:7254/api/auth/callback?code=${authCode}`)
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;
          if (access_token && refresh_token && expires_in) {
            localStorage.setItem("quickbooks_access_token", access_token);
            localStorage.setItem("quickbooks_refresh_token", refresh_token);
            localStorage.setItem(
              "quickbooks_token_expiry",
              (Date.now() + expires_in * 1000).toString()
            );
            localStorage.setItem("quickbooks_realm_id", realmIdFromUrl || "");
            setToken(access_token);
          }
        })
        .catch((error) => console.error("Error fetching token:", error));
    }
  }, []);

  const fetchAccounts = () => {
    if (!token || !realmId) {
      console.error("Access Token or Realm ID is missing!");
      return;
    }

    axios
      .get("https://localhost:7254/api/quickbooks/accounts", {
        params: { accessToken: token, realmId },
      })
      .then((response) => {
        const accounts = response.data?.QueryResponse?.Account ?? [];
        setAccounts(accounts);
        setDataSource("quickbooks");
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.response?.data || error);
      });
  };

  const fetchFromMongoDB = () => {
  axios
    .get("https://localhost:7254/api/quickbooks/accounts/mongo")
    .then((response) => {
      const mongoData = response.data || [];

      const mappedData: Account[] = mongoData.map((item: any) => ({
        Id: item._id?.$oid || "", // fallback to empty string if missing
        Name: item.Name,
        AccountType: item.AccountType,
        AccountSubType: item.AccountSubType,
        CurrentBalance: 0, // or undefined if you want to hide
        BankBalance: 0,     // optional
      }));

      setAccounts(mappedData);
      setDataSource("mongo");
    })
    .catch((error) => {
      console.error("Error fetching accounts from MongoDB:", error.response?.data || error);
    });
};

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setAccounts([]);
    setDataSource(null);
    window.location.reload();
  };


  const columns: ColumnsType<Account> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Account Type", dataIndex: "accountType", key: "accountType" },
    { title: "Detail Type", dataIndex: "accountSubType", key: "accountSubType" },
    { title: "Classification", dataIndex: "classification", key: "classification" },
    { title: "QuickBooks ID", dataIndex: "quickBooksId", key: "quickBooksId" },
    {
      title: "QuickBooks Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Bank Balance",
      dataIndex: "bankBalance",
      key: "bankBalance",
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Account) => (
        <Button type="primary" onClick={() => console.log("View", record.id)}>
          View
        </Button>
      ),
    },
  ];
  
  
=======

>>>>>>> b0b99b40050afc4278297d78f99683eb81d7c477
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

<<<<<<< HEAD
        {token ? (
          <>
            <Space style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Button
                onClick={fetchAccounts}
                type="primary"
              >
                Fetch from QuickBooks
              </Button>
              <Button
                onClick={fetchFromMongoDB}
                type="dashed"
              >
                Fetch from MongoDB
              </Button>
            </Space>

            {dataSource && (
              <p>
                <Tag color={dataSource === "quickbooks" ? "green" : "blue"}>
                  Showing data from: {dataSource === "quickbooks" ? "QuickBooks API" : "MongoDB"}
                </Tag>
              </p>
            )}

<Table
  columns={columns}
  dataSource={accounts}
  rowKey="id"
  pagination={{ pageSize: 5 }}
/>

          </>
        ) : (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href="https://localhost:7254/api/auth/login">
              <Button type="primary" size="large">
                Connect to QuickBooks
              </Button>
            </a>
          </div>
        )}
      </Card>
    </div>
=======
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
>>>>>>> b0b99b40050afc4278297d78f99683eb81d7c477
  );
};

export default App;
