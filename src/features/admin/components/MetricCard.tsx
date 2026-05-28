import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  growth?: number;
  icon?: React.ReactNode;
  color?: string;
}

/**
 * Metric Card Component
 * 
 * Displays a single metric with optional growth indicator
 * Validates: Requirements 10.2
 */
export default function MetricCard({ title, value, growth, icon, color = 'primary' }: MetricCardProps) {
  const hasGrowth = growth !== undefined;
  const isPositiveGrowth = growth && growth > 0;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: `${color}.main`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 600 }}>
          {value}
        </Typography>

        {hasGrowth && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: isPositiveGrowth ? 'success.main' : 'error.main',
            }}
          >
            {isPositiveGrowth ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {Math.abs(growth!).toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
