# Library Management System - Backend

Django REST Framework backend for the Library Management System.

## Architecture

This is a REST API built with:
- **Django 6.0** - Web framework
- **Django REST Framework** - REST API toolkit
- **djangorestframework-simplejwt** - JWT authentication
- **django-cors-headers** - CORS support for React frontend
- **SQLite** - Database (can be replaced with PostgreSQL)

## Project Structure

```
backend/
├── manage.py                # Django management script
├── db.sqlite3               # SQLite database
├── requirements.txt         # Python dependencies
├── locallibrary/            # Django project settings
│   ├── settings.py          # Project configuration
│   ├── urls.py              # Main URL router
│   ├── wsgi.py              # WSGI application
│   └── asgi.py              # ASGI application
├── catalog/                 # Main app for books and authors
│   ├── models.py            # Book, Author, BookInstance models
│   ├── serializers.py       # DRF serializers for API
│   ├── views.py             # Views (template + DRF viewsets)
│   ├── urls.py              # App URL routing
│   ├── forms.py             # Django forms
│   ├── admin.py             # Django admin configuration
│   └── migrations/          # Database migrations
├── biblioteca/              # API app for advanced features
│   ├── views.py             # Custom API endpoints
│   ├── serializers.py       # Additional serializers
│   ├── urls.py              # API URL routing
│   └── permissions.py       # Custom permission classes
├── templates/               # HTML templates (legacy)
└── media/                   # User-uploaded files
```

## Getting Started

### Prerequisites
- Python 3.9+
- pip or conda

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Database Setup

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Running the Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /biblioteca/login/` - Obtain JWT tokens
- `POST /biblioteca/token/refresh/` - Refresh access token

### Books
- `GET /catalog/api/books/` - List all books
- `POST /catalog/api/books/` - Create a new book
- `GET /catalog/api/books/{id}/` - Retrieve a specific book
- `PUT /catalog/api/books/{id}/` - Update a book
- `DELETE /catalog/api/books/{id}/` - Delete a book

### Authors
- `GET /catalog/api/authors/` - List all authors
- `POST /catalog/api/authors/` - Create a new author
- `GET /catalog/api/authors/{id}/` - Retrieve a specific author
- `PUT /catalog/api/authors/{id}/` - Update an author
- `DELETE /catalog/api/authors/{id}/` - Delete an author

### Book Instances
- `GET /catalog/api/bookinstances/` - List all book instances
- `GET /catalog/api/bookinstances/{id}/` - Retrieve a specific instance
- `PATCH /catalog/api/bookinstances/{id}/` - Update instance status

### Profiles
- `GET /catalog/api/perfiles/` - List all user profiles
- `GET /biblioteca/preg7/` - Advanced profile search

### Permissions
- `GET /catalog/api/permisos/` - List all permissions
- `POST /catalog/permisos/nuevo/` - Create new permission

## Models

### Book
- `title` - Book title
- `author` - FK to Author
- `isbn` - ISBN code
- `genre` - M2M to Genre
- `summary` - Book description
- `original_language` - FK to Language

### Author
- `name` - Author name
- `birth_date` - Birth date
- `death_date` - Death date

### BookInstance
- `book` - FK to Book
- `borrower` - FK to User
- `status` - 'a' (Available), 'o' (On loan), 'r' (Reserved), 'm' (Maintenance)
- `due_back` - Return date
- `imprint` - Edition details

### Perfil (User Profile)
- `usuario_django` - FK to Django User
- `direccion` - Address
- `localidad` - City
- `provincia` - Province
- `foto` - Profile picture
- `permisos` - M2M to PermisoE
- `fecha_penalizacion` - Penalty date

## Configuration

### CORS Settings

The backend is configured to accept requests from the React frontend at `http://localhost:3000`.

Update `CORS_ALLOWED_ORIGINS` in `locallibrary/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',  # Vite default
]
```

### JWT Configuration

Tokens expire after 30 minutes. Update in `settings.py`:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
}
```

## Admin Panel

Access Django admin at `http://localhost:8000/admin` with superuser credentials.

## Authentication Flow

1. **Login**: POST to `/biblioteca/login/` with username and password
2. **Receive Tokens**: Get `access` and `refresh` tokens
3. **Make Requests**: Include access token in Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
4. **Refresh Token**: When access token expires, POST to `/biblioteca/token/refresh/` with refresh token

## Production Deployment

Before deploying:

1. Set `DEBUG = False` in `settings.py`
2. Configure `ALLOWED_HOSTS`
3. Use a production database (PostgreSQL recommended)
4. Set secure cookie flags
5. Use environment variables for secrets
6. Configure static files collection

```bash
python manage.py collectstatic
```

## Contributing

When adding new models:
1. Create model in `catalog/models.py`
2. Create serializer in `catalog/serializers.py`
3. Create viewset in `catalog/views.py`
4. Register viewset in `catalog/urls.py`
5. Create and run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

## License

Part of the educational project - Library Management System
