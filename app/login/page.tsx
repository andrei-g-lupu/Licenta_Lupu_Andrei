'use client';

import React from 'react';
import Login from '../components/Login';
import styles from '../components/Login.module.css'; // Ensure the path is correct

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login />
    </div>
  );
};

export default LoginPage;