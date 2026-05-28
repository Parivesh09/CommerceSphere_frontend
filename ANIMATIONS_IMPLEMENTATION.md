# Animations and Transitions Implementation

This document describes the animation system implemented for the premium e-commerce frontend application.

## Overview

The application uses **Framer Motion** for animations and transitions, providing smooth, performant animations throughout the user experience. All animations respect the user's `prefers-reduced-motion` setting for accessibility.

**Validates Requirements:** 11.1, 11.2, 11.3, 11.4, 11.5

## Animation Principles

- **Duration:** 200-300ms for micro-interactions, 400-600ms for page transitions
- **Easing:** Spring physics for natural feel, ease-out for exits
- **Stagger:** 50-100ms delay between list items
- **Accessibility:** Respects `prefers-reduced-motion` media query

## Core Animation Variants

### Location: `src/animations/variants.ts`

#### Common Patterns

1. **Fade Animations**
   - `fadeIn`: Simple opacity transition
   - `fadeInUp`: Fade with upward motion
   - `fadeInDown`: Fade with downward motion

2. **Slide Animations**
   - `slideInLeft`: Slide from left
   - `slideInRight`: Slide from right
   - `drawerSlideRight`: Drawer animation with spring physics
   - `drawerSlideLeft`: Drawer animation from left

3. **Scale Animations**
   - `scaleIn`: Scale up with fade (for modals)
   - `scaleOnHover`: Interactive hover effect
   - `elevateOnHover`: Card elevation with shadow

4. **Stagger Animations**
   - `staggerContainer`: Container for staggered children
   - `staggerContainerFast`: Faster stagger (50ms)
   - `staggerContainerSlow`: Slower stagger (150ms)
   - `staggerItem`: Individual staggered item

5. **Page Transitions**
   - `pageTransition`: Fade and slide for route changes

6. **Special Animations**
   - `flyToCart`: Product flying to cart animation
   - `pulse`: Attention-grabbing pulse
   - `bounce`: Bounce animation
   - `rotate`: Continuous rotation for spinners

## Transition Configurations

### Location: `src/animations/variants.ts`

```typescript
transitions = {
  fast: { duration: 0.2, ease: 'easeOut' },
  default: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 },
  springSmooth: { type: 'spring', stiffness: 200, damping: 25 },
}
```

## Reduced Motion Support

### Hook: `useReducedMotion()`

**Location:** `src/animations/useReducedMotion.ts`

Detects if the user prefers reduced motion via the `prefers-reduced-motion` media query.

```typescript
const prefersReducedMotion = useReducedMotion();


<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
/>
```

### Helper Functions

1. **`getAnimationConfig(prefersReducedMotion)`**
   - Returns minimal animation config when reduced motion is preferred

2. **`applyReducedMotion(prefersReducedMotion, variants)`**
   - Conditionally applies animation variants based on preference
   - Falls back to simple fade when reduced motion is preferred

## Animation Components

### 1. AnimatedPage

**Location:** `src/components/ui/AnimatedPage.tsx`

Wrapper component for page-level animations. Automatically applies fade and slide transitions when pages change.

```tsx
<AnimatedPage>
  <h1>My Page Content</h1>
</AnimatedPage>
```

**Features:**
- Respects `prefers-reduced-motion`
- Consistent page transitions
- Minimal performance impact

### 2. AnimatedList & AnimatedListItem

**Location:** `src/components/ui/AnimatedList.tsx`

Components for staggered list animations.

```tsx
<AnimatedList staggerSpeed="normal">
  {items.map(item => (
    <AnimatedListItem key={item.id}>
      <ProductCard product={item} />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

**Props:**
- `staggerSpeed`: 'fast' | 'normal' | 'slow'
- `as`: HTML element to render (default: 'div')

**Features:**
- Stagger effect for list items
- Configurable stagger speed
- Respects reduced motion preferences

## Enhanced UI Components

### Button

**Location:** `src/components/ui/Button.tsx`

Enhanced with microinteractions:
- Scale up on hover (1.02x)
- Scale down on tap (0.98x)
- Fast transition (200ms)
- Can be disabled with `animated={false}`

```tsx
<Button animated={true}>Click Me</Button>
```

### Card

**Location:** `src/components/ui/Card.tsx`

Enhanced with hover animations:
- Elevation change on hover
- Scale transformation (1.02x)
- Shadow transition
- Spring physics for natural feel

```tsx
<Card hoverable animated>
  <CardContent>...</CardContent>
</Card>
```

### Drawer

**Location:** `src/components/ui/Drawer.tsx`

Enhanced with spring physics:
- Smooth slide-in animation
- Spring physics (stiffness: 200, damping: 25)
- Backdrop fade
- Respects reduced motion

```tsx
<Drawer isOpen={isOpen} onClose={onClose} position="right">
  <p>Drawer content</p>
</Drawer>
```

### Modal

**Location:** `src/components/ui/Modal.tsx`

Enhanced with scale animation:
- Scale in from 0.9 to 1.0
- Fade backdrop
- Smooth transitions
- Respects reduced motion

```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <p>Modal content</p>
</Modal>
```

## Page Transitions

### Implementation in App.tsx

**Location:** `src/App.tsx`

Page transitions are implemented using `AnimatePresence` from Framer Motion:

```tsx
<AnimatePresence mode="wait" initial={false}>
  <Routes location={location} key={location.pathname}>
    {/* Routes */}
  </Routes>
</AnimatePresence>
```

**Features:**
- Wait mode: Current page exits before next enters
- Keyed by pathname for proper animation triggers
- Initial={false}: No animation on first load

## Usage Examples

### Example 1: Animated Product Grid

```tsx
import { AnimatedList, AnimatedListItem } from '@/components/ui';

function ProductGrid({ products }) {
  return (
    <AnimatedList staggerSpeed="fast" className="grid grid-cols-4 gap-4">
      {products.map(product => (
        <AnimatedListItem key={product.id}>
          <ProductCard product={product} />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
}
```

### Example 2: Page with Animation

```tsx
import { AnimatedPage } from '@/components/ui';

function ProductDetailPage() {
  return (
    <AnimatedPage>
      <h1>Product Details</h1>
      {/* Page content */}
    </AnimatedPage>
  );
}
```

### Example 3: Custom Animation

```tsx
import { motion } from 'framer-motion';
import { fadeInUp, transitions } from '@/animations/variants';
import { useReducedMotion, applyReducedMotion } from '@/animations/useReducedMotion';

function CustomComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={applyReducedMotion(prefersReducedMotion, fadeInUp)}
      initial="initial"
      animate="animate"
      transition={prefersReducedMotion ? { duration: 0.01 } : transitions.default}
    >
      Content
    </motion.div>
  );
}
```

### Example 4: Interactive Card

```tsx
import { Card } from '@/components/ui';

function ProductCard({ product }) {
  return (
    <Card hoverable animated onClick={() => navigate(`/products/${product.id}`)}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </Card>
  );
}
```

## Performance Considerations

1. **Hardware Acceleration**
   - Animations use `transform` and `opacity` properties
   - These properties are GPU-accelerated
   - Minimal layout thrashing

2. **Reduced Motion**
   - Automatically disables complex animations
   - Falls back to simple fades
   - Improves performance for users who prefer it

3. **Lazy Loading**
   - Animation components are tree-shakeable
   - Only imported animations are included in bundle
   - Framer Motion is code-split

4. **Spring Physics**
   - Used for natural feel
   - Computationally efficient
   - Better than complex easing curves

## Accessibility

All animations respect the `prefers-reduced-motion` CSS media query:

```css
@media (prefers-reduced-motion: reduce) {

}
```

**Benefits:**
- Users with vestibular disorders get minimal motion
- Users with motion sensitivity get better experience
- Complies with WCAG 2.1 Level AA guidelines

## Testing Animations

### Manual Testing

1. **Test Reduced Motion:**
   - Enable "Reduce motion" in OS settings
   - Verify animations are simplified
   - Check that functionality still works

2. **Test Performance:**
   - Open DevTools Performance tab
   - Record during animations
   - Check for 60fps frame rate
   - Look for layout thrashing

3. **Test Interactions:**
   - Hover over cards
   - Click buttons
   - Open/close modals and drawers
   - Navigate between pages

### Browser DevTools

```javascript


```

## Future Enhancements

1. **Gesture Support**
   - Swipe to dismiss drawers
   - Pull to refresh
   - Drag to reorder

2. **Advanced Transitions**
   - Shared element transitions
   - Morphing animations
   - Path animations

3. **Performance Monitoring**
   - Track animation performance
   - Identify slow animations
   - Optimize based on metrics

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [WCAG 2.1 Animation Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Summary

The animation system provides:
- ✅ Smooth, performant animations
- ✅ Consistent animation patterns
- ✅ Accessibility support (reduced motion)
- ✅ Easy-to-use components
- ✅ Flexible customization
- ✅ Spring physics for natural feel
- ✅ Page transitions
- ✅ Stagger animations
- ✅ Microinteractions

All animations follow the design principles and validate requirements 11.1, 11.2, 11.3, 11.4, and 11.5.
