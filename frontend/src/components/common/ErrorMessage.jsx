import { FaExclamationCircle } from 'react-icons/fa';

/**
 * Composant réutilisable pour afficher les erreurs.
 */
function ErrorMessage({ message }) {
  return (
    <div style={{
      background: '#fee2e2', color: '#dc2626', padding: '1rem',
      borderRadius: '8px', marginBottom: '1rem',
      display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500
    }}>
      <FaExclamationCircle />
      {message}
    </div>
  );
}

export default ErrorMessage;