import { useState } from 'react';
import { useMedicaments } from '../hooks/useMedicaments';
import { useCategories } from '../hooks/useCategories';
import { createMedicament, deleteMedicament, updateStock, updateMedicament } from '../api/medicamentsApi';
import { FaPills, FaPlus, FaTimes, FaSearch, FaTrash, FaExclamationTriangle, FaCheckCircle, FaBoxes, FaEdit } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';


function MedicamentsPage() {
  const [page, setPage] = useState(1);
  const { medicaments, alertes, metadata, loading, error, reload } = useMedicaments(page);
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [search, setSearch] = useState('');
  

  const emptyForm = {
    nom: '', dci: '', categorie: '', forme: 'comprime',
    dosage: '', prix_achat: '', prix_vente: '',
    stock_actuel: '', stock_minimum: 10,
    date_expiration: '', ordonnance_requise: false,
  };

  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (med) => {
    setEditMode(true);
    setEditId(med.id);
    setForm({
      nom: med.nom,
      dci: med.dci || '',
      categorie: med.categorie,
      forme: med.forme,
      dosage: med.dosage,
      prix_achat: med.prix_achat,
      prix_vente: med.prix_vente,
      stock_actuel: med.stock_actuel,
      stock_minimum: med.stock_minimum,
      date_expiration: med.date_expiration,
      ordonnance_requise: med.ordonnance_requise,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (editMode) {
        await updateMedicament(editId, form);
      } else {
        await createMedicament(form);
      }
      handleCloseForm();
      reload();
    } catch (err) {
      setFormError(err.response?.data || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Désactiver ${nom} ?`)) return;
    await deleteMedicament(id);
    reload();
  };

  const handleReappro = async (med) => {
    const quantite = window.prompt(
      `Réapprovisionner "${med.nom}"\nStock actuel : ${med.stock_actuel}\nNouveau stock :`,
      med.stock_actuel + 50
    );
    if (quantite === null) return;
    const newStock = parseInt(quantite);
    if (isNaN(newStock) || newStock < 0) {
      alert('Quantité invalide.');
      return;
    }
    await updateStock(med.id, newStock);
    reload();
  };

  const filtered = medicaments.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaPills style={{ color: '#0d4f8c' }} /> Médicaments
        </h1>
        <button className="btn btn-primary" onClick={() => showForm ? handleCloseForm() : setShowForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {showForm ? <><FaTimes /> Fermer</> : <><FaPlus /> Ajouter</>}
        </button>
      </div>

      {alertes.length > 0 && (
        <div style={{ background: '#fff7ed', color: '#c2410c', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid #f97316', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaExclamationTriangle />
          {alertes.length} médicament(s) en rupture de stock imminente
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Formulaire Ajout / Modification */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1a2332', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {editMode
              ? <><FaEdit style={{ color: '#0d4f8c' }} /> Modifier le Médicament</>
              : <><FaPlus style={{ color: '#1a6b3c' }} /> Nouveau Médicament</>
            }
          </h2>
          {formError && <div className="error-msg">{JSON.stringify(formError)}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Nom commercial *</label>
                <input name="nom" value={form.nom} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>DCI</label>
                <input name="dci" value={form.dci} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Catégorie *</label>
                <select name="categorie" value={form.categorie} onChange={handleChange} required>
                  <option value="">-- Choisir --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Forme</label>
                <select name="forme" value={form.forme} onChange={handleChange}>
                  <option value="comprime">Comprimé</option>
                  <option value="sirop">Sirop</option>
                  <option value="injection">Injection</option>
                  <option value="creme">Crème</option>
                  <option value="capsule">Capsule</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input name="dosage" value={form.dosage} onChange={handleChange} placeholder="ex: 500mg" required />
              </div>
              <div className="form-group">
                <label>Date expiration *</label>
                <input type="date" name="date_expiration" value={form.date_expiration} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Prix achat (MAD) *</label>
                <input type="number" step="0.01" name="prix_achat" value={form.prix_achat} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Prix vente (MAD) *</label>
                <input type="number" step="0.01" name="prix_vente" value={form.prix_vente} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Stock actuel *</label>
                <input type="number" name="stock_actuel" value={form.stock_actuel} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Stock minimum *</label>
                <input type="number" name="stock_minimum" value={form.stock_minimum} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="ordonnance_requise" checked={form.ordonnance_requise} onChange={handleChange} />
                Ordonnance requise
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaCheckCircle /> {submitting ? 'Enregistrement...' : editMode ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button type="button" className="btn btn-danger" onClick={handleCloseForm}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaTimes /> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className="card">
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaSearch style={{ color: '#4a5568' }} />
          <input
            placeholder="Rechercher un médicament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.6rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', width: '300px', outline: 'none' }}
          />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix Vente</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((med) => (
              <tr key={med.id}>
                <td>
                  <strong>{med.nom}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#4a5568' }}>{med.dosage}</div>
                </td>
                <td>{med.categorie_detail?.nom || '—'}</td>
                <td>{med.prix_vente} MAD</td>
                <td>
                  <span style={{ fontWeight: 700, color: med.est_en_alerte ? '#dc2626' : '#16a34a' }}>
                    {med.stock_actuel}
                  </span>
                </td>
                <td>
                  {med.est_en_alerte
                    ? <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><FaExclamationTriangle /> Stock Bas</span>
                    : <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle /> OK</span>
                  }
                </td>
                <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn" onClick={() => handleEdit(med)}
                    style={{ background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaEdit /> Modifier
                  </button>
                  {med.est_en_alerte && (
                    <button className="btn btn-success" onClick={() => handleReappro(med)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaBoxes /> Réappro
                    </button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDelete(med.id, med.nom)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaTrash /> Désactiver
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#4a5568' }}>Aucun médicament trouvé</td></tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {metadata && metadata.total_pages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e8f0fe'
          }}>
            <button
              className="btn"
              onClick={() => setPage(page - 1)}
              disabled={!metadata.has_previous}
              style={{ background: '#e0f2fe', color: '#0369a1' }}
            >
              ‹
            </button>

            <span style={{ fontWeight: 600, color: '#1a2332' }}>
              Page {metadata.current_page} / {metadata.total_pages}
            </span>

            <button
              className="btn"
              onClick={() => setPage(page + 1)}
              disabled={!metadata.has_next}
              style={{ background: '#e0f2fe', color: '#0369a1' }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicamentsPage;