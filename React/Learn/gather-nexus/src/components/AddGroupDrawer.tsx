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
        const response = await fetch('db.json'); // Use this if db.json is in public folder
 // Use this if db.json is in public folder
        if (!response.ok) throw new Error('Failed to fetch dropdown data');
        const data = await response.json();

        // Extracting `currencies` and `companies`
        setCurrencies(data.currencies || []);
        setCompanies(data.companies?.map((company: { name: string }) => company.companyName) || []);
      } catch (error) {
        message.error('Failed to load dropdown data');
      }
    };

    fetchDropdownData();
  }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      onAdd(values);
      form.resetFields();
    } catch (error) {
      message.error('Please fill in all required fields');
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
