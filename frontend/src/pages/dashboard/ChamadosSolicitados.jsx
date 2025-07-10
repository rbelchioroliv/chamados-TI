// src/pages/dashboard/ChamadosSolicitados.jsx
import React, { useEffect, useMemo } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useTickets } from '../../context/TicketContext';
import TicketCard from '../../components/tickets/TicketCard';

const ChamadosSolicitados = () => {
  const { tickets, loading, error, fetchTickets } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const requestedTickets = useMemo(() => 
    tickets.filter(ticket => ticket.status === 'REQUESTED'),
    [tickets]
  );

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Meus Chamados Solicitados</Typography>
      {requestedTickets.length === 0 ? (
        <Typography>Nenhum chamado solicitado encontrado.</Typography>
      ) : (
        requestedTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}
    </Box>
  );
};

export default ChamadosSolicitados;