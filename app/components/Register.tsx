// File: c:/Tutorial_Rag/app/components/Register.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration Error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.formHeader}>
        <h2>Create Account</h2>
        <p>Join us today and get started</p>
      </div>
      
      {error && (
        <div className={styles.errorAlert}>
          <span>⚠️</span> {error}
        </div>
      )}
      
      {success && (
        <div className={styles.successAlert}>
          <span>✅</span> {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="johndoe"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="john@example.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <span className={styles.loader}>Creating account...</span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className={styles.footer}>
        Already have an account?{' '}
        <button
          onClick={() => router.push('/login')}
          className={styles.linkButton}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Register;