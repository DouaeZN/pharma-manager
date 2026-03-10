import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { FaPills, FaHome, FaReceipt, FaSignOutAlt } from 'react-icons/fa';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
}

function Navbar() {
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon"><FaPills /></span>
        <span className="brand-name">PharmaManager</span>
      </div>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome /> Dashboard
        </Link>
        <Link to="/medicaments" className={`nav-link ${location.pathname === '/medicaments' ? 'active' : ''}`}>
          <FaPills /> Médicaments
        </Link>
        <Link to="/ventes" className={`nav-link ${location.pathname === '/ventes' ? 'active' : ''}`}>
          <FaReceipt /> Ventes
        </Link>
        <button onClick={handleLogout} className="nav-link" style={{
          background: '#dc2626', border: 'none', cursor: 'pointer',
          color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </nav>
  );
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout><DashboardPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/medicaments" element={
          <PrivateRoute>
            <Layout><MedicamentsPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/ventes" element={
          <PrivateRoute>
            <Layout><VentesPage /></Layout>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;