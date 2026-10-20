import client from './client';

export const loginUser = async (email, password) => {
  const response = await client.post('/auth/login/', { email, password });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await client.post('/auth/register/', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me/');
  return response.data;
};

export const refreshAuthToken = async (refresh) => {
  const response = await client.post('/auth/token/refresh/', { refresh });
  return response.data;
};
