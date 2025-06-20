
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: string | string[];
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRoles, 
  adminOnly = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // 1. While the authentication state is loading, show a loading indicator.
  // This is crucial to prevent a redirect before the user's session is verified.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // if (userProfile.status !== 'active') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  //       <Card className="max-w-md w-full">
  //         <CardContent className="pt-6 text-center">
  //           <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
  //           <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Deactivated</h2>
  //           <p className="text-gray-600 mb-4">
  //             Your account has been deactivated. Please contact your administrator for assistance.
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page. Admin access required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRoles && !requiredRoles.includes(user.role as string)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">403 - Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have the required permissions to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required roles: {Array.isArray(requiredRoles) ? requiredRoles.join(', ') : requiredRoles}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
