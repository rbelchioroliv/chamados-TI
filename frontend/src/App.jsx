import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

// Layouts e Componentes de Rota
import DashboardLayout from './pages/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Páginas
import Login from './pages/auth/Login';
import Cadastro from './pages/auth/Cadastro';
import VisaoGeral from './pages/dashboard/VisaoGeral';
import NovoChamado from './pages/dashboard/NovoChamado';
import ChamadosSolicitados from './pages/dashboard/ChamadosSolicitados';
import OrdensAndamento from './pages/dashboard/OrdensAndamento';
import ChamadosConcluidos from './pages/dashboard/ChamadosConcluidos';
import FilaChamados from './pages/admin/FilaChamados';
import HistoricoChamados from './pages/admin/HistoricoChamados';
import UserManagement from './pages/admin/UserManagement';

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

      {/* Rota usuário */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<VisaoGeral />} />
        <Route path="novo-chamado" element={<NovoChamado />} />
        <Route path="solicitados" element={<ChamadosSolicitados />} />
        <Route path="andamento" element={<OrdensAndamento />} />
        <Route path="concluidos" element={<ChamadosConcluidos />} />
      </Route>

      {/* Rota admin */}
      <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route path="fila" element={<FilaChamados />} />
          <Route path="historico" element={<HistoricoChamados />} />
          <Route path="/admin/users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;