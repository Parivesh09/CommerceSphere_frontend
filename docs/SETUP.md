# Frontend Setup Guide

## ✅ Current Status

The frontend has been successfully initialized with:

### ✅ Completed
- ✅ Vite + React 19 + TypeScript setup
- ✅ All dependencies installed
- ✅ Tailwind CSS configured
- ✅ Redux Toolkit + RTK Query setup
- ✅ Material-UI theme configuration
- ✅ Folder structure created
- ✅ Base API layer with automatic token refresh
- ✅ Auth API endpoints
- ✅ Product API endpoints
- ✅ Redux slices (auth, cart, ui)
- ✅ Custom hooks (useAppDispatch, useAppSelector)
- ✅ Main layouts (MainLayout, AdminLayout)
- ✅ Navbar with cart, search, theme toggle
- ✅ Footer component
- ✅ Cart drawer
- ✅ All page components created
- ✅ Login/Register pages with API integration
- ✅ Home page with hero section
- ✅ Admin dashboard layout
- ✅ Routing configured

## 🚀 Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📋 Next Steps

### Phase 1: Complete Core Features (Priority)

1. **Product Listing Page**
   - Implement product grid with RTK Query
   - Add filters and sorting
   - Implement pagination/infinite scroll
   - Add skeleton loaders

2. **Product Detail Page**
   - Product image gallery
   - Add to cart functionality
   - Product variants
   - Reviews section
   - Related products

3. **Cart Functionality**
   - Complete cart drawer
   - Cart page with item management
   - Quantity updates with optimistic UI
   - Remove items
   - Calculate totals

4. **Checkout Flow**
   - Multi-step checkout
   - Address form
   - Payment integration
   - Order summary
   - Order confirmation

### Phase 2: Enhanced Features

5. **Search Functionality**
   - Search page
   - Autocomplete
   - Search filters
   - Recent searches

6. **User Profile**
   - Profile information
   - Order history
   - Address management
   - Password change

7. **Wishlist**
   - Add/remove items
   - Wishlist page
   - Move to cart

### Phase 3: Admin Features

8. **Admin Product Management**
   - Product CRUD operations
   - Image upload
   - Inventory management
   - Bulk operations

9. **Admin Order Management**
   - Order list with filters
   - Order details
   - Status updates
   - Refund processing

10. **Admin Analytics**
    - Sales charts
    - User metrics
    - Product performance
    - Revenue tracking

### Phase 4: Advanced Features

11. **Real-time Features**
    - WebSocket integration
    - Live notifications
    - Real-time inventory updates
    - Order status updates

12. **Animations**
    - Page transitions with Framer Motion
    - Cart animations
    - Loading states
    - Micro-interactions

13. **Performance Optimization**
    - Code splitting
    - Image optimization
    - Lazy loading
    - Bundle optimization

14. **Testing**
    - Unit tests with Jest
    - Component tests with React Testing Library
    - E2E tests with Playwright

## 🔧 Configuration Files

### Environment Variables (.env.local)
```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=CommerceSphere
VITE_APP_VERSION=1.0.0
```

### Tailwind Config (tailwind.config.js)
- Custom colors
- Animations
- Dark mode support

### MUI Theme (src/theme/index.ts)
- Light/dark themes
- Custom typography
- Component overrides

## 📁 Key Files

### API Layer
- `src/services/api/baseApi.ts` - Base RTK Query setup with auth
- `src/services/api/authApi.ts` - Authentication endpoints
- `src/services/api/productApi.ts` - Product endpoints

### State Management
- `src/store/index.ts` - Redux store configuration
- `src/store/slices/authSlice.ts` - Auth state
- `src/store/slices/cartSlice.ts` - Cart state with persistence
- `src/store/slices/uiSlice.ts` - UI state (theme, drawers)

### Routing
- `src/App.tsx` - Main app with routes
- `src/layouts/MainLayout.tsx` - Customer-facing layout
- `src/layouts/AdminLayout.tsx` - Admin dashboard layout

### Components
- `src/components/layout/Navbar.tsx` - Main navigation
- `src/components/layout/Footer.tsx` - Footer
- `src/features/cart/components/CartDrawer.tsx` - Cart drawer

## 🎨 Design System

### Colors
- Primary: Blue (#0ea5e9)
- Secondary: Purple (#8b5cf6)
- Background: Light (#f8fafc) / Dark (#0f172a)

### Typography
- Font: Inter
- Headings: 600-700 weight
- Body: 400-500 weight

### Spacing
- Base unit: 8px
- Container max-width: 1200px

## 🔌 API Integration

### Authentication Flow
1. User logs in via `/auth/login`
2. Access token stored in Redux + localStorage
3. Refresh token stored in localStorage
4. Automatic token refresh on 401 errors
5. Redirect to login on refresh failure

### RTK Query Features
- Automatic caching
- Request deduplication
- Optimistic updates
- Tag-based invalidation
- Polling support

## 🎯 Development Guidelines

### Component Structure
```typescript

features/
  products/
    components/     # Product-specific components
    pages/         # Product pages
    api/           # Product API (if needed)
    hooks/         # Product hooks
    types/         # Product types
```

### State Management Rules
1. Use Redux for global state (auth, cart, ui)
2. Use RTK Query for API state
3. Use local state for component-specific state
4. Implement proper selectors

### Code Style
- TypeScript for all files
- Functional components with hooks
- Proper prop types
- Error boundaries
- Accessibility (ARIA labels, keyboard navigation)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📊 Performance Targets

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB (gzipped)

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Testing
npm run test             # Run tests
npm run test:coverage    # Coverage report
```

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 🎉 Ready to Start!

The frontend foundation is complete. You can now:

1. Start the dev server: `npm run dev`
2. Test authentication with the backend
3. Begin implementing the product listing page
4. Add more features incrementally

The architecture is scalable, type-safe, and follows industry best practices!
