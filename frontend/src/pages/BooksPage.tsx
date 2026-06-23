import { useState, useEffect } from 'react';
import { type Book } from '../types';
import api from '../services/api';
import '../styles/pages.css';

export const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    summary: '',
    original_language: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.getBooks();
      setBooks(response.data);
    } catch (err: any) {
      setError('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateBook(editingId, formData);
      } else {
        await api.createBook(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        summary: '',
        original_language: '',
      });
      fetchBooks();
    } catch (err: any) {
      setError('Failed to save book');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.deleteBook(id);
        fetchBooks();
      } catch (err: any) {
        setError('Failed to delete book');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📖 Books</h1>
          <p className="page-subtitle">Manage your book collection</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + Add Book
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No books yet</h3>
            <p className="empty-state-text">Start by adding your first book to the collection</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Add First Book
            </button>
          </div>
        </div>
      ) : (
        <div className="list-container">
          {books.map((book) => (
            <div key={book.id} className="list-item">
              <div className="list-item-header">
                <h3 className="list-item-title">{book.title}</h3>
                <div className="list-item-meta">
                  <span>📕 ISBN: {book.isbn}</span>
                </div>
              </div>
              <div className="list-item-body">
                <p className="list-item-description">{book.summary}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <p>Author: {book.author_name || 'Unknown'}</p>
                </div>
              </div>
              <div className="list-item-footer">
                <button
                  onClick={() => {
                    setEditingId(book.id);
                    setFormData({
                      title: book.title,
                      author: book.author.toString(),
                      isbn: book.isbn,
                      summary: book.summary,
                      original_language: book.original_language.toString(),
                    });
                    setShowForm(true);
                  }}
                  className="btn btn-sm btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
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
              <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
              <button onClick={() => setShowForm(false)} className="modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Summary</label>
                  <textarea
                    className="form-textarea"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    rows={4}
                    required
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
