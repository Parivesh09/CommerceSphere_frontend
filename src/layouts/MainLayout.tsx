import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../features/cart/components/CartDrawer';

export default function MainLayout() {
  return (
    <div className="page-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main id="main-content" className="flex-grow pt-20" role="main" aria-label="Main content">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
