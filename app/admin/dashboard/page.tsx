'use client';
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Clock, 
  Globe, 
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  FileText,
  Shield,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';

// Types
interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalQueries: number;
  queriesToday: number;
  avgResponseTime: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface UserActivity {
  id: number;
  username: string;
  email: string;
  queryCount: number;
  lastActive: string;
  location?: string;
}

interface QueryTrend {
  date: string;
  queries: number;
  users: number;
}

interface RealtimeMetric {
  timestamp: string;
  activeUsers: number;
  queriesPerMinute: number;
  responseTime: number;
  errorRate: number;
}

// New types for admin management
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

interface Log {
  id: number;
  user_id: number;
  action_type: string;
  action_details: any;
  ip_address: string;
  created_at: string;
}

export default function AdminDashboard() {
  // State
  const [activeTab, setActiveTab] = useState<'executive' | 'monitoring' | 'analytics' | 'users' | 'settings' | 'logs'>('executive');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [queryTrends, setQueryTrends] = useState<QueryTrend[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([]);
  
  // New state for admin management
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [editSettings, setEditSettings] = useState<Record<string, string>>({});
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues by only rendering dates on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data functions
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setDashboardStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/user-activities');
      if (!response.ok) throw new Error('Failed to fetch user activities');
      const data = await response.json();
      setUserActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user activities');
    }
  };

  const fetchQueryTrends = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/query-trends');
      if (!response.ok) throw new Error('Failed to fetch query trends');
      const data = await response.json();
      console.log('Query trends data received:', data);
      console.log('Query trends length:', data.length);
      console.log('Last 7 days data:', data.slice(-7));
      setQueryTrends(data);
    } catch (err) {
      console.error('Query trends fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch query trends');
    }
  };

  const fetchRealtimeMetrics = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/realtime');
      if (!response.ok) throw new Error('Failed to fetch realtime metrics');
      const data = await response.json();
      setRealtimeMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch realtime metrics');
    }
  };

  // New fetch functions for admin management
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.error || 'Unknown error fetching users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    }
  };

  // Admin management handlers
  const handleRoleChange = async (id: number, role: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      });
      if (!response.ok) throw new Error('Failed to update user role');
      setUsers(users => users.map(u => u.id === id ? { ...u, role } : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users => users.filter(u => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingUpdate = async (setting_key: string, setting_value: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key, setting_value }),
      });
      if (!response.ok) throw new Error('Failed to update setting');
      setSettings(settings => settings.map(s => s.setting_key === setting_key ? { ...s, setting_value } : s));
      setEditSettings(prev => {
        const newEdits = { ...prev };
        delete newEdits[setting_key];
        return newEdits;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'users' || activeTab === 'settings' || activeTab === 'logs') {
        // Fetch admin management data
        const promises = [];
        if (activeTab === 'users') promises.push(fetchUsers());
        if (activeTab === 'settings') promises.push(fetchSettings());
        if (activeTab === 'logs') promises.push(fetchLogs());
        await Promise.all(promises);
      } else {
        // Fetch dashboard analytics data
        await Promise.all([
          fetchDashboardStats(),
          fetchUserActivities(),
          fetchQueryTrends(),
          fetchRealtimeMetrics()
        ]);
      }
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Update the tab change effect to fetch appropriate data
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'settings') {
      fetchSettings();
    } else if (activeTab === 'logs') {
      fetchLogs();
    } else {
      // Fetch dashboard analytics data for executive, monitoring, analytics tabs
      const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
          await Promise.all([
            fetchDashboardStats(),
            fetchUserActivities(),
            fetchQueryTrends(),
            fetchRealtimeMetrics()
          ]);
          setLastUpdate(new Date());
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [activeTab]);

  // Auto-refresh every 30 seconds for realtime data
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'monitoring') {
        fetchRealtimeMetrics();
        fetchDashboardStats();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Helper functions
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'critical': return <AlertCircle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string | Date) => {
    if (!mounted) return '...'; // Prevent hydration mismatch
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (date: Date) => {
    if (!mounted) return '...'; // Prevent hydration mismatch
    try {
      return date.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">
                Last updated: {formatDateTime(lastUpdate)}
              </p>
            </div>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'executive', label: 'Executive Summary', icon: BarChart3 },
              { id: 'monitoring', label: 'Real-time Monitoring', icon: Activity },
              { id: 'analytics', label: 'User Analytics', icon: Users },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'logs', label: 'Logs', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary Tab */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats ? formatNumber(dashboardStats.totalUsers) : '...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Today</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats ? formatNumber(dashboardStats.activeUsersToday) : '...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Queries</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats ? formatNumber(dashboardStats.totalQueries) : '...'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Response</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats ? `${dashboardStats.avgResponseTime.toFixed(1)}s` : '...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Query Trends Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Query Trends (Last 7 Days)</h3>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                {queryTrends.length > 0 ? (
                  <div className="w-full h-full p-4">
                    {/* Simple bar chart representation */}
                    <div className="flex items-end justify-between h-48 space-x-2">
                      {queryTrends.slice(-7).map((trend, index) => {
                        const maxQueries = Math.max(...queryTrends.map(t => t.queries));
                        const height = maxQueries > 0 ? (trend.queries / maxQueries) * 100 : (trend.queries > 0 ? 100 : 10);
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-gray-600 mb-1">
                              {trend.queries}
                            </div>
                            <div 
                              className={`w-full rounded-t ${trend.queries > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                              style={{ height: `${height}%`, minHeight: '4px' }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">
                              {mounted ? new Date(trend.date).getDate() : '...'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Total queries in last 7 days: {queryTrends.slice(-7).reduce((sum, trend) => sum + trend.queries, 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">No trend data available</p>
                    <p className="text-sm text-gray-400">Data will appear once queries are made</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Real-time Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">System Health</h3>
                <div className={`flex items-center gap-2 ${dashboardStats ? getHealthColor(dashboardStats.systemHealth) : 'text-gray-500'}`}>
                  {dashboardStats ? getHealthIcon(dashboardStats.systemHealth) : <Activity className="w-5 h-5" />}
                  <span className="font-medium capitalize">
                    {dashboardStats?.systemHealth || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Queries/Min</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.length > 0 
                        ? realtimeMetrics[realtimeMetrics.length - 1]?.queriesPerMinute.toFixed(1) 
                        : '0.0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Now</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.length > 0 
                        ? realtimeMetrics[realtimeMetrics.length - 1]?.activeUsers || 0
                        : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Error Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.length > 0 
                        ? `${(realtimeMetrics[realtimeMetrics.length - 1]?.errorRate * 100 || 0).toFixed(1)}%`
                        : '0.0%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Users Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Most Active Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Queries
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userActivities.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.queryCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            {user.location || 'Unknown'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500">Manage user roles and permissions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.created_at ? formatDate(user.created_at) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-500">Configure application settings and preferences</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Setting Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {settings.map((setting) => (
                      <tr key={setting.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {setting.setting_key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={editSettings[setting.setting_key] ?? setting.setting_value}
                            onChange={(e) =>
                              setEditSettings(prev => ({
                                ...prev,
                                [setting.setting_key]: e.target.value
                              }))
                            }
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {setting.updated_at ? formatDate(setting.updated_at) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleSettingUpdate(setting.setting_key, editSettings[setting.setting_key] ?? setting.setting_value)}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {settings.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No settings found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            {/* Logs Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Logs</h3>
                <p className="text-sm text-gray-500">View system activity and user actions</p>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {log.user_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.action_type === 'login' ? 'bg-green-100 text-green-800' :
                            log.action_type === 'logout' ? 'bg-yellow-100 text-yellow-800' :
                            log.action_type === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.action_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={typeof log.action_details === 'string' ? log.action_details : JSON.stringify(log.action_details)}>
                            {typeof log.action_details === 'string' 
                              ? log.action_details 
                              : JSON.stringify(log.action_details).substring(0, 50) + '...'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {log.ip_address}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.created_at ? formatDate(log.created_at) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No logs found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 