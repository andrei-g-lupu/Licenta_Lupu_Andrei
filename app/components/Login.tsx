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
    setError(null); // Reset error before submitting
    try {
      const response = await fetch('/api/login', { // Ensured to match server route
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

      // On success:
      window.location.href = 'http://localhost:3000'; // Redirect to localhost:3000
    } catch (err) {
      console.error('Login Error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          required
          className={styles.inputField}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => router.push('/register')}
        className="mt-4 p-2 bg-gray-500 text-white rounded"
      >
        Don't have an account? Register
      </button>
    </div>
  );
};

export default Login;