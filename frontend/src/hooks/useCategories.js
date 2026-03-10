import { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categoriesApi';

/**
 * Hook pour gérer les catégories.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data.results || data);
      } catch (err) {
        setError('Erreur lors du chargement des catégories.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { categories, loading, error };
};