import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import api from '../../api';
import TicketCard from '../../components/tickets/TicketCard';

const ChamadosConcluidos = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

       
        const recentCompleted = response.data.filter(ticket => 
          ticket.status === 'COMPLETED' && new Date(ticket.completedAt) > oneMonthAgo
        ).slice(0, 10); 

        setTickets(recentCompleted);
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
        Meus Chamados Concluídos (Últimos 30 dias)
      </Typography>
      {tickets.length === 0 ? (
        <Typography>Nenhum chamado concluído recentemente.</Typography>
      ) : (
        tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}
    </Box>
  );
};

export default ChamadosConcluidos;