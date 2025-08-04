import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { SalesForm } from './SalesForm';
import { SalesTable } from './SalesTable';
import { AdminPanel } from './AdminPanel';
import { 
  BarChart3, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  LogOut,
  Plus,
  Settings
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { sales, pendingSales } = useData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'admin'>('dashboard');
  const [showSalesForm, setShowSalesForm] = useState(false);

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date().toDateString();
    const saleDate = new Date(sale.date).toDateString();
    return today === saleDate;
  });

  const stats = [
    {
      title: 'Ventas Totales',
      value: `$${totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Ventas Hoy',
      value: todaySales.length.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Pendientes',
      value: pendingSales.length.toString(),
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Total Registros',
      value: sales.length.toString(),
      icon: BarChart3,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Ventas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ventas
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'admin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Administración
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSalesForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Venta
                </button>
                <button
                  onClick={() => setActiveTab('sales')}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Historial
                </button>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Ventas Recientes</h2>
              </div>
              <SalesTable sales={sales.slice(-5)} showActions={false} />
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Ventas</h2>
              <button
                onClick={() => setShowSalesForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Venta
              </button>
            </div>
            <SalesTable sales={sales} showActions={true} />
          </div>
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Sales Form Modal */}
      {showSalesForm && (
        <SalesForm onClose={() => setShowSalesForm(false)} />
      )}
    </div>
  );
};