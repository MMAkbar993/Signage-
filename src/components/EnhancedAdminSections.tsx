import { useState, useEffect } from 'react';
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Lock,
  Key,
  Eye,
  Ban,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  TrendingUp,
  TrendingDown,
  Bell,
  Mail,
  FileBarChart,
  Download,
  Calendar,
  Clock,
  Users,
  Activity,
  Database,
  RefreshCw,
  ExternalLink,
  Copy,
  Settings,
  Trash2,
  Plus,
  X,
  Info,
  FileText,
  Target,
  Zap,
  Globe,
} from 'lucide-react';

// Security Section
export function SecuritySection({ showMessage }: any) {
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [newIP, setNewIP] = useState('');
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(24);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = () => {
    const stored = localStorage.getItem('securitySettings');
    if (stored) {
      const settings = JSON.parse(stored);
      setBlockedIPs(settings.blockedIPs || []);
      setTwoFactorEnabled(settings.twoFactorEnabled || false);
      setSessionTimeout(settings.sessionTimeout || 24);
    }

    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(JSON.parse(attempts));
    }
  };

  const handleBlockIP = () => {
    if (!newIP.trim()) {
      showMessage('error', 'Please enter an IP address');
      return;
    }

    const updatedIPs = [...blockedIPs, newIP];
    setBlockedIPs(updatedIPs);
    
    const settings = {
      blockedIPs: updatedIPs,
      twoFactorEnabled,
      sessionTimeout,
    };
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    
    setNewIP('');
    showMessage('success', 'IP address blocked successfully');
  };

  const handleUnblockIP = (ip: string) => {
    const updatedIPs = blockedIPs.filter(i => i !== ip);
    setBlockedIPs(updatedIPs);
    
    const settings = {
      blockedIPs: updatedIPs,
      twoFactorEnabled,
      sessionTimeout,
    };
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    
    showMessage('success', 'IP address unblocked');
  };

  const saveSecuritySettings = () => {
    const settings = {
      blockedIPs,
      twoFactorEnabled,
      sessionTimeout,
    };
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    showMessage('success', 'Security settings saved!');
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 mb-1">Security Level</div>
              <div className="text-2xl text-green-600">High</div>
            </div>
            <Shield className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 mb-1">Failed Logins (24h)</div>
              <div className="text-2xl text-slate-900">{loginAttempts.length}</div>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 mb-1">Blocked IPs</div>
              <div className="text-2xl text-slate-900">{blockedIPs.length}</div>
            </div>
            <Ban className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          Security Configuration
        </h3>

        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-slate-900 mb-1">Two-Factor Authentication</div>
              <div className="text-sm text-slate-600">Require 2FA for admin login</div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                twoFactorEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
              }`}
            >
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Session Timeout */}
          <div>
            <label className="block text-slate-700 mb-2">Session Timeout (hours)</label>
            <input
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="72"
            />
          </div>

          <button
            onClick={saveSecuritySettings}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Security Settings
          </button>
        </div>
      </div>

      {/* IP Blocking */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <Ban className="w-5 h-5 text-red-600" />
          IP Blocking
        </h3>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            placeholder="Enter IP address to block (e.g., 192.168.1.1)"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleBlockIP}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Block IP
          </button>
        </div>

        <div className="space-y-2">
          {blockedIPs.map((ip, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Ban className="w-4 h-4 text-red-600" />
                <span className="text-slate-900">{ip}</span>
              </div>
              <button
                onClick={() => handleUnblockIP(ip)}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-red-600 rounded border border-red-300 text-sm"
              >
                Unblock
              </button>
            </div>
          ))}

          {blockedIPs.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No blocked IP addresses
            </div>
          )}
        </div>
      </div>

      {/* Recent Login Attempts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Recent Login Attempts</h3>
        <div className="text-sm text-slate-600">
          Track and monitor all login attempts to your admin panel
        </div>
      </div>
    </div>
  );
}

// Reports Section
export function ReportsSection({ users, showMessage }: any) {
  const [reportType, setReportType] = useState('users');
  const [dateRange, setDateRange] = useState('7days');

  const generateReport = () => {
    const reportData = {
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: users,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${dateRange}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage('success', 'Report generated and downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-6 flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-blue-600" />
          Generate Reports
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="users">User Activity Report</option>
              <option value="signage">Signage Generation Report</option>
              <option value="analytics">Analytics Report</option>
              <option value="quotas">Quota Usage Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="security">Security Audit Report</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button
            onClick={generateReport}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate & Download Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600 mb-1">Total Revenue (Estimated)</div>
          <div className="text-3xl text-green-600">
            ${users.filter(u => u.plan === 'pro').length * 5 + users.filter(u => u.plan === 'enterprise').length * 50}
          </div>
          <div className="text-xs text-slate-500 mt-1">Monthly recurring</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600 mb-1">Active Subscriptions</div>
          <div className="text-3xl text-blue-600">
            {users.filter(u => u.plan !== 'free').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Pro + Enterprise</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="text-sm text-slate-600 mb-1">Conversion Rate</div>
          <div className="text-3xl text-purple-600">
            {users.length > 0 ? ((users.filter(u => u.plan !== 'free').length / users.length) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Free to paid</div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Available Report Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'User Activity', desc: 'Complete user activity and engagement metrics', icon: Users },
            { name: 'Signage Analytics', desc: 'Signage generation statistics and trends', icon: FileText },
            { name: 'Revenue Analysis', desc: 'Financial reports and subscription metrics', icon: TrendingUp },
            { name: 'Quota Usage', desc: 'Daily quota consumption and limits', icon: Target },
            { name: 'Security Audit', desc: 'Security events and access logs', icon: Shield },
            { name: 'System Performance', desc: 'Technical metrics and health status', icon: Cpu },
          ].map((report, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-start gap-3">
                <report.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-slate-900 mb-1">{report.name}</div>
                  <div className="text-sm text-slate-600">{report.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Notifications Section
export function NotificationsSection({ showMessage }: any) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [userAlerts, setUserAlerts] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@signage.com');

  const saveNotificationSettings = () => {
    const settings = {
      emailNotifications,
      systemAlerts,
      userAlerts,
      adminEmail,
    };
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    showMessage('success', 'Notification settings saved!');
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Notification Settings
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 mb-2">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-slate-900 mb-1">Email Notifications</div>
                <div className="text-sm text-slate-600">Receive email alerts for important events</div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  emailNotifications
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                }`}
              >
                {emailNotifications ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-slate-900 mb-1">System Alerts</div>
                <div className="text-sm text-slate-600">Get notified about system issues</div>
              </div>
              <button
                onClick={() => setSystemAlerts(!systemAlerts)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  systemAlerts
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                }`}
              >
                {systemAlerts ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-slate-900 mb-1">User Activity Alerts</div>
                <div className="text-sm text-slate-600">Notifications for new users and activities</div>
              </div>
              <button
                onClick={() => setUserAlerts(!userAlerts)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  userAlerts
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                }`}
              >
                {userAlerts ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <button
            onClick={saveNotificationSettings}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {[
            { type: 'info', message: 'New user registered', time: '2 minutes ago' },
            { type: 'success', message: 'System backup completed', time: '1 hour ago' },
            { type: 'warning', message: 'High API usage detected', time: '3 hours ago' },
          ].map((notif, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              notif.type === 'success' ? 'bg-green-50 border-green-500' :
              notif.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-slate-900">{notif.message}</div>
                  <div className="text-sm text-slate-600 mt-1">{notif.time}</div>
                </div>
                <Bell className={`w-4 h-4 ${
                  notif.type === 'success' ? 'text-green-600' :
                  notif.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// System Health Section
export function SystemHealthSection({ showMessage }: any) {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    storage: 38,
    uptime: 99.9,
    activeUsers: 142,
    requestsPerSecond: 23,
  });

  const refreshMetrics = () => {
    // Simulate real-time metrics
    setSystemMetrics({
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      storage: Math.floor(Math.random() * 100),
      uptime: 99.9,
      activeUsers: Math.floor(Math.random() * 200),
      requestsPerSecond: Math.floor(Math.random() * 50),
    });
    showMessage('success', 'Metrics refreshed!');
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl text-green-900 mb-2">System Status: Online</h3>
            <p className="text-green-700">All systems operational</p>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-8 h-8 text-green-600" />
            <button
              onClick={refreshMetrics}
              className="p-2 bg-white hover:bg-green-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">CPU Usage</div>
            <Cpu className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl text-slate-900 mb-2">{systemMetrics.cpu}%</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                systemMetrics.cpu > 80 ? 'bg-red-500' :
                systemMetrics.cpu > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${systemMetrics.cpu}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">Memory Usage</div>
            <HardDrive className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl text-slate-900 mb-2">{systemMetrics.memory}%</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                systemMetrics.memory > 80 ? 'bg-red-500' :
                systemMetrics.memory > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${systemMetrics.memory}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">Storage Usage</div>
            <Database className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl text-slate-900 mb-2">{systemMetrics.storage}%</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                systemMetrics.storage > 80 ? 'bg-red-500' :
                systemMetrics.storage > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${systemMetrics.storage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-6 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-600" />
          Performance Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700 mb-1">System Uptime</div>
            <div className="text-2xl text-blue-900">{systemMetrics.uptime}%</div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-700 mb-1">Active Users</div>
            <div className="text-2xl text-green-900">{systemMetrics.activeUsers}</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-700 mb-1">Requests/Second</div>
            <div className="text-2xl text-purple-900">{systemMetrics.requestsPerSecond}</div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-700 mb-1">Response Time</div>
            <div className="text-2xl text-orange-900">45ms</div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-slate-50 rounded">
            <span className="text-slate-600">Server Status:</span>
            <span className="text-green-600 font-semibold">Online</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded">
            <span className="text-slate-600">Database:</span>
            <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded">
            <span className="text-slate-600">API Status:</span>
            <span className="text-green-600 font-semibold">Operational</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded">
            <span className="text-slate-600">Last Backup:</span>
            <span className="text-slate-900">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
