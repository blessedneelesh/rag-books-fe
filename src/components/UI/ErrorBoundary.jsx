import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import './ErrorBoundary.css';

const ErrorBoundary = () => {
  const error = useRouteError();
  
  console.error('Route Error:', error);

  return (
    <div className="error-boundary">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h1 className="error-title">Oops! Something went wrong</h1>
        
        <div className="error-details">
          <p className="error-message">
            {error?.message || error?.statusText || 'An unexpected error occurred'}
          </p>
          
          {error?.status && (
            <p className="error-status">Error Code: {error.status}</p>
          )}
        </div>

        <div className="error-actions">
          <Link to="/" className="home-button">
            🏠 Go Home
          </Link>
          
          <button 
            onClick={() => window.location.reload()} 
            className="reload-button"
          >
            🔄 Reload Page
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="error-stack">
            <summary>Error Details (Development)</summary>
            <pre className="stack-trace">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;