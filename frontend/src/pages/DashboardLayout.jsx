// src/pages/DashboardLayout.jsx
import React, { useState } from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DRAWER_WIDTH = 180;
const COLLAPSED_DRAWER_WIDTH = 50; // Largura da sidebar encolhida

export default function DashboardLayout() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Novo estado para controlar a sidebar

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
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
        handleSidebarToggle={handleSidebarToggle}
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
            xs: 0, // Sem margem em telas pequenas
            sm: isSidebarExpanded ? `${DRAWER_WIDTH - 180}px` : `${COLLAPSED_DRAWER_WIDTH -46}px` 
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}