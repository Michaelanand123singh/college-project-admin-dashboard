// src/utils/adminHelpers.js
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'text-green-700 bg-green-100',
    inactive: 'text-red-700 bg-red-100',
    pending: 'text-yellow-700 bg-yellow-100',
    completed: 'text-blue-700 bg-blue-100',
    cancelled: 'text-gray-700 bg-gray-100'
  };
  return colors[status?.toLowerCase()] || 'text-gray-700 bg-gray-100';
};

export const truncateText = (text, maxLength = 50) => {
  return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};