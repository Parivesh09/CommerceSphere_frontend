import { useState } from 'react';
import { Box, IconButton, styled } from '@mui/material';
import { ChevronLeft, ChevronRight, ZoomIn } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductImage } from '../../../types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const GalleryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  overflowX: 'auto',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'column',
    width: '100px',
    overflowY: 'auto',
    maxHeight: '500px',
  },
}));

const Thumbnail = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  width: '80px',
  height: '80px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  cursor: 'pointer',
  border: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'border-color 0.2s',
  flexShrink: 0,
  '&:hover': {
    borderColor: theme.palette.primary.light,
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const MainImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  aspectRatio: '1',
  maxHeight: '600px',
}));

const MainImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  cursor: 'zoom-in',
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ZoomButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  if (sortedImages.length === 0) {
    return (
      <MainImageContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
          }}
        >
          No images available
        </Box>
      </MainImageContainer>
    );
  }

  const currentImage = sortedImages[currentIndex];
  if (!currentImage) {
    return null;
  }

  return (
    <GalleryContainer>
      {sortedImages.length > 1 && (
        <ThumbnailContainer>
          {sortedImages.map((image, index) => (
            <Thumbnail
              key={image.id}
              active={index === currentIndex}
              onClick={() => handleThumbnailClick(index)}
            >
              <img src={image.url} alt={`${productName} thumbnail ${index + 1}`} loading="lazy" />
            </Thumbnail>
          ))}
        </ThumbnailContainer>
      )}

      <MainImageContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          >
            <MainImage
              src={currentImage.url}
              alt={productName}
              onClick={handleZoomToggle}
              style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            />
          </motion.div>
        </AnimatePresence>

        {sortedImages.length > 1 && (
          <>
            <NavigationButton
              onClick={handlePrevious}
              sx={{ left: (theme) => theme.spacing(2) }}
              size="small"
            >
              <ChevronLeft />
            </NavigationButton>
            <NavigationButton
              onClick={handleNext}
              sx={{ right: (theme) => theme.spacing(2) }}
              size="small"
            >
              <ChevronRight />
            </NavigationButton>
          </>
        )}

        <ZoomButton onClick={handleZoomToggle} size="small">
          <ZoomIn />
        </ZoomButton>
      </MainImageContainer>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleZoomToggle}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
              padding: '20px',
            }}
          >
            <motion.img
              src={currentImage.url}
              alt={productName}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
}
