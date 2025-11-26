import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useData } from '../../Provider/DataProvider';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { clearConversations } = useData();

  const handleNewChat = () => {
    // Clear conversations and reset chat state
    clearConversations();
    // Close sidebar on mobile after action
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      {/* Mobile Header with Breadcrumbs */}
      <header className="mobile-header">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="breadcrumbs">
          <span className="breadcrumb-item">🤖 RAG Assistant</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item current">Chat</span>
        </div>
        <button className="mobile-new-chat" onClick={handleNewChat}>
          ✨
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <span className="app-icon">🤖</span>
            RAG Assistant
          </h1>
        </div>
        
        <div className="sidebar-content">
          <button className="new-chat-button" onClick={handleNewChat}>
            <span className="new-chat-icon">✨</span>
            New Chat
          </button>
          
          <nav className="sidebar-nav">
            <Link
              to="/"
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="nav-icon">💬</span>
              <span className="nav-label">Chat</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="layout-main">
        <div className="main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;