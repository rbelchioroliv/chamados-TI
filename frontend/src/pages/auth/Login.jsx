// src/pages/auth/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext'; // Hook de autenticação
import { Link as RouterLink } from 'react-router-dom';

import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Link,
  Grid,
} from '@mui/material';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth(); // Função de login do nosso contexto
  const [serverError, setServerError] = React.useState('');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data); // Chama a função de login
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.';
      setServerError(message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Acessar Sistema
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          {serverError && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{serverError}</Alert>}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            autoFocus
            {...register('email', { required: 'O e-mail é obrigatório' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: 'A senha é obrigatória' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/cadastro" variant="body2">
                Não tem uma conta? Cadastre-se
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}