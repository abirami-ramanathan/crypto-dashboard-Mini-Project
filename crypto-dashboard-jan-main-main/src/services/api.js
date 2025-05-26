import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Demo user credentials
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'demo123',
  token: 'demo-token',
  userId: 'demo-user'
};

// Auth APIs
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Portfolio APIs
export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const updatePortfolio = async (holdings) => {
  const response = await api.put('/portfolio', { holdings });
  return response.data;
};

// Transaction APIs
export const getTransactions = async () => {
  try {
    const response = await api.get('/transactions');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User APIs
export const updateBalance = async (balance) => {
  const response = await api.put('/users/balance', { balance });
  return response.data;
}; 