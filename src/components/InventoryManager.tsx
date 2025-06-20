
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Package, Plus, Search, Filter, Calendar, Truck } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  unit: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'expiring-soon';
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    batchNumber: "AMX001",
    expiryDate: "2024-12-15",
    unit: "Tablets",
    quantity: 150,
    price: 2.50,
    supplier: "VetMed Supplies",
    status: "in-stock"
  },
  {
    id: "2",
    name: "Ivermectin Injection",
    category: "Parasiticides",
    batchNumber: "IVM002",
    expiryDate: "2024-08-20",
    unit: "ml",
    quantity: 5,
    price: 15.00,
    supplier: "Animal Health Co",
    status: "low-stock"
  },
  {
    id: "3",
    name: "Doxycycline Tablets",
    category: "Antibiotics",
    batchNumber: "DOX003",
    expiryDate: "2024-07-10",
    unit: "Tablets",
    quantity: 0,
    price: 1.75,
    supplier: "PharmaVet Ltd",
    status: "out-of-stock"
  }
];

export const InventoryManager = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'expiring-soon':
        return <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your veterinary drug inventory</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-1">
                <Truck className="h-4 w-4" />
                <span>Restock</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restock Product</DialogTitle>
                <DialogDescription>Add new stock to existing products</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity to Add</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input placeholder="Enter supplier name" />
                </div>
                <div className="space-y-2">
                  <Label>Cost per Unit (Optional)</Label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input placeholder="Additional notes..." />
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Add Stock
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-1">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter details for the new veterinary drug</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select category...</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Parasiticides">Parasiticides</option>
                    <option value="Vaccines">Vaccines</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Supplements">Supplements</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input placeholder="Enter batch number" />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Tablets">Tablets</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Vials">Vials</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price ($)</Label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Input placeholder="Enter supplier name" />
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Add Product
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="restocks">Restock History</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex space-x-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-teal-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category} • Batch: {product.batchNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{product.quantity}</p>
                        <p className="text-xs text-gray-500">{product.unit}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">${product.price}</p>
                        <p className="text-xs text-gray-500">per {product.unit}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{product.expiryDate}</p>
                        <p className="text-xs text-gray-500">Expiry</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">{product.supplier}</p>
                        <p className="text-xs text-gray-500">Supplier</p>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Expired Products</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">No expired products found.</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Low Stock Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-700">Ivermectin Injection</span>
                    <Badge className="bg-yellow-100 text-yellow-800">5 ml remaining</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Expiring Soon (30 days)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Doxycycline Tablets</span>
                    <Badge className="bg-orange-100 text-orange-800">Expires 2024-07-10</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="restocks">
          <Card>
            <CardHeader>
              <CardTitle>Restock History</CardTitle>
              <CardDescription>Track all restocking activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Amoxicillin 500mg</p>
                      <p className="text-sm text-gray-600">Added 100 tablets from VetMed Supplies</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">2024-06-15</p>
                      <p className="text-xs text-gray-500">10:30 AM</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
