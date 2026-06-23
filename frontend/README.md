# Library Management System - Frontend

Modern React TypeScript frontend for the Library Management System.

## Architecture

This is a Single Page Application (SPA) built with:
- **React 18** with TypeScript
- **React Router** for client-side navigation
- **Axios** for HTTP requests with JWT authentication
- **CSS3** with custom design tokens (no CSS-in-JS)
- **Vite** for fast development and optimized builds

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/               # Page components (routed views)
│   ├── services/            # API client and HTTP utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Global CSS and component styles
│   ├── App.tsx              # Main app component with routing
│   └── main.tsx             # App entry point
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173` (Vite default)

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000
```

## Features

- 📖 Browse and manage books
- ✍️ Manage authors
- 👥 User profiles and permissions
- 🎯 Track borrowed books
- 🔐 JWT authentication
- 📱 Responsive design
- ⚡ Fast and modern UX

## API Integration

The frontend communicates with the Django REST API at `/api/*` endpoints:

- `GET /api/books/` - List all books
- `GET /api/authors/` - List all authors
- `GET /api/bookinstances/` - List book instances
- `GET /api/perfiles/` - List user profiles
- JWT login at `/biblioteca/login/`

## Authentication

JWT tokens are stored in localStorage:
- `access_token` - Access token for API requests
- `refresh_token` - Refresh token for obtaining new access tokens

Tokens are automatically refreshed on 401 responses.

## Styling

The app uses a custom CSS design system with CSS variables defined in `src/styles/global.css`:

```css
--primary-color: #4f46e5
--secondary-color: #06b6d4
--success-color: #10b981
--danger-color: #ef4444
```

All components use utility classes and semantic HTML for consistency and accessibility.

## Performance

- Lazy loading of pages via React Router
- Optimized builds with code splitting
- Efficient API calls with Axios interceptors
- CSS is minified and cached by the browser

## Contributing

Follow these patterns:
1. Create pages in `src/pages/` for routed views
2. Create reusable components in `src/components/`
3. Add types in `src/types/index.ts`
4. Keep API logic in `src/services/api.ts`
5. Style with CSS utility classes and semantic naming

## License

Part of the educational project - Library Management System
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
