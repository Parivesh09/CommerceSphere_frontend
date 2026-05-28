


export {
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  ensureMinTouchTarget,
  generateA11yId,
  trapFocus,
  announceToScreenReader,
  prefersReducedMotion,
  getAnimationDuration,
} from './accessibility';


export {
  prefetchRoute,
  prefetchRoutes,
  createPrefetchHandler,
  shallowEqual,
  debounce,
  throttle,
  measureRender,
  browserSupports,
  getOptimalImageSize,
  generateSrcSet,
  generateSizes,
} from './performance';


export {
  isValidEmail,
  validatePasswordStrength,
  isValidPhoneNumber,
  isValidPostalCode,
  isValidCreditCard,
  isValidUrl,
  sanitizeInput,
  isValidFileSize,
  isValidFileType,
  validateImageDimensions,
  fieldsMatch,
  isMinimumAge,
  isFutureDate,
  isPastDate,
  isValidUsername,
  isAlphanumeric,
  isAlpha,
  isNumeric,
  isValidHexColor,
  isValidIPv4,
  isInRange,
  isLengthInRange,
} from './validation';
export type { PasswordStrength } from './validation';

