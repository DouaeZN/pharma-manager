import { useState } from 'react';
import { useVentes } from '../hooks/useVentes';
import { useMedicaments } from '../hooks/useMedicaments';
import { createVente } from '../api/ventesApi';
import { FaReceipt, FaPlus, FaTimes, FaTrash, FaCheckCircle, FaBan, FaClock } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';

/**
 * Page Ventes — Historique et création de ventes.
 */
function VentesPage() {
  const { ventes, loading, error, reload } = useVentes();
  const { medicaments } = useMedicaments();
  const [showForm, setShowForm] = useState(false);
  const [lignes, setLignes] = useState([{ medicament: '', quantite: 1 }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleLigneChange = (index, field, value) => {
    const newLignes = [...lignes];
    newLignes[index][field] = value;
    setLignes(newLignes);
  };

  const ajouterLigne = () => setLignes([...lignes, { medicament: '', quantite: 1 }]);

  const supprimerLigne = (index) => setLignes(lignes.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSuccessMsg(null);
    try {
      await createVente({ lignes });
      setSuccessMsg('Vente enregistrée avec succès !');
      setLignes([{ medicament: '', quantite: 1 }]);
      setShowForm(false);
      reload();
    } catch (err) {
      setFormError(err.response?.data || 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnnuler = async (id, reference) => {
    if (!window.confirm(`Annuler la vente ${reference} ?`)) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/ventes/${id}/annuler/`, { method: 'POST' });
      reload();
    } catch {
      alert('Erreur lors de l\'annulation.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaReceipt style={{ color: '#1a6b3c' }} /> Ventes
        </h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {showForm ? <><FaTimes /> Fermer</> : <><FaPlus /> Nouvelle Vente</>}
        </button>
      </div>

      {error && <ErrorMessage message={error} />}


      {successMsg && <SuccessMessage message={successMsg} />}


      {/* Formulaire nouvelle vente */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1a2332', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaPlus style={{ color: '#1a6b3c' }} /> Nouvelle Vente
          </h2>
          {formError && <div className="error-msg">{JSON.stringify(formError)}</div>}
          <form onSubmit={handleSubmit}>
            {lignes.map((ligne, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', marginBottom: '0.75rem', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Médicament *</label>
                  <select value={ligne.medicament}
                    onChange={(e) => handleLigneChange(index, 'medicament', e.target.value)} required>
                    <option value="">-- Choisir --</option>
                    {medicaments.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nom} ({m.dosage}) — Stock: {m.stock_actuel}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Quantité *</label>
                  <input type="number" min="1" value={ligne.quantite}
                    onChange={(e) => handleLigneChange(index, 'quantite', parseInt(e.target.value))} required />
                </div>
                <button type="button" className="btn btn-danger"
                  onClick={() => supprimerLigne(index)} disabled={lignes.length === 1}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FaTrash />
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-success" onClick={ajouterLigne}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaPlus /> Ajouter un article
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaCheckCircle /> {submitting ? 'Enregistrement...' : 'Confirmer la vente'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historique */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1a2332', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaReceipt style={{ color: '#0d4f8c' }} /> Historique des Ventes
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Date</th>
              <th>Total TTC</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente) => (
              <tr key={vente.id}>
                <td><strong>{vente.reference}</strong></td>
                <td>{new Date(vente.date_vente).toLocaleDateString('fr-FR')}</td>
                <td style={{ fontWeight: 700, color: '#1a6b3c' }}>{vente.total_ttc} MAD</td>
                <td>
                  {vente.statut === 'annulee'
                    ? <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><FaBan /> Annulée</span>
                    : vente.statut === 'completee'
                    ? <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle /> Complétée</span>
                    : <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><FaClock /> En cours</span>
                  }
                </td>
                <td>
                  {vente.statut !== 'annulee' && (
                    <button className="btn btn-danger" onClick={() => handleAnnuler(vente.id, vente.reference)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaBan /> Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {ventes.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#4a5568' }}>
                  Aucune vente enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VentesPage;