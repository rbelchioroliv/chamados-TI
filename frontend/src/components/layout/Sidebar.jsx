// src/components/layout/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, IconButton, useTheme, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Ícones
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HistoryIcon from '@mui/icons-material/History';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssessmentIcon from '@mui/icons-material/Assessment';

// --- DEFINIÇÃO DOS MENUS (FORA DO COMPONENTE) ---

// Itens de menu para usuários comuns
const userMenuItems = [
  { text: 'Novo Chamado', icon: <AddCircleOutlineIcon />, path: '/dashboard/novo-chamado' },
  { text: 'Chamados Solicitados', icon: <PendingActionsIcon />, path: '/dashboard/solicitados' },
  { text: 'Ordens em Andamento', icon: <PlaylistAddCheckIcon />, path: '/dashboard/andamento' },
  { text: 'Chamados Concluídos', icon: <HistoryIcon />, path: '/dashboard/concluidos' },
];

// Itens de menu para o TI
const adminMenuItems = [
    { text: 'Fila de Chamados', icon: <PendingActionsIcon />, path: '/admin/fila' },
    { text: 'Histórico', icon: <AssessmentIcon />, path: '/admin/historico' },
];

// --- COMPONENTE PRINCIPAL ---

const Sidebar = ({ drawerWidth, collapsedDrawerWidth, isSidebarExpanded, mobileOpen, handleDrawerToggle, handleSidebarToggle }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();

  // Escolhe a lista de menus correta com base no papel do usuário
  const menuItemsToRender = user?.role === 'IT' ? adminMenuItems : userMenuItems;

  const renderDrawerContent = (isExpanded) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Divider />
        <List>
          {menuItemsToRender.map((item) => { // Usando a variável correta aqui
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding component={Link} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemButton
                  selected={isActive}
                  sx={{
                    justifyContent: isExpanded ? 'initial' : 'center',
                    px: 2.5,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 3 : 'auto', justifyContent: 'center', color: isActive ? theme.palette.primary.main : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Divider />
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleSidebarToggle}>
            <ChevronLeftIcon sx={{ transform: isSidebarExpanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}/>
          </IconButton>
        </Toolbar>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: isSidebarExpanded ? drawerWidth : collapsedDrawerWidth }, flexShrink: { sm: 0 } }}>
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
        {renderDrawerContent(true)}
      </Drawer>

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
      >
        {renderDrawerContent(isSidebarExpanded)}
      </Drawer>
    </Box>
  );
};

export default Sidebar;