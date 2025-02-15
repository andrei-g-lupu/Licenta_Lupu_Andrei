import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      window.location.href = '/chat';
    } catch (err) {
      console.error('Login Error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formHeader}>
        <h2>Welcome Back</h2>
        <p>Please sign in to continue</p>
      </div>
      
      {error && (
        <div className={styles.errorAlert}>
          <span>⚠️</span> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
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
            placeholder="your@email.com"
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
            <span className={styles.loader}>Loading...</span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className={styles.footer}>
        <button
          onClick={() => router.push('/register')}
          className={styles.linkButton}
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;