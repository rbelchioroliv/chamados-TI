// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import EditProfileModal from '../profile/EditProfileModal';
import ResetPasswordModal from '../profile/ResetPasswordModal';

const Header = ({ drawerWidth, collapsedDrawerWidth, isSidebarExpanded, handleDrawerToggle }) => {
  const theme = useTheme();
  const { user, logout, updateUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Estados para controlar os dois modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  
  const homePath = user?.role === 'IT' ? '/admin/fila' : '/dashboard';

  // Funções para o modal de Edição
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    handleCloseMenu();
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const handleProfileUpdate = (newUserData) => {
    updateUser(newUserData);
    handleCloseEditModal();
  };

  // Funções para o modal de Redefinir Senha
  const handleOpenResetPasswordModal = () => {
    setIsResetPasswordModalOpen(true);
    handleCloseMenu();
  };
  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          width: { sm: `calc(100% - ${(isSidebarExpanded ? drawerWidth : collapsedDrawerWidth)}px)` },
          ml: { sm: `${(isSidebarExpanded ? drawerWidth : collapsedDrawerWidth)}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Link to={homePath} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" noWrap component="div">
                Sistema de Chamados
              </Typography>
            </Link>
          </Box>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>{user.username}</Typography>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar alt={user.name} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem disabled>{user.name}</MenuItem>
                <MenuItem onClick={handleOpenEditModal}>Editar Conta</MenuItem>
                <MenuItem onClick={handleOpenResetPasswordModal}>Redefinir Senha</MenuItem>
                <MenuItem onClick={logout}>Sair</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Renderiza o Modal de Edição (se estiver aberto) */}
      {user && isEditModalOpen && (
        <EditProfileModal
          user={user}
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Renderiza o Modal de Redefinir Senha (se estiver aberto) */}
      {isResetPasswordModalOpen && (
         <ResetPasswordModal
           open={isResetPasswordModalOpen}
           onClose={handleCloseResetPasswordModal}
         />
      )}
    </>
  );
};

export default Header;