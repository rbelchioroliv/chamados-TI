// src/pages/auth/Login.jsx
import React, { useState } from 'react'; // Importa o useState
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

// Imports adicionais do Material-UI
import {
  Container,
  Typography,
  Box,
  Alert,
  Link,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
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
          
          {/* CAMPO DE SENHA ATUALIZADO */}
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel htmlFor="password-input">Senha</InputLabel>
            <OutlinedInput
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'A senha é obrigatória' })}
              error={!!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Senha"
            />
            {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
          </FormControl>

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