import { Box, Container, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      id="footer"
      sx={{
        py: { xs: 4, md: 6 },
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {/* Brand Section */}
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              component="h2"
              sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' } }}
            >
              CommerceSphere
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Your premium e-commerce destination for quality products.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              component="h3"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              Quick Links
            </Typography>
            <nav aria-label="Quick links">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link 
                  href="/products" 
                  color="inherit" 
                  aria-label="Browse products"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Products
                </Link>
                <Link 
                  href="/categories" 
                  color="inherit" 
                  aria-label="Browse categories"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Categories
                </Link>
                <Link 
                  href="/orders" 
                  color="inherit" 
                  aria-label="View your orders"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Orders
                </Link>
              </Box>
            </nav>
          </Box>

          {/* Support Links */}
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              component="h3"
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              Support
            </Typography>
            <nav aria-label="Support links">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link 
                  href="#" 
                  color="inherit" 
                  aria-label="Visit help center"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Help Center
                </Link>
                <Link 
                  href="#" 
                  color="inherit" 
                  aria-label="Contact customer support"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Contact Us
                </Link>
                <Link 
                  href="#" 
                  color="inherit" 
                  aria-label="Read privacy policy"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Privacy Policy
                </Link>
              </Box>
            </nav>
          </Box>
        </Box>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ 
            mt: { xs: 3, md: 4 },
            fontSize: { xs: '0.75rem', md: '0.875rem' },
          }}
        >
          © {new Date().getFullYear()} CommerceSphere. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
