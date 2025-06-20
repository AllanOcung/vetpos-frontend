
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Building2, Phone, Mail, Calendar, Package } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "VetMed Supplies",
    contact: "John Anderson",
    email: "orders@vetmedsupplies.com",
    phone: "+1234567890",
    address: "123 Medical Drive, Healthcare City",
    totalOrders: 45,
    lastOrder: "2024-06-15",
    status: "active"
  },
  {
    id: "2",
    name: "Animal Health Co",
    contact: "Sarah Williams",
    email: "supply@animalhealthco.com",
    phone: "+1234567891",
    address: "456 Veterinary Avenue, Med City",
    totalOrders: 32,
    lastOrder: "2024-06-10",
    status: "active"
  },
  {
    id: "3",
    name: "PharmaVet Ltd",
    contact: "Mike Johnson",
    email: "sales@pharmavet.com",
    phone: "+1234567892",
    address: "789 Pharmaceutical Street, Drug City",
    totalOrders: 28,
    lastOrder: "2024-05-30",
    status: "inactive"
  }
];

export const SupplierManager = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: ""
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSupplier = () => {
    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name,
      contact: newSupplier.contact,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      totalOrders: 0,
      lastOrder: "Never",
      status: "active"
    };
    
    setSuppliers([...suppliers, supplier]);
    setNewSupplier({ name: "", contact: "", email: "", phone: "", address: "" });
    setIsAddSupplierOpen(false);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="outline" className="text-gray-600">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
          <p className="text-gray-600">Manage your veterinary drug suppliers</p>
        </div>
        <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Supplier</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Enter supplier information and contact details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  placeholder="Enter company name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input
                  placeholder="Enter contact person"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Enter phone number"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Enter full address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                />
              </div>
            </div>
            <Button
              onClick={addSupplier}
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={!newSupplier.name || !newSupplier.contact || !newSupplier.email}
            >
              Add Supplier
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="suppliers" className="w-full">
        <TabsList>
          <TabsTrigger value="suppliers">All Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search suppliers by name, contact, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{supplier.name}</h3>
                        <p className="text-sm text-gray-600">{supplier.contact}</p>
                      </div>
                    </div>
                    {getStatusBadge(supplier.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{supplier.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{supplier.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Orders:</span>
                      <span className="font-semibold">{supplier.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Order:</span>
                      <span className="text-sm">{supplier.lastOrder}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track all orders from suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">Order #{i.toString().padStart(6, '0')}</p>
                        <p className="text-sm text-gray-600">
                          {mockSuppliers[i % mockSuppliers.length].name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(Math.random() * 1000 + 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Supplier Details Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              Complete supplier information and order history
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Company Name</Label>
                  <p className="text-sm">{selectedSupplier.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm">{selectedSupplier.contact}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedSupplier.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedSupplier.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm">{selectedSupplier.address}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Recent Orders</Label>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">Order #{i.toString().padStart(6, '0')}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${(Math.random() * 1000 + 100).toFixed(2)}</p>
                        <Badge variant="outline">Delivered</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
