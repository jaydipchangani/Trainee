import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

interface AddGroupDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newGroup: any) => void;
}

const AddGroupDrawer: React.FC<AddGroupDrawerProps> = ({ visible, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No token found in local storage');
        }

        console.log('Fetching currencies from API...');
        const currencyResponse = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/Configuration/GetCurrencyDropdown', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Currency API response:', currencyResponse);

        if (!currencyResponse.ok) {
          throw new Error('Failed to fetch currencies from API');
        }

        const currencyData = await currencyResponse.json();
        console.log('Currency API data:', currencyData);

        const fetchedCurrencies = currencyData.result[0].currencies.map((currency: any) => currency.code);
        console.log('Fetched currencies:', fetchedCurrencies);
        setCurrencies(fetchedCurrencies);

        console.log('Fetching companies from API...');
        const companyResponse = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/Company/GetCompanyDropdown?isHolding=b', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Company API response:', companyResponse);

        if (!companyResponse.ok) {
          throw new Error('Failed to fetch companies from API');
        }

        const companyData = await companyResponse.json();
        console.log('Company API data:', companyData);

        const fetchedCompanies = companyData.result.map((company: any) => company.name);
        console.log('Fetched companies:', fetchedCompanies);
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching data from API:', error);

        try {
          console.log('Fetching data from db.json as fallback...');
          const response = await fetch('db.json'); // Use this if db.json is in public folder
          console.log('Fallback response:', response);

          if (!response.ok) throw new Error('Failed to fetch dropdown data');
          const data = await response.json();
          console.log('Fallback data:', data);

          // Extracting `currencies` and `companies`
          setCurrencies(data.currencies || []);
          setCompanies(data.companies?.map((company: { name: string }) => company.companyName) || []);
        } catch (fallbackError) {
          console.error('Error fetching data from db.json:', fallbackError);
          message.error('Failed to load dropdown data');
        }
      }
    };

    fetchDropdownData();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
  
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in local storage");
      }
  
      const requestData = {
        groupId: 0,
        groupName: values.groupName,
        currencyCode: values.currency,
        currencyName: currencies.find((c) => c === values.currency) || "",
        financialYear: values.financialYear,
        groupMappedCompaniesReqModel: values.companies.map((company: string) => ({
          erpCompanyId: company,
          erpCompanyName: company,
          erpCompanyCurrencyCode: values.currency, // Adjust if necessary
        })),
      };
  
      const response = await fetch("https://sandboxgathernexusapi.azurewebsites.net/api/Group/AddOrUpdateGroup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save group");
      }
  
      message.success("Group added successfully!");
      onAdd(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error adding group:", error);
      message.error("Failed to add group. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <Drawer
      title="Add Group"
      width={400}
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="groupName"
          label="Group Name"
          rules={[{ required: true, message: 'Please enter group name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="currency"
          label="Currency"
          rules={[{ required: true, message: 'Please select a currency' }]}
        >
          <Select placeholder="Select Currency">
            {currencies.map((currency) => (
              <Option key={currency} value={currency}>
                {currency}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="financialYear"
          label="Choose FY Period"
          rules={[{ required: true, message: 'Please select a financial year period' }]}
        >
          <Select placeholder="Select FY Period">
            <Option value="Jan-Dec">Jan-Dec</Option>
            <Option value="Apr-Mar">Apr-Mar</Option>
            <Option value="Jul-Jun">Jul-Jun</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="companies"
          label="Companies"
          rules={[{ required: true, message: 'Please select companies' }]}
        >
          <Select mode="multiple" placeholder="Select Companies">
            {companies.map((company) => (
              <Option key={company} value={company}>
                {company}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleAdd} loading={loading}>
            Add Group
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddGroupDrawer;