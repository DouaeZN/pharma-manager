import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { FaPills, FaHome, FaReceipt } from 'react-icons/fa';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <FaPills style={{ color: 'white', fontSize: '1.5rem' }} />
            <span className="brand-name">PharmaManager</span>
          </div>
          <div className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FaHome /> Dashboard
            </NavLink>
            <NavLink to="/medicaments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FaPills /> Médicaments
            </NavLink>
            <NavLink to="/ventes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <FaReceipt /> Ventes
            </NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/medicaments" element={<MedicamentsPage />} />
            <Route path="/ventes" element={<VentesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;