export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatHours = (hours) => {
  if (!hours) return '0h';
  return `${hours.toFixed(2)}h`;
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'warning',
    exiting: 'warning',
    offboarded: 'danger',
    applied: 'info',
    interview: 'warning',
    rejected: 'danger',
    onboarded: 'success',
    pending: 'warning',
    approved: 'success',
    'Punched In': 'success',
    'Punched Out': 'default',
    'On Leave': 'warning',
    'Not Punched': 'danger',
  };
  return colors[status] || 'default';
};

export const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


