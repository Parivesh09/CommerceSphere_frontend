import { z } from 'zod';

/**
 * Admin Product Validation Schemas
 * 
 * Zod schemas for validating admin product forms
 * Validates: Requirements 10.3
 */

export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().min(1, 'Image alt text is required'),
  order: z.number().int().min(0, 'Order must be a positive number'),
});

export const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  options: z.array(
    z.object({
      name: z.string().min(1, 'Option name is required'),
      value: z.string().min(1, 'Option value is required'),
    })
  ).min(1, 'At least one option is required'),
  price: z.number().positive('Price must be positive').optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive('Compare at price must be positive').optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  images: z.array(productImageSchema).min(1, 'At least one image is required'),
  variants: z.array(productVariantSchema).optional(),
}).refine(
  (data) => !data.compareAtPrice || data.compareAtPrice > data.price,
  {
    message: 'Compare at price must be greater than regular price',
    path: ['compareAtPrice'],
  }
);

export const updateProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  price: z.number().positive('Price must be positive').optional(),
  compareAtPrice: z.number().positive('Compare at price must be positive').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  tags: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
  images: z.array(productImageSchema).min(1, 'At least one image is required').optional(),
  variants: z.array(productVariantSchema).optional(),
}).refine(
  (data) => !data.compareAtPrice || !data.price || data.compareAtPrice > data.price,
  {
    message: 'Compare at price must be greater than regular price',
    path: ['compareAtPrice'],
  }
);

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
