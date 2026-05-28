import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Button } from '../../../components/ui';
import type { Address } from '../../../types';
import type { ShippingMethod, PaymentMethod } from '../types';
import type { Cart } from '../../cart/types';

interface OrderReviewProps {
  cart: Cart;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * Order review component showing final order details
 * Validates: Requirements 7.1, 7.4
 */
export function OrderReview({
  cart,
  shippingAddress,
  billingAddress,
  shippingMethod,
  paymentMethod,
  onSubmit,
  onBack,
  isLoading = false,
}: OrderReviewProps) {
  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };

  const finalTotal = cart.subtotal + cart.tax + shippingMethod.price;

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <List>
          {cart.items.map((item) => (
            <ListItem key={item.id} sx={{ px: 0 }}>
              <ListItemText
                primary={item.product?.title || 'Product'}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Grid container spacing={3}>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatAddress(shippingAddress)}
            </Typography>
          </Paper>
        </Grid>

        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Billing Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatAddress(billingAddress)}
            </Typography>
          </Paper>
        </Grid>

        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Method
            </Typography>
            <Typography variant="body1">{shippingMethod.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {shippingMethod.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Estimated delivery: {shippingMethod.estimatedDays}
            </Typography>
          </Paper>
        </Grid>

        
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body1">{paymentMethod.name}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Subtotal</Typography>
            <Typography variant="body1">${cart.subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Shipping</Typography>
            <Typography variant="body1">${shippingMethod.price.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Tax</Typography>
            <Typography variant="body1">${cart.tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary">
              ${finalTotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={onSubmit} isLoading={isLoading}>
          Place Order
        </Button>
      </Box>
    </Box>
  );
}
