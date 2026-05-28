# CommerceSphere Frontend

A production-grade, enterprise-level e-commerce frontend built with React 19, TypeScript, Redux Toolkit, and Material-UI.

## 🚀 Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Redux Toolkit** - State Management
- **RTK Query** - API State Management & Caching
- **Material-UI (MUI)** - Component Library
- **Tailwind CSS** - Utility-First Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Socket.io Client** - Real-time Communication
- **React Hot Toast** - Notifications
- **Recharts** - Data Visualization

## 📁 Project Structure

```
src/
├── app/                    # App-level configuration
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   └── layout/            # Layout components
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   ├── products/         # Product management
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── orders/           # Order management
│   ├── profile/          # User profile
│   ├── wishlist/         # Wishlist
│   ├── search/           # Search functionality
│   └── admin/            # Admin dashboard
├── layouts/               # Page layouts
├── services/              # API services
│   └── api/              # RTK Query API slices
├── store/                 # Redux store
│   ├── slices/           # Redux slices
│   └── middleware/       # Custom middleware
├── hooks/                 # Custom React hooks
├── providers/             # Context providers
├── lib/                   # Third-party library configs
├── constants/             # App constants
├── types/                 # TypeScript types
├── animations/            # Animation configurations
├── theme/                 # MUI theme configuration
├── utils/                 # Utility functions
└── styles/                # Global styles
```

## 🎯 Key Features

### Architecture
- **Feature-Based Structure** - Modular, scalable architecture
- **RTK Query** - Complete API layer with caching, polling, optimistic updates
- **Type-Safe** - Full TypeScript coverage
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - System-aware theme switching
- **Real-time Updates** - WebSocket integration

### State Management
- **Redux Toolkit** - Global state management
- **RTK Query** - API state with automatic caching
- **Persistent State** - LocalStorage integration
- **Optimistic Updates** - Instant UI feedback

### UI/UX
- **Premium Design** - Glassmorphism, gradients, smooth animations
- **Material-UI** - Enterprise-grade components
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth page transitions
- **Responsive** - Mobile, tablet, desktop support

### Performance
- **Code Splitting** - Lazy loading routes
- **Memoization** - React.memo, useMemo, useCallback
- **Image Optimization** - Lazy loading, responsive images
- **Bundle Optimization** - Vite's optimized builds

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=CommerceSphere
VITE_APP_VERSION=1.0.0
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🔌 API Integration

The frontend communicates with the backend microservices through the API Gateway at `http://localhost:3000`.

### RTK Query Setup

All API communication is handled through RTK Query with:
- Automatic caching
- Request deduplication
- Optimistic updates
- Automatic refetching
- Tag-based invalidation

### Example API Usage

```typescript
import { useGetProductsQuery } from './services/api/productApi';

function ProductList() {
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    pageSize: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🎨 Theming

The app supports light/dark/system themes with Material-UI theming.

```typescript
import { useAppDispatch } from './hooks/useAppDispatch';
import { setTheme } from './store/slices/uiSlice';

function ThemeToggle() {
  const dispatch = useAppDispatch();
  
  const handleToggle = () => {
    dispatch(setTheme('dark'));
  };

  return <button onClick={handleToggle}>Toggle Theme</button>;
}
```

## 🔐 Authentication

JWT-based authentication with automatic token refresh:

```typescript
import { useLoginMutation } from './services/api/authApi';
import { setCredentials } from './store/slices/authSlice';

function Login() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (credentials) => {
    const result = await login(credentials).unwrap();
    dispatch(setCredentials(result));
  };
}
```

## 🛒 Cart Management

Persistent cart with optimistic updates:

```typescript
import { useAppDispatch } from './hooks/useAppDispatch';
import { addToCart } from './store/slices/cartSlice';

function AddToCartButton({ product }) {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addToCart({
      id: product.id,
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
    }));
  };

  return <button onClick={handleAdd}>Add to Cart</button>;
}
```

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB (gzipped)

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all files
- Follow ESLint rules
- Use functional components with hooks
- Implement proper error boundaries

### Component Structure
```typescript

import { FC } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{product.title}</Typography>
        <Typography variant="body2">${product.price}</Typography>
      </CardContent>
    </Card>
  );
};
```

### State Management
- Use Redux for global state
- Use RTK Query for API state
- Use local state for component-specific state
- Implement proper selectors

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Related Documentation

- [Backend API Documentation](../docs/API_DOCUMENTATION.md)
- [Architecture Guide](../docs/ARCHITECTURE_DETAILED.md)
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)

## 📞 Support

For issues and questions:
- GitHub Issues
- Email: support@commercesphere.com

---

Built with ❤️ using React, TypeScript, and Redux Toolkit
