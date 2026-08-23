import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const dashboardByRole = {
    admin: '/admin/dashboard',
    finance: '/finance/dashboard',
    super_admin: '/super-admin/dashboard',
};

export default function ProtectedRoute({ allowedRoles = [], children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const hasAccess = user && (allowedRoles.length === 0 || allowedRoles.includes(user.role));

    useEffect(() => {
        if (!user) {
            router.visit('/admin/login');
            return;
        }

        if (!hasAccess) {
            router.visit(dashboardByRole[user.role] || '/');
        }
    }, [hasAccess, user]);

    if (!hasAccess) {
        return null;
    }

    return children;
}

export { dashboardByRole };
