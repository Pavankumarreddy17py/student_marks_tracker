import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  branch: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  register: (id: string, name: string, branch: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // In a real implementation, these would call the Django backend
  const login = async (id: string, password: string) => {
    try {
      // In the real implementation, we'd call the API
      // const response = await api.post('/auth/login/', { id, password });
      
      // For now, simulate authentication with localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = storedUsers.find((u: any) => u.id === id && u.password === password);
      
      if (user) {
        setUser({
          id: user.id,
          name: user.name,
          branch: user.branch
        });
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          name: user.name,
          branch: user.branch
        }));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (id: string, name: string, branch: string, password: string) => {
    try {
      // In the real implementation, we'd call the API
      // const response = await api.post('/auth/register/', { id, name, branch, password });
      
      // For now, simulate registration with localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (storedUsers.some((u: any) => u.id === id)) {
        throw new Error('Student ID already registered');
      }
      
      const newUser = {
        id,
        name,
        branch,
        password,
        semester1: null,
        semester2: null,
        semester3: null,
        semester4: null,
        semester5: null,
        semester6: null,
        semester7: null,
        semester8: null
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      setUser({
        id,
        name,
        branch
      });
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify({
        id,
        name,
        branch
      }));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};