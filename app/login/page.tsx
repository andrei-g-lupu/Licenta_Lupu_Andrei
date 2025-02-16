'use client';

import React, { Suspense } from 'react';
import Login from '../components/Login';
import styles from '../components/Login.module.css'; // Ensure the path is correct

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<LoadingComponent />}>
        <Login />
      </Suspense>
    </div>
  );
};

export default LoginPage;