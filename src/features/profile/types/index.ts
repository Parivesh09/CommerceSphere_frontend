import type { Address } from '../../../types';

/**
 * Extended user profile with additional fields
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin' | 'moderator';
  avatar?: string;
  phone?: string;
  addresses: UserAddress[];
  createdAt: string;
  updatedAt: string;
}

/**
 * User address with ID for management
 */
export interface UserAddress extends Address {
  id: string;
  label?: string; // e.g., "Home", "Work"
  isDefault: boolean;
}

/**
 * Profile update data
 */
export interface ProfileUpdateData {
  name?: string | undefined;
  phone?: string | undefined;
  avatar?: string | undefined;
}

/**
 * Password change data
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Address creation data
 */
export interface AddressCreateData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label?: string | undefined;
  isDefault?: boolean | undefined;
}

/**
 * Address update data
 */
export interface AddressUpdateData extends Partial<AddressCreateData> {
  id: string;
}
