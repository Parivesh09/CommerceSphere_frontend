# Theme System

This directory contains the theme configuration for the application, implementing a comprehensive dark mode system with Material UI and Tailwind CSS.

## Features

- **Light and Dark Themes**: Fully configured light and dark color schemes
- **System Preference Detection**: Automatically detects and applies the user's system theme preference
- **Manual Toggle**: Users can manually switch between light, dark, and system modes
- **Persistent Preferences**: Theme selection is saved to localStorage and restored on page load
- **Tailwind Integration**: Dark mode classes are automatically applied to the document root for Tailwind CSS
- **Material UI Integration**: MUI components automatically adapt to the selected theme

## Architecture

### Theme Provider (`/src/providers/ThemeProvider.tsx`)

The `ThemeProvider` component wraps the application and manages theme state:

- Listens to system theme preference changes
- Determines the effective theme (light/dark) based on user selection
- Updates the document class for Tailwind dark mode
- Provides the MUI theme to all components

### Theme Configuration (`/src/theme/index.ts`)

Defines the theme tokens for both light and dark modes:

- **Colors**: Primary (#2563eb), Secondary (#7c3aed)
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 8px grid system
- **Components**: Custom styling for MUI components (Button, Card, TextField)

### Theme Toggle Component (`/src/components/ui/ThemeToggle.tsx`)

A dropdown menu component that allows users to select their preferred theme:

- Light mode
- Dark mode
- System preference (auto)

## Usage

### Using the Theme Provider

The theme provider is already integrated in `App.tsx`:

```tsx
import { ThemeProvider } from './providers/ThemeProvider';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* Your app content */}
      </ThemeProvider>
    </Provider>
  );
}
```

### Using the Theme Toggle

Add the theme toggle to any component (already integrated in Navbar):

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function MyComponent() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

### Accessing Theme in Components

#### Material UI Components

MUI components automatically use the theme:

```tsx
import { Button, Card } from '@mui/material';

function MyComponent() {
  return (
    <Card>
      <Button color="primary">Click me</Button>
    </Card>
  );
}
```

#### Tailwind CSS

Use Tailwind's dark mode variants:

```tsx
function MyComponent() {
  return (
    <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-primary-600 dark:text-primary-400">Hello</h1>
    </div>
  );
}
```

#### Programmatic Access

Access the current theme from Redux state:

```tsx
import { useAppSelector } from '@/hooks/useAppSelector';

function MyComponent() {
  const theme = useAppSelector((state) => state.ui.theme);

}
```

## Theme Colors

### Light Mode

- **Primary**: #2563eb (Blue)
- **Secondary**: #7c3aed (Purple)
- **Background**: #ffffff (White)
- **Paper**: #f9fafb (Light Gray)
- **Text Primary**: #0f172a (Dark Slate)
- **Text Secondary**: #475569 (Slate)

### Dark Mode

- **Primary**: #3b82f6 (Lighter Blue)
- **Secondary**: #8b5cf6 (Lighter Purple)
- **Background**: #0f172a (Dark Slate)
- **Paper**: #1e293b (Slate)
- **Text Primary**: #f1f5f9 (Light Slate)
- **Text Secondary**: #cbd5e1 (Gray)

## Requirements Satisfied

This implementation satisfies the following requirements from the design specification:

- **13.1**: System theme preference detection on application load
- **13.2**: Theme toggle functionality with smooth transitions
- **13.3**: localStorage persistence for theme preferences
- **13.4**: Theme-aware colors from Material UI theme system
- **13.5**: Tailwind CSS dark mode variants support

## Testing

To test the theme system:

1. **System Preference**: Set your OS to dark mode and reload the app (with theme set to "System")
2. **Manual Toggle**: Click the theme toggle button in the navbar and select different modes
3. **Persistence**: Change the theme, reload the page, and verify the selection is preserved
4. **Tailwind Classes**: Verify dark mode classes work by inspecting elements with `dark:` variants
5. **MUI Components**: Verify MUI components change colors when switching themes
