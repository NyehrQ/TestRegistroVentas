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
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
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
    const tempCodes = JSON.parse(localStorage.getItem('tempCodes') || '[]');
    const validCode = tempCodes.find((c: any) => c.code === code && !c.used);
    
    if (validCode) {
      return true;
    }

    return false;
  };

  const loginWithCodeAndUser = (code: string, tempUserId: string): boolean => {
    const tempCodes = JSON.parse(localStorage.getItem('tempCodes') || '[]');
    const tempUsers = JSON.parse(localStorage.getItem('tempUsers') || '[]');
    
    const validCode = tempCodes.find((c: any) => c.code === code && !c.used);
    const selectedUser = tempUsers.find((u: any) => u.id === tempUserId && u.isActive);
    
    if (validCode && selectedUser) {
      const tempUser: User = {
        id: selectedUser.id,
        email: selectedUser.email || `${selectedUser.name.toLowerCase().replace(/\s+/g, '')}@temporal.com`,
        role: 'temp',
        name: selectedUser.name
      };
      
      // Marcar código como usado
      validCode.used = true;
      validCode.userId = tempUser.id;
      validCode.userName = tempUser.name;
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

  return { user, login, loginWithCode, loginWithCodeAndUser, logout, loading };
};