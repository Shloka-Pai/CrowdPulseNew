import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Leaf size={24} color="var(--color-accent)" />
        <span className="brand-name">CrowdPulse</span>
      </div>
      <div className="nav-links">
        {!isDashboard && location.pathname !== '/login' && (
          <Link to="/login" className="btn btn-outline">Log In</Link>
        )}
        {!isDashboard && location.pathname !== '/register' && (
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        )}
        {isDashboard && (
          <button onClick={handleLogout} className="btn btn-outline" style={{ border: 'none', color: 'var(--color-text-secondary)' }}>
            <LogOut size={18} /> Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
