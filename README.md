# Library Management System

A full-stack library management app built with a **React + TypeScript frontend** and a **Django REST API backend**.

Not just a school project anymore — this started as a Django exam and slowly turned into something closer to a real full-stack app.

## 🎯 Overview

What started as an educational project ended up evolving into a complete system with:

- ✨ _React + TypeScript SPA_ with a responsive UI
- 🚀 _Django REST API_ with JWT authentication
- 📚 Full library management (books, authors, borrowing system)
- 👥 User profiles + permissions
- 🎨 Clean UI with a simple, custom design system

## 📁 Project Structure

```

users-management/
├── frontend/        → React + TypeScript SPA
├── backend/         → Django REST API
└── README.md        → you are here

````

Inside each part:

- frontend → pages, components, hooks, API client, styles  
- backend → Django apps, REST API, auth, models

## 🚀 Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
````

Runs on:
`http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:
`http://localhost:5173`

## ✨ Features

### 📖 Books

* Browse full catalog
* View details
* Create / edit / delete books
* Track availability

### ✍️ Authors

* Manage authors
* Birth / death dates
* Linked books

### 👥 Users

* Profiles with extra info
* Permissions system
* Basic penalty logic

### 📚 Borrowing system

* Track borrowed books
* Due dates
* Overdue detection

### 🔐 Auth

* JWT login system
* Protected routes
* Token refresh handling

## 🛠️ Tech Stack

### Frontend

* React 18
* TypeScript
* Vite
* React Router
* Axios
* Vanilla CSS

### Backend

* Django 6
* Django REST Framework
* SimpleJWT
* CORS headers
* SQLite (dev)

## 📖 API (quick look)

### Login

```http
POST /biblioteca/login/
```

```json
{
  "username": "user",
  "password": "pass"
}
```

Response:

```json
{
  "access": "jwt_token...",
  "refresh": "jwt_token..."
}
```

### Main endpoints

**Books**

* GET /catalog/api/books/
* POST /catalog/api/books/
* GET /catalog/api/books/{id}/
* PUT /catalog/api/books/{id}/
* DELETE /catalog/api/books/{id}/

**Authors**

* GET /catalog/api/authors/
* POST /catalog/api/authors/

**Instances**

* GET /catalog/api/bookinstances/
* PATCH /catalog/api/bookinstances/{id}/

## 🎨 UI Notes

Nothing fancy here — just a custom CSS setup:

* mobile-first layout
* flex + grid
* simple color system
* no UI frameworks

## 🔒 Security

* JWT authentication
* role-based permissions
* CORS enabled for frontend
* token refresh flow

## 📊 Models (core idea)

* User → authentication base
* Book → main catalog
* Author → book creators
* BookInstance → physical copies
* Perfil → extended user data
* PermisoE → permissions layer

## 🔄 Workflow (how it grew)

When adding features:

1. backend model
2. serializer
3. viewset
4. frontend page
5. API call
6. route added

## 🧠 Notes

* SQLite is just for dev
* Django templates still exist but are legacy now
* backend and frontend are fully separated

## 📱 Responsive

Works on mobile + desktop:

* responsive layout
* touch-friendly UI
* adaptive navigation

## 🚀 Performance

* basic code splitting (React Router)
* optimized Django queries
* pagination support in API


## 🐛 Limitations

* not production-ready DB setup (yet)
* some legacy Django views still there
* admin still uses default Django UI


## 🎓 Context

This started as a Django exam project and slowly turned into a full-stack practice app covering:

* REST API design
* React SPA architecture
* authentication flows
* frontend/backend separation


## 🤝 Contributing

If you touch it:

* keep structure consistent
* use TypeScript types
* don’t break backend contracts
* test both sides
* don’t leave half features


## 📄 License

Educational project — not meant for production use.


> ⚠️ Note
> This is part of my learning path.
> More here: [https://github.com/RubenMurciaeduca](https://github.com/RubenMurciaeduca)