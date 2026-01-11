import { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Trash2,
  Download,
  Upload,
  Users,
  FileText,
  BarChart3,
  Shield,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Building2,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  LogOut,
  Lock,
  Key,
  UserPlus,
  UserX,
  Edit,
  Ban,
  CheckSquare,
  XCircle,
  Activity,
  Zap,
  DollarSign,
  Crown,
  Filter,
  Search,
  Calendar,
  Clock,
  Layers,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  Target,
  Sparkles,
  Plus,
  Image,
  BookOpen,
  MessageCircle,
  Bell,
  Cpu,
  HardDrive,
  Monitor,
  Wifi,
  FileBarChart,
} from 'lucide-react';
import {
  User,
  ActivityLog,
  getAllUsers,
  updateUser,
  addUser,
  deleteUser,
  getActivityLogs,
  clearActivityLogs,
  getSystemStats,
  PLAN_CONFIGS,
  getCurrentUser,
} from '../utils/userTracking';
import {
  SecuritySection,
  ReportsSection,
  NotificationsSection,
  SystemHealthSection,
} from './EnhancedAdminSections';

interface CompanyBranding {
  clientLogo: string;
  contractorLogo: string;
  companyName: string;
  contactInfo: string;
}

type AdminSection = 
  | 'overview' 
  | 'users' 
  | 'plans' 
  | 'analytics' 
  | 'activity' 
  | 'features' 
  | 'templates'
  | 'branding' 
  | 'blog'
  | 'quotas'
  | 'security'
  | 'reports'
  | 'notifications'
  | 'system-health'
  | 'data' 
  | 'settings';

export function ComprehensiveAdminPanel() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [systemStats, setSystemStats] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [branding, setBranding] = useState<CompanyBranding>({
    clientLogo: '',
    contractorLogo: '',
    companyName: '',
    contactInfo: '',
  });
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadData();
    loadBranding();
  }, []);

  const loadData = () => {
    setUsers(getAllUsers());
    setActivityLogs(getActivityLogs());
    setSystemStats(getSystemStats());
  };

  const loadBranding = () => {
    const stored = localStorage.getItem('companyBranding');
    if (stored) {
      setBranding(JSON.parse(stored));
    }
  };

  const showSaveMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    window.location.reload();
  };

  const handleExportData = () => {
    const exportData = {
      users: getAllUsers(),
      activityLogs: getActivityLogs(),
      systemStats: getSystemStats(),
      branding,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSaveMessage('success', 'Data exported successfully!');
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      if (confirm('FINAL WARNING: This will delete everything! Continue?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const handleUserStatusChange = (userId: string, status: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updatedUser = { ...user, status };
      updateUser(updatedUser);
      loadData();
      showSaveMessage('success', `User ${status} successfully!`);
    }
  };

  const handleUserPlanChange = (userId: string, plan: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const planConfig = PLAN_CONFIGS[plan];
      const updatedUser = {
        ...user,
        plan,
        quota: planConfig.limits,
        features: planConfig.features,
      };
      updateUser(updatedUser);
      loadData();
      showSaveMessage('success', `Plan changed to ${plan.toUpperCase()} successfully!`);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      loadData();
      showSaveMessage('success', 'User deleted successfully!');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.plan === userFilter || user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Message Toast */}
      {saveMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in ${
          saveMessage.type === 'success' ? 'bg-green-600 text-white' :
          saveMessage.type === 'error' ? 'bg-red-600 text-white' :
          'bg-blue-600 text-white'
        }`}>
          {saveMessage.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {saveMessage.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {saveMessage.type === 'info' && <Info className="w-5 h-5" />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10" />
              Master Admin Control Center
            </h1>
            <p className="text-blue-100">Complete system control and management</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg flex items-center gap-2 transition-colors border border-white/30"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex max-w-[1920px] mx-auto">
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white border-r border-slate-200 min-h-[calc(100vh-104px)] sticky top-[104px] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {/* Dashboard Section */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase px-3 py-2 mb-1 tracking-wide">Dashboard</div>
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                  activeSection === 'overview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span>Overview</span>
              </button>
            </div>

            {/* User Management Section */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase px-3 py-2 mb-1 tracking-wide">User Management</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('users')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'users'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span>Users</span>
                </button>
                <button
                  onClick={() => setActiveSection('plans')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'plans'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Crown className="w-5 h-5 flex-shrink-0" />
                  <span>Plans & Quotas</span>
                </button>
                <button
                  onClick={() => setActiveSection('quotas')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'quotas'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Target className="w-5 h-5 flex-shrink-0" />
                  <span>Daily Quotas</span>
                </button>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase px-3 py-2 mb-1 tracking-wide">Analytics & Reports</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('analytics')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'analytics'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setActiveSection('activity')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'activity'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Activity className="w-5 h-5 flex-shrink-0" />
                  <span>Activity Logs</span>
                </button>
                <button
                  onClick={() => setActiveSection('reports')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'reports'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileBarChart className="w-5 h-5 flex-shrink-0" />
                  <span>Reports</span>
                </button>
              </div>
            </div>

            {/* Content Management Section */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase px-3 py-2 mb-1 tracking-wide">Content Management</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('templates')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'templates'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-5 h-5 flex-shrink-0" />
                  <span>Templates</span>
                </button>
                <button
                  onClick={() => setActiveSection('blog')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'blog'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-5 h-5 flex-shrink-0" />
                  <span>Blog Management</span>
                </button>
                <button
                  onClick={() => setActiveSection('branding')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'branding'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-5 h-5 flex-shrink-0" />
                  <span>Branding</span>
                </button>
                <button
                  onClick={() => setActiveSection('features')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'features'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="w-5 h-5 flex-shrink-0" />
                  <span>Features</span>
                </button>
              </div>
            </div>

            {/* System Section */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase px-3 py-2 mb-1 tracking-wide">System</div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'security'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'notifications'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bell className="w-5 h-5 flex-shrink-0" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => setActiveSection('system-health')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'system-health'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Monitor className="w-5 h-5 flex-shrink-0" />
                  <span>System Health</span>
                </button>
                <button
                  onClick={() => setActiveSection('data')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'data'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-5 h-5 flex-shrink-0" />
                  <span>Data</span>
                </button>
                <button
                  onClick={() => setActiveSection('settings')}
                  className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left ${
                    activeSection === 'settings'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-900">System Online</span>
              </div>
              <div className="text-xs text-green-700">
                All systems operational
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl text-slate-900 mb-2">Section: {activeSection}</h2>
            <p className="text-slate-600">
              Content sections will be imported from ComprehensiveAdminPanel.tsx
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Please use the existing ComprehensiveAdminPanel component.<br/>
              This is a layout reference showing the sidebar structure.
            </p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
