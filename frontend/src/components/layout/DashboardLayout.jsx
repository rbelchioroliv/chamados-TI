// src/pages/DashboardLayout.jsx
import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Outlet renderiza as páginas filhas
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DRAWER_WIDTH = 240;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header drawerWidth={DRAWER_WIDTH} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar drawerWidth={DRAWER_WIDTH} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          
        }}
      >
        {/* As páginas (Novo chamado, etc.) serão renderizadas aqui pelo Outlet */}
        <Outlet />
      </Box>
    </Box>
  );
}