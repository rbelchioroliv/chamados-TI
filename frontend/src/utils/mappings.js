// src/utils/mappings.js

export const statusMap = {
  REQUESTED: { label: 'Solicitado', color: 'primary' },
  IN_PROGRESS: { label: 'Em Andamento', color: 'warning' },
  COMPLETED: { label: 'Concluído', color: 'success' },
};

export const priorityMap = {
  NORMAL: { label: 'Normal', color: 'default' },
  URGENT: { label: 'Urgente', color: 'error' },
};