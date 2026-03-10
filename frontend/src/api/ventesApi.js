import axiosInstance from './axiosConfig';

/**
 * Récupère l'historique des ventes.
 */
export const fetchVentes = async () => {
  const response = await axiosInstance.get('/ventes/');
  return response.data;
};

/**
 * Crée une nouvelle vente.
 */
export const createVente = async (data) => {
  const response = await axiosInstance.post('/ventes/', data);
  return response.data;
};

/**
 * Annule une vente.
 */
export const annulerVente = async (id) => {
  const response = await axiosInstance.post(`/ventes/${id}/annuler/`);
  return response.data;
};