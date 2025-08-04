import { useState, useEffect } from 'react';
import { Product, Sale, TempCode } from '../types';

export const useData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [pendingSales, setPendingSales] = useState<Sale[]>([]);
  const [tempCodes, setTempCodes] = useState<TempCode[]>([]);

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
    sales,
    pendingSales,
    tempCodes,
    addSale,
    approveSale,
    rejectSale,
    generateTempCode,
    refreshData: loadData
  };
};