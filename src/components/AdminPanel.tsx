import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Check, X, Key, Copy, RefreshCw } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    pendingSales, 
    tempCodes, 
    approveSale, 
    rejectSale, 
    generateTempCode,
    refreshData 
  } = useData();
  const [newCode, setNewCode] = useState<string>('');
  const [showCodeAlert, setShowCodeAlert] = useState(false);

  const handleGenerateCode = () => {
    const code = generateTempCode();
    setNewCode(code);
    setShowCodeAlert(true);
    setTimeout(() => setShowCodeAlert(false), 5000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
                    {code.userId || '-'}
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

      {/* Google Sheets Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Integración con Google Sheets</h3>
        <p className="text-blue-800 mb-4">
          Las ventas aprobadas se sincronizan automáticamente con tu hoja de cálculo de Google Sheets.
        </p>
        <div className="text-sm text-blue-700">
          <p><strong>Hoja Principal:</strong> Ventas aprobadas y historial completo</p>
          <p><strong>Hoja Temporal:</strong> Ventas pendientes de aprobación</p>
          <p><strong>Hoja Productos:</strong> Catálogo con precios minoristas y mayoristas</p>
        </div>
      </div>
    </div>
  );
};