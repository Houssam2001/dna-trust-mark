import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/services/api";

export type AppRole = "admin" | "agent" | "owner";

export interface User {
  id: string;
  email: string;
  profile?: {
    full_name?: string;
    phone?: string;
  };
  roles?: { role: AppRole }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get<{ user: User }>('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.message || 'Login failed') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, fullName });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.message || 'Registration failed') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const roles = user?.roles?.map(r => r.role) || [];
  const isAdmin = roles.includes("admin");
  const isAgent = roles.includes("agent");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isAgent,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
