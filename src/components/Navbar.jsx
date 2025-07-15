import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const logo = 'logo.jpg';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: '👥' },
    { path: '/depot', label: 'Dépôts', icon: '💰' },
    { path: '/retraits', label: 'Retraits', icon: '💸' },
    { path: '/commissions', label: 'Commissions', icon: '📈' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logo} alt="TWB Logo" className="navbar-logo" />
          <div className="brand-text">
            <h1 className="brand-title">TWB</h1>
            <span className="brand-subtitle">Admin Panel</span>
          </div>
        </div>
        
        <div className="navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="navbar-actions">
          <button className="btn-notification">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <img src="/api/placeholder/32/32" alt="Profile" className="profile-avatar" />
            <span className="profile-name">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
}