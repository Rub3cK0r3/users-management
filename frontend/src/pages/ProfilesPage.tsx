import { useState, useEffect } from 'react';
import { type Perfil } from '../types';
import api from '../services/api';
import '../styles/pages.css';

export const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Perfil[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Perfil | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await api.getProfiles();
      setProfiles(response.data);
    } catch (err: any) {
      setError('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileStatus = (profile: Perfil) => {
    if (profile.fecha_penalizacion) {
      const today = new Date();
      const penaltyDate = new Date(profile.fecha_penalizacion);
      return penaltyDate >= today ? 'Penalized' : 'Valid';
    }
    return 'Valid';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 User Profiles</h1>
          <p className="page-subtitle">Manage user profiles and permissions</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : profiles.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3 className="empty-state-title">No profiles yet</h3>
            <p className="empty-state-text">User profiles will appear here</p>
          </div>
        </div>
      ) : (
        <div className="list-container">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="list-item"
              onClick={() => setSelectedProfile(profile)}
              style={{ cursor: 'pointer' }}
            >
              <div className="list-item-header">
                <h3 className="list-item-title">{profile.usuario_username}</h3>
                <span
                  className={`badge badge-${getProfileStatus(profile) === 'Valid' ? 'success' : 'danger'}`}
                >
                  {getProfileStatus(profile)}
                </span>
              </div>
              <div className="list-item-body">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <p>
                    <strong>Address:</strong> {profile.direccion}
                  </p>
                  <p>
                    <strong>City:</strong> {profile.localidad}
                  </p>
                  <p>
                    <strong>Province:</strong> {profile.provincia}
                  </p>
                  <p>
                    <strong>Permissions:</strong> {profile.permiso_details?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfile && (
        <div className="modal-overlay" onClick={() => setSelectedProfile(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Profile Details</h2>
              <button onClick={() => setSelectedProfile(null)} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                  {selectedProfile.usuario_username}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <p>
                    <strong>Address:</strong> {selectedProfile.direccion}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedProfile.localidad}
                  </p>
                  <p>
                    <strong>Province:</strong> {selectedProfile.provincia}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`badge badge-${
                        getProfileStatus(selectedProfile) === 'Valid' ? 'success' : 'danger'
                      }`}
                    >
                      {getProfileStatus(selectedProfile)}
                    </span>
                  </p>
                </div>
              </div>

              {selectedProfile.permiso_details && selectedProfile.permiso_details.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Permissions</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedProfile.permiso_details.map((permission) => (
                      <span key={permission.id} className="badge badge-primary">
                        {permission.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
