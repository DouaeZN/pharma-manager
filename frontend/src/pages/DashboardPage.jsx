import { useMedicaments } from '../hooks/useMedicaments';
import { useVentes } from '../hooks/useVentes';
import { FaPills, FaExclamationTriangle, FaShoppingCart, FaCalendarDay } from 'react-icons/fa';

/**
 * Page Dashboard — Vue d'ensemble de la pharmacie.
 */
function DashboardPage() {
  const { medicaments, alertes, loading } = useMedicaments();
  const { ventes } = useVentes();

  const aujourd_hui = new Date().toDateString();
  const ventesAujourdhui = ventes.filter(
    (v) => new Date(v.date_vente).toDateString() === aujourd_hui
  );
  const totalJour = ventesAujourdhui.reduce(
    (sum, v) => sum + parseFloat(v.total_ttc || 0), 0
  );

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de Bord</h1>
        <span style={{ color: '#4a5568', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FaCalendarDay />
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>

        <div className="card" style={{ borderLeft: '4px solid #0d4f8c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Médicaments
            </div>
            <FaPills style={{ color: '#0d4f8c', fontSize: '1.5rem' }} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0d4f8c' }}>
            {medicaments.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.3rem' }}>
            médicaments actifs
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600, textTransform: 'uppercase' }}>
              Alertes Stock
            </div>
            <FaExclamationTriangle style={{ color: '#dc2626', fontSize: '1.5rem' }} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#dc2626' }}>
            {alertes.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.3rem' }}>
            sous le seuil minimum
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #1a6b3c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 600, textTransform: 'uppercase' }}>
              Ventes du Jour
            </div>
            <FaShoppingCart style={{ color: '#1a6b3c', fontSize: '1.5rem' }} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a6b3c' }}>
            {ventesAujourdhui.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#4a5568', marginTop: '0.3rem' }}>
            Total : {totalJour.toFixed(2)} MAD
          </div>
        </div>

      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaExclamationTriangle /> Médicaments en Alerte de Stock
          </h2>
          <table className="table">
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Stock Actuel</th>
                <th>Stock Minimum</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map((med) => (
                <tr key={med.id}>
                  <td><strong>{med.nom}</strong></td>
                  <td style={{ color: '#dc2626', fontWeight: 700 }}>{med.stock_actuel}</td>
                  <td>{med.stock_minimum}</td>
                  <td><span className="badge badge-danger">Stock Bas</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;