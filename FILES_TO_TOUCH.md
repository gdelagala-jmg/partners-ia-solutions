# FILE IMPACT MAP - ADMIN UX RESPONSIVE HARDENING

## CREATE
- `src/components/admin/ui/AdminLayoutShell.tsx` [NEW] (Root layout shell)
- `src/components/admin/ui/AdminToolbar.tsx` [NEW] (Module-level actions bar)
- `src/components/admin/ui/AdminActionMenu.tsx` [NEW] (Universal "three-dots" ⋯ menu)
- `src/components/admin/ui/AdminCard.tsx` [NEW] (Standardized administrative surface)
- `src/components/admin/ui/AdminTable.tsx` [NEW] (Hardened responsive data display)
- `src/components/admin/ui/AdminFormShell.tsx` [NEW] (Layout for complex administrative forms)
- `src/components/admin/ui/AdminResponsiveGrid.tsx` [NEW] (Dynamic grid for dashboards)
- `src/components/admin/ui/AdminStatusBadge.tsx` [NEW] (Standardized status indicators)

## MODIFY
- `src/components/admin/Sidebar.tsx` [MODIFY] (Add mobile toggle and collapse logic)
- `src/app/admin/(dashboard)/dashboard/page.tsx` [MODIFY] (Implement AdminResponsiveGrid)
- `src/app/admin/(dashboard)/noticias/page.tsx` [MODIFY] (Implement AdminTable & AdminToolbar)
- `src/components/admin/NewsForm.tsx` [MODIFY] (Refactor into AdminFormShell)
- `src/components/admin/DashboardGrid.tsx` [MODIFY] (Hardening overflow and drag handles)

## DELETE
- (None - All legacy components preserved until Wave 4 completion)
