import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://chwh.store/backend/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (payload: { name: string; email: string; password: string }) => {
  const res = await apiClient.post('/auth/register', payload);
  return res.data;
};

export const loginWithGoogle = async (token: string) => {
  const res = await apiClient.post('/auth/google', { token });
  return res.data;
};

export const loginWithFacebook = async (token: string) => {
  const res = await apiClient.post('/auth/facebook', { token });
  return res.data;
};

export const registerWithGoogle = async (token: string) => {
  const res = await apiClient.post('/auth/google/register', { token });
  return res.data;
};

export const registerWithFacebook = async (token: string) => {
  const res = await apiClient.post('/auth/facebook/register', { token });
  return res.data;
};


