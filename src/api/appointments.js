import client from './client';

export const bookAppointment = async (data) => {
  const response = await client.post('/appointments/', data);
  return response.data;
};

export const getAppointments = async (status = '', page = 1) => {
  const params = {};
  if (status) params.status = status;
  if (page) params.page = page;
  const response = await client.get('/appointments/', { params });
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await client.patch(`/appointments/${id}/cancel/`);
  return response.data;
};

export const updateAppointmentStatus = async (id, newStatus) => {
  const response = await client.patch(`/appointments/${id}/status/`, { status: newStatus });
  return response.data;
};

export const getPrescription = async (appointmentId) => {
  const response = await client.get(`/appointments/${appointmentId}/prescription/`);
  return response.data;
};

export const savePrescription = async (appointmentId, data) => {
  const response = await client.post(`/appointments/${appointmentId}/prescription/`, data);
  return response.data;
};
