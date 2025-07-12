// src/components/profile/ResetPasswordModal.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal, Box, Typography, Button, TextField, CircularProgress, Alert,
  FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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

// Componente reutilizável para o campo de senha
const PasswordInput = ({ name, label, register, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel htmlFor={`${name}-input`}>{label}</InputLabel>
      <OutlinedInput
        id={`${name}-input`}
        type={showPassword ? 'text' : 'password'}
        {...register(name, {
          required: `${label} é obrigatória`,
          minLength: name !== 'currentPassword' ? { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' } : undefined,
        })}
        error={!!errors[name]}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={`toggle ${name} visibility`}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      {errors[name] && <FormHelperText error>{errors[name].message}</FormHelperText>}
    </FormControl>
  );
};


const ResetPasswordModal = ({ open, onClose }) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await api.patch('/users/password', data);
      alert('Senha redefinida com sucesso!');
      reset();
      onClose();
    } catch (error) {
      const message = error.response?.data?.error || 'Falha ao redefinir a senha.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }}>
      <Box sx={style} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" component="h2" mb={2}>Redefinir Senha</Typography>
        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        
        <PasswordInput name="currentPassword" label="Senha Atual" register={register} errors={errors} />
        <PasswordInput name="newPassword" label="Nova Senha" register={register} errors={errors} />
        <FormControl fullWidth margin="normal" variant="outlined">
           <InputLabel htmlFor="newPasswordConfirmation-input">Confirmação da Nova Senha</InputLabel>
           <OutlinedInput
             id="newPasswordConfirmation-input"
             type="password"
             {...register('newPasswordConfirmation', {
               required: 'A confirmação é obrigatória',
               validate: value => value === newPassword || 'As senhas não correspondem'
             })}
             error={!!errors.newPasswordConfirmation}
             label="Confirmação da Nova Senha"
           />
           {errors.newPasswordConfirmation && <FormHelperText error>{errors.newPasswordConfirmation.message}</FormHelperText>}
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => { reset(); onClose(); }} sx={{ mr: 1 }}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar Nova Senha'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResetPasswordModal;