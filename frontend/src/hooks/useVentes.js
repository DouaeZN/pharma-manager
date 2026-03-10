import { useState, useEffect } from 'react';
import { fetchVentes, createVente, annulerVente } from '../api/ventesApi';

/**
 * Hook pour gérer les ventes.
 */
export const useVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVentes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVentes();
      setVentes(data.results || data);
    } catch (err) {
      setError('Erreur lors du chargement des ventes.');
    } finally {
      setLoading(false);
    }
  };

  const ajouterVente = async (data) => {
    try {
      await createVente(data);
      await loadVentes();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data || 'Erreur lors de la création.' 
      };
    }
  };

  const annuler = async (id) => {
    try {
      await annulerVente(id);
      await loadVentes();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data || 'Erreur lors de l\'annulation.' 
      };
    }
  };

  useEffect(() => {
    loadVentes();
  }, []);

  return { ventes, loading, error, ajouterVente, annuler, reload: loadVentes };
};