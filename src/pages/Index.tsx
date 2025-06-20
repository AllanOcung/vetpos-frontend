
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   if (user && userProfile) {
  //     // Redirect authenticated users based on their role
  //     switch (userProfile.role) {
  //       case 'admin':
  //         navigate('/admin/dashboard');
  //         break;
  //       case 'cashier':
  //         navigate('/sales');
  //         break;
  //       case 'inventory_manager':
  //         navigate('/inventory');
  //         break;
  //       default:
  //         navigate('/dashboard');
  //     }
  //   }
  // }, [user, userProfile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-mint-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-mint-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-600 p-3 rounded-full shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">VetPOS</h1>
          <p className="text-gray-600">Veterinary Drug Shop Point of Sale System</p>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-4 bg-gray-50 rounded-t-lg">
            <CardTitle className="text-2xl text-center text-gray-800">Welcome</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Professional veterinary pharmacy management system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-gray-700">
              Manage your veterinary drug shop with our comprehensive point of sale system.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                Sign In to VetPOS
              </Button>
            </div>

            <div className="text-sm text-gray-600 mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium mb-2 text-blue-800">Features:</p>
              <ul className="text-blue-700 text-left space-y-1">
                <li>• Inventory Management</li>
                <li>• Sales Processing</li>
                <li>• Customer Management</li>
                <li>• Reports & Analytics</li>
                <li>• User Role Management</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
