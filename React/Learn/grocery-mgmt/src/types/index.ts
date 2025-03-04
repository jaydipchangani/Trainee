export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  expiryDate?: string;
}

export type ThemeMode = 'light' | 'dark';