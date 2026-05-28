import { Drawer, Box, Typography, IconButton, Button, Divider } from '@mui/material';
import { Close, ShoppingCart, Add, Remove, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useCart } from '../hooks';
import { formatCurrency } from '../utils';
import { ROUTES } from '../../../constants';

/**
 * Cart Drawer Component
 * 
 * Features:
 * - Slide-in animation with spring physics
 * - Quantity controls with optimistic updates
 * - Real-time total calculations
 * - Empty state handling
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */
export default function CartDrawer() {
  const navigate = useNavigate();
  const { cartDrawerOpen } = useAppSelector((state) => state.ui);
  const { cart, updateQuantity, removeItem, closeCartDrawer } = useCart();

  const handleCheckout = () => {
    closeCartDrawer();
    navigate(ROUTES.CHECKOUT);
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate(ROUTES.CART);
  };

  const handleIncrement = (productId: string, variantId: string | undefined, currentQuantity: number) => {
    updateQuantity(productId, variantId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, variantId: string | undefined, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, variantId, currentQuantity - 1);
    }
  };

  const handleRemove = (productId: string, variantId?: string) => {
    removeItem(productId, variantId);
  };

  return (
    <Drawer
      anchor="right"
      open={cartDrawerOpen}
      onClose={closeCartDrawer}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
        },
      }}
    >
      <Box
        component={motion.div}
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCart />
            <Typography variant="h6">Shopping Cart</Typography>
            {cart.items.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)
              </Typography>
            )}
          </Box>
          <IconButton onClick={closeCartDrawer} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {cart.items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 2,
              }}
            >
              <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3 }} />
              <Typography variant="h6" color="text.secondary">
                Your cart is empty
              </Typography>
              <Button variant="contained" onClick={closeCartDrawer}>
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variantId || 'default'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 2,
                      pb: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {/* Product Image Placeholder */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />

                    {/* Product Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        Product {item.productId}
                      </Typography>
                      {item.variantId && (
                        <Typography variant="caption" color="text.secondary">
                          Variant: {item.variantId}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                        {formatCurrency(item.unitPrice)}
                      </Typography>

                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDecrement(item.productId, item.variantId, item.quantity)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleIncrement(item.productId, item.variantId, item.quantity)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemove(item.productId, item.variantId)}
                          sx={{ ml: 'auto' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </Box>

        {/* Footer with Totals */}
        {cart.items.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">{formatCurrency(cart.subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">{formatCurrency(cart.tax)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">
                  {cart.shipping === 0 ? 'FREE' : formatCurrency(cart.shipping)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatCurrency(cart.total)}</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ mb: 1 }}
            >
              Checkout
            </Button>
            <Button variant="outlined" fullWidth onClick={handleViewCart}>
              View Cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
