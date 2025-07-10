// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = ({ drawerWidth, collapsedDrawerWidth, isSidebarExpanded, handleDrawerToggle }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const homePath = user?.role === 'IT' ? '/admin/fila' : '/dashboard';

  return (
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
            {/* LINHA CORRIGIDA: Exibe o nome de usuário a partir de telas pequenas (sm) */}
            <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>{user.username}</Typography>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt={user.name} />
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem disabled>{user.name}</MenuItem>
              <MenuItem onClick={handleClose}>Editar Conta</MenuItem>
              <MenuItem onClick={handleClose}>Redefinir Senha</MenuItem>
              <MenuItem onClick={logout}>Sair</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;