# Library Management System

A modern full-stack application for managing a library's book collection, with a React TypeScript frontend and Django REST API backend.

## 🎯 Overview

This project evolved from an educational Django exam into a modern full-stack application with:
- ✨ Modern React TypeScript frontend with responsive UI
- 🚀 Django REST API backend with JWT authentication
- 📚 Complete library management features
- 👥 User profiles and permission system
- 🎨 Clean, intuitive user interface

## 📁 Project Structure

```
users-management/
├── frontend/                # React TypeScript SPA
│   ├── src/
│   │   ├── pages/          # Page components (Home, Books, Authors, etc.)
│   │   ├── components/     # Reusable components (Navigation, etc.)
│   │   ├── services/       # API client with JWT handling
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   ├── types/          # TypeScript types and interfaces
│   │   └── styles/         # Global CSS and component styles
│   ├── package.json
│   └── README.md           # Frontend documentation
│
├── backend/                 # Django REST API
│   ├── locallibrary/        # Django project settings
│   ├── catalog/             # Main app (Books, Authors, Instances)
│   ├── biblioteca/          # API app (Advanced features)
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md            # Backend documentation
│
└── README.md                # This file
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173` (Vite) or `http://localhost:3000` (if configured)

## ✨ Features

### 📖 Book Management
- Browse complete book catalog
- View detailed book information
- Add, edit, delete books
- Track book instances and their status

### ✍️ Author Management
- Manage author information
- Birth and death date tracking
- Associated book listings

### 👥 User Profiles
- User profile information
- Address and location details
- Permission management
- Penalty system for overdue items

### 📚 Borrowing System
- Track borrowed books
- Due date management
- Overdue detection
- Borrower information

### 🔐 Authentication & Authorization
- JWT-based authentication
- User roles and permissions
- Permission assignment per user
- Secure token refresh mechanism

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling (no frameworks)

### Backend
- **Django 6.0** - Web framework
- **Django REST Framework** - API
- **djangorestframework-simplejwt** - JWT auth
- **django-cors-headers** - CORS support
- **SQLite** - Database

## 📖 API Documentation

### Authentication
```bash
POST /biblioteca/login/
{
  "username": "user",
  "password": "pass"
}
```

Returns:
```json
{
  "access": "eyJ0eXAiOiJKV1Q...",
  "refresh": "eyJ0eXAiOiJKV1Q..."
}
```

### Main API Endpoints

**Books**
- `GET /catalog/api/books/` - List books
- `POST /catalog/api/books/` - Create book
- `GET /catalog/api/books/{id}/` - Retrieve book
- `PUT /catalog/api/books/{id}/` - Update book
- `DELETE /catalog/api/books/{id}/` - Delete book

**Authors**
- `GET /catalog/api/authors/` - List authors
- `POST /catalog/api/authors/` - Create author
- `GET /catalog/api/authors/{id}/` - Retrieve author
- `PUT /catalog/api/authors/{id}/` - Update author
- `DELETE /catalog/api/authors/{id}/` - Delete author

**Book Instances**
- `GET /catalog/api/bookinstances/` - List instances
- `GET /catalog/api/bookinstances/{id}/` - Retrieve instance
- `PATCH /catalog/api/bookinstances/{id}/` - Update instance

**User Profiles**
- `GET /catalog/api/perfiles/` - List profiles
- `GET /biblioteca/preg7/` - Advanced search

## 🎨 Design System

The frontend uses a custom CSS design system with:
- **Color Palette**: Primary (#4f46e5), Secondary (#06b6d4), Success (#10b981), Danger (#ef4444)
- **Responsive Grid**: Mobile-first approach
- **Utility Classes**: Consistent spacing and styling
- **Dark Mode Ready**: Easy to implement

## 📝 Pages & Components

### Pages
1. **HomePage** - Welcome and feature overview
2. **LoginPage** - User authentication
3. **BooksPage** - Browse and manage books
4. **AuthorsPage** - Browse and manage authors
5. **MyBooksPage** - User's borrowed books
6. **ProfilesPage** - User profiles and permissions

### Components
- **Navigation** - Main navigation bar with auth status

## 🔒 Security Features

- JWT token-based authentication
- CORS protection
- CSRF token handling
- Permission-based access control
- Secure token refresh with automatic re-authentication

## 📊 Database Models

### Core Models
- **User** - Django built-in user model
- **Author** - Author information
- **Book** - Book details
- **Genre** - Book genre classification
- **Language** - Original language tracking
- **BookInstance** - Physical book tracking
- **Perfil** - Extended user profile
- **PermisoE** - Custom permission system

## 🔄 Development Workflow

### Adding a New Feature

1. **Backend**: Create model and serializer
2. **Backend**: Create viewset and register in router
3. **Frontend**: Add page component
4. **Frontend**: Create API service methods
5. **Frontend**: Add route in App.tsx
6. **Frontend**: Create form/list components

### Common Commands

**Backend**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**
```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
```

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Flexbox and CSS Grid layouts
- Touch-friendly interface
- Adaptive navigation

## 🚀 Performance Optimizations

- **Frontend**: Code splitting with React Router
- **Frontend**: CSS minification
- **Backend**: Database indexing
- **Backend**: Query optimization with select_related/prefetch_related
- **API**: DRF pagination and filtering

## 🐛 Known Limitations

- SQLite for development only (use PostgreSQL in production)
- Legacy template views kept for backward compatibility
- Admin panel still uses Django templates

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Frontend-specific details
- [Backend README](./backend/README.md) - Backend-specific details

## 🎓 Educational Context

This project started as a Django exam and has evolved into a modern full-stack application showcasing:
- Modern frontend development with React and TypeScript
- RESTful API design with Django REST Framework
- JWT authentication and authorization
- Database design and ORM usage
- Frontend-backend integration

## 🤝 Contributing

When contributing:
1. Follow the existing code structure
2. Add TypeScript types for new frontend code
3. Write meaningful commit messages
4. Test both frontend and backend
5. Update relevant documentation

## 📄 License

This is an educational project. See original README note below.

---

> [!WARNING]
> For newcomers, this is part of my educational journey
> for more visit this profile:
> https://github.com/RubenMurciaeduca
