import React, { useState, useRef } from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DRAWER_WIDTH = 180;
const COLLAPSED_DRAWER_WIDTH = 65; // Largura da sidebar

export default function DashboardLayout() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 
  const timerRef = useRef(null); 

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current); 
    setIsSidebarExpanded(true);
  };

  const handleMouseLeave = () => {
  
    timerRef.current = setTimeout(() => {
      setIsSidebarExpanded(false);
    }, 1000); 
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




