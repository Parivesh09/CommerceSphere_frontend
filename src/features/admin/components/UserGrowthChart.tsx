import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { UserGrowthDataPoint } from '../types';

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
}

/**
 * User Growth Chart Component
 * 
 * Displays user growth metrics over time using Recharts
 * Validates: Requirements 10.2
 */
export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Growth
        </Typography>
        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label: any) => {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }}
                formatter={(value: any, name: any) => {
                  const numValue = Number(value);
                  if (name === 'users') {
                    return [numValue.toLocaleString(), 'Total Users'];
                  }
                  return [numValue.toLocaleString(), 'New Users'];
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="users"
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorNewUsers)"
                name="newUsers"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
