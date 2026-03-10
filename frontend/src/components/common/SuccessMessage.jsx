import { FaCheckCircle } from 'react-icons/fa';

/**
 * Composant réutilisable pour afficher les messages de succès.
 */
function SuccessMessage({ message }) {
  return (
    <div style={{
      background: '#dcfce7', color: '#16a34a', padding: '1rem',
      borderRadius: '8px', marginBottom: '1rem',
      display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
    }}>
      <FaCheckCircle />
      {message}
    </div>
  );
}

export default SuccessMessage;