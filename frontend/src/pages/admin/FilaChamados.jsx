// src/pages/admin/FilaChamados.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Paper 
} from '@mui/material';
import api from '../../api';
import TicketCard from '../../components/tickets/TicketCard';
import TicketDetailsModal from '../../components/tickets/TicketDetailsModal';
import { socket } from '../../socket';

const FilaChamados = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ department: '', priority: '' });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    // Não seta loading como true aqui para a atualização do socket ser mais suave
    try {
      const response = await api.get('/admin/tickets', { params: filters });
      setTickets(response.data);
    } catch (err) {
      setError('Falha ao carregar os chamados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Busca os dados quando os filtros mudam
  useEffect(() => {
    setLoading(true);
    fetchTickets();
  }, [fetchTickets]);


  // useEffect para atualizações em tempo real via Socket.IO
  useEffect(() => {
    socket.connect();

    const onTicketsUpdate = () => {
      console.log("Aviso 'tickets_updated' recebido! Atualizando a lista de chamados...");
      fetchTickets();
    };

    socket.on('tickets_updated', onTicketsUpdate);

    return () => {
      console.log("Desconectando o socket e removendo o ouvinte de 'tickets_updated'.");
      socket.off('tickets_updated', onTicketsUpdate);
      socket.disconnect();
    };
  }, [fetchTickets]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({ department: '', priority: '' });
  };

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleTicketUpdate = () => {
    // A atualização agora é tratada pelo evento do socket,
    // então aqui apenas fechamos o modal.
    handleCloseModal();
  };

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Fila de Chamados
      </Typography>

      <Grid container spacing={2} mb={3} alignItems="center">
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth sx={{ minWidth: 220 }}>
            <InputLabel id="setor-filter-label">Setor</InputLabel>
            <Select
              labelId="setor-filter-label"
              id="setor-select"
              name="department"
              value={filters.department}
              label="Setor"
              onChange={handleFilterChange}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              <MenuItem value="TI">TI</MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="Recepção">Recepção</MenuItem>
              <MenuItem value="Almoxarifado">Almoxarifado</MenuItem>
              <MenuItem value="Sesmt">Sesmt</MenuItem>
              <MenuItem value="Dose em Casa">Dose em Casa</MenuItem>
              <MenuItem value="Supervisão">Supervisão</MenuItem>
              <MenuItem value="Compras/Financeiro">Compras/Financeiro</MenuItem>
              <MenuItem value="Diretoria">Diretoria</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth sx={{ minWidth: 220 }}>
            <InputLabel id="prioridade-filter-label">Prioridade</InputLabel>
            <Select
              labelId="prioridade-filter-label"
              id="prioridade-select"
              name="priority"
              value={filters.priority}
              label="Prioridade"
              onChange={handleFilterChange}
            >
              <MenuItem value=""><em>Todas</em></MenuItem>
              <MenuItem value="URGENT">Urgente</MenuItem>
              <MenuItem value="NORMAL">Normal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="outlined" onClick={clearFilters} fullWidth sx={{ height: '56px' }}>
            Limpar
          </Button>
        </Grid>
      </Grid>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : tickets.length === 0 ? (
        <Typography sx={{ my: 4, textAlign: 'center' }}>
          Nenhum chamado encontrado.
        </Typography>
      ) : (
        <Box>
          {tickets.map(ticket => (
            <Box key={ticket.id} onClick={() => handleOpenModal(ticket)} sx={{ cursor: 'pointer' }}>
              <TicketCard ticket={ticket} />
            </Box>
          ))}
        </Box>
      )}

      <TicketDetailsModal
        ticket={selectedTicket}
        open={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleTicketUpdate}
      />
    </Paper>
  );
};

export default FilaChamados;