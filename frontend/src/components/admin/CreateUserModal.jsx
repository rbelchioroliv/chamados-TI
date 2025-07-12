// src/components/admin/CreateUserModal.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../../api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const CreateUserModal = ({ open, onClose, onUpdate }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleClose = () => {
    reset(); // Limpa o formulário
    setServerError('');
    onClose();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await api.post('/admin/users', data);
      alert('Usuário criado com sucesso!');
      onUpdate(); // Recarrega a lista de usuários na página principal
      handleClose();
    } catch (error) {
      const message = error.response?.data?.error || 'Falha ao criar o usuário.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" component="h2" mb={2}>
          Criar Novo Usuário
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <TextField
          label="Nome Completo"
          fullWidth
          margin="normal"
          {...register('name', { required: 'O nome é obrigatório' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Nome de Usuário"
          fullWidth
          margin="normal"
          {...register('username', { required: 'O nome de usuário é obrigatório' })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          {...register('email', { required: 'O email é obrigatório' })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Departamento</InputLabel>
          <Select
            label="Departamento"
            defaultValue=""
            {...register('department', { required: 'O departamento é obrigatório' })}
            error={!!errors.department}
          >
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Papel (Role)</InputLabel>
          <Select
            label="Papel (Role)"
            defaultValue="USER"
            {...register('role', { required: 'O papel é obrigatório' })}
            error={!!errors.role}
          >
            <MenuItem value="USER">Usuário</MenuItem>
            <MenuItem value="IT">TI (Admin)</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', { required: 'A senha é obrigatória', minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Criar Usuário'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateUserModal;