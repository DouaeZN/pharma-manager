import { FaSpinner } from 'react-icons/fa';

/**
 * Composant réutilisable d'indicateur de chargement.
 */
function LoadingSpinner({ message = 'Chargement...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
      color: '#0d4f8c'
    }}>
      <FaSpinner style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontWeight: 500 }}>{message}</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default LoadingSpinner;