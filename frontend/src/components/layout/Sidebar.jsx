// src/components/layout/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, useTheme, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HistoryIcon from '@mui/icons-material/History';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';

const userMenuItems = [
  { text: 'Visão Geral', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Novo Chamado', icon: <AddCircleOutlineIcon />, path: '/dashboard/novo-chamado' },
  { text: 'Chamados Solicitados', icon: <PendingActionsIcon />, path: '/dashboard/solicitados' },
  { text: 'Ordens em Andamento', icon: <PlaylistAddCheckIcon />, path: '/dashboard/andamento' },
  { text: 'Chamados Concluídos', icon: <HistoryIcon />, path: '/dashboard/concluidos' },
];

const adminMenuItems = [
    { text: 'Fila de Chamados', icon: <PendingActionsIcon />, path: '/admin/fila' },
    { text: 'Histórico', icon: <AssessmentIcon />, path: '/admin/historico' },
    { text: 'Gerenciar Usuários', icon: <GroupIcon />, path: '/admin/users' },
];

const Sidebar = ({ drawerWidth, collapsedDrawerWidth, isSidebarExpanded, mobileOpen, handleDrawerToggle, handleMouseEnter, handleMouseLeave }) => {
  const theme = useTheme();
  const location = useLocation();
  const { user } = useAuth();

  const menuItemsToRender = user?.role === 'IT' ? adminMenuItems : userMenuItems;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Divider />
      <List>
        {menuItemsToRender.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding component={Link} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
              <ListItemButton
                selected={isActive}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2.5,
                  py: 1.5,
                  '&.Mui-selected': { backgroundColor: theme.palette.action.selected },
                  '&:hover': { backgroundColor: theme.palette.action.hover },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 3, justifyContent: 'center', color: isActive ? theme.palette.primary.main : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: isSidebarExpanded ? 1 : 0, transition: 'opacity 0.2s' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: isSidebarExpanded ? drawerWidth : collapsedDrawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Drawer para Mobile (continua igual, com clique) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer para Desktop (agora com hover) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            overflowX: 'hidden',
            width: isSidebarExpanded ? drawerWidth : collapsedDrawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        // Adiciona os eventos de mouse ao papel do Drawer
        PaperProps={{
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;