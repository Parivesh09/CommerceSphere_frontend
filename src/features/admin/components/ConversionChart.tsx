import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ConversionDataPoint } from '../types';

interface ConversionChartProps {
  data: ConversionDataPoint[];
}

/**
 * Conversion Chart Component
 * 
 * Displays conversion rate metrics over time using Recharts
 * Validates: Requirements 10.2
 */
export default function ConversionChart({ data }: ConversionChartProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Conversion Metrics
        </Typography>
        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: any, name: any) => {
                  const numValue = Number(value);
                  if (name === 'rate') {
                    return [`${numValue.toFixed(2)}%`, 'Conversion Rate'];
                  }
                  return [numValue.toLocaleString(), name === 'visitors' ? 'Visitors' : 'Conversions'];
                }}
                labelFormatter={(label: any) => {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="visitors"
                fill="#94a3b8"
                name="Visitors"
              />
              <Bar
                yAxisId="left"
                dataKey="conversions"
                fill="#2563eb"
                name="Conversions"
              />
              <Bar
                yAxisId="right"
                dataKey="rate"
                fill="#10b981"
                name="Rate (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
