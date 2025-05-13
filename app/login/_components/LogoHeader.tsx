import React from 'react';
import Image from 'next/image';

export default function LogoHeader() {
  return (
    <>
      <div className="flex justify-center mb-6">
        <Image
          src="/images/iyte_logo.png"
          alt="IYTE Logo"
          width={80}
          height={80}
          priority
        />
      </div>
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">Graduation Management System</h1>
      <p className="text-sm text-center text-gray-600 mb-6">std.iyte.edu.tr | iyte.edu.tr Domain User Information</p>
    </>
  );
} 