# REGRESSION & HARDENING PROTOCOLS

## 1. REGRESSION PROTOCOLS
- **PUBLIC SITE SAFETY**: After each Wave, execute `grep` for any changes in `src/app/(public)` or `src/components/layout`. Zero modifications allowed.
- **BUILD STABILITY**: `npm run build` must be executed and pass after Wave 1, Wave 2, and Wave 3.
- **VISUAL AUDIT**: 
  - Desktop (1440px): Ensure no "empty white space" or weird stretching.
  - Mobile (375px): Ensure zero horizontal scroll and minimum 44px touch targets.

## 2. HARDENING POLICIES
- **ISOLATION**: All new admin components must reside in `src/components/admin/ui/` to prevent contamination.
- **DEPENDENCY LOCK**: No new external dependencies allowed without explicit approval. Use existing Radix/Lucide/Framer-Motion.
- **STATE INTEGRITY**: Form refactors must preserve `react-hook-form` state and validation logic.
- **ERROR BOUNDARIES**: Wrap main admin sections in local ErrorBoundaries to prevent a single module from crashing the entire dashboard.

## 3. VALIDATION GATE
- Hito: `SAFEPOINT_ADMIN_UX_RESPONSIVE_WAVE_[N]_COMPLETED`
- Requirement: Build Pass + No public site changes + No overflow on 320px.
