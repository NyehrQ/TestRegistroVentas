import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Check, X, Key, Copy, RefreshCw, Plus, Edit, Trash2, Save, User, Package } from 'lucide-react';
import { Product, TempUser } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    pendingSales, 
    tempCodes, 
    products,
    tempUsers,
    approveSale, 
    rejectSale, 
    generateTempCode,
    addProduct,
    updateProduct,
    deleteProduct,
    addTempUser,
    updateTempUser,
    deleteTempUser,
    refreshData 
  } = useData();
  const [newCode, setNewCode] = useState<string>('');
  const [showCodeAlert, setShowCodeAlert] = useState(false);
  const [activeSection, setActiveSection] = useState<'sales' | 'products' | 'users'>('sales');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<TempUser | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  const handleGenerateCode = () => {
    const code = generateTempCode();
    setNewCode(code);
    setShowCodeAlert(true);
    setTimeout(() => setShowCodeAlert(false), 5000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const productData = {
      name: formData.get('name') as string,
      minorPrice: parseFloat(formData.get('minorPrice') as string),
      majorPrice: parseFloat(formData.get('majorPrice') as string),
      category: formData.get('category') as string,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }
    setShowProductForm(false);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      isActive: formData.get('isActive') === 'on',
    };

    if (editingUser) {
      updateTempUser(editingUser.id, userData);
      setEditingUser(null);
    } else {
      addTempUser(userData);
    }
    setShowUserForm(false);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const startEditUser = (user: TempUser) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const resetForms = () => {
    setEditingProduct(null);
    setEditingUser(null);
    setShowProductForm(false);
    setShowUserForm(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
        <button
          onClick={refreshData}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSection('sales')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'sales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ventas y Códigos
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4 inline mr-1" />
            Productos
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSection === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4 inline mr-1" />
            Usuarios Temporales
          </button>
        </nav>
      </div>

      {activeSection === 'sales' && (
        <>
          {/* Code Generation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Código Temporal</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGenerateCode}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Key className="w-4 h-4 mr-2" />
                Generar Nuevo Código
              </button>
              {newCode && (
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-bold text-green-600">{newCode}</span>
                  <button
                    onClick={() => copyToClipboard(newCode)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {showCodeAlert && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  <strong>Código generado:</strong> {newCode} - Comparte este código con el usuario temporal.
                </p>
              </div>
            )}
          </div>
          {/* Temp Codes History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Códigos Temporales</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Generado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tempCodes.map((code) => (
                    <tr key={code.code}>
                      <td className="px-6 py-4 font-mono text-sm">{code.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(code.generated).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          code.used 
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {code.used ? 'Usado' : 'Disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {code.userName || code.userId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Ventas Pendientes de Aprobación ({pendingSales.length})
              </h3>
            </div>
            {pendingSales.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay ventas pendientes de aprobación
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingSales.map((sale) => (
                  <div key={sale.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="font-medium text-gray-900">Venta #{sale.id.split('-')[1]}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sale.isMajor 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sale.isMajor ? 'Mayorista' : 'Minorista'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Usuario: {sale.userName} | Fecha: {new Date(sale.date).toLocaleString()}
                        </p>
                        <div className="text-sm text-gray-600 mb-2">
                          Productos: {sale.products.map(p => `${p.productName} (${p.quantity})`).join(', ')}
                        </div>
                        <p className="font-semibold text-lg">Total: ${sale.total.toLocaleString()}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => approveSale(sale.id)}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => rejectSale(sale.id)}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeSection === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Productos</h3>
            <button
              onClick={() => {
                resetForms();
                setShowProductForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Minorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Mayorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${product.minorPrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${product.majorPrice}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Usuarios Temporales</h3>
            <button
              onClick={() => {
                resetForms();
                setShowUserForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tempUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTempUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Integración con Google Sheets</h3>
        <p className="text-blue-800 mb-4">
          Los datos se sincronizan automáticamente con tu hoja de cálculo de Google Sheets.
        </p>
        <div className="text-sm text-blue-700">
          <p><strong>Hoja Principal:</strong> Ventas aprobadas y historial completo</p>
          <p><strong>Hoja Temporal:</strong> Ventas pendientes de aprobación</p>
          <p><strong>Hoja Productos:</strong> Catálogo con precios minoristas y mayoristas</p>
          <p><strong>Hoja Usuarios:</strong> Lista de usuarios temporales autorizados</p>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct?.name || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingProduct?.category || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Minorista</label>
                <input
                  type="number"
                  step="0.01"
                  name="minorPrice"
                  defaultValue={editingProduct?.minorPrice || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Mayorista</label>
                <input
                  type="number"
                  step="0.01"
                  name="majorPrice"
                  defaultValue={editingProduct?.majorPrice || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForms}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser?.name || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingUser?.phone || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser?.email || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingUser?.isActive !== false}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Usuario activo</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForms}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};