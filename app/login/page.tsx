'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LogoHeader from './_components/LogoHeader';
import LoginLayout from './_components/LoginLayout';
import LoginForm from './_components/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <LoginLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4aed88',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ff4b4b',
              color: '#fff',
            },
          },
        }}
      />
      <LogoHeader />
      <LoginForm />
    </LoginLayout>
  );
}