
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, User, Phone, Calendar } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  animalType: string;
  totalPurchases: number;
  lastVisit: string;
  registrationDate: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1234567890",
    animalType: "Dog",
    totalPurchases: 245.50,
    lastVisit: "2024-06-15",
    registrationDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1234567891",
    animalType: "Cat",
    totalPurchases: 89.25,
    lastVisit: "2024-06-10",
    registrationDate: "2024-03-20"
  },
  {
    id: "3",
    name: "Mike Wilson",
    phone: "+1234567892",
    animalType: "Horse",
    totalPurchases: 1250.00,
    lastVisit: "2024-06-12",
    registrationDate: "2023-12-01"
  }
];

export const CustomerManager = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    animalType: ""
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.animalType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      animalType: newCustomer.animalType,
      totalPurchases: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      registrationDate: new Date().toISOString().split('T')[0]
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({ name: "", phone: "", animalType: "" });
    setIsAddCustomerOpen(false);
  };

  const getAnimalTypeColor = (animalType: string) => {
    switch (animalType.toLowerCase()) {
      case 'dog': return 'bg-blue-100 text-blue-800';
      case 'cat': return 'bg-purple-100 text-purple-800';
      case 'horse': return 'bg-brown-100 text-brown-800';
      case 'cattle': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage your veterinary clinic customers</p>
        </div>
        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Customer</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Register a new customer in the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter phone number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Animal Type</Label>
                <select
                  value={newCustomer.animalType}
                  onChange={(e) => setNewCustomer({...newCustomer, animalType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select animal type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Horse">Horse</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Goat">Goat</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Button
                onClick={addCustomer}
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={!newCustomer.name || !newCustomer.phone || !newCustomer.animalType}
              >
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers by name, phone, or animal type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getAnimalTypeColor(customer.animalType)}>
                  {customer.animalType}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Purchases:</span>
                  <span className="font-semibol text-green-600">${customer.totalPurchases.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Visit:</span>
                  <span className="text-sm">{customer.lastVisit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since:</span>
                  <span className="text-sm">{customer.registrationDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  View Purchase History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Purchase history and customer information
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Animal Type</Label>
                  <p className="text-sm">{selectedCustomer.animalType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Purchases</Label>
                  <p className="text-sm font-semibold text-green-600">
                    ${selectedCustomer.totalPurchases.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Purchase History</Label>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">Purchase #{i.toString().padStart(4, '0')}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${(Math.random() * 100 + 10).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {Math.floor(Math.random() * 5) + 1} items
                        </p>
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
