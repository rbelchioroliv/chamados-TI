// src/pages/auth/Cadastro.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Container, Box, Typography, TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Cadastro = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/register', data);
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao realizar o cadastro.';
      setServerError(message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Cadastro</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
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
              <MenuItem value="Financeiro">Financeiro</MenuItem>
              <MenuItem value="RH">Recursos Humanos</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="IT">TI</MenuItem> {/* <-- A CORREÇÃO ESTÁ AQUI */}
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cadastrar
          </Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" textAlign="center">Já tem uma conta? Faça login</Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Cadastro;