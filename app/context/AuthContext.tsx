'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

export type UserRole = 'secretariat' | 'faculity' | 'Student Affairs' | "advisor" | "student" | null;

interface Department {
  id: number;
  name: string;
  email: string;
}

interface Advisor {
  id: number;
  name: string;
  email: string;
  type: string;
  departmentId: number;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  advisorId: number;
  grade: number;
  department: Department;
  advisor: Advisor;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: UserRole;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set auth cookie
const setAuthCookie = (isAuthenticated: boolean, userRole: UserRole) => {
  const authData = JSON.stringify({ isAuthenticated, userRole });
  document.cookie = `auth=${authData}; path=/; max-age=86400`; // 24 hours expiry
};

// Helper function to remove auth cookie
const removeAuthCookie = () => {
  document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { isAuthenticated: storedIsAuth, userRole: storedRole, user: storedUser } = JSON.parse(storedAuth);
        setIsAuthenticated(storedIsAuth);
        setUserRole(storedRole);
        setUser(storedUser);
        setAuthCookie(storedIsAuth, storedRole);
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('auth');
        removeAuthCookie();
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    }
  }, []);

  // Handle route protection
  useEffect(() => {
    const isLoginPage = pathname === '/login';
    
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      // Update localStorage with new user data
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated,
        userRole: updatedUser.role,
        user: updatedUser
      }));
      return updatedUser;
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (!response.ok) {
        toast.error('Invalid email or password');
      }
      return response.json();
    })
    .then(async (data) => {
      await validateUser(data.user.email, data.role).then(res => {
        if (!res.user) {
          if (data.role === 'student') {
            toast.error('Please consult your advisor for access to this system');
          } 
          toast.error('User have not permission to access this system');
          
          return;
        }
        setIsAuthenticated(true);
        setUserRole(data.role);
        setUser(data.user);
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          userRole: data.role,
          user: data.user
        }));
        setAuthCookie(true, data.role);
      }).catch(error => {
        toast.error('User have not permission to access this system');
        return;
      });
    })
    .catch(error => {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('auth');
      removeAuthCookie();
      toast.error('Invalid email or password');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const validateUser = async (email: string, role: UserRole) => {
    const response = await fetch('/api/auth?email=' + email + '&role=' + role, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('auth');
    removeAuthCookie();
    router.push('/login');
  };

  const value = {
    isAuthenticated,
    user,
    userRole,
    isLoading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 