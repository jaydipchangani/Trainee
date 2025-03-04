import React, { useState } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Space, Popconfirm, message, 
  Typography
} from 'antd';
import { 
  PlusCircle, Edit, Trash2, Search, 
  Package, DollarSign, ShoppingCart, Calendar 
} from 'lucide-react';
import dayjs from 'dayjs';
import { useGrocery } from '../../context/GroceryContext';
import { GroceryItem } from '../../types';
import GroceryTable from '../../components/GroceryTable/GroceryTable';
import GroceryForm from '../../components/GroceryForm/GroceryForm';
import StatCard from '../../components/StatCard/StatCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Dashboard.module.scss';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { 
    groceryItems, 
    addGroceryItem, 
    updateGroceryItem, 
    deleteGroceryItem 
  } = useGrocery();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  
  // Filter items based on search text
  const filteredItems = groceryItems.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  );
  
  // Calculate statistics
  const totalItems = groceryItems.length;
  const totalValue = groceryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = groceryItems.reduce((sum, item) => sum + item.quantity, 0);
  const expiringItems = groceryItems.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;
  
  const showModal = (item?: GroceryItem) => {
    setEditingItem(item || null);
    
    if (item) {
      form.setFieldsValue({
        ...item,
        expiryDate: item.expiryDate ? dayjs(item.expiryDate) : undefined
      });
    } else {
      form.resetFields();
    }
    
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const formattedValues = {
          ...values,
          expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : undefined
        };
        
        if (editingItem) {
          updateGroceryItem({ ...formattedValues, id: editingItem.id });
          message.success('Item updated successfully');
        } else {
          addGroceryItem(formattedValues);
          message.success('Item added successfully');
        }
        
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  const handleEdit = (item: GroceryItem) => {
    showModal(item);
  };
  
  const handleDelete = (id: string) => {
    deleteGroceryItem(id);
    message.success('Item deleted successfully');
  };
  
  const handleSearch = (value: string) => {
    setSearchText(value);
  };
  
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <Title level={2}>Grocery Inventory Dashboard</Title>
        <Button 
          type="primary" 
          icon={<PlusCircle size={16} />} 
          onClick={() => showModal()}
        >
          Add New Item
        </Button>
      </div>
      
      <div className={styles.statsContainer}>
        <StatCard 
          title="Total Items" 
          value={totalItems} 
          icon={<Package />} 
        />
        
        <StatCard 
          title="Total Value" 
          value={`$${totalValue.toFixed(2)}`} 
          icon={<DollarSign />} 
        />
        
        <StatCard 
          title="Total Quantity" 
          value={totalQuantity} 
          icon={<ShoppingCart />} 
        />
        
        <StatCard 
          title="Expiring Soon" 
          value={expiringItems} 
          icon={<Calendar />} 
        />
      </div>
      
      <div className={styles.searchContainer}>
        <SearchBar
          placeholder="Search by name or category"
          onSearch={handleSearch}
          onChange={handleSearch}
        />
      </div>
      
      <div className={styles.tableContainer}>
        <GroceryTable 
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      
      <Modal
        title={editingItem ? 'Edit Grocery Item' : 'Add New Grocery Item'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <GroceryForm
          initialValues={editingItem || undefined}
          onFinish={handleSubmit}
          onCancel={handleCancel}
          form={form}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;