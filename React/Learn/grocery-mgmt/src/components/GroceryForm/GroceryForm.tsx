import React from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, Space } from 'antd';
import { GroceryItem } from '../../types';
import dayjs from 'dayjs';

interface GroceryFormProps {
  initialValues?: GroceryItem;
  onFinish: (values: any) => void;
  onCancel: () => void;
  form: any;
}

const GroceryForm: React.FC<GroceryFormProps> = ({ 
  initialValues, 
  onFinish, 
  onCancel,
  form
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      name="groceryForm"
      initialValues={
        initialValues 
          ? { 
              ...initialValues, 
              expiryDate: initialValues.expiryDate ? dayjs(initialValues.expiryDate) : undefined 
            } 
          : undefined
      }
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the item name' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select>
          <Select.Option value="Fruits">Fruits</Select.Option>
          <Select.Option value="Vegetables">Vegetables</Select.Option>
          <Select.Option value="Dairy">Dairy</Select.Option>
          <Select.Option value="Meat">Meat</Select.Option>
          <Select.Option value="Bakery">Bakery</Select.Option>
          <Select.Option value="Grains">Grains</Select.Option>
          <Select.Option value="Beverages">Beverages</Select.Option>
          <Select.Option value="Snacks">Snacks</Select.Option>
          <Select.Option value="Frozen">Frozen</Select.Option>
          <Select.Option value="Canned">Canned</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>
      </Form.Item>
      
      <Space style={{ display: 'flex', width: '100%' }}>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the price' }]}
          style={{ flex: 1 }}
        >
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            addonBefore="$"
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please enter the quantity' }]}
          style={{ flex: 1 }}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Space>
      
      <Form.Item
        name="unit"
        label="Unit"
        rules={[{ required: true, message: 'Please select a unit' }]}
      >
        <Select>
          <Select.Option value="kg">Kilogram (kg)</Select.Option>
          <Select.Option value="g">Gram (g)</Select.Option>
          <Select.Option value="lb">Pound (lb)</Select.Option>
          <Select.Option value="oz">Ounce (oz)</Select.Option>
          <Select.Option value="liter">Liter (l)</Select.Option>
          <Select.Option value="ml">Milliliter (ml)</Select.Option>
          <Select.Option value="pcs">Pieces (pcs)</Select.Option>
          <Select.Option value="pack">Pack</Select.Option>
          <Select.Option value="box">Box</Select.Option>
          <Select.Option value="can">Can</Select.Option>
          <Select.Option value="bottle">Bottle</Select.Option>
          <Select.Option value="loaf">Loaf</Select.Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="expiryDate"
        label="Expiry Date"
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues ? 'Update' : 'Add'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default GroceryForm;