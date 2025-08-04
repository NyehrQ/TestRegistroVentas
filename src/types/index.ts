export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'temp';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  minorPrice: number; // Precio minorista
  majorPrice: number; // Precio mayorista
  category: string;
}

export interface Sale {
  id: string;
  products: SaleItem[];
  total: number;
  userId: string;
  userName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isMajor: boolean; // Si es venta mayorista
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface TempCode {
  code: string;
  generated: string;
  used: boolean;
  userId?: string;
}