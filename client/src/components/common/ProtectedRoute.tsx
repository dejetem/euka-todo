import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean; // default to true for protected routes
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If we're on the auth page and already authenticated, redirect to todos
        if (pathname === '/auth' && isAuthenticated) {
            router.push('/');
        }

        // If we need authentication and user is not authenticated, redirect to auth
        else if (requireAuth && !isAuthenticated) {
            router.push('/auth');
        }
        setIsChecking(false);
    }, [isAuthenticated, router, pathname, requireAuth]);

    if (isChecking) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }


    // For auth page, show nothing while redirecting if authenticated
    if (pathname === '/auth' && isAuthenticated) {
        return null;
    }

    // For protected routes, show nothing while redirecting if not authenticated
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};