import client from './client';

export const getDoctors = async (params = {}) => {
  const response = await client.get('/doctors/', { params });
  return response.data;
};

export const getDoctorDetails = async (id) => {
  const response = await client.get(`/doctors/${id}/`);
  return response.data;
};

export const getDoctorSlots = async (id, dateStr) => {
  const params = dateStr ? { date: dateStr } : {};
  const response = await client.get(`/doctors/${id}/slots/`, { params });
  return response.data;
};

export const getMyDoctorProfile = async () => {
  const response = await client.get('/doctors/me/');
  return response.data;
};

export const updateDoctorProfile = async (data) => {
  const response = await client.patch('/doctors/me/', data);
  return response.data;
};

export const updateConsultationFee = async (fee) => {
  const response = await client.patch('/doctors/me/', { consultation_fee: fee });
  return response.data;
};

export const updateDoctorById = async (id, data) => {
  const response = await client.patch(`/doctors/${id}/`, data);
  return response.data;
};

