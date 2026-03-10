import axios from 'axios';

export const login = async (username, password) => {
  const response = await axios.post('http://localhost:8000/api/v1/auth/login/', { username, password });
  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await axios.post('http://localhost:8000/api/v1/auth/refresh/', { refresh });
  return response.data;
};