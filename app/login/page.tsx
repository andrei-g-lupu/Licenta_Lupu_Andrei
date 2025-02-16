'use client';

import React, { Suspense } from 'react';
import Login from '../components/Login';
import styles from '../components/Login.module.css'; // Ensure the path is correct

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  );
};

export default LoginPage;