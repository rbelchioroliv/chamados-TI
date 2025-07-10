import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api';
import TicketCard from '../../components/tickets/TicketCard';

const OrdensAndamento = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        // A ÚNICA MUDANÇA É AQUI: filtramos por 'IN_PROGRESS'
        const inProgressTickets = response.data.filter(ticket => ticket.status === 'IN_PROGRESS');
        setTickets(inProgressTickets);
      } catch (err) {
        setError('Falha ao carregar os chamados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ordens de Serviço em Andamento
      </Typography>
      {tickets.length === 0 ? (
        <Typography>Nenhuma ordem de serviço em andamento no momento.</Typography>
      ) : (
        tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}
    </Box>
  );
};

export default OrdensAndamento;