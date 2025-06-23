import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Package, Plus, Search, Filter, Calendar, Truck, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

// Interface for a Supplier (for the dropdown)
interface Supplier {
  id: string;
  name: string;
}

// Updated Product interface to match backend
interface Product {
  id: string;
  name: string;
  category: string;
  batch_number: string;
  expiry_date: string;
  unit: string;
  quantity: number;
  price: number;
  supplier: string; // This will be the supplier ID
  supplier_name: string; // This is the display name
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'expiring-soon';
}

// Type for the new product form state
type NewProductData = {
  name: string;
  category: string;
  batch_number: string;
  expiry_date: string;
  unit: string;
  quantity: number;
  price: string; // Use string for input, convert to number on submit
  supplier: string; // Will hold the selected supplier ID
};

// Type for the new product form state
type ProductFormData = {
  name: string;
  category: string;
  batch_number: string;
  expiry_date: string;
  unit: string;
  quantity: number;
  price: string; // Use string for input, convert to number on submit
  supplier: string; // Will hold the selected supplier ID
};

interface RestockHistoryItem {
  id: number;
  product_name: string;
  supplier_name: string;
  user_name: string;
  quantity_added: number;
  cost_per_unit: number | null;
  notes: string;
  restock_date: string;
}

// Type for the restock form
type RestockFormData = {
  product_id: string;
  quantity_added: string;
  supplier_id: string;
  cost_per_unit: string;
  notes: string;
};


export const InventoryManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
   const [restockHistory, setRestockHistory] = useState<RestockHistoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProduct, setNewProduct] = useState<NewProductData>({
    name: "",
    category: "",
    batch_number: "",
    expiry_date: "",
    unit: "Tablets",
    quantity: 0,
    price: "",
    supplier: "",
  });

  // Add state for the restock form
  const [restockData, setRestockData] = useState<RestockFormData>({
    product_id: "",
    quantity_added: "",
    supplier_id: "",
    cost_per_unit: "",
    notes: "",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/');
      setProducts(data || []);
    } catch (err) {
      setError("Failed to fetch products.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get('/suppliers/');
      setSuppliers(data.filter((s: any) => s.is_active) || []); // Only show active suppliers
    } catch (err) {
      setError("Failed to fetch suppliers.");
    }
  };

  // Add function to fetch restock history
  const fetchRestockHistory = async () => {
    try {
      const { data } = await api.get('/restock-history/');
      setRestockHistory(data || []);
    } catch (err) {
      setError("Failed to fetch restock history.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchProducts(), fetchSuppliers(), fetchRestockHistory()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProduct.supplier) {
      toast({ variant: "destructive", title: "Error", description: "Please select a supplier." });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/products/', {
        ...newProduct,
        price: parseFloat(newProduct.price) // Convert price to number
      });
      toast({ title: "Success", description: "Product has been added." });
      fetchProducts();
      setIsAddProductOpen(false);
      // Reset form
      setNewProduct({ name: "", category: "", batch_number: "", expiry_date: "", unit: "Tablets", quantity: 0, price: "", supplier: "" });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to add product.";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add handler for submitting the restock form
  const handleRestockSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restockData.product_id || !restockData.quantity_added || !restockData.supplier_id || !restockData.cost_per_unit) {
      toast({ variant: "destructive", title: "Error", description: "Product, quantity, supplier, and cost are required." });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post(`/products/${restockData.product_id}/restock/`, {
        quantity_added: parseInt(restockData.quantity_added),
        supplier_id: parseInt(restockData.supplier_id),
        cost_per_unit: restockData.cost_per_unit ? parseFloat(restockData.cost_per_unit) : null,
        notes: restockData.notes,
      });
      toast({ title: "Success", description: "Product has been restocked." });
      // Refresh data and close dialog
      fetchProducts();
      fetchRestockHistory();
      setIsRestockOpen(false);
      setRestockData({ product_id: "", quantity_added: "", supplier_id: "", cost_per_unit: "", notes: "" });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to restock product.";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct || !selectedProduct) return;

    setIsSubmitting(true);
    try {
      await api.patch(`/products/${selectedProduct.id}/`, {
        ...editingProduct,
        price: parseFloat(editingProduct.price)
      });
      toast({ title: "Success", description: "Product has been updated." });
      fetchProducts();
      handleCloseDialog();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to update product.";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/products/${selectedProduct.id}/`);
      toast({ title: "Success", description: "Product has been deleted." });
      fetchProducts();
      handleCloseDialog();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete product." });
    } finally {
      setIsSubmitting(false);
      setIsDeleteAlertOpen(false);
    }
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setEditingProduct({
      ...product,
      price: String(product.price), // Convert price to string for the form
    });
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setEditingProduct(null);
  };

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
      product.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  // Create filtered lists for the alerts tab
  const expiredProducts = products.filter(p => p.status === 'expired');
  const lowStockProducts = products.filter(p => p.status === 'low-stock');
  const expiringSoonProducts = products.filter(p => p.status === 'expiring-soon');
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock');


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
               <form onSubmit={handleRestockSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <select
                    value={restockData.product_id}
                    onChange={(e) => setRestockData({ ...restockData, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="" disabled>Select product...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity to Add</Label>
                  <Input
                    type="number"
                    value={restockData.quantity_added}
                    onChange={(e) => setRestockData({ ...restockData, quantity_added: e.target.value })}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <select
                    value={restockData.supplier_id}
                    onChange={(e) => setRestockData({ ...restockData, supplier_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="" disabled>Select supplier...</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Cost per Unit </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={restockData.cost_per_unit}
                    onChange={(e) => setRestockData({ ...restockData, cost_per_unit: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={restockData.notes}
                    onChange={(e) => setRestockData({ ...restockData, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding Stock...' : 'Add Stock'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

           {/* ... Add Product Dialog ... */}
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
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Number</Label>
                    <Input value={newProduct.batch_number} onChange={(e) => setNewProduct({ ...newProduct, batch_number: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input type="date" value={newProduct.expiry_date} onChange={(e) => setNewProduct({ ...newProduct, expiry_date: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <select value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                      <option value="Tablets">Tablets</option>
                      <option value="ml">ml</option>
                      <option value="mg">mg</option>
                      <option value="Bottles">Bottles</option>
                      <option value="Vials">Vials</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Quantity</Label>
                    <Input type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price ($)</Label>
                    <Input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <select value={newProduct.supplier} onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                      <option value="" disabled>Select a supplier...</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Product'}
                </Button>
              </form>
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

          {loading && <p>Loading products...</p>}
          {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}


          {!loading && !error && (
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
                            <p className="text-sm text-gray-600">{product.category} • Batch: {product.batch_number}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{product.quantity}</p>
                          <p className="text-xs text-gray-500">{product.unit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">UGX{product.price}</p>
                          <p className="text-xs text-gray-500">per {product.unit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{product.expiry_date}</p>
                          <p className="text-xs text-gray-500">Expiry</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm">{product.supplier_name}</p>
                          <p className="text-xs text-gray-500">Supplier</p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDetails(product)}>
                        View / Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            {/* Expired Products Card */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Expired Products ({expiredProducts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expiredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {expiredProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-red-700">
                        <span>{p.name}</span>
                        <Badge variant="destructive">Expired: {p.expiry_date}</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-red-700">No expired products found.</p>}
              </CardContent>
            </Card>

            {/* Low Stock Items Card */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Low Stock Items ({lowStockProducts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-2">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-yellow-700">
                        <span>{p.name}</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{p.quantity} {p.unit} left</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-yellow-700">No items with low stock.</p>}
              </CardContent>
            </Card>

            {/* Expiring Soon Card */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Expiring Soon (30 days) ({expiringSoonProducts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expiringSoonProducts.length > 0 ? (
                  <div className="space-y-2">
                    {expiringSoonProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-orange-700">
                        <span>{p.name}</span>
                        <Badge className="bg-orange-100 text-orange-800">Expires: {p.expiry_date}</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-orange-700">No products expiring soon.</p>}
              </CardContent>
            </Card>

            {/* Out of Stock Card */}
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Out of Stock ({outOfStockProducts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {outOfStockProducts.length > 0 ? (
                  <div className="space-y-2">
                    {outOfStockProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center text-gray-700">
                        <span>{p.name}</span>
                        <Badge variant="secondary">No stock</Badge>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-700">All products are in stock.</p>}
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
                {restockHistory.length > 0 ? (
                <div className="space-y-4">
                  {restockHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          Added {item.quantity_added} units from {item.supplier_name}
                        </p>
                        <p className="text-sm text-gray-600 font-semibold">
                          Cost: UGX{item.cost_per_unit?.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })} per unit
                        </p>
                        {item.notes && <p className="text-xs text-gray-500 mt-1">Note: {item.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(item.restock_date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(item.restock_date).toLocaleTimeString()}</p>
                        <p className="text-xs text-gray-500 mt-1">by {item.user_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No restock history found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details for {selectedProduct?.name}</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                {/* Form fields are identical to Add Product, but for editingProduct state */}
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input value={editingProduct.batch_number} onChange={(e) => setEditingProduct({ ...editingProduct, batch_number: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input type="date" value={editingProduct.expiry_date} onChange={(e) => setEditingProduct({ ...editingProduct, expiry_date: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <select value={editingProduct.unit} onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="Tablets">Tablets</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Vials">Vials</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" value={editingProduct.quantity} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) || 0 })} required />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price (UGX)</Label>
                  <Input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <select value={editingProduct.supplier} onChange={(e) => setEditingProduct({ ...editingProduct, supplier: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{selectedProduct?.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProduct} disabled={isSubmitting}>
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
