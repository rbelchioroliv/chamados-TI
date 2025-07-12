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
import EditIcon from '@mui/icons-material/Edit'; // Importa o ícone de edição
import api from '../../api';
import EditUserModal from '../../components/admin/EditUserModal'; // Importa o novo modal

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null); // Estado para guardar o usuário em edição
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

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

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUserUpdate = () => {
    fetchUsers(); // Recarrega a lista após uma atualização
    handleCloseModal();
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário "${userName}"? Todos os seus chamados também serão removidos. Esta ação é irreversível.`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        alert('Usuário deletado com sucesso.');
        fetchUsers();
      } catch (err) {
        alert('Falha ao deletar o usuário.');
        console.error(err);
      }
    }
  };

  if (loading) { /* ... (código de loading e erro continua igual) ... */ }
  if (error) { /* ... */ }

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Gerenciamento de Usuários</Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
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
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  {/* Botão de Edição */}
                  <Tooltip title="Editar Usuário">
                    <IconButton onClick={() => handleOpenEditModal(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {/* Botão de Deletar */}
                  <Tooltip title="Deletar Usuário">
                    <IconButton onClick={() => handleDeleteUser(user.id, user.name)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Renderiza o Modal de Edição */}
      <EditUserModal
        user={editingUser}
        open={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUserUpdate}
      />
    </Paper>
  );
};

export default UserManagement;