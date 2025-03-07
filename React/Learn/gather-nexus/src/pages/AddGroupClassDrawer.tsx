import React, { useState, useEffect } from "react";
import { Drawer, Button, Form, Input, Select, Checkbox, Space, message } from "antd";
import axios from "axios";
import { getToken } from "../utils/storage";

const { Option } = Select;

interface Company {
  id: number;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AddGroupDrawer: React.FC<Props> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchCurrencies();
      fetchCompanies();
    }
  }, [visible]);

  const fetchCurrencies = async () => {
    try {
      const token = getToken();
      const response = await axios.get("/api/Configuration/AddOrUpdateConfiguration", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.currencies)) {
        setCurrencies(response.data.currencies);
      } else {
        setCurrencies([]);
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      setCurrencies([]);
    }
    finally{
        console.log("Currencies:", currencies);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = getToken();
      const response = await axios.get("https://sandboxgathernexusapi.azurewebsites.net/api/Configuration/GetCurrencyDropdown", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.companies)) {
        setCompanies(response.data.companies);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setCompanies([]);
    }
    finally{
        console.log("Companies:", companies);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = getToken();
      await axios.post(
        "/api/Configuration/AddOrUpdateConfiguration",
        {
          groupName: values.groupName,
          currency: values.currency,
          fyPeriod: values.fyPeriod,
          companies: values.companies,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Group added successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to add group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Add New Group"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      width={500}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="groupName" label="Group Name" rules={[{ required: true, message: "Please enter group name" }]}>
          <Input placeholder="Enter group name" />
        </Form.Item>

        <Form.Item name="currency" label="Currency" rules={[{ required: true, message: "Please select a currency" }]}>
          <Select placeholder="Select currency">
            {currencies.length > 0 ? (
              currencies.map((currency) => (
                <Option key={currency} value={currency}>
                  {currency}
                </Option>
              ))
            ) : (
              <Option value="" disabled>
                No currencies available
              </Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item name="fyPeriod" label="Choose FY Period" rules={[{ required: true, message: "Please select FY period" }]}>
          <Select placeholder="Select financial year">
            <Option value="2023-2024">2023-2024</Option>
            <Option value="2024-2025">2024-2025</Option>
          </Select>
        </Form.Item>

        <Form.Item name="companies" label="Companies" rules={[{ required: true, message: "Please select at least one company" }]}>
          <Checkbox.Group>
            <Space direction="vertical">
              {companies.map((company) => (
                <Checkbox key={company.id} value={company.id}>
                  {company.name}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add Group
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddGroupDrawer;
