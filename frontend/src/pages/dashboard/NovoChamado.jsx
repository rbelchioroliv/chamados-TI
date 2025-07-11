// src/pages/dashboard/NovoChamado.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Paper, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';

const NovoChamado = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/tickets', data);
      alert('Chamado criado com sucesso!');
      navigate('/dashboard/solicitados');
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar chamado.';
      setServerError(message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Abrir Novo Chamado</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        <TextField
          label="Título do Chamado"
          fullWidth
          margin="normal"
          {...register('title', { required: 'O título é obrigatório' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          label="Descrição do Problema"
          fullWidth
          multiline
          rows={6}
          margin="normal"
          {...register('description', { required: 'A descrição é obrigária' })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Prioridade</InputLabel>
          <Select
            label="Prioridade"
            defaultValue=""
            {...register('priority', { required: 'A prioridade é obrigatória' })}
            error={!!errors.priority}
          >
            <MenuItem value="NORMAL">Pode esperar</MenuItem>
            <MenuItem value="URGENT">Urgente</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
          Enviar Chamado
        </Button>
      </Box>
    </Paper>
  );
};

export default NovoChamado;