import AdminLayoutShell from '@/components/admin/AdminLayoutShell'

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminLayoutShell>
            {children}
        </AdminLayoutShell>
    )
}
