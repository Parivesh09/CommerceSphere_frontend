import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../features/cart/components/CartDrawer';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box 
        component="main" 
        id="main-content"
        sx={{ flexGrow: 1, pt: 8 }}
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </Box>
      <Footer />
      <CartDrawer />
    </Box>
  );
}
