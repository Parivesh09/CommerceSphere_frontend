import { Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Analytics,
  Warehouse,
  Storefront,
  AdminPanelSettings,
  Menu as MenuIcon,
  Public,
  Logout,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { logout } from '../store/slices/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: ROUTES.ADMIN },
  { text: 'Products', icon: <Inventory />, path: ROUTES.ADMIN_PRODUCTS },
  { text: 'Orders', icon: <ShoppingCart />, path: ROUTES.ADMIN_ORDERS },
  { text: 'Inventory', icon: <Warehouse />, path: ROUTES.ADMIN_INVENTORY },
  { text: 'Users', icon: <People />, path: ROUTES.ADMIN_USERS },
  { text: 'Analytics', icon: <Analytics />, path: ROUTES.ADMIN_ANALYTICS },
  { text: 'Vendors', icon: <Storefront />, path: ROUTES.ADMIN_VENDORS },
  { text: 'Roles', icon: <AdminPanelSettings />, path: ROUTES.ADMIN_ROLES },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewSite = () => {
    navigate(ROUTES.HOME);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  const drawer = (
    <div className="flex flex-col h-full">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List component="nav" aria-label="Admin navigation menu" sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              aria-label={`Navigate to ${item.text}`}
              sx={{ minHeight: 44 }}
            >
              <ListItemIcon aria-hidden="true">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          borderTop: '1px solid var(--color-outline-variant)',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <ListItemButton
          onClick={handleViewSite}
          aria-label="View storefront website"
          sx={{ minHeight: 44 }}
        >
          <ListItemIcon aria-hidden="true"><Public /></ListItemIcon>
          <ListItemText primary="View site" />
        </ListItemButton>
        <ListItemButton
          onClick={handleLogout}
          aria-label="Log out of admin panel"
          sx={{ minHeight: 44, color: 'var(--color-error)' }}
        >
          <ListItemIcon aria-hidden="true" sx={{ color: 'var(--color-error)' }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'var(--color-surface)',
          color: 'var(--color-on-surface)',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, minWidth: 44, minHeight: 44 }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="h1" sx={{ flexGrow: 1 }}>
            CommerceSphere Admin
          </Typography>
          <IconButton
            onClick={handleViewSite}
            aria-label="View storefront website"
            sx={{ minWidth: 44, minHeight: 44, '&:hover': { bgcolor: 'var(--color-surface-container-low)' } }}
          >
            <Public />
          </IconButton>
          <IconButton
            onClick={handleLogout}
            aria-label="Log out of admin panel"
            sx={{ minWidth: 44, minHeight: 44, color: 'var(--color-error)', '&:hover': { bgcolor: 'var(--color-surface-container-low)' } }}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box 
        component="nav" 
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Admin navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          aria-label="Mobile navigation drawer"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
          aria-label="Desktop navigation drawer"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        id="main-content"
        className="page-bg"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
        role="main"
        aria-label="Main content"
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
