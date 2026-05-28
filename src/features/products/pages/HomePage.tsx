import { Container, Typography, Box, Card, CardMedia, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section - Responsive */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, sm: 8, md: 12 },
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.75rem' },
              }} 
              gutterBottom
            >
              Welcome to CommerceSphere
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: { xs: 3, md: 4 }, 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              }}
            >
              Discover premium products at unbeatable prices
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minHeight: 44,
                minWidth: 120,
              }}
              onClick={() => navigate(ROUTES.PRODUCTS)}
            >
              Shop Now
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Featured Products - Responsive Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
          }}
        >
          Featured Products
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <motion.div 
              key={item} 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: { xs: 180, sm: 200, md: 220 },
                    bgcolor: 'grey.200',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
                  >
                    Product {item}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    $99.99
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Categories - Responsive Grid */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 3, md: 4 },
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            }}
          >
            Shop by Category
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((category) => (
              <Card
                key={category}
                sx={{
                  height: { xs: 120, sm: 140, md: 150 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.3s',
                }}
              >
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
                >
                  {category}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
