import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { statusMap, priorityMap } from '../../utils/mappings';




export default function TicketCard({ ticket }) {
  const { title, description, status, priority, createdAt, estimatedCompletion } = ticket;

  return (
    <Card sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" noWrap title={title}>
            {title}
          </Typography>
          <Chip
            label={statusMap[status]?.label || 'Desconhecido'}
            color={statusMap[status]?.color || 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
          height: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Chip
            label={`Prioridade: ${priorityMap[priority]?.label || ''}`}
            color={priorityMap[priority]?.color || 'default'}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            Criado em: {new Date(createdAt).toLocaleDateString('pt-BR')}
          </Typography>
        </Box>
        {status === 'IN_PROGRESS' && estimatedCompletion && (
           <Typography variant="caption" display="block" color="error" mt={1}>
            Previsão: {new Date(estimatedCompletion).toLocaleDateString('pt-BR')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}