import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Sale, SaleItem } from '../types';

interface SalesFormProps {
  onClose: () => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { products, addSale } = useData();
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setSaleItems([...saleItems, {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
    }]);
  };

  const removeItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...saleItems];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        // Calcular precio basado en cantidad total
        const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const isMajor = totalQuantity > 3;
        newItems[index].unitPrice = isMajor ? product.majorPrice : product.minorPrice;
      }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].subtotal = newItems[index].quantity * newItems[index].unitPrice;
    }

    // Recalcular precios si cambió la cantidad total
    if (field === 'quantity') {
      const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const isMajor = totalQuantity > 3;
      
      newItems.forEach(item => {
        if (item.productId) {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            item.unitPrice = isMajor ? product.majorPrice : product.minorPrice;
            item.subtotal = item.quantity * item.unitPrice;
          }
        }
      });
    }

    setSaleItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saleItems.length === 0) return;

    setLoading(true);

    try {
      const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalQuantity = saleItems.reduce((sum, item) => sum + item.quantity, 0);
      const isMajor = totalQuantity > 3;

      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        products: saleItems,
        total,
        userId: user!.id,
        userName: user!.name,
        date: new Date().toISOString(),
        status: user!.role === 'temp' ? 'pending' : 'approved',
        isMajor
      };

      addSale(newSale);
      onClose();
    } catch (error) {
      console.error('Error al guardar venta:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalQuantity = saleItems.reduce((sum, item) => sum + item.quantity, 0);
  const isMajor = totalQuantity > 3;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Venta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Productos</h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Producto
            </button>
          </div>

          {saleItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
            </div>
          ) : (
            <div className="space-y-4">
              {saleItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Producto
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Unitario
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtotal
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.subtotal}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {saleItems.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-medium text-gray-900">
                  Resumen de Venta
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isMajor 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {isMajor ? 'Venta Mayorista' : 'Venta Minorista'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Cantidad Total:</span>
                  <span className="font-medium ml-2">{totalQuantity} productos</span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-lg ml-2">${total.toLocaleString()}</span>
                </div>
              </div>
              {user?.role === 'temp' && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Nota:</strong> Como usuario temporal, esta venta quedará pendiente de aprobación por un administrador.
                  </p>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || saleItems.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
};