import { Container, Typography, Box, Grid, CircularProgress, Alert } from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  TrendingUp,
} from '@mui/icons-material';
import { useGetAnalyticsQuery } from '../api';
import { MetricCard, SalesChart, UserGrowthChart, ConversionChart } from '../components';

/**
 * Admin Dashboard Page
 * 
 * Main dashboard displaying analytics and key metrics for administrators
 * Validates: Requirements 10.1, 10.2, 10.5
 */
export default function AdminDashboard() {
  const { data: analytics, isLoading, error } = useGetAnalyticsQuery();

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load analytics data. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container maxWidth="xl">
        <Alert severity="info" sx={{ mt: 2 }}>
          No analytics data available.
        </Alert>
      </Container>
    );
  }

  const { metrics, salesData, userGrowthData, conversionData } = analytics;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your store's performance
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Sales"
            value={`$${metrics.totalSales.toLocaleString()}`}
            growth={metrics.revenueGrowth}
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders.toLocaleString()}
            growth={metrics.orderGrowth}
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            icon={<People />}
            color="info"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Products"
            value={metrics.totalProducts.toLocaleString()}
            icon={<Inventory />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Additional Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(2)}%`}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Average Order Value"
            value={`$${metrics.averageOrderValue.toFixed(2)}`}
            icon={<AttachMoney />}
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        
        <Grid size={{ xs: 12, lg: 8 }}>
          <SalesChart data={salesData} />
        </Grid>
        
        <Grid size={{ xs: 12, lg: 4 }}>
          <UserGrowthChart data={userGrowthData} />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <ConversionChart data={conversionData} />
        </Grid>
      </Grid>
    </Container>
  );
}
