import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { ROUTES } from '../../../constants';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSeller?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false, requireSeller = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, isSeller } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (requireSeller && !isSeller && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
