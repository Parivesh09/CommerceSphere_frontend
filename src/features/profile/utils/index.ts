import type { UserAddress } from '../types';

/**
 * Format address as a single line string
 */
export function formatAddress(address: UserAddress): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
}

/**
 * Format address as multiple lines
 */
export function formatAddressMultiline(address: UserAddress): string[] {
  return [
    address.street,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ];
}

/**
 * Get default address from list
 */
export function getDefaultAddress(addresses: UserAddress[]): UserAddress | undefined {
  return addresses.find((addr) => addr.isDefault);
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}
