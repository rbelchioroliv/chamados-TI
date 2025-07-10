// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { Box, CircularProgress } from '@mui/material';

// Layouts e Componentes de Rota
import DashboardLayout from './pages/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Páginas Públicas
import Login from './pages/auth/Login';
import Cadastro from './pages/auth/Cadastro';

// Páginas de Usuário
import VisaoGeral from './pages/dashboard/VisaoGeral';
import NovoChamado from './pages/dashboard/NovoChamado';
import ChamadosSolicitados from './pages/dashboard/ChamadosSolicitados';
import OrdensAndamento from './pages/dashboard/OrdensAndamento';
import ChamadosConcluidos from './pages/dashboard/ChamadosConcluidos';

// Páginas de Admin
import FilaChamados from './pages/admin/FilaChamados';
import HistoricoChamados from './pages/admin/HistoricoChamados';

// Componente wrapper para não repetir código
const UserRoutesWrapper = () => (
  <ProtectedRoute>
    <TicketProvider>
      <DashboardLayout />
    </TicketProvider>
  </ProtectedRoute>
);

const AdminRoutesWrapper = () => (
  <AdminRoute>
    <TicketProvider>
      <DashboardLayout />
    </TicketProvider>
  </AdminRoute>
);


function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          !isAuthenticated ? <Navigate to="/login" /> : 
          user.role === 'IT' ? <Navigate to="/admin/fila" /> : 
          <Navigate to="/dashboard" />
        } 
      />
      
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas de Usuário */}
      <Route element={<UserRoutesWrapper />}>
        <Route path="/dashboard" element={<VisaoGeral />} />
        <Route path="/dashboard/novo-chamado" element={<NovoChamado />} />
        <Route path="/dashboard/solicitados" element={<ChamadosSolicitados />} />
        <Route path="/dashboard/andamento" element={<OrdensAndamento />} />
        <Route path="/dashboard/concluidos" element={<ChamadosConcluidos />} />
      </Route>

      {/* Rotas de Admin */}
      <Route element={<AdminRoutesWrapper />}>
        <Route path="/admin/fila" element={<FilaChamados />} />
        <Route path="/admin/historico" element={<HistoricoChamados />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;