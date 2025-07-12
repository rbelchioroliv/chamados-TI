// src/components/admin/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import api from '../../api';

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
};

const EditUserModal = ({ user, open, onClose, onUpdate }) => {
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Atualiza o estado do modal sempre que um novo usuário é selecionado
  useEffect(() => {
    if (user) {
      setRole(user.role);
      setPassword(''); // Limpa o campo de senha
    }
  }, [user]);

  const handleSaveChanges = async () => {
    setLoading(true);
    const dataToUpdate = {};

    if (role !== user.role) {
      dataToUpdate.role = role;
    }
    if (password) {
      dataToUpdate.password = password;
    }

    try {
      await api.patch(`/admin/users/${user.id}`, dataToUpdate);
      alert('Usuário atualizado com sucesso!');
      onUpdate(); // Chama a função para recarregar a lista de usuários
    } catch (error) {
      const message = error.response?.data?.error || 'Falha ao atualizar o usuário.';
      alert(message);
    } finally {
      setLoading(false);
      onClose(); // Fecha o modal independentemente do resultado
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Editar Usuário: {user.name}
        </Typography>
        <Typography sx={{ mt: 1, mb: 2 }} color="text.secondary">
          {user.email}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Papel (Role)</InputLabel>
          <Select
            value={role}
            label="Papel (Role)"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="USER">Usuário</MenuItem>
            <MenuItem value="IT">TI (Admin)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          fullWidth
          label="Nova Senha (opcional)"
          type="password"
          placeholder="Deixe em branco para não alterar"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveChanges} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserModal;