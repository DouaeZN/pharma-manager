import axiosInstance from './axiosConfig';

/**
 * Récupère la liste des catégories.
 */
export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories/');
  return response.data;
};