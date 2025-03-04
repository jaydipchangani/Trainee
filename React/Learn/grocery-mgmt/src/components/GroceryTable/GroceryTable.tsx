import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { Edit, Trash2 } from 'lucide-react';
import { GroceryItem } from '../../types';
import styles from './GroceryTable.module.scss';

interface GroceryTableProps {
  items: GroceryItem[];
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
}

const GroceryTable: React.FC<GroceryTableProps> = ({ items, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: GroceryItem, b: GroceryItem) => a.name.localeCompare(b.name)
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(items.map(item => item.category))).map(category => ({
        text: category,
        value: category
      })),
      onFilter: (value: string, record: GroceryItem) => record.category === value
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: GroceryItem, b: GroceryItem) => a.price - b.price
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (text: string, record: GroceryItem) => `${record.quantity} ${record.unit}`,
      sorter: (a: GroceryItem, b: GroceryItem) => a.quantity - b.quantity
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date?: string) => date || 'N/A',
      sorter: (a: GroceryItem, b: GroceryItem) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: GroceryItem) => (
        <div className={styles.actionColumn}>
          <Button 
            type="primary" 
            icon={<Edit size={16} />} 
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete this item?"
            description="Are you sure you want to delete this item?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<Trash2 size={16} />} 
            />
          </Popconfirm>
        </div>
      )
    }
  ];
  
  return (
    <Table 
      dataSource={items} 
      columns={columns} 
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default GroceryTable;