// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Falha ao carregar usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    // Pede confirmação antes de uma ação destrutiva
    if (window.confirm('Tem certeza que deseja deletar este usuário? Todos os seus chamados também serão removidos. Esta ação é irreversível.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        alert('Usuário deletado com sucesso.');
        fetchUsers(); // Recarrega a lista de usuários
      } catch (err) {
        alert('Falha ao deletar o usuário.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Gerenciamento de Usuários</Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Papel</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Deletar Usuário">
                    <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserManagement;