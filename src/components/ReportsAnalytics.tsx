
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Calendar, Download, Filter } from "lucide-react";

const salesData = [
  { name: 'Mon', sales: 1200, items: 45 },
  { name: 'Tue', sales: 1800, items: 52 },
  { name: 'Wed', sales: 2400, items: 68 },
  { name: 'Thu', sales: 1600, items: 48 },
  { name: 'Fri', sales: 2800, items: 72 },
  { name: 'Sat', sales: 3200, items: 85 },
  { name: 'Sun', sales: 2000, items: 58 }
];

const categoryData = [
  { name: 'Antibiotics', value: 35, color: '#2CA58D' },
  { name: 'Parasiticides', value: 25, color: '#3E8EDE' },
  { name: 'Vaccines', value: 20, color: '#A3E4D7' },
  { name: 'Pain Relief', value: 15, color: '#F4D35E' },
  { name: 'Supplements', value: 5, color: '#F25F5C' }
];

const topProducts = [
  { name: 'Amoxicillin 500mg', sales: 234, revenue: 585.00, trend: 'up' },
  { name: 'Ivermectin Injection', sales: 156, revenue: 2340.00, trend: 'up' },
  { name: 'Doxycycline Tablets', sales: 128, revenue: 224.00, trend: 'down' },
  { name: 'Vitamin B Complex', sales: 89, revenue: 756.50, trend: 'up' },
  { name: 'Deworming Solution', sales: 67, revenue: 804.00, trend: 'down' }
];

export const ReportsAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +20.1%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.3%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$19.28</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2.1%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Sales Trend</CardTitle>
                <CardDescription>Sales performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#2CA58D" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products by sales volume and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-teal-100 text-teal-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        {product.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Report</CardTitle>
                <CardDescription>Detailed breakdown of today's sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p className="text-sm font-medium">Sale #{i.toString().padStart(4, '0')}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(Date.now() - i * 60 * 60 * 1000).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${(Math.random() * 100 + 10).toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 5) + 1} items
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>Current inventory status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Products:</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">In Stock:</span>
                    <span className="font-semibold text-green-600">1,156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Stock:</span>
                    <span className="font-semibold text-yellow-600">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Out of Stock:</span>
                    <span className="font-semibold text-red-600">33</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expiry Alerts</CardTitle>
                <CardDescription>Products approaching expiry dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Expired:</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expiring in 30 days:</span>
                    <Badge className="bg-orange-100 text-orange-800">15</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expiring in 90 days:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">48</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Peak Sales Hours</CardTitle>
                <CardDescription>When your customers shop the most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-center">
                      <div 
                        className="bg-teal-200 rounded" 
                        style={{ height: `${Math.random() * 40 + 10}px` }}
                      />
                      <p className="text-xs mt-1">{i}:00</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Understanding your customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Top Animal Types</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Dogs:</span>
                        <span className="text-sm font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cats:</span>
                        <span className="text-sm font-semibold">32%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cattle:</span>
                        <span className="text-sm font-semibold">18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Others:</span>
                        <span className="text-sm font-semibold">5%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Customer Loyalty</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">New Customers:</span>
                        <span className="text-sm font-semibold">23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Returning:</span>
                        <span className="text-sm font-semibold">65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">VIP (10+ orders):</span>
                        <span className="text-sm font-semibold">12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
