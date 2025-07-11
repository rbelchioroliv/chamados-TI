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
      // Apenas navega. A página de solicitados buscará os dados atualizados ao carregar.
      navigate('/dashboard/solicitados'); 
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar chamado.';
      setServerError(message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      {/* ... (O JSX do seu formulário continua o mesmo aqui) ... */}
    </Paper>
  );
};

export default NovoChamado;