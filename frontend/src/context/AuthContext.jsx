// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- NOSSO NOVO ESTADO DE CARREGAMENTO
  const navigate = useNavigate();

  useEffect(() => {
    // Esta função agora é responsável por verificar a sessão ao iniciar
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      // Independentemente de encontrar ou não, o carregamento inicial termina aqui
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    const { token, user: userData } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);

    if (userData.role === 'IT') {
      navigate('/admin/fila');
    } else {
      navigate('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const isAuthenticated = !!user;

  // Agora também passamos o 'loading' para os componentes filhos
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};