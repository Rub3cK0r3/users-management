import { useState, useEffect } from 'react';
import { type BookInstance } from '../types';
import api from '../services/api';
import '../styles/pages.css';

export const MyBooksPage = () => {
  const [bookInstances, setBookInstances] = useState<BookInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.getMyBorrowedBooks();
      setBookInstances(response.data);
    } catch (err: any) {
      setError('Failed to load your books');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      a: { label: 'Available', color: 'success' },
      o: { label: 'On Loan', color: 'warning' },
      r: { label: 'Reserved', color: 'info' },
      m: { label: 'Maintenance', color: 'danger' },
    };

    const statusInfo = statusMap[status] || { label: 'Unknown', color: 'secondary' };
    return statusInfo;
  };

  const isOverdue = (dueBack: string | undefined) => {
    if (!dueBack) return false;
    return new Date(dueBack) < new Date();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 My Books</h1>
          <p className="page-subtitle">Books you have borrowed</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : bookInstances.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No borrowed books</h3>
            <p className="empty-state-text">You haven't borrowed any books yet</p>
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>ISBN</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {bookInstances.map((instance) => {
                const statusInfo = getStatusBadge(instance.status);
                const overdue = isOverdue(instance.due_back);
                return (
                  <tr key={instance.id}>
                    <td>
                      <strong>{instance.book_title}</strong>
                    </td>
                    <td>{instance.id.slice(0, 8)}</td>
                    <td>
                      <span className={`badge badge-${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      {instance.due_back
                        ? new Date(instance.due_back).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      {overdue ? (
                        <span className="badge badge-danger">⚠️ Overdue</span>
                      ) : (
                        <span className="badge badge-success">✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
