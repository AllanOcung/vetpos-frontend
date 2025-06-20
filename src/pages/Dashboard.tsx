import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Settings,
  LogOut,
  Pill,
  DollarSign,
  User
} from "lucide-react";
import { InventoryManager } from "@/components/InventoryManager";
import { SalesInterface } from "@/components/SalesInterface";
import { CustomerManager } from "@/components/CustomerManager";
import { ReportsAnalytics } from "@/components/ReportsAnalytics";
import { SupplierManager } from "@/components/SupplierManager";
import { AdminSettings } from "@/components/AdminSettings";

const Dashboard = () => {
  // NOTE: useNavigate and useEffect have been removed.
  const { user, signOut, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    await signOut();
    // No need to navigate. ProtectedRoute will handle the redirect.
  };

  // The ProtectedRoute handles the case where the user is null.
  // We add this check as a safeguard.
  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'inventory_manager': return 'bg-blue-100 text-blue-800';
      case 'cashier': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'inventory_manager': return 'Inventory Manager';
      case 'cashier': return 'Cashier';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-teal-600 p-2 rounded-lg mr-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VetPOS</h1>
                <p className="text-sm text-gray-500">Veterinary POS System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                {/* Use user.username instead of userProfile.name */}
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
                {/* Use user.role instead of userProfile.role */}
                <Badge className={getRoleColor(user.role as string)}>
                  {getRoleLabel(user.role as string)}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            {hasRole(['admin', 'inventory_manager']) && (
              <TabsTrigger value="inventory" className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
            )}
            {hasRole(['admin', 'cashier']) && (
              <TabsTrigger value="sales" className="flex items-center space-x-1">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Sales</span>
              </TabsTrigger>
            )}
            {hasRole(['admin']) && (
              <TabsTrigger value="customers" className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Customers</span>
              </TabsTrigger>
            )}
            {hasRole(['admin', 'inventory_manager']) && (
              <TabsTrigger value="suppliers" className="flex items-center space-x-1">
                <Pill className="h-4 w-4" />
                <span className="hidden sm:inline">Suppliers</span>
              </TabsTrigger>
            )}
            {hasRole(['admin']) && (
              <TabsTrigger value="settings" className="flex items-center space-x-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,345</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">23 low stock alerts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">Within 30 days</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Latest transactions from today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Sale #{i.toString().padStart(4, '0')}</p>
                          <p className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</p>
                        </div>
                        <div className="text-sm font-bold">${(Math.random() * 100 + 10).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Items requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Expired</Badge>
                      <span className="text-sm">Amoxicillin 500mg</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                      <span className="text-sm">Ivermectin Injection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-100 text-orange-800">Expiring</Badge>
                      <span className="text-sm">Doxycycline Tablets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {hasRole(['admin', 'inventory_manager']) && (
            <TabsContent value="inventory">
              <InventoryManager />
            </TabsContent>
          )}

          {hasRole(['admin', 'cashier']) && (
            <TabsContent value="sales">
              <SalesInterface />
            </TabsContent>
          )}

          {hasRole(['admin']) && (
            <TabsContent value="customers">
              <CustomerManager />
            </TabsContent>
          )}

          {hasRole(['admin', 'inventory_manager']) && (
            <TabsContent value="suppliers">
              <SupplierManager />
            </TabsContent>
          )}

          {hasRole(['admin']) && (
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;