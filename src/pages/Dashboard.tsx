import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  User,
  Loader2,
  ChevronsUpDown
} from "lucide-react";
import { InventoryManager } from "@/components/InventoryManager";
import { SalesInterface } from "@/components/SalesInterface";
import { CustomerManager } from "@/components/CustomerManager";
import { ReportsAnalytics } from "@/components/ReportsAnalytics";
import { SupplierManager } from "@/components/SupplierManager";
import { AdminSettings } from "@/components/AdminSettings";
import api from "@/lib/api";



// Interface for dashboard stats
interface DashboardStats {
  total_revenue: number;
  products_in_stock: number;
  sales_today: number;
  low_stock_alerts: number;
  expiring_soon: number;
}


// Interfaces for sales data
interface SaleItem {
  product_name: string;
  quantity: number;
}

interface Sale {
  id: number;
  user_name: string;
  total_amount: string;
  created_at: string;
  items: SaleItem[];
}


const Dashboard = () => {
  const { user, signOut, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);



  useEffect(() => {
    const fetchDashboardData = async () => {
      if (hasRole(['admin', 'cashier', 'inventory_manager'])) {
        try {
          setLoadingSales(true);
          const { data } = await api.get('/sales/');
          setRecentSales(data.slice(0, 5) || []); // Get the 5 most recent sales
        } catch (err) {
          setSalesError("Failed to load recent sales.");
        } finally {
          setLoadingSales(false);
        }

        // Fetch Dashboard Stats
        try {
          setLoadingStats(true);
          const statsResponse = await api.get('/dashboard-stats/');
          setStats(statsResponse.data);
        } catch (err) {
          // Handle stats error separately if needed
        } finally {
          setLoadingStats(false);
        }
      } else {
        setLoadingSales(false);
        setLoadingStats(false);
      }
    };

    if (activeTab === 'overview') {
      fetchDashboardData();
    }
  }, [activeTab, hasRole]);

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
                  {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>
                      <div className="text-2xl font-bold">
                        {stats?.total_revenue.toLocaleString('en-US', { style: 'currency', currency: 'UGX' }) ?? '...'}
                      </div>
                      <p className="text-xs text-muted-foreground">All-time sales revenue</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>
                      <div className="text-2xl font-bold">{stats?.products_in_stock ?? '...'}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.low_stock_alerts ?? '0'} low stock alerts
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>
                      <div className="text-2xl font-bold">+{stats?.sales_today ?? '...'}</div>
                      <p className="text-xs text-muted-foreground">New transactions today</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>
                      <div className="text-2xl font-bold">{stats?.expiring_soon ?? '...'}</div>
                      <p className="text-xs text-muted-foreground">Within 30 days</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Your 5 most recent transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {loadingSales && <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-teal-600" /></div>}
                    {salesError && <Alert variant="destructive"><AlertDescription>{salesError}</AlertDescription></Alert>}
                    {!loadingSales && !salesError && recentSales.length > 0 && recentSales.map((sale) => (
                      <Collapsible key={sale.id} className="border rounded-lg">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium">Sale #{sale.id}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(sale.created_at).toLocaleDateString()} by {sale.user_name}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-bold mr-2 text-teal-700">
                                {parseFloat(sale.total_amount).toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                              </span>
                              <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-3 border-t bg-gray-50">
                          <ul className="space-y-1 list-disc list-inside text-xs text-gray-600">
                            {sale.items.map((item, index) => (
                              <li key={index}>
                                {item.quantity} x {item.product_name}
                              </li>
                              ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    {!loadingSales && !salesError && recentSales.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No sales have been recorded yet.</p>
                    )}
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