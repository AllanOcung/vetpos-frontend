import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

// Define the shape of our user object
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'cashier' | 'inventory_manager' | null;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  hasRole: (role: string | string[]) => boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetUser = async () => {
    try {
      const { data } = await api.get('/user/profile/');
      setUser(data);      
      return data;
    } catch (error) {
      // This can happen if the token is invalid/expired
      console.error("Failed to fetch user", error);
      signOut(); // Log out the user if we can't fetch their profile
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await fetchAndSetUser();
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const signIn = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/token/', {
        username: data.username,
        password: data.password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      const userData = await fetchAndSetUser();
  
    } catch (error) {
      console.error('Sign in failed:', error);
      // Clean up on failure
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const signOut = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  };

  // const hasRole = (role: string) => {
  //   return user?.role === role;
  // };

  const hasRole = (roles: string | string[]) => {
    const hasPermission = user?.role ? (Array.isArray(roles) ? roles.includes(user.role) : user.role === roles) : false;    
    return hasPermission;
  };

  const value = {
    user,
    signIn,
    signOut,
    loading,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};