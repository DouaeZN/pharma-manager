import { useState, useEffect } from 'react';
import { fetchMedicaments, fetchAlertes } from '../api/medicamentsApi';

/**
 * Hook pour gérer la liste des médicaments et les alertes de stock.
 */
export const useMedicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMedicaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMedicaments();
      setMedicaments(data.results || data);
      const alertesData = await fetchAlertes();
      setAlertes(alertesData.results || alertesData);
    } catch (err) {
      setError('Erreur lors du chargement des médicaments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicaments();
  }, []);

  return { medicaments, alertes, loading, error, reload: loadMedicaments };
};