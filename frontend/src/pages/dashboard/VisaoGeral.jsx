import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const VisaoGeral = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [itStatus, setItStatus] = useState(null);
  const [queueInfo, setQueueInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statusResponse, positionResponse] = await Promise.all([
          api.get('/it-status'),
          api.get('/tickets/my-position')
        ]);
        
        setItStatus(statusResponse.data);
        setQueueInfo(positionResponse.data);

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 128px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {user?.name.split(' ')[0]}!
      </Typography>
      
      {/* Card de Status do TI*/}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Status da Equipe de TI</Typography>
        {itStatus?.status === 'DISPONIVEL' ? (
          <Alert severity="success">A equipe de TI está disponível para novos chamados.</Alert>
        ) : (
       
          itStatus.task?.ownerId === user.id ? (
            
            <Alert severity="success">
              A equipe de TI está <strong>ocupada</strong> trabalhando em sua solicitação.
              <Typography variant="body2" sx={{ mt: 1 }}>
                Logo você receberá um retorno, obrigado!
              </Typography>
            </Alert>
          ) : (
            
            <Alert severity="info">
              A equipe de TI está <strong>ocupada</strong> no momento.
              <Typography variant="body2" sx={{ mt: 1 }}>
                {itStatus?.task.priority === 'URGENT' 
                  ? "Trabalhando em um chamado urgente, logo sua solicitação será atendida!"
                  : "Trabalhando em um chamado, logo sua solicitação será atendida!"
                }
              </Typography>
            </Alert>
          )
        )}
      </Paper>
      
      {/* Card da Fila do Usuário */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Seu Chamado na Fila</Typography>
        {queueInfo?.position ? (
          <>
            <Typography variant="body1">
              Chamado: <strong>"{queueInfo.ticketTitle}"</strong>
            </Typography>
            <Typography variant="h3" component="p" textAlign="center" my={2}>
              {queueInfo.position}ª
            </Typography>
            <Typography variant="body1" textAlign="center">
              Posição na fila de atendimento.
            </Typography>
          </>
        ) : (
          <Typography>Você não possui chamados na fila no momento.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default VisaoGeral;