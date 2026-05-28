# Frontend Architecture

## Overview

This is a production-grade e-commerce frontend built with React 19, TypeScript, Redux Toolkit, RTK Query, Material UI, Tailwind CSS, and Framer Motion.

## Technology Stack

- **React 19**: Latest React with concurrent features
- **TypeScript**: Strict mode enabled for maximum type safety
- **Vite**: Fast build tool and dev server
- **Redux Toolkit**: State management with RTK Query for API calls
- **Material UI**: Component library with custom theming
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hook Form + Zod**: Form handling and validation
- **React Router**: Client-side routing

## Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   │   ├── api/          # RTK Query endpoints
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Route pages
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Helper functions
│   │   └── validation/   # Zod schemas
│   ├── products/         # Product browsing and details
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── orders/           # Order history and tracking
│   ├── search/           # Product search
│   ├── wishlist/         # Wishlist management
│   ├── profile/          # User profile
│   └── admin/            # Admin dashboard
│
├── components/           # Shared components
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components
│
├── store/               # Redux store configuration
│   ├── index.ts         # Store setup
│   ├── slices/          # Redux slices
│   └── middleware/      # Custom middleware
│
├── services/            # External services
│   ├── api/            # Base API configuration
│   ├── websocket/      # WebSocket client
│   └── storage/        # Local storage utilities
│
├── hooks/              # Global custom hooks
├── utils/              # Global utility functions
├── types/              # Global TypeScript types
├── theme/              # Material UI theme configuration
├── constants/          # Application constants
└── styles/             # Global styles

```

## Feature Module Structure

Each feature follows a consistent structure:

```
feature/
├── api/              # RTK Query API slice
├── components/       # Feature-specific components
├── hooks/           # Feature-specific hooks
├── pages/           # Route components
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
└── validation/      # Zod validation schemas
```

## Key Architectural Decisions

### 1. Feature-Based Organization
- Code is organized by feature rather than by type
- Each feature is self-contained and independent
- Easier to scale and maintain as the app grows

### 2. TypeScript Strict Mode
- All strict type-checking options enabled
- Ensures maximum type safety
- Catches errors at compile time

### 3. RTK Query for API Communication
- Automatic caching and invalidation
- Optimistic updates
- Built-in loading and error states
- Tag-based cache invalidation

### 4. Path Aliases
- Clean imports using `@/` prefix
- Easier refactoring and code navigation

### 5. Material UI + Tailwind CSS
- Material UI for complex components
- Tailwind for utility styling
- Custom theme system for consistency

## Development Guidelines

### TypeScript
- Always use explicit types
- Avoid `any` type
- Use interfaces for object shapes
- Use type aliases for unions and primitives

### Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use React.memo for expensive components

### State Management
- Use RTK Query for server state
- Use Redux slices for client state
- Keep state as close to where it's used as possible

### Styling
- Use Tailwind utilities for simple styling
- Use Material UI components for complex UI
- Follow the 8px grid system
- Ensure dark mode compatibility

### Testing
- Write unit tests for utilities and hooks
- Write integration tests for features
- Use property-based testing for critical logic

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Preview production build

## Environment Variables

See `.env.example` for required environment variables.

## Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Strict mode enabled for all checks
