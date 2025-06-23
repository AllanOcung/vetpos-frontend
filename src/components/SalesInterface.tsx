
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Minus, ShoppingCart, CreditCard, DollarSign, Receipt, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";



// Interface for Product data from the API
interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number; // This is the available stock
}


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  available: number;
}

interface Customer {
  name: string;
  phone: string;
  animalType: string;
}


export const SalesInterface = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", animalType: "" });
  const [discount, setDiscount] = useState({ type: "none", value: 0 });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add state to hold the tax rate from settings
  const [settings, setSettings] = useState({ tax_rate: 0.0 });



  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/');
      // Filter out products with zero or less quantity
      setProducts(data.filter((p: Product) => p.quantity > 0) || []);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings/');
      if (data && data.tax_rate) {
        setSettings({ tax_rate: parseFloat(data.tax_rate) });
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Could not load system tax rate. Defaulting to 0%.",
      });
    }
  };


  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({ variant: "destructive", title: "Stock limit reached", description: `Only ${product.quantity} units of ${product.name} are available.` });
      }
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.unit,
        available: product.quantity
      }]);
    }
  };


  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, Math.min(item.available, item.quantity + change));
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Add local calculation for discount to display in UI
  const discountAmount = discount.type === "percentage"
    ? (subtotal * discount.value / 100)
    : discount.type === "fixed" ? discount.value : 0;

  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * (settings.tax_rate / 100);
  const total = taxableAmount + tax;
  const change = cashReceived - total;



  const completeSale = async () => {
    setIsSubmitting(true);
    const salePayload = {
      items: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      // Add discount info to the payload
      discount_type: discount.type,
      discount_value: discount.value,
    };

    try {
      // The backend now returns the full sale object with final calculations
      const { data: completedSale } = await api.post('/sales/', salePayload);

      toast({
        title: "Success",
        description: `Sale #${completedSale.id} completed! Total: ${Number(completedSale.total_amount).toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}`
      });

      // Reset state
      setCart([]);
      setCustomer({ name: "", phone: "", animalType: "" });
      setCashReceived(0);
      setIsCheckoutOpen(false);

      // Refresh product list to get updated stock
      fetchProducts();

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "An unexpected error occurred.";
      toast({ variant: "destructive", title: "Sale Failed", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-[calc(100vh-200px)]">
      {/* Product Search & Selection */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {loading && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[600px] p-1">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-teal-600">
                        {product.price.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                      </p>
                      <p className="text-xs text-gray-500">{product.quantity} available</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart & Checkout */}
      <div className="space-y-4">
        <Card className="h-full bg-white border-gray-200">
          <CardHeader className="bg-teal-50 border-b border-teal-100">
            <CardTitle className="flex items-center space-x-2 text-teal-800">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cart.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {/* Cart Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.price.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })} per {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.available}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Info */}
            {/* <div className="space-y-2 border-t pt-4">
              <Label className="text-sm font-medium text-gray-700">Customer Information (Optional)</Label>
              <Input
                placeholder="Customer name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                size="sm"
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
              <Input
                placeholder="Phone number"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                size="sm"
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
              <select
                value={customer.animalType}
                onChange={(e) => setCustomer({ ...customer, animalType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="">Select animal type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Horse">Horse</option>
                <option value="Cattle">Cattle</option>
                <option value="Other">Other</option>
              </select>
            </div> */}

            {/* Discount - Re-enable this section */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-sm font-medium text-gray-700">Discount</Label>
              <div className="flex space-x-2">
                <select
                  value={discount.type}
                  onChange={(e) => setDiscount({ ...discount, type: e.target.value, value: 0 })}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="none">No Discount</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                {discount.type !== "none" && (
                  <Input
                    type="number"
                    placeholder="Value"
                    value={discount.value || ''}
                    onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) || 0 })}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-2 border-t pt-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{discountAmount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tax ({settings.tax_rate}%):</span>
                <span>{tax.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 text-gray-800">
                <span>Total:</span>
                <span>{total.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={cart.length === 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Complete Sale</DialogTitle>
                  <DialogDescription className="text-gray-600">Choose payment method and complete the transaction</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Payment Method</Label>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                        <TabsTrigger value="cash" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Cash</TabsTrigger>
                        <TabsTrigger value="card" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Card</TabsTrigger>
                        <TabsTrigger value="mobile" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">Mobile Money</TabsTrigger>
                      </TabsList>

                      <TabsContent value="cash" className="space-y-2">
                        <Label className="text-gray-700">Cash Received</Label>
                        <Input
                          type="number"
                          step="100"
                          value={cashReceived || ""}
                          onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                        {cashReceived > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">Change:</span>
                            <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                              {change.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                            </span>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="card">
                        <p className="text-sm text-gray-600">Card payment will be processed through Stripe</p>
                      </TabsContent>

                      <TabsContent value="mobile">
                        <p className="text-sm text-gray-600">Mobile money payment integration</p>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-2 text-gray-800">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span>{subtotal.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax ({settings.tax_rate}%):</span>
                        <span>{tax.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-1 text-gray-800">
                        <span>Total:</span>
                        <span>{total.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={completeSale}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={isSubmitting || (paymentMethod === "cash" && change < 0)}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Receipt className="h-4 w-4 mr-2" />}
                    {isSubmitting ? 'Processing...' : 'Complete Sale'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
