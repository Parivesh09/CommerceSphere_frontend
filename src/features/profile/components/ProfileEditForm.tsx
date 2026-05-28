import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { profileUpdateSchema, type ProfileUpdateFormData } from '../validation';
import { useUpdateProfileMutation, useUploadAvatarMutation } from '../api';
import type { UserProfile } from '../types';
import toast from 'react-hot-toast';

interface ProfileEditFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

/**
 * Profile Edit Form Component
 * 
 * Allows users to update their profile information including name, phone, and avatar.
 * Validates: Requirements 3.1
 */
export default function ProfileEditForm({ profile, onSuccess }: ProfileEditFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(profile.avatar);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || '',
      avatar: profile.avatar || '',
    },
  });

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;


    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }


    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }


    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);


    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const result = await uploadAvatar(formData).unwrap();
      toast.success('Avatar uploaded successfully');
      

      setAvatarPreview(result.avatarUrl);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to upload avatar');

      setAvatarPreview(profile.avatar);
    }
  };

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfile(data).unwrap();
      toast.success('Profile updated successfully');
      onSuccess?.();
    } catch (error) {
      const err = error as { data?: { message?: string; errors?: Record<string, string> } };
      if (err?.data?.errors) {

        Object.entries(err.data.errors).forEach(([field, message]) => {
          setError(field as keyof ProfileUpdateFormData, {
            type: 'server',
            message: message as string,
          });
        });
      } else {
        toast.error(err?.data?.message || 'Failed to update profile');
      }
    }
  };

  const isLoading = isUpdating || isUploading;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Avatar Upload */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={avatarPreview}
          alt={profile.name}
          sx={{ width: 100, height: 100, mr: 2 }}
        />
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
            disabled={isLoading}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              color="primary"
              aria-label="upload avatar"
              component="span"
              disabled={isLoading}
            >
              {isUploading ? <CircularProgress size={24} /> : <PhotoCamera />}
            </IconButton>
          </label>
        </Box>
      </Box>

      {/* Name Field */}
      <TextField
        {...register('name')}
        label="Name"
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isLoading}
      />

      {/* Phone Field */}
      <TextField
        {...register('phone')}
        label="Phone Number"
        fullWidth
        margin="normal"
        placeholder="+1234567890"
        error={!!errors.phone}
        helperText={errors.phone?.message || 'Optional: Include country code'}
        disabled={isLoading}
      />

      {/* Submit Button */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty || isLoading}
          fullWidth
        >
          {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}
