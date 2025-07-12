// src/pages/DashboardLayout.jsx
import React, { useState, useRef } from 'react'; // 1. Importa o useRef
import { Box, CssBaseline, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DRAWER_WIDTH = 180;
const COLLAPSED_DRAWER_WIDTH = 65; // Largura da sidebar encolhida

export default function DashboardLayout() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // Inicia encolhida
  const timerRef = useRef(null); // 2. Ref para guardar a referência do timer

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 3. Novas funções para controlar o hover
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current); // Cancela qualquer timer de encolhimento pendente
    setIsSidebarExpanded(true);
  };

  const handleMouseLeave = () => {
    // Inicia um timer para encolher a sidebar após 1 segundo
    timerRef.current = setTimeout(() => {
      setIsSidebarExpanded(false);
    }, 1000); // 1000 milissegundos = 1 segundo
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header
        drawerWidth={DRAWER_WIDTH}
        collapsedDrawerWidth={COLLAPSED_DRAWER_WIDTH}
        isSidebarExpanded={isSidebarExpanded}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        collapsedDrawerWidth={COLLAPSED_DRAWER_WIDTH}
        isSidebarExpanded={isSidebarExpanded}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        // Passa as novas funções de hover para a sidebar
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          mt: '64px',
          ml: { 
            xs: 0,
            sm: isSidebarExpanded ? `${DRAWER_WIDTH - 180}px` : `${COLLAPSED_DRAWER_WIDTH - 65}px` 
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}




