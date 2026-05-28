import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  InputBase,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  Search as SearchIcon,
  AccountCircle,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCartDrawerOpen } from '../../store/slices/uiSlice';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ROUTES } from '../../constants';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleCartClick = () => {
    dispatch(setCartDrawerOpen(true));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigationItems = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Products', path: ROUTES.PRODUCTS },
    { label: 'Categories', path: '/categories' },
    ...(isAuthenticated ? [{ label: 'Orders', path: ROUTES.ORDERS }] : []),
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
        component="nav"
        id="navigation"
        role="navigation"
        aria-label="Main navigation"
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="Open navigation menu"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: 'pointer',
              fontWeight: 700,
              mr: { xs: 0, md: 4 },
              fontSize: { xs: '1rem', sm: '1.25rem' },
              flexShrink: 0,
            }}
            onClick={() => handleNavigate(ROUTES.HOME)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigate(ROUTES.HOME);
              }
            }}
            aria-label="CommerceSphere home"
          >
            CommerceSphere
          </Typography>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => handleNavigate(item.path)}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          {!isMobile && (
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                backgroundColor: alpha('#000', 0.05),
                '&:hover': {
                  backgroundColor: alpha('#000', 0.08),
                },
                marginLeft: 2,
                width: '100%',
                maxWidth: 400,
              }}
            >
              <Box
                sx={{
                  padding: 2,
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon aria-hidden="true" />
              </Box>
              <InputBase
                placeholder="Search products..."
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: 1,
                    paddingLeft: 6,
                    width: '100%',
                  },
                }}
                onClick={() => handleNavigate(ROUTES.SEARCH)}
                inputProps={{
                  'aria-label': 'Search products',
                  role: 'searchbox',
                }}
              />
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Mobile Search Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => handleNavigate(ROUTES.SEARCH)}
              aria-label="Search products"
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Icon */}
          <IconButton
            color="inherit"
            onClick={handleCartClick}
            aria-label={`Shopping cart with ${itemCount} items`}
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <Badge badgeContent={itemCount} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Auth Button/Icon */}
          {isAuthenticated ? (
            <IconButton
              color="inherit"
              onClick={() => handleNavigate(ROUTES.PROFILE)}
              aria-label="View profile"
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <AccountCircle />
            </IconButton>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleNavigate(ROUTES.LOGIN)}
              aria-label="Login to your account"
              sx={{
                minWidth: { xs: 'auto', sm: 80 },
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              {isMobile ? 'Login' : 'Login'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 320,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{ minHeight: 48 }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {!isAuthenticated && (
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleNavigate(ROUTES.LOGIN)}
              sx={{ minHeight: 44 }}
            >
              Login
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
}
