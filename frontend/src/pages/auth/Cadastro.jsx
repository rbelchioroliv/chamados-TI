// src/pages/auth/Cadastro.jsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Importamos nossa instância do axios

import {
  TextField,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from '@mui/material';

export default function Cadastro() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');
  const password = watch('password');

  const onSubmit = async (data) => {
    setServerError(''); // Limpa erros antigos
    try {
      // Remove o campo de confirmação de senha antes de enviar para a API
      const { confirmPassword, ...payload } = data;
      
      // Envia os dados para a rota /register do nosso back-end
      await api.post('/register', payload);
      
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login'); // Redireciona para o login após sucesso

    } catch (error) {
      // Pega a mensagem de erro que definimos no back-end
      const message = error.response?.data?.error || 'Erro ao realizar o cadastro. Tente novamente.';
      setServerError(message);
      console.error('Erro no cadastro:', error.response);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Cadastro de Novo Usuário
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
          
          <TextField
            label="Nome Completo"
            fullWidth
            margin="normal"
            autoFocus
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
            {...register('email', { required: 'O e-mail é obrigatório' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Setor</InputLabel>
            <Select
              label="Setor"
              defaultValue=""
              {...register('department', { required: 'O setor é obrigatório' })}
              error={!!errors.department}
            >
              <MenuItem value="Financeiro">Financeiro/Compras</MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="Coordenacao">Coordenação</MenuItem>
              <MenuItem value="Diretoria">Diretoria</MenuItem>
              <MenuItem value="Almoxarifado">Almoxarifado</MenuItem>
              <MenuItem value="Dose">Dose em Casa</MenuItem>
              <MenuItem value="Recepcao">Recepção</MenuItem>
              <MenuItem value="TI">TI</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: 'A senha é obrigatória', minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' }})}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Confirmar Senha"
            type="password"
            fullWidth
            margin="normal"
            {...register('confirmPassword', {
              required: 'A confirmação de senha é obrigatória',
              validate: (value) => value === password || 'As senhas não coincidem',
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2 }}>
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}