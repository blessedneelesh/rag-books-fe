import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Chat', icon: '💬' },
    { path: '/library', label: 'Library', icon: '📚' },
    { path: '/add-book', label: 'Add Book', icon: '➕' }
  ];

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="app-icon">🤖</span>
            RAG Books Assistant
          </h1>
          <nav className="navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <div className="main-content">
          <Outlet />
        </div>
      </main>

      <footer className="layout-footer">
        <div className="footer-content">
          <p>&copy; 2024 RAG Books Assistant - Powered by AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;