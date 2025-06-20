import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  // The new useAuth doesn't return userProfile or a specific error object yet.
  // We will rely on the try/catch for error handling.
  const { signIn, user, loading } = useAuth();
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // This effect now handles redirection when the user state is populated.
    if (user) {
      const targetPath = {
        admin: '/admin/dashboard',
        cashier: '/sales',
        inventory_manager: '/inventory',
      }[user.role as string] || '/dashboard';
      
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call signIn with a single object containing username and password
      await signIn({ username, password });
      // The navigate logic is now in the useEffect or could be in the signIn function itself
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password. Please check your credentials and try again.');
    }

    setIsLoading(false);
  };

   if (loading || user) {
    // Show a loading indicator while the initial auth check runs,
    // or if the user has just logged in and is about to be redirected.
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
            <CardTitle className="text-2xl text-center text-gray-800">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-sm text-gray-600 mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium mb-2 text-blue-800">Contact Administrator</p>
              <p className="text-blue-700">New users must be added by an administrator.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;