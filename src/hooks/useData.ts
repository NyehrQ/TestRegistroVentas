import { useState, useEffect } from 'react';
import { Product, Sale, TempCode, TempUser } from '../types';

export const useData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [pendingSales, setPendingSales] = useState<Sale[]>([]);
  const [tempCodes, setTempCodes] = useState<TempCode[]>([]);
  const [tempUsers, setTempUsers] = useState<TempUser[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Cargar productos de ejemplo
    const defaultProducts: Product[] = [
      { id: '1', name: 'Producto A', minorPrice: 100, majorPrice: 85, category: 'Categoría 1' },
      { id: '2', name: 'Producto B', minorPrice: 200, majorPrice: 170, category: 'Categoría 1' },
      { id: '3', name: 'Producto C', minorPrice: 150, majorPrice: 125, category: 'Categoría 2' },
      { id: '4', name: 'Producto D', minorPrice: 300, majorPrice: 250, category: 'Categoría 2' },
      { id: '5', name: 'Producto E', minorPrice: 80, majorPrice: 65, category: 'Categoría 3' },
    ];

    const savedProducts = localStorage.getItem('products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : defaultProducts);
    
    if (!savedProducts) {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    // Cargar usuarios temporales de ejemplo
    const defaultTempUsers: TempUser[] = [
      { 
        id: 'temp-1', 
        name: 'Juan Pérez', 
        phone: '+1234567890', 
        email: 'juan@example.com',
        createdAt: new Date().toISOString(),
        isActive: true 
      },
      { 
        id: 'temp-2', 
        name: 'María García', 
        phone: '+0987654321', 
        email: 'maria@example.com',
        createdAt: new Date().toISOString(),
        isActive: true 
      }
    ];

    const savedTempUsers = localStorage.getItem('tempUsers');
    setTempUsers(savedTempUsers ? JSON.parse(savedTempUsers) : defaultTempUsers);
    
    if (!savedTempUsers) {
      localStorage.setItem('tempUsers', JSON.stringify(defaultTempUsers));
    }

    // Cargar ventas
    const savedSales = localStorage.getItem('sales');
    setSales(savedSales ? JSON.parse(savedSales) : []);

    // Cargar ventas pendientes
    const savedPendingSales = localStorage.getItem('pendingSales');
    setPendingSales(savedPendingSales ? JSON.parse(savedPendingSales) : []);

    // Cargar códigos temporales
    const savedTempCodes = localStorage.getItem('tempCodes');
    setTempCodes(savedTempCodes ? JSON.parse(savedTempCodes) : []);
  };

  // CRUD Productos
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  // CRUD Usuarios Temporales
  const addTempUser = (user: Omit<TempUser, 'id' | 'createdAt'>) => {
    const newUser: TempUser = {
      ...user,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const newTempUsers = [...tempUsers, newUser];
    setTempUsers(newTempUsers);
    localStorage.setItem('tempUsers', JSON.stringify(newTempUsers));
  };

  const updateTempUser = (id: string, updates: Partial<TempUser>) => {
    const newTempUsers = tempUsers.map(u => 
      u.id === id ? { ...u, ...updates } : u
    );
    setTempUsers(newTempUsers);
    localStorage.setItem('tempUsers', JSON.stringify(newTempUsers));
  };

  const deleteTempUser = (id: string) => {
    const newTempUsers = tempUsers.filter(u => u.id !== id);
    setTempUsers(newTempUsers);
    localStorage.setItem('tempUsers', JSON.stringify(newTempUsers));
  };

  const addSale = (sale: Sale) => {
    if (sale.status === 'pending') {
      const newPendingSales = [...pendingSales, sale];
      setPendingSales(newPendingSales);
      localStorage.setItem('pendingSales', JSON.stringify(newPendingSales));
    } else {
      const newSales = [...sales, sale];
      setSales(newSales);
      localStorage.setItem('sales', JSON.stringify(newSales));
    }
  };

  const approveSale = (saleId: string) => {
    const saleToApprove = pendingSales.find(s => s.id === saleId);
    if (saleToApprove) {
      const approvedSale = { ...saleToApprove, status: 'approved' as const };
      const newSales = [...sales, approvedSale];
      const newPendingSales = pendingSales.filter(s => s.id !== saleId);
      
      setSales(newSales);
      setPendingSales(newPendingSales);
      localStorage.setItem('sales', JSON.stringify(newSales));
      localStorage.setItem('pendingSales', JSON.stringify(newPendingSales));
    }
  };

  const rejectSale = (saleId: string) => {
    const newPendingSales = pendingSales.filter(s => s.id !== saleId);
    setPendingSales(newPendingSales);
    localStorage.setItem('pendingSales', JSON.stringify(newPendingSales));
  };

  const generateTempCode = (): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newCode: TempCode = {
      code,
      generated: new Date().toISOString(),
      used: false
    };
    
    const newTempCodes = [...tempCodes, newCode];
    setTempCodes(newTempCodes);
    localStorage.setItem('tempCodes', JSON.stringify(newTempCodes));
    
    return code;
  };

  return {
    products,
    tempUsers,
    sales,
    pendingSales,
    tempCodes,
    addProduct,
    updateProduct,
    deleteProduct,
    addTempUser,
    updateTempUser,
    deleteTempUser,
    addSale,
    approveSale,
    rejectSale,
    generateTempCode,
    refreshData: loadData
  };
};