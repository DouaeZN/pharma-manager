import axios from 'axios';

/**
 * Instance Axios configurée avec la baseURL depuis les variables d'environnement.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;