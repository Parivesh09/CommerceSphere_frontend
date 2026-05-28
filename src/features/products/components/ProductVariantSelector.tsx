import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  Chip,
  styled,
} from '@mui/material';
import type { ProductVariant } from '../../../types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
}

const VariantContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export default function ProductVariantSelector({
  variants,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});


  const handleVariantUpdate = useCallback(
    (matchingVariant: ProductVariant | null) => {
      onVariantChange(matchingVariant);
    },
    [onVariantChange]
  );


  const variantGroups = variants.reduce((acc, variant) => {
    Object.entries(variant.attributes).forEach(([key, value]) => {
      if (!acc[key]) {
        acc[key] = new Set<string>();
      }
      acc[key].add(value);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  useEffect(() => {

    const matchingVariant = variants.find((variant) => {
      return Object.entries(selectedAttributes).every(
        ([key, value]) => variant.attributes[key] === value
      );
    });

    handleVariantUpdate(matchingVariant || null);
  }, [selectedAttributes, variants, handleVariantUpdate]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const isAttributeValueAvailable = (attributeName: string, value: string): boolean => {

    return variants.some((variant) => {
      if (variant.attributes[attributeName] !== value) return false;
      if (variant.inventoryQuantity === 0) return false;


      return Object.entries(selectedAttributes).every(
        ([key, selectedValue]) =>
          key === attributeName || variant.attributes[key] === selectedValue
      );
    });
  };

  if (variants.length === 0) {
    return null;
  }


  const selectedVariant = variants.find((variant) => {
    return Object.entries(selectedAttributes).every(
      ([key, value]) => variant.attributes[key] === value
    );
  }) || null;

  return (
    <VariantContainer>
      {Object.entries(variantGroups).map(([attributeName, values]) => (
        <FormControl key={attributeName} component="fieldset">
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
            {attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}
          </FormLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Array.from(values).map((value) => {
              const isAvailable = isAttributeValueAvailable(attributeName, value);
              const isSelected = selectedAttributes[attributeName] === value;

              return (
                <Chip
                  key={value}
                  label={value}
                  onClick={() => isAvailable && handleAttributeChange(attributeName, value)}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  disabled={!isAvailable}
                  sx={{
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    '&:hover': {
                      backgroundColor: isAvailable
                        ? isSelected
                          ? 'primary.dark'
                          : 'action.hover'
                        : 'transparent',
                    },
                  }}
                />
              );
            })}
          </Box>
        </FormControl>
      ))}

      {selectedVariant && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            SKU: {selectedVariant.sku}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {selectedVariant.inventoryQuantity} available
          </Typography>
          {selectedVariant.price && (
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              ${selectedVariant.price.toFixed(2)}
            </Typography>
          )}
        </Box>
      )}
    </VariantContainer>
  );
}
