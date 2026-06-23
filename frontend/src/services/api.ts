import axios, { type AxiosInstance } from 'axios';
import { type TokenResponse, type LoginCredentials } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
    this.updateAuthHeader();

    // Add interceptor to refresh token on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.client.post('/biblioteca/token/refresh/', {
                refresh: refreshToken,
              });
              this.setTokens(response.data.access, refreshToken);
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private updateAuthHeader() {
    if (this.accessToken) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this.updateAuthHeader();
  }

  clearTokens() {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.updateAuthHeader();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await this.client.post('/biblioteca/login/', credentials);
    return response.data;
  }

  // Book endpoints
  async getBooks() {
    return this.client.get('/catalog/books/');
  }

  async getBook(id: number) {
    return this.client.get(`/catalog/book/${id}/`);
  }

  async createBook(data: any) {
    return this.client.post('/catalog/books/', data);
  }

  async updateBook(id: number, data: any) {
    return this.client.put(`/catalog/book/${id}/`, data);
  }

  async deleteBook(id: number) {
    return this.client.delete(`/catalog/book/${id}/`);
  }

  // Author endpoints
  async getAuthors() {
    return this.client.get('/catalog/authors/');
  }

  async getAuthor(id: number) {
    return this.client.get(`/catalog/author/${id}/`);
  }

  async createAuthor(data: any) {
    return this.client.post('/catalog/authors/', data);
  }

  async updateAuthor(id: number, data: any) {
    return this.client.put(`/catalog/author/${id}/`, data);
  }

  async deleteAuthor(id: number) {
    return this.client.delete(`/catalog/author/${id}/`);
  }

  // BookInstance endpoints
  async getBookInstances() {
    return this.client.get('/biblioteca/bookinstances/');
  }

  async getBookInstance(id: string) {
    return this.client.get(`/biblioteca/bookinstance/${id}/`);
  }

  async updateBookInstance(id: string, data: any) {
    return this.client.patch(`/biblioteca/bookinstance/${id}/`, data);
  }

  // Profile endpoints
  async getProfiles() {
    return this.client.get('/biblioteca/preg7/');
  }

  async getProfile(id: number) {
    return this.client.get(`/catalog/preg5/${id}/`);
  }

  async updateProfile(id: number, data: any) {
    return this.client.patch(`/biblioteca/preg6/${id}/`, data);
  }

  // Permission endpoints
  async createPermission(data: any) {
    return this.client.post('/catalog/permisos/nuevo/', data);
  }

  async assignPermission(profileId: number, permissionId: number) {
    return this.client.post(`/catalog/preg4/${profileId}`, {
      permiso: permissionId,
    });
  }

  // Register endpoints
  async registerUser(data: any) {
    return this.client.post('/catalog/registro/', data);
  }

  // Borrowed books endpoints
  async getMyBorrowedBooks() {
    return this.client.get('/catalog/mybooks/');
  }

  async getAllBorrowedBooks() {
    return this.client.get('/catalog/borrowed/');
  }
}

export default new ApiClient();
