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
  Tooltip,
  Button // Importa o Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Importa ícone de adicionar
import api from '../../api';
import EditUserModal from '../../components/admin/EditUserModal';
import CreateUserModal from '../../components/admin/CreateUserModal'; // Importa o novo modal de criação

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para os modais
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // Funções para o modal de EDIÇÃO
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Funções para o modal de CRIAÇÃO
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Função genérica para recarregar a lista
  const handleUpdate = () => {
    fetchUsers();
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

  if (loading) { /* ... */ }
  if (error) { /* ... */ }

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gerenciamento de Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenCreateModal}
        >
          Criar Novo Usuário
        </Button>
      </Box>

      <TableContainer>
        <Table stickyHeader>
          {/* ... (código da tabela continua o mesmo) ... */}
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar Usuário">
                    <IconButton onClick={() => handleOpenEditModal(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
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

      {/* Renderiza os Modais */}
      <EditUserModal
        user={editingUser}
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdate}
      />
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onUpdate={handleUpdate}
      />
    </Paper>
  );
};

export default UserManagement;