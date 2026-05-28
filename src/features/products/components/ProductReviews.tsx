import { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Divider,
  Pagination,
  LinearProgress,
  Chip,
  styled,
} from '@mui/material';
import { Verified } from '@mui/icons-material';
import { useGetProductReviewsQuery } from '../../../services/api/productApi';
import { Skeleton } from '../../../components/ui';

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

const ReviewContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const ReviewHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const RatingDistribution = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

export default function ProductReviews({
  productId,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useGetProductReviewsQuery({
    productId,
    page,
    pageSize,
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);

    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };


  const ratingDistribution = [
    { stars: 5, count: Math.floor(reviewCount * 0.6) },
    { stars: 4, count: Math.floor(reviewCount * 0.2) },
    { stars: 3, count: Math.floor(reviewCount * 0.1) },
    { stars: 2, count: Math.floor(reviewCount * 0.05) },
    { stars: 1, count: Math.floor(reviewCount * 0.05) },
  ];

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">Failed to load reviews</Typography>
      </Box>
    );
  }

  return (
    <Box id="reviews-section" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Customer Reviews
      </Typography>

      {/* Rating Summary */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              out of 5
            </Typography>
          </Box>
          <Rating value={averageRating} precision={0.1} readOnly size="large" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Based on {reviewCount} reviews
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: '250px' }}>
          {ratingDistribution.map(({ stars, count }) => (
            <RatingDistribution key={stars}>
              <Typography variant="body2" sx={{ minWidth: '60px' }}>
                {stars} stars
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(count / reviewCount) * 100}
                sx={{ flex: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: '40px' }}>
                {count}
              </Typography>
            </RatingDistribution>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Reviews List */}
      {isLoading ? (
        <Box>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="20%" />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          ))}
        </Box>
      ) : data && data.data.length > 0 ? (
        <>
          {data.data.map((review) => (
            <ReviewContainer key={review.id}>
              <ReviewHeader>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {review.userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {review.userName}
                    </Typography>
                    {review.verified && (
                      <Chip
                        icon={<Verified />}
                        label="Verified Purchase"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </ReviewHeader>

              {review.title && (
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {review.title}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {review.comment}
              </Typography>

              {review.helpful > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                </Typography>
              )}
            </ReviewContainer>
          ))}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No reviews yet. Be the first to review!</Typography>
        </Box>
      )}
    </Box>
  );
}
