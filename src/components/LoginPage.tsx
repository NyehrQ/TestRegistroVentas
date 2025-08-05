import React, { useState } from 'react';
import { LogIn, Key, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginType, setLoginType] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithCode } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = login(email, password);
      if (success) {
        onLogin();
      } else {
        setError('Credenciales incorrectas');
      }
      } catch {
        setError('Error al iniciar sesión');
      } finally {
      setLoading(false);
    }
  };

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = loginWithCode(code);
      if (success) {
        onLogin();
      } else {
        setError('Código inválido o ya utilizado');
      }
      } catch {
        setError('Error al validar código');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Ventas</h1>
          <p className="text-gray-600 mt-2">Ingresa para continuar</p>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setLoginType('email')}
            className={`flex-1 py-2 px-4 rounded-l-lg border ${
              loginType === 'email'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            } transition-colors`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginType('code')}
            className={`flex-1 py-2 px-4 rounded-r-lg border ${
              loginType === 'code'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            } transition-colors`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Código
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {loginType === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Acceso
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Solicita un código al administrador
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Validando...' : 'Ingresar con Código'}
            </button>
          </form>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-medium mb-2">Usuario de prueba:</p>
          <p className="text-xs text-gray-500">Email: admin@admin.com</p>
          <p className="text-xs text-gray-500">Contraseña: admin</p>
        </div>
      </div>
    </div>
  );
};