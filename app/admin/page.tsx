'use client';
import React, { useEffect, useState } from 'react';

type User = { id: number; username: string; email: string; role: string };
type Setting = { id: number; setting_key: string; setting_value: string; updated_at: string };
type Log = { id: number; user_id: number; action_type: string; action_details: any; ip_address: string; created_at: string };

export default function AdminDashboard() {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedTab, setSelectedTab] = useState<'users' | 'settings' | 'logs'>('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editSettings, setEditSettings] = useState<Record<string, string>>({});

  // Fetch data
  useEffect(() => {
    setError(null);
    setLoading(true);
    if (selectedTab === 'users') {
      fetch('/api/admin/users')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
          else setError(data.error || "Unknown error");
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else if (selectedTab === 'settings') {
      fetch('/api/admin/settings').then(r => r.json()).then(setSettings).catch(e => setError(e.message)).finally(() => setLoading(false));
    } else if (selectedTab === 'logs') {
      fetch('/api/admin/logs').then(r => r.json()).then(setLogs).catch(e => setError(e.message)).finally(() => setLoading(false));
    }
  }, [selectedTab]);

  // Handlers
  const handleRoleChange = async (id: number, role: string) => {
    setLoading(true);
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    setUsers(users => users.map(u => u.id === id ? { ...u, role } : u));
    setLoading(false);
  };

  const handleDeleteUser = async (id: number) => {
    setLoading(true);
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setUsers(users => users.filter(u => u.id !== id));
    setLoading(false);
  };

  const handleSettingUpdate = async (setting_key: string, setting_value: string) => {
    setLoading(true);
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setting_key, setting_value }),
    });
    setSettings(settings => settings.map(s => s.setting_key === setting_key ? { ...s, setting_value } : s));
    setEditSettings(prev => {
      const newEdits = { ...prev };
      delete newEdits[setting_key];
      return newEdits;
    });
    setLoading(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex gap-4 mb-6">
          <button className={selectedTab === 'users' ? 'font-bold' : ''} onClick={() => setSelectedTab('users')}>Users</button>
          <button className={selectedTab === 'settings' ? 'font-bold' : ''} onClick={() => setSelectedTab('settings')}>Settings</button>
          <button className={selectedTab === 'logs' ? 'font-bold' : ''} onClick={() => setSelectedTab('logs')}>Logs</button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading && <div>Loading...</div>}

        {/* Users Tab */}
        {selectedTab === 'users' && (
          <table className="w-full border mb-4">
            <thead>
              <tr>
                <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="moderator">moderator</option>
                    </select>
                  </td>
                  <td>
                    <button className="text-red-600" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Settings Tab */}
        {selectedTab === 'settings' && (
          <table className="w-full border mb-4">
            <thead>
              <tr>
                <th>Key</th><th>Value</th><th>Updated At</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map(s => (
                <tr key={s.id}>
                  <td>{s.setting_key}</td>
                  <td>
                    <input
                      type="text"
                      value={editSettings[s.setting_key] ?? s.setting_value}
                      onChange={e =>
                        setEditSettings(prev => ({
                          ...prev,
                          [s.setting_key]: e.target.value
                        }))
                      }
                      className="border px-2"
                    />
                  </td>
                  <td>{s.updated_at ? new Date(s.updated_at).toLocaleString() : ''}</td>
                  <td>
                    <button
                      onClick={() => handleSettingUpdate(s.setting_key, editSettings[s.setting_key] ?? s.setting_value)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Logs Tab */}
        {selectedTab === 'logs' && (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full border">
              <thead>
                <tr>
                  <th>ID</th><th>User ID</th><th>Action</th><th>Details</th><th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{l.user_id}</td>
                    <td>{l.action_type}</td>
                    <td><pre className="whitespace-pre-wrap">{JSON.stringify(l.action_details, null, 2)}</pre></td>
                    <td>{new Date(l.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}