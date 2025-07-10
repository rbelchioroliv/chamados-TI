// src/pages/admin/HistoricoChamados.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../../api';
import * as XLSX from 'xlsx'; // Importa a biblioteca para Excel
import { priorityMap } from '../../utils/mappings';

const HistoricoChamados = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ year: '', month: '', day: '' });
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 10, total: 0 });

  const fetchHistory = async (page = 0, rowsPerPage = 10) => {
    setLoading(true);
    const params = {
      ...filters,
      page: page + 1,
      limit: rowsPerPage,
    };
    // Remove filtros vazios para não enviar na URL
    Object.keys(params).forEach(key => !params[key] && delete params[key]);

    try {
      const response = await api.get('/admin/tickets/history', { params });
      setHistory(response.data.tickets);
      setPagination(prev => ({ ...prev, total: response.data.total }));
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(pagination.page, pagination.rowsPerPage);
  }, [pagination.page, pagination.rowsPerPage]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 0 })); // Reseta para a primeira página
    fetchHistory(0, pagination.rowsPerPage);
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    setPagination(prev => ({ ...prev, rowsPerPage: parseInt(event.target.value, 10), page: 0 }));
  };

  const handleExport = () => {
    const formattedData = history.map(ticket => ({
      'Título': ticket.title,
      'Solicitante': ticket.owner.name,
      'Setor': ticket.owner.department,
      'Prioridade': priorityMap[ticket.priority]?.label || ticket.priority,
      'Data de Conclusão': new Date(ticket.completedAt).toLocaleString('pt-BR'),
      'Descrição': ticket.description,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico de Chamados");
    XLSX.writeFile(workbook, "Historico_Chamados.xlsx");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Histórico de Chamados Concluídos</Typography>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport} disabled={history.length === 0}>
          Exportar para Excel
        </Button>
      </Box>

      <Grid container spacing={2} mb={3} alignItems="flex-end">
        <Grid item xs={12} sm={3}><TextField name="year" label="Ano (ex: 2025)" fullWidth onChange={handleFilterChange} /></Grid>
        <Grid item xs={12} sm={3}><TextField name="month" label="Mês (1-12)" fullWidth onChange={handleFilterChange} /></Grid>
        <Grid item xs={12} sm={3}><TextField name="day" label="Dia" fullWidth onChange={handleFilterChange} /></Grid>
        <Grid item xs={12} sm={3}><Button variant="outlined" fullWidth onClick={handleApplyFilters}>Aplicar Filtros</Button></Grid>
      </Grid>

      {loading ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Solicitante</TableCell>
                <TableCell>Setor</TableCell>
                <TableCell>Data de Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.owner.name}</TableCell>
                  <TableCell>{ticket.owner.department}</TableCell>
                  <TableCell>{new Date(ticket.completedAt).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={handlePageChange}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default HistoricoChamados;