import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/navigation.css';

export const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 Library Management
        </Link>

        <div className="navbar-menu">
          <ul className="navbar-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to="/authors">Authors</Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/my-books">My Books</Link>
                </li>
                <li>
                  <Link to="/profiles">Profiles</Link>
                </li>
              </>
            )}
          </ul>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
