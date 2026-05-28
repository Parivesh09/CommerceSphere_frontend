import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowForward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks';
import { formatCurrency } from '../utils';
import { ROUTES } from '../../../constants';

/**
 * Cart Page Component
 * 
 * Features:
 * - Full cart view with item list
 * - Quantity controls with optimistic updates
 * - Real-time total calculations
 * - Responsive layout
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */
export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem } = useCart();

  const handleIncrement = (productId: string, variantId: string | undefined, currentQuantity: number) => {
    updateQuantity(productId, variantId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, variantId: string | undefined, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, variantId, currentQuantity - 1);
    }
  };

  const handleRemove = (productId: string, variantId?: string | undefined) => {
    removeItem(productId, variantId);
  };

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  const handleContinueShopping = () => {
    navigate(ROUTES.PRODUCTS);
  };

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 3,
          }}
        >
          <ShoppingCart sx={{ fontSize: 120, color: 'text.secondary', opacity: 0.3 }} />
          <Typography variant="h4" color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add some products to get started
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinueShopping}
            endIcon={<ArrowForward />}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {cart.items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Cart Items */}
        <Box>
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.variantId || 'default'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  {/* Product Image Placeholder */}
                  <Box
                    sx={{
                      width: { xs: 80, sm: 120 },
                      height: { xs: 80, sm: 120 },
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />

                  {/* Product Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" noWrap>
                      Product {item.productId}
                    </Typography>
                    {item.variantId && (
                      <Typography variant="body2" color="text.secondary">
                        Variant: {item.variantId}
                      </Typography>
                    )}
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      {formatCurrency(item.unitPrice)}
                    </Typography>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 2,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDecrement(item.productId, item.variantId, item.quantity)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{
                            minWidth: 40,
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleIncrement(item.productId, item.variantId, item.quantity)}
                        >
                          <Add />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Subtotal: {formatCurrency(item.unitPrice * item.quantity)}
                      </Typography>

                      <IconButton
                        color="error"
                        onClick={() => handleRemove(item.productId, item.variantId)}
                        sx={{ ml: 'auto' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            variant="outlined"
            onClick={handleContinueShopping}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>

        {/* Order Summary */}
        <Box>
          <Paper
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: { md: 16 },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">{formatCurrency(cart.subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1">Tax (8%)</Typography>
                <Typography variant="body1">{formatCurrency(cart.tax)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">
                  {cart.shipping === 0 ? (
                    <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      FREE
                    </Typography>
                  ) : (
                    formatCurrency(cart.shipping)
                  )}
                </Typography>
              </Box>

              {cart.subtotal < 50 && cart.subtotal > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Add {formatCurrency(50 - cart.subtotal)} more for free shipping
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(cart.total)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              endIcon={<ArrowForward />}
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Secure checkout powered by Stripe
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
