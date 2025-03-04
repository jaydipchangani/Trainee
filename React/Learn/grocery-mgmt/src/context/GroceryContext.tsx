import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GroceryItem } from '../types';

interface GroceryContextType {
  groceryItems: GroceryItem[];
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;  //id is removed from GroceryItem
  updateGroceryItem: (item: GroceryItem) => void;
  deleteGroceryItem: (id: string) => void;
  getGroceryItem: (id: string) => GroceryItem | undefined;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

const initialGroceryItems: GroceryItem[] = [
  {
    id: uuidv4(),
    name: 'Apples',
    category: 'Fruits',
    price: 2.99,
    quantity: 5,
    unit: 'kg',
    expiryDate: '2024-12-31'
  },
  {
    id: uuidv4(),
    name: 'Milk',
    category: 'Dairy',
    price: 1.99,
    quantity: 2,
    unit: 'liter',
    expiryDate: '2024-11-15'
  },
  {
    id: uuidv4(),
    name: 'Bread',
    category: 'Bakery',
    price: 3.49,
    quantity: 1,
    unit: 'loaf',
    expiryDate: '2025-03-05'
  },
  {
    id: uuidv4(),
    name: 'Chicken',
    category: 'Meat',
    price: 7.99,
    quantity: 1,
    unit: 'kg',
    expiryDate: '2025-03-26'
  },
  {
    id: uuidv4(),
    name: 'Rice',
    category: 'Grains',
    price: 4.99,
    quantity: 5,
    unit: 'kg',
    expiryDate: '2025-05-20'
  }
];

export const GroceryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(initialGroceryItems);

  const addGroceryItem = (item: Omit<GroceryItem, 'id'>) => {
    const newItem = { ...item, id: uuidv4() };
    setGroceryItems(prevItems => [...prevItems, newItem]);
  };

  const updateGroceryItem = (updatedItem: GroceryItem) => {
    setGroceryItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteGroceryItem = (id: string) => {
    setGroceryItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getGroceryItem = (id: string) => {
    return groceryItems.find(item => item.id === id);
  };

  return (
    <GroceryContext.Provider
      value={{
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        deleteGroceryItem,
        getGroceryItem
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = (): GroceryContextType => {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};