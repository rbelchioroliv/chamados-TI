// src/components/tickets/TicketDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import api from '../../api';
import { priorityMap } from '../../utils/mappings';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default function TicketDetailsModal({ ticket, open, onClose, onUpdate }) {
  const [newStatus, setNewStatus] = useState('');
  const [estimatedDate, setEstimatedDate] = useState('');
  
  useEffect(() => {
    // Reseta os estados internos sempre que um novo ticket for selecionado
    if (ticket) {
      setNewStatus(ticket.status);
      setEstimatedDate('');
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleUpdate = async () => {
    try {
      const payload = { status: newStatus };
      if (newStatus === 'IN_PROGRESS' && estimatedDate) {
        payload.estimatedCompletion = estimatedDate;
      }
      
      await api.patch(`/admin/tickets/${ticket.id}`, payload);
      onUpdate(); // Avisa a página pai para recarregar os dados
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      alert("Falha ao atualizar o status.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Detalhes do Chamado</Typography>
        <Typography sx={{ mt: 2 }}><strong>Título:</strong> {ticket.title}</Typography>
        <Typography sx={{ mt: 1 }}><strong>Descrição:</strong> {ticket.description}</Typography>
        <Typography sx={{ mt: 1 }}><strong>Solicitante:</strong> {ticket.owner.name} ({ticket.owner.department})</Typography>
        <Typography sx={{ mt: 1 }}><strong>Prioridade:</strong> {priorityMap[ticket.priority]?.label || ticket.priority}</Typography>
        
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Mudar Status</InputLabel>
          <Select value={newStatus} label="Mudar Status" onChange={(e) => setNewStatus(e.target.value)}>
            <MenuItem value="REQUESTED">Solicitado</MenuItem>
            <MenuItem value="IN_PROGRESS">Em Andamento</MenuItem>
            <MenuItem value="COMPLETED">Concluído</MenuItem>
          </Select>
        </FormControl>

        {newStatus === 'IN_PROGRESS' && (
          <TextField
            label="Previsão de Conclusão"
            type="date"
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setEstimatedDate(e.target.value)}
          />
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdate}>Atualizar</Button>
        </Box>
      </Box>
    </Modal>
  );
}