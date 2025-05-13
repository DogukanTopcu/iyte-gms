import React, { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/images/login_background.jpg')" }}>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Login Box */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
} 