
import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Settings, Users, Shield, Database, Download, Upload, Calendar, AlertTriangle, PlusCircle } from "lucide-react";
import { Edit, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast"; // Import useToast for notifications
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


const mockBackups = [
  { id: 1, date: "2024-06-19", time: "02:00 AM", size: "45.2 MB", status: "completed" },
  { id: 2, date: "2024-06-18", time: "02:00 AM", size: "44.8 MB", status: "completed" },
  { id: 3, date: "2024-06-17", time: "02:00 AM", size: "43.9 MB", status: "completed" },
  { id: 4, date: "2024-06-16", time: "02:00 AM", size: "42.1 MB", status: "failed" }
];

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'cashier' | 'inventory_manager' | null;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at: string;
}

// Add interface for Product (for the multi-select)
interface Product {
  id: number;
  name: string;
}

// Add interface for Promotion
interface Promotion {
  id: number;
  name: string;
  description: string;
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  products: number[]; // Array of product IDs
}


// Define a single state shape for our forms
interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string; // Optional for edit form
  role: 'admin' | 'cashier' | 'inventory_manager';
  status: 'active' | 'inactive';
}

// Define an interface for our settings object to match backend keys
interface SystemSettings {
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  tax_rate: number;
  currency: string;
  low_stock_alert_threshold: number;
  expiry_alert_days: number;
}

export const AdminSettings = () => {
  // Get the currently logged-in user to prevent self-deletion
  const { user: loggedInUser, hasRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State for all settings, matching the backend model keys
  const [settings, setSettings] = useState<Partial<SystemSettings>>({});
  const [isSaving, setIsSaving] = useState(false);

  // --- START: State for Promotions ---
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isEditPromotionOpen, setIsEditPromotionOpen] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  // --- END: State for Promotions ---

  // --- START: State for Edit User Dialog ---
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  // --- END: State for Edit User Dialog ---

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_name: 'cashier',
    // status: 'active'
  });

  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setNewUser({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role_name: 'cashier',
    });
    setError('');
    setSuccess('');
  };

  // --- START: Functions for fetching and saving settings ---
  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings/');
      // Backend sends numbers as strings, so we parse them
      const parsedSettings = {
        ...data,
        tax_rate: parseFloat(data.tax_rate) || 0,
        low_stock_alert_threshold: parseInt(data.low_stock_alert_threshold, 10) || 10,
        expiry_alert_days: parseInt(data.expiry_alert_days, 10) || 30, 
      };
      setSettings(parsedSettings);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to load settings",
        description: "Could not fetch system configuration from the server.",
      });
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await api.post('/settings/', settings);
      toast({
        title: "Success",
        description: "Settings have been saved successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  // --- END: Functions for fetching and saving settings ---


  // --- START: Handler for Updating a User ---
  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // We use PATCH to send only the changed data to the backend.
      // The endpoint is /api/users/{id}/
      await api.patch(`/users/${editingUser.id}/`, {
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        role_name: editingUser.role_name,
        is_active: editingUser.is_active,
      });

      setSuccess('User updated successfully!');
      toast({ title: "Success", description: "User details have been updated." });
      fetchUsers(); // Refresh the user list
      setIsEditUserOpen(false); // Close the dialog
      setEditingUser(null); // Clear the editing state
    } catch (err: any) {
      const errorMessage = err.response?.data?.email?.[0] || "Failed to update user.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Update Failed", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END: Handler for Updating a User ---

  // --- START: Handler to open the edit dialog ---
  const handleOpenEditDialog = (userToEdit: any) => {
    setEditingUser({
      ...userToEdit,
      // The backend expects 'role_name' and 'is_active' for updates.
      // We map the user's current 'role' and 'status' to these fields.
      role_name: userToEdit.role,
      is_active: userToEdit.status === 'active',
    });
    setIsEditUserOpen(true);
  };
  // --- END: Handler to open the edit dialog ---

  // --- START: Handler for Deleting a User ---
  const handleDeleteUser = async (userId: string) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Send a DELETE request to the /api/users/{id}/ endpoint
      await api.delete(`/users/${userId}/`);
      setSuccess('User deleted successfully!');
      toast({ title: "Success", description: "The user has been permanently deleted." });
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to delete user.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Deletion Failed", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END: Handler for Deleting a User ---

  // --- START: Functions for Promotions ---
  const fetchPromotions = async () => {
    setPromoLoading(true);
    try {
      const { data } = await api.get('/promotions/');
      setPromotions(data || []);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to load promotions" });
    } finally {
      setPromoLoading(false);
    }
  };

  const fetchProductsForPromo = async () => {
    try {
      const { data } = await api.get('/products/');
      setProducts(data || []);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to load products for promotions" });
    }
  };

   const handleSavePromotion = async (promoData: Omit<Promotion, 'id'> | Promotion) => {
    setIsSubmitting(true);
    try {
      if ('id' in promoData) {
        // Editing existing promotion
        await api.patch(`/promotions/${promoData.id}/`, promoData);
        toast({ title: "Success", description: "Promotion updated successfully." });
      } else {
        // Creating new promotion
        await api.post('/promotions/', promoData);
        toast({ title: "Success", description: "Promotion created successfully." });
      }
      fetchPromotions();
      setIsAddPromotionOpen(false);
      setIsEditPromotionOpen(false);
      setEditingPromotion(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "An error occurred.";
      toast({ variant: "destructive", title: "Save Failed", description: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDeletePromotion = async (promoId: number) => {
    try {
      await api.delete(`/promotions/${promoId}/`);
      toast({ title: "Success", description: "Promotion deleted." });
      fetchPromotions();
    } catch (err) {
      toast({ variant: "destructive", title: "Deletion Failed" });
    }
  };
  // --- END: Functions for Promotions ---



  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'inventory_manager': return 'bg-blue-100 text-blue-800';
      case 'cashier': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getBackupStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const createBackup = () => {
    alert("Manual backup initiated. This will take a few minutes to complete.");
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/');
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasRole('admin')) {
      fetchUsers();
      fetchSettings(); // Fetch settings when the component loads
      fetchPromotions();
      fetchProductsForPromo();
    }
  }, [hasRole]);

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Use our central api instance to post the new user data
      await api.post('/users/', newUser);

      setSuccess('User created successfully!');
      toast({ title: "Success", description: "New user has been created." });
      fetchUsers(); // Refresh the user list
      setIsAddUserOpen(false); // Close the dialog
      resetForm(); // Clear the form for next time
    } catch (err: any) {
      // Handle validation errors from Django (e.g., "email already exists")
      const errorMessage =
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        "An unexpected error occurred.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Creation Failed", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasRole('admin')) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only administrators can manage users.</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Manage system configuration and administration</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Update your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    value={settings.business_name || ''}
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={settings.business_address || ''}
                    onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={settings.business_phone || ''}
                    onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.business_email || ''}
                    onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.tax_rate || 0}
                    onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select
                    value={settings.currency || 'UGX'}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="UGX">UGX (Sh)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Low Stock Alert Threshold</Label>
                  <Input
                    type="number"
                    value={settings.low_stock_alert_threshold || 10}
                    onChange={(e) => setSettings({ ...settings, low_stock_alert_threshold: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Alert (days before)</Label>
                  <Input
                    type="number"
                    value={settings.expiry_alert_days || 30}
                    onChange={(e) => setSettings({ ...settings, expiry_alert_days: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <Button onClick={handleSaveSettings} className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSaving ? 'Saving...' : 'Save All General Settings'}
          </Button>
        </TabsContent>

        {/* --- START: Promotions Tab --- */}
        <TabsContent value="promotions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Promotions Management</h3>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsAddPromotionOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </div>

          <PromotionDialog
            isOpen={isAddPromotionOpen}
            onClose={() => setIsAddPromotionOpen(false)}
            onSave={handleSavePromotion}
            products={products}
            isSubmitting={isSubmitting}
          />

          <PromotionDialog
            isOpen={isEditPromotionOpen}
            onClose={() => { setIsEditPromotionOpen(false); setEditingPromotion(null); }}
            onSave={handleSavePromotion}
            products={products}
            isSubmitting={isSubmitting}
            promotion={editingPromotion}
          />
           <Card>
            <CardContent className="p-0">
              {promoLoading ? (
                <div className="p-6 text-center">Loading promotions...</div>
              ) : (
                <div className="space-y-1">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{promo.name} ({promo.value}%)</p>
                        <p className="text-sm text-gray-600">{promo.description}</p>
                        <p className="text-xs text-gray-500">
                          Active from {new Date(promo.start_date).toLocaleDateString()} to {new Date(promo.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={promo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {promo.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => { setEditingPromotion(promo); setIsEditPromotionOpen(true); }}>
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Promotion?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the promotion: <span className="font-semibold">{promo.name}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePromotion(promo.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* --- END: Promotions Tab --- */}

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Dialog open={isAddUserOpen} onOpenChange={(isOpen) => { setIsAddUserOpen(isOpen); if (!isOpen) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account with specific role permissions</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          placeholder="John"
                          value={newUser.first_name}
                          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          placeholder="Doe"
                          value={newUser.last_name}
                          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <select
                        value={newUser.role_name}
                        onChange={(e) => setNewUser({ ...newUser, role_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="cashier">Cashier</option>
                        <option value="inventory_manager">Inventory Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Temporary Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter temporary password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={!newUser.username || !newUser.email || !newUser.password || isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create User'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* --- START: Edit User Dialog --- */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User: {editingUser?.full_name}</DialogTitle>
                <DialogDescription>Update user details, role, and status.</DialogDescription>
              </DialogHeader>
              {editingUser && (
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={editingUser.first_name}
                          onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={editingUser.last_name}
                          onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <select
                        value={editingUser.role_name}
                        onChange={(e) => setEditingUser({ ...editingUser, role_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="cashier">Cashier</option>
                        <option value="inventory_manager">Inventory Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <Label>User Status</Label>
                        <p className="text-sm text-muted-foreground">
                          Inactive users cannot log in.
                        </p>
                      </div>
                      <Switch
                        checked={editingUser.is_active}
                        onCheckedChange={(checked) => setEditingUser({ ...editingUser, is_active: checked })}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
          {/* --- END: Edit User Dialog --- */}

          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert className="border-green-500"><CheckCircle className="h-4 w-4 text-green-500" /><AlertDescription>{success}</AlertDescription></Alert>}

          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(user)}>
                        Edit
                      </Button>
                       {/* --- START: Delete User Button and Dialog --- */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {/* Disable delete button for the currently logged-in user */}
                          <Button variant="destructive" size="icon" className="h-8 w-8" disabled={user.id === loggedInUser?.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account for <span className="font-semibold">{user.full_name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)} disabled={isSubmitting}>
                              {isSubmitting ? 'Deleting...' : 'Continue'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {/* --- END: Delete User Button and Dialog --- */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Manage automatic backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Daily Backup</Label>
                    <p className="text-sm text-gray-600">Backup data every day at 2:00 AM</p>
                  </div>
                  <Switch
                    // checked={settings.autoBackup}
                    // onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                  />
                </div>
                <Button onClick={createBackup} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Database className="h-4 w-4 mr-2" />
                  Create Manual Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import/Export</CardTitle>
                <CardDescription>Manage data import and export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Recent backup activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBackups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{backup.date}</p>
                        <p className="text-xs text-gray-500">{backup.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm">{backup.size}</span>
                      <Badge className={getBackupStatusColor(backup.status)}>
                        {backup.status.toUpperCase()}
                      </Badge>
                      {backup.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Password Change</Label>
                    <p className="text-sm text-gray-600">Force users to change password every 90 days</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-600">Auto logout after 30 minutes of inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Security Alerts</span>
                </CardTitle>
                <CardDescription>Recent security events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Failed login attempt</p>
                      <p className="text-xs text-gray-500">admin@vetpos.com - 2 hours ago</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Password changed</p>
                      <p className="text-xs text-gray-500">cashier1@vetpos.com - 1 day ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Info</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">New user added</p>
                      <p className="text-xs text-gray-500">cashier2@vetpos.com - 3 days ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Info</Badge>
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


// --- START: Promotion Dialog Component ---
// A reusable dialog for adding/editing promotions

interface PromotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promoData: Omit<Promotion, 'id'> | Promotion) => void;
  products: Product[];
  isSubmitting: boolean;
  promotion?: Promotion | null;
}

const PromotionDialog = ({ isOpen, onClose, onSave, products, isSubmitting, promotion }: PromotionDialogProps) => {
  const [formData, setFormData] = useState<Omit<Promotion, 'id' | 'products'> & { products: number[] }>({
    name: '',
    description: '',
    value: 0,
    start_date: '',
    end_date: '',
    is_active: true,
    products: [],
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
           name: promotion.name,
        description: promotion.description,
        value: promotion.value,
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        is_active: promotion.is_active,
        products: promotion.products,
      });
    } else {
      // Reset for new promotion
      setFormData({
        name: '',
        description: '',
        value: 0,
        start_date: '',
        end_date: '',
        is_active: true,
        products: [],
      });
    }
  }, [promotion, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = promotion ? { ...formData, id: promotion.id } : formData;
    onSave(dataToSave);
  };

  const handleProductSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({ ...formData, products: selectedIds });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{promotion ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Promotion Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Discount Value (%)</Label>
            <Input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Applicable Products (Ctrl/Cmd + Click to select multiple)</Label>
            <select
              multiple
              value={formData.products.map(String)}
              onChange={handleProductSelection}
              className="w-full h-32 p-2 border rounded-md"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label>Active</Label>
            <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
          </div>
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Promotion'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
