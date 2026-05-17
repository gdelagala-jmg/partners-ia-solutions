# VISUAL BASELINE - ADMIN UX RESPONSIVE HARDENING

## 1. DESIGN SYSTEM TOKENS
- **Radius**: `rounded-xl` (12px) for cards, `rounded-lg` (8px) for inputs.
- **Shadows**: `shadow-sm` for surfaces, `shadow-md` for floating elements (menus).
- **Typography**:
  - Headers: Inter / SemiBold.
  - Body: Inter / Regular.
  - Labels: Medium / 12px (Uppercase where applicable).

## 2. COLOR PALETTE (ENTERPRISE STANDARD)
- **Backgrounds**:
  - Page: `bg-[#F9FAFB]` (Light) / `bg-[#030712]` (Dark).
  - Surface: `bg-white` / `bg-[#111827]`.
- **Borders**: `border-[#E5E7EB]` / `border-[#1F2937]`.
- **Text**:
  - Primary: `text-slate-900` / `text-slate-50`.
  - Secondary: `text-slate-500` / `text-slate-400`.

## 3. COMPONENT POLICIES
- **Tables**:
  - Desktop: Dense rows (padding vertical 12px).
  - Mobile: Transform into `AdminCard` stack with clear labels.
- **Forms**:
  - Multi-column on Desktop (2-3 columns).
  - Stacked on Mobile.
  - Sticky Actions: Save/Cancel bar fixed at bottom on mobile forms.

## 4. INTERACTION PATTERNS
- **Secondary Actions**: Always hidden behind `AdminActionMenu` (⋯) on screens < 768px.
- **Empty States**: Professional illustrations/icons with "Create New" CTA.
- **Loading States**: Skeleton screens matching the actual component structure.
