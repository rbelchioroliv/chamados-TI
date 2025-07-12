// src/components/profile/EditProfileModal.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Box, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material';
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

const EditProfileModal = ({ user, open, onClose, onUpdate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
    }
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const response = await api.patch('/users/profile', data);
      onUpdate(response.data); // Atualiza os dados do usuário no AuthContext
      alert('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      const message = error.response?.data?.error || 'Falha ao atualizar o perfil.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" component="h2" mb={2}>Editar Perfil</Typography>
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
        {/* Futuramente, o campo de upload de foto virá aqui */}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;