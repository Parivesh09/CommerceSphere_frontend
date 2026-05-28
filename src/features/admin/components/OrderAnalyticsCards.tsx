import { Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import {
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  PendingActions,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import type { OrderAnalytics } from '../types';

interface OrderAnalyticsCardsProps {
  analytics: OrderAnalytics | undefined;
  isLoading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}.lighter`,
          color: `${color}.main`,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export function OrderAnalyticsCards({ analytics, isLoading }: OrderAnalyticsCardsProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard
          title="Total Orders"
          value={analytics.totalOrders.toLocaleString()}
          icon={<ShoppingCart />}
          color="primary"
          subtitle={`${analytics.recentOrders} in last 30 days`}
        />
      </Grid>
      
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          icon={<AttachMoney />}
          color="success"
        />
      </Grid>
      
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(analytics.averageOrderValue)}
          icon={<TrendingUp />}
          color="info"
        />
      </Grid>
      
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Pending Orders"
          value={analytics.pendingOrders}
          icon={<PendingActions />}
          color="warning"
        />
      </Grid>
      
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Completed Orders"
          value={analytics.completedOrders}
          icon={<CheckCircle />}
          color="success"
        />
      </Grid>
      
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Cancelled Orders"
          value={analytics.cancelledOrders}
          icon={<Cancel />}
          color="error"
        />
      </Grid>
      
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Orders by Status
          </Typography>
          <Box sx={{ mt: 2 }}>
            {analytics.ordersByStatus.slice(0, 3).map((item) => (
              <Box
                key={item.status}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="body2">{item.status}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {item.count} ({item.percentage.toFixed(1)}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
