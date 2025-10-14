import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { getMe, login as apiLogin } from '@/services/apiService';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  // Add other fields from the /api/me response as needed
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  revalidateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const revalidateUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
      localStorage.setItem('picnode_user', JSON.stringify(userData));
    } catch (error) {
      // If getMe fails, the user is likely not authenticated
      setUser(null);
      localStorage.removeItem('picnode_user');
      localStorage.removeItem('picnode_token');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('picnode_token');
    if (token) {
      revalidateUser();
    }
  }, []);

  const login = async (credentials: any) => {
    const response = await apiLogin(credentials);
    localStorage.setItem('picnode_token', response.token);
    await revalidateUser();
  };

  const logout = async () => {
    try {
      await apiService.delete('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('picnode_user');
      localStorage.removeItem('picnode_token');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, revalidateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
