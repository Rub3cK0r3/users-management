import { useState, useEffect } from 'react';
import { type Author } from '../types';
import api from '../services/api';
import '../styles/pages.css';

export const AuthorsPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    death_date: '',
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      const response = await api.getAuthors();
      setAuthors(response.data);
    } catch (err: any) {
      setError('Failed to load authors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateAuthor(editingId, formData);
      } else {
        await api.createAuthor(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        birth_date: '',
        death_date: '',
      });
      fetchAuthors();
    } catch (err: any) {
      setError('Failed to save author');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await api.deleteAuthor(id);
        fetchAuthors();
      } catch (err: any) {
        setError('Failed to delete author');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">✍️ Authors</h1>
          <p className="page-subtitle">Manage book authors</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + Add Author
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : authors.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">✍️</div>
            <h3 className="empty-state-title">No authors yet</h3>
            <p className="empty-state-text">Add your first author to get started</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add First Author
            </button>
          </div>
        </div>
      ) : (
        <div className="list-container">
          {authors.map((author) => (
            <div key={author.id} className="list-item">
              <div className="list-item-header">
                <h3 className="list-item-title">{author.name}</h3>
              </div>
              <div className="list-item-body">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {author.birth_date && (
                    <p>
                      Born: <strong>{new Date(author.birth_date).toLocaleDateString()}</strong>
                    </p>
                  )}
                  {author.death_date && (
                    <p>
                      Died: <strong>{new Date(author.death_date).toLocaleDateString()}</strong>
                    </p>
                  )}
                </div>
              </div>
              <div className="list-item-footer">
                <button
                  onClick={() => {
                    setEditingId(author.id);
                    setFormData({
                      name: author.name,
                      birth_date: author.birth_date || '',
                      death_date: author.death_date || '',
                    });
                    setShowForm(true);
                  }}
                  className="btn btn-sm btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Author' : 'Add New Author'}</h2>
              <button onClick={() => setShowForm(false)} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Death Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.death_date}
                    onChange={(e) => setFormData({ ...formData, death_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
