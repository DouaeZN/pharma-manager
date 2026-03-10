import { useState, useEffect } from 'react';
import { fetchMedicaments, fetchAlertes } from '../api/medicamentsApi';

export const useMedicaments = (page = 1) => {
  const [medicaments, setMedicaments] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMedicaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMedicaments({ page });
      setMedicaments(data.results || data);
      setMetadata(data.metadata || null);
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
  }, [page]);

  return { medicaments, alertes, metadata, loading, error, reload: loadMedicaments };
};