import { useState, useEffect } from 'react';
import { Product, Sale, TempCode } from '../types';

const PRODUCTS_RANGE = import.meta.env.VITE_PRODUCTS_RANGE || 'Products!A2:E';
const SALES_RANGE = import.meta.env.VITE_SALES_RANGE || 'Sales!A1';

const fetchProductsFromSheet = async (): Promise<Product[]> => {
  const sheetId = import.meta.env.VITE_PRODUCTS_SHEET_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!sheetId || !apiKey) {
    throw new Error('Missing Google Sheets configuration');
  }
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${PRODUCTS_RANGE}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.values || []).map((row: string[]) => ({
    id: row[0],
    name: row[1],
    minorPrice: Number(row[2]),
    majorPrice: Number(row[3]),
    category: row[4]
  }));
};

const recordSaleToSheet = async (sale: Sale) => {
  const sheetId = import.meta.env.VITE_SALES_SHEET_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!sheetId || !apiKey) return;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SALES_RANGE}:append?valueInputOption=RAW&key=${apiKey}`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      values: [[sale.id, sale.userName, sale.total, sale.date, sale.status]]
    })
  });
};

export const useData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [pendingSales, setPendingSales] = useState<Sale[]>([]);
  const [tempCodes, setTempCodes] = useState<TempCode[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Cargar productos desde Google Sheets o desde localStorage si falla
    try {
      const sheetProducts = await fetchProductsFromSheet();
      setProducts(sheetProducts);
      localStorage.setItem('products', JSON.stringify(sheetProducts));
    } catch {
      const savedProducts = localStorage.getItem('products');
      setProducts(savedProducts ? JSON.parse(savedProducts) : []);
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

  const addSale = async (sale: Sale) => {
    if (sale.status === 'pending') {
      const newPendingSales = [...pendingSales, sale];
      setPendingSales(newPendingSales);
      localStorage.setItem('pendingSales', JSON.stringify(newPendingSales));
    } else {
      const newSales = [...sales, sale];
      setSales(newSales);
      localStorage.setItem('sales', JSON.stringify(newSales));
    }

    try {
      await recordSaleToSheet(sale);
    } catch (err) {
      console.error('No se pudo registrar la venta en Google Sheets', err);
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