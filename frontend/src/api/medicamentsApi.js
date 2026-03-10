import axiosInstance from './axiosConfig';

/**
 * Récupère la liste des médicaments.
 */
export const fetchMedicaments = async (params = {}) => {
  const response = await axiosInstance.get('/medicaments/', { params });
  return response.data;
};

/**
 * Crée un nouveau médicament.
 */
export const createMedicament = async (data) => {
  const response = await axiosInstance.post('/medicaments/', data);
  return response.data;
};

/**
 * Met à jour le stock d'un médicament.
 */
export const updateStock = async (id, quantite) => {
  const response = await axiosInstance.patch(`/medicaments/${id}/`, { stock_actuel: quantite });
  return response.data;
};

/**
 * Modifie un médicament existant.
 */
export const updateMedicament = async (id, data) => {
  const response = await axiosInstance.patch(`/medicaments/${id}/`, data);
  return response.data;
};

/**
 * Supprime (soft delete) un médicament.
 */
export const deleteMedicament = async (id) => {
  const response = await axiosInstance.delete(`/medicaments/${id}/`);
  return response.data;
};

/**
 * Récupère les médicaments en alerte de stock.
 */
export const fetchAlertes = async () => {
  const response = await axiosInstance.get('/medicaments/alertes/');
  return response.data;
};