import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLogin from '@/pages/AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean; // Regular user (not admin)
}

/**
 * ProtectedRoute component that handles route access based on user roles
 * - requireAdmin: Only admins can access
 * - requireUser: Only regular users (not admins) can access
 * - Neither: Anyone authenticated can access
 */
export function ProtectedRoute({ children, requireAdmin = false, requireUser = false }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!user) {
        // If accessing /admin, show admin login instead of redirecting
        if (requireAdmin && location.pathname === '/admin') {
          return; // Show AdminLogin component
        }
        navigate('/auth');
        return;
      }

      // Require admin but user is not admin
      if (requireAdmin && !isAdmin) {
        navigate('/discover');
        return;
      }

      // Require regular user but user is admin
      // Exception: always allow admins to access onboarding (for testing and new admin onboarding)
      if (requireUser && isAdmin && location.pathname !== '/onboarding') {
        navigate('/admin');
        return;
      }
    }
  }, [user, isLoading, isAdmin, requireAdmin, requireUser, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    );
  }

  // Show admin login if accessing /admin while logged out
  if (!user && requireAdmin && location.pathname === '/admin') {
    return <AdminLogin />;
  }

  if (!user) {
    return null; // Will redirect
  }

  if (requireAdmin && !isAdmin) {
    return null; // Will redirect
  }

  // Allow admins to access onboarding even if requireUser is true
  if (requireUser && isAdmin && location.pathname !== '/onboarding') {
    return null; // Will redirect
  }

  return <>{children}</>;
}
