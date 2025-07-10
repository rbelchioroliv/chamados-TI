// src/context/TicketContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const TicketContext = createContext(null);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchTickets = useCallback(async (filters = {}) => {
    if (!user) return;

    setLoading(true);
    setError('');
    
    const url = user.role === 'IT' ? '/admin/tickets' : '/tickets';
    
    try {
      const response = await api.get(url, { params: filters });
      setTickets(response.data);
    } catch (err) {
      setError('Falha ao carregar os chamados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    tickets,
    loading,
    error,
    fetchTickets,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  return useContext(TicketContext);
};