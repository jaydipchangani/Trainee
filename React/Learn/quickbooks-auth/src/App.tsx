import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Card, Row, Col, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Account {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType: string;
  CurrentBalance?: number;
  BankBalance?: number;
}

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("quickbooks_access_token")
  );
  const [realmId, setRealmId] = useState<string | null>(
    localStorage.getItem("quickbooks_realm_id")
  );
  const [accounts, setAccounts] = useState<Account[]>([]);

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
      .get(`https://localhost:7254/api/quickbooks/accounts`, {
        params: { accessToken: token, realmId },
      })
      .then((response) => {
        setAccounts(response.data.QueryResponse.Account || []);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.response?.data || error);
      });
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setAccounts([]);
    window.location.reload();
  };

  const columns: ColumnsType<Account> = [
    { title: "Name", dataIndex: "Name", key: "name" },
    { title: "Account Type", dataIndex: "AccountType", key: "accountType" },
    { title: "Detail Type", dataIndex: "AccountSubType", key: "detailType" },
    {
      title: "QuickBooks Balance",
      dataIndex: "CurrentBalance",
      key: "quickBooksBalance",
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Bank Balance",
      dataIndex: "BankBalance",
      key: "bankBalance",
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Account) => (
        <Button type="primary" onClick={() => console.log("View", record.Id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <Card bordered style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1>QuickBooks OAuth Integration</h1>
          </Col>
          {token && (
            <Col>
              <Button onClick={logout} type="default" danger>
                Logout
              </Button>
            </Col>
          )}
        </Row>

        {token ? (
          <>
            <Space style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Button
                onClick={fetchAccounts}
                type="primary"
                style={{ marginRight: "10px" }}
              >
                Fetch QuickBooks Accounts
              </Button>
            </Space>
            <Table
              columns={columns}
              dataSource={accounts}
              rowKey="Id"
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
  );
};

export default App;
