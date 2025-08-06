import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Usuario admin predefinido
    if (email === 'admin@admin.com' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@admin.com',
        role: 'admin',
        name: 'Administrador'
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // Simulación de otros usuarios
      interface StoredUser extends User {
        password: string;
      }
      const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userInfo: User = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name
      };
      setUser(userInfo);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      return true;
    }

    return false;
  };

  const loginWithCode = (code: string): boolean => {
      interface StoredTempCode {
        code: string;
        used: boolean;
        userId?: string;
      }
      const tempCodes: StoredTempCode[] = JSON.parse(localStorage.getItem('tempCodes') || '[]');
      const validCode = tempCodes.find((c) => c.code === code && !c.used);
    
    if (validCode) {
      const tempUser: User = {
        id: `temp-${Date.now()}`,
        email: `temp-${code}@temporal.com`,
        role: 'temp',
        name: `Usuario Temporal ${code}`
      };
      
      // Marcar código como usado
      validCode.used = true;
      validCode.userId = tempUser.id;
      localStorage.setItem('tempCodes', JSON.stringify(tempCodes));
      
      setUser(tempUser);
      localStorage.setItem('currentUser', JSON.stringify(tempUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return { user, login, loginWithCode, logout, loading };
};