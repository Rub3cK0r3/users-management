import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages.css';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Welcome to Library Management</h1>
          <p className="page-subtitle">
            Manage your book collection efficiently with our modern interface
          </p>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <Link to="/books" className="card" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📖</div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Books</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Browse and manage the book collection
          </p>
        </Link>

        <Link to="/authors" className="card" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✍️</div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Authors</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage authors and their works
          </p>
        </Link>

        {isAuthenticated && (
          <Link to="/my-books" className="card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>My Books</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              View your borrowed books
            </p>
          </Link>
        )}
      </div>

      {!isAuthenticated && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>Get Started</h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            Sign in to access all features and manage your library
          </p>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      )}

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>📊 Features</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>✓ Browse complete book catalog</li>
            <li>✓ Manage book instances</li>
            <li>✓ Track borrowed books</li>
            <li>✓ User profiles & permissions</li>
            <li>✓ REST API backend</li>
          </ul>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🛠️ Technology Stack</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>Frontend: React + TypeScript</li>
            <li>Styling: Custom CSS with design tokens</li>
            <li>HTTP: Axios with JWT auth</li>
            <li>Backend: Django + DRF</li>
            <li>Database: SQLite</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
