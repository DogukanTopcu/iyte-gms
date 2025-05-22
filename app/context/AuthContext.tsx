'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

export type UserRole = 'Physics Department Secretariat'|'secretariat' | 'faculity' | 'Student Affairs' | "advisor" | "student" | null;

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

export interface User {
  id: number;
  studentId: number;
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

  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { isAuthenticated: storedIsAuth, userRole: storedRole, user: storedUser } = JSON.parse(storedAuth);
        setIsAuthenticated(storedIsAuth);
        setUserRole(storedRole);
        setUser(storedUser);
        // Ensure the cookie is also set if localStorage has auth, for middleware consistency
        if (storedIsAuth) {
          setAuthCookie(storedIsAuth, storedRole);
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('auth');
        removeAuthCookie();
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    }
    setIsLoading(false); // Set isLoading to false after checking localStorage
  }, []);

  // Handle route protection
  useEffect(() => {
    // Only run route protection logic after initial loading is done
    if (isLoading) {
      return;
    }

    const isLoginPage = pathname === '/login';

    // If not authenticated and not on the login page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    } else if (isAuthenticated && isLoginPage) {
      // If authenticated and on the login page, redirect to the main page
      router.push('/');
    }
  }, [isAuthenticated, pathname, router, isLoading]); // Add isLoading to dependency array

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
        console.log("data", data)
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
    console.log("role", role)
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