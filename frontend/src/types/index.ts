// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Library domain models
export interface Author {
  id: number;
  name: string;
  birth_date?: string;
  death_date?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: number;
  author_name?: string;
  isbn: string;
  genre: number[];
  genre_names?: string[];
  summary: string;
  original_language: number;
  language_name?: string;
}

export interface BookInstance {
  id: string;
  book: number;
  book_title?: string;
  borrower?: number;
  borrower_name?: string;
  status: 'a' | 'o' | 'r' | 'm';
  imprint: string;
  due_back?: string;
  is_overdue?: boolean;
}

// Permission and Profile types
export interface PermisoE {
  id: number;
  nombre: string;
  codename: string;
}

export interface Perfil {
  id: number;
  usuario_django: number;
  usuario_username?: string;
  direccion: string;
  localidad: string;
  provincia: string;
  foto?: string;
  permisos: number[];
  permiso_details?: PermisoE[];
  fecha_penalizacion?: string;
  is_valid?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
