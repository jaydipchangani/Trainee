import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Input,
} from "antd";
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("quickbooks_access_token")
  );
  const [realmId, setRealmId] = useState<string | null>(
    localStorage.getItem("quickbooks_realm_id")
  );
  const [dataSource, setDataSource] = useState<"quickbooks" | "mongo" | null>(null);
  const [searchText, setSearchText] = useState<string>("");

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
        const fetched = response.data?.QueryResponse?.Account ?? [];
        const mapped: Account[] = fetched.map((acc: any) => ({
          Id: acc.Id,
          Name: acc.Name,
          AccountType: acc.AccountType,
          AccountSubType: acc.AccountSubType,
          CurrentBalance: acc.CurrentBalance,
          BankBalance: acc.BankBalance,
        }));
        setAccounts(mapped);
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
          Id:
            item._id?.$oid ||
            item.id ||
            item.quickBooksId ||
            Math.random().toString(36).substr(2, 9),
          Name: item.name || item.Name || "N/A",
          AccountType: item.accountType || item.AccountType || "N/A",
          AccountSubType: item.accountSubType || item.AccountSubType || "N/A",
          CurrentBalance: item.CurrentBalance ?? 0,
          BankBalance: item.BankBalance ?? 0,
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
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.Name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Account Type",
      dataIndex: "AccountType",
      key: "AccountType",
      sorter: (a, b) => a.AccountType.localeCompare(b.AccountType),
    },
    {
      title: "Detail Type",
      dataIndex: "AccountSubType",
      key: "AccountSubType",
      sorter: (a, b) => a.AccountSubType.localeCompare(b.AccountSubType),
    },
    {
      title: "QuickBooks Balance",
      dataIndex: "CurrentBalance",
      key: "CurrentBalance",
      sorter: (a, b) => (a.CurrentBalance ?? 0) - (b.CurrentBalance ?? 0),
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Bank Balance",
      dataIndex: "BankBalance",
      key: "BankBalance",
      sorter: (a, b) => (a.BankBalance ?? 0) - (b.BankBalance ?? 0),
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Account) => (
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
              <Button onClick={fetchAccounts} type="primary">
                Fetch from QuickBooks
              </Button>
              <Button onClick={fetchFromMongoDB} type="dashed">
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

            <Input.Search
              placeholder="Search by Name"
              allowClear
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <Table
              columns={columns}
              dataSource={accounts}
              rowKey={(record) => record.Id || Math.random().toString(36).substr(2, 9)}
              pagination={{ pageSize: 10 }}
            />
          </>
        ) : (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href="https://localhost:7254/api/auth/login">
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Button 
        type="primary" 
        size="large" 
        style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
      >
        Connect to QuickBooks
      </Button>
    </div>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default App;
