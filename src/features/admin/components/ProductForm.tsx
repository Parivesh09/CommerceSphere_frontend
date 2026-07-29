import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Paper,
  Chip,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { Add, Delete, CloudUpload } from '@mui/icons-material';
import { createProductSchema, updateProductSchema, type CreateProductFormData, type UpdateProductFormData } from '../validation';
import type { Product } from '../../products/types';
import { useUploadProductImageMutation } from '../api';

/**
 * Product Form Component
 * 
 * Form for creating and editing products with validation
 * Validates: Requirements 10.3
 */

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductFormData | UpdateProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = !!product;
  const [tagInput, setTagInput] = React.useState('');
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

  type FormData = typeof isEditMode extends true ? UpdateProductFormData : CreateProductFormData;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? updateProductSchema : createProductSchema) as any,
    defaultValues: product
      ? {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          category: product.category,
          tags: product.tags || [],
          stock: product.stock,
          images: product.images,
          variants: product.variants,
        }
      : {
          name: '',
          description: '',
          price: 0,
          category: '',
          tags: [],
          stock: 0,
          images: [],
          variants: [],
        },
  } as any);

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const tags = watch('tags' as any) || [];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const result = await uploadProductImage({ productId: 'temp', fileExtension: extension }).unwrap();
      const uploadUrl = result.url;
      await fetch(uploadUrl, { method: 'PUT', body: file });
      appendImage({
        url: uploadUrl.split('?')[0],
        alt: file.name,
        order: imageFields.length,
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        {/* Basic Information */}
        
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>

        
        <Grid size={{ xs: 12 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        
        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                required
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
        </Grid>

        
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category"
                fullWidth
                required
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            )}
          />
        </Grid>

        
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Stock"
                type="number"
                fullWidth
                required
                error={!!errors.stock}
                helperText={errors.stock?.message}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
        </Grid>

        {/* Pricing */}
        
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Pricing
          </Typography>
        </Grid>

        
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                }}
                error={!!errors.price}
                helperText={errors.price?.message}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Grid>

        
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="compareAtPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Compare at Price (Optional)"
                type="number"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                }}
                error={!!errors.compareAtPrice}
                helperText={errors.compareAtPrice?.message}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            )}
          />
        </Grid>

        {/* Tags */}
        
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              size="small"
              fullWidth
            />
            <Button onClick={handleAddTag} variant="outlined" startIcon={<Add />}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
            ))}
          </Box>
        </Grid>

        {/* Images */}
        
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Images
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            disabled={isUploading}
            sx={{ mb: 2 }}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          {errors.images && (
            <FormHelperText error>{errors.images.message}</FormHelperText>
          )}
          <Grid container spacing={2}>
            {imageFields.map((field, index) => (
              
        <Grid size={{ xs: 12, sm: 6 }} key={field.id}>
                <Paper sx={{ p: 2 }}>
                  <Box
                    component="img"
                    src={field.url}
                    alt={field.alt}
                    sx={{ width: '100%', height: 150, objectFit: 'cover', mb: 1 }}
                  />
                  <Controller
                    name={`images.${index}.alt`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Alt Text"
                        size="small"
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                    )}
                  />
                  <Button
                    onClick={() => removeImage(index)}
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Variants */}
        
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Variants (Optional)
          </Typography>
          <Button
            onClick={() =>
              appendVariant({
                name: '',
                options: [{ name: '', value: '' }],
                stock: 0,
              })
            }
            variant="outlined"
            startIcon={<Add />}
            sx={{ mb: 2 }}
          >
            Add Variant
          </Button>
          {variantFields.map((field, index) => (
            <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Variant {index + 1}</Typography>
                <IconButton onClick={() => removeVariant(index)} color="error" size="small">
                  <Delete />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                
        <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={`variants.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Variant Name" fullWidth size="small" />
                    )}
                  />
                </Grid>
                
        <Grid size={{ xs: 12, sm: 3 }}>
                  <Controller
                    name={`variants.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Price (Optional)"
                        type="number"
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                        }}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    )}
                  />
                </Grid>
                
        <Grid size={{ xs: 12, sm: 3 }}>
                  <Controller
                    name={`variants.${index}.stock`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Stock"
                        type="number"
                        fullWidth
                        size="small"
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        {/* Actions */}
        
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
