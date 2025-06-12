import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Space, Tag, Input,message } from "antd";
import OAuthLogin from "./components/OAuthLogin";
import AccountTable from "./components/AccountTable";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

interface Account {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType: string;
  CurrentBalance?: number;
  BankBalance?: number;
  classification : string;
  quickBooksId:number

}

const App = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("quickbooks_access_token"));
  const [realmId, setRealmId] = useState<string | null>(localStorage.getItem("quickbooks_realm_id"));
  const [dataSource, setDataSource] = useState<"quickbooks" | "mongo" | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const fetchAccounts = () => {
    if (!token || !realmId) {
      message.error("Access Token or Realm ID is missing!");
      return;
    }
  
    const hide = message.loading("Fetching data from QuickBooks...", 0);
  
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
          classification: acc.Classification,
          quickBooksId: acc.QuickBooksId,
        }));
        setAccounts(mapped);
        setDataSource("quickbooks");
        hide();
        message.success("Data fetched successfully from QuickBooks!");
      })
      .catch((error) => {
        hide();
        message.error("Error fetching data from QuickBooks.");
        console.error("Error fetching accounts:", error.response?.data || error);
      });
  };
  

  const fetchFromMongoDB = () => {
    const hide = message.loading("Fetching data from MongoDB...", 0);
  
    axios
      .get("https://localhost:7254/api/quickbooks/accounts/mongo")
      .then((response) => {
        const mongoData = response.data || [];
        const mappedData: Account[] = mongoData.map((item: any) => ({
          Id: item._id?.$oid || item.id || item.quickBooksId || Math.random().toString(36).substr(2, 9),
          Name: item.name || item.Name || "N/A",
          AccountType: item.accountType || item.AccountType || "N/A",
          AccountSubType: item.accountSubType || item.AccountSubType || "N/A",
          CurrentBalance: item.CurrentBalance ?? 0,
          BankBalance: item.BankBalance ?? 0,
          classification: item.classification || "N/A",
          quickBooksId: item.quickBooksId || 0,
        }));
        setAccounts(mappedData);
        setDataSource("mongo");
        hide();
        message.success("Data fetched successfully from MongoDB!");
      })
      .catch((error) => {
        hide();
        message.error("Error fetching data from MongoDB.");
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

            

            <Input.Search
              placeholder="Search by Name"
              allowClear
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginTop:15, marginLeft: 15 }}
            />

            <AccountTable accounts={accounts.filter(account => account.Name.toLowerCase().includes(searchText.toLowerCase()))} />
          </>
        ) : (
          <OAuthLogin setToken={setToken} setRealmId={setRealmId} />
        )}
      </Card>
    </div>
  );
};

export default App;
