import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api';
import TicketCard from '../../components/tickets/TicketCard';

const ChamadosSolicitados = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await api.get('/tickets');
     
        const requestedTickets = response.data.filter(t => t.status === 'REQUESTED');
        setTickets(requestedTickets);
      } catch (err) {
        setError('Falha ao carregar os chamados.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Meus Chamados Solicitados</Typography>
      {tickets.length === 0 ? (
        <Typography>Nenhum chamado solicitado encontrado.</Typography>
      ) : (
        tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}
    </Box>
  );
};

export default ChamadosSolicitados;