import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { FaUser, FaLock, FaSignInAlt, FaPills } from 'react-icons/fa';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(username, password);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/');
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a6b3c 0%, #0d4f8c 100%)'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '2.5rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#1a6b3c' }}>
            <FaPills />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a2332' }}>PharmaManager</h1>
          <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Connectez-vous à votre espace</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#dc2626',
            padding: '0.8rem 1rem', borderRadius: '8px',
            marginBottom: '1rem', fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaUser style={{ color: '#0d4f8c' }} /> Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaLock style={{ color: '#0d4f8c' }} /> Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%', marginTop: '1.5rem', padding: '0.8rem',
              fontSize: '1rem', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <FaSignInAlt />
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;