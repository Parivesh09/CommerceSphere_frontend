import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Alert,
  styled,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetProductQuery } from '../../../services/api/productApi';
import { useCart } from '../../cart/hooks';
import { Skeleton } from '../../../components/ui';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductVariantSelector from '../components/ProductVariantSelector';
import ProductReviews from '../components/ProductReviews';
import type { ProductVariant } from '../../../types';
import toast from 'react-hot-toast';

const ProductDetailContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const FlyingCartIcon = styled(motion.div)({
  position: 'fixed',
  zIndex: 9999,
  pointerEvents: 'none',
});

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart: addToCartAction } = useCart();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [flyingIcon, setFlyingIcon] = useState<{ x: number; y: number } | null>(null);

  const { data: product, isLoading, error } = useGetProductQuery(id || '');

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!product) return;


    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }


    const availableStock = selectedVariant
      ? selectedVariant.inventoryQuantity
      : product.inventoryQuantity;

    if (availableStock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available`);
      return;
    }


    const buttonRect = addToCartButtonRef.current?.getBoundingClientRect();
    if (buttonRect) {
      setFlyingIcon({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
      });


      setTimeout(() => setFlyingIcon(null), 1000);
    }


    addToCartAction({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <ProductDetailContainer maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={500} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={60} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" height={50} />
            </Box>
          </Box>
        </Box>
      </ProductDetailContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailContainer maxWidth="lg">
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load product details
        </Alert>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </ProductDetailContainer>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const availableStock = selectedVariant
    ? selectedVariant.inventoryQuantity
    : product.inventoryQuantity;
  const isOutOfStock = availableStock === 0;

  return (
    <ProductDetailContainer maxWidth="lg">
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Image Gallery */}
        <Box sx={{ flex: 1 }}>
          <ProductImageGallery images={product.images} productName={product.title} />
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            {/* Product Title and Status */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {product.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: 'warning.main', fontSize: 20 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {/* Mock rating - would come from aggregated reviews */}
                    4.5
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ({/* Mock review count */}128 reviews)
                </Typography>
                <Chip
                  label={product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                  color={product.status === 'active' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>

            {/* Price */}
            <PriceContainer>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                ${currentPrice.toFixed(2)}
              </Typography>
            </PriceContainer>

            <Divider sx={{ my: 3 }} />

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <ProductVariantSelector
                  variants={product.variants}
                  onVariantChange={handleVariantChange}
                />
              </Box>
            )}

            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                >
                  +
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {availableStock} available
                </Typography>
              </Box>
            </Box>

            {/* Add to Cart Button */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                ref={addToCartButtonRef}
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <IconButton size="large" color="default">
                <FavoriteBorder />
              </IconButton>
              <IconButton size="large" color="default">
                <Share />
              </IconButton>
            </Box>

            {/* Features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FeatureBox>
                <LocalShipping color="primary" />
                <Typography variant="body2">Free shipping on orders over $50</Typography>
              </FeatureBox>
              <FeatureBox>
                <Security color="primary" />
                <Typography variant="body2">Secure payment & 30-day return policy</Typography>
              </FeatureBox>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mt: 6 }}>
        <ProductReviews
          productId={product.id}
          averageRating={4.5} // Mock - would come from aggregated data
          reviewCount={128} // Mock - would come from aggregated data
        />
      </Box>

      {/* Flying Cart Animation */}
      <AnimatePresence>
        {flyingIcon && (
          <FlyingCartIcon
            initial={{ x: flyingIcon.x, y: flyingIcon.y, scale: 1, opacity: 1 }}
            animate={{
              x: window.innerWidth - 100,
              y: 20,
              scale: 0.3,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />
          </FlyingCartIcon>
        )}
      </AnimatePresence>
    </ProductDetailContainer>
  );
}
