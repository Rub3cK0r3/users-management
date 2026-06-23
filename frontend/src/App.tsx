import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';
import { useAuth } from './hooks/useAuth';
import { Navigation } from './components/Navigation';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { MyBooksPage } from './pages/MyBooksPage';
import { ProfilesPage } from './pages/ProfilesPage';
import './styles/global.css';

// Protected route component
const ProtectedRoute = ({
  element,
  isAuthenticated,
}: {
  element: ReactElement;
  isAuthenticated: boolean;
}) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navigation />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/authors" element={<AuthorsPage />} />

        <Route
          path="/my-books"
          element={
            <ProtectedRoute
              element={<MyBooksPage />}
              isAuthenticated={isAuthenticated}
            />
          }
        />

        <Route
          path="/profiles"
          element={
            <ProtectedRoute
              element={<ProfilesPage />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;