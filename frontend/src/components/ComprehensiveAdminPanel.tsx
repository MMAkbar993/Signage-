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
  Palette,
  Layout,
  Type,
  AlertTriangle,
  Network,
  Home,
  FileType,
  Languages,
  Sliders,
  ExternalLink,
  Copy,
  ToggleLeft,
  ToggleRight,
  Wand2,
  X,
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

interface WebsiteSettings {
  siteName: string;
  siteTagline: string;
  siteLogo: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  maintenanceMode: boolean;
  announcementBanner: string;
  showAnnouncementBanner: boolean;
}

interface FeatureFlags {
  aiGenerator: boolean;
  customEditor: boolean;
  templateLibrary: boolean;
  multiLanguage: boolean;
  companyBranding: boolean;
  organizationChart: boolean;
  emergencyTeam: boolean;
  authorizedPersons: boolean;
  blogSection: boolean;
  exportPDF: boolean;
  exportPNG: boolean;
  qrCodeGenerator: boolean;
  watermark: boolean;
}

type AdminSection = 
  | 'overview' 
  | 'website-settings'
  | 'homepage'
  | 'users' 
  | 'plans' 
  | 'analytics' 
  | 'activity' 
  | 'features' 
  | 'templates'
  | 'ai-settings'
  | 'branding' 
  | 'blog'
  | 'authorized-persons'
  | 'emergency-teams'
  | 'org-chart'
  | 'export-settings'
  | 'language-settings'
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
  const [systemStats, setSystemStats] = useState<any>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // User management
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);
  
  // Branding
  const [branding, setBranding] = useState<CompanyBranding>({
    clientLogo: '',
    contractorLogo: '',
    companyName: '',
    contactInfo: '',
  });

  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteName: 'Universal Smart Signage Generator',
    siteTagline: 'Professional EHS, Safety & Industrial Signage System',
    siteLogo: '/logo.jpeg',
    primaryColor: '#2563EB',
    secondaryColor: '#7C3AED',
    footerText: '© 2024 Universal Smart Signage Generator. All rights reserved.',
    contactEmail: 'support@signagecreators.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Safety Street, Industrial Zone',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
    maintenanceMode: false,
    announcementBanner: '',
    showAnnouncementBanner: false,
  });

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    aiGenerator: true,
    customEditor: true,
    templateLibrary: true,
    multiLanguage: true,
    companyBranding: true,
    organizationChart: true,
    emergencyTeam: true,
    authorizedPersons: true,
    blogSection: true,
    exportPDF: true,
    exportPNG: true,
    qrCodeGenerator: true,
    watermark: false,
  });

  useEffect(() => {
    loadData();
    const defaultPasswordCheck = localStorage.getItem('isDefaultPassword') === 'true';
    setIsDefaultPassword(defaultPasswordCheck);
  }, []);

  const loadData = () => {
    setUsers(getAllUsers());
    setActivityLogs(getActivityLogs(100));
    setSystemStats(getSystemStats());
    
    const savedBranding = localStorage.getItem('companyBranding');
    if (savedBranding) {
      setBranding(JSON.parse(savedBranding));
    }

    const savedWebsiteSettings = localStorage.getItem('websiteSettings');
    if (savedWebsiteSettings) {
      setWebsiteSettings(JSON.parse(savedWebsiteSettings));
    }

    const savedFeatureFlags = localStorage.getItem('featureFlags');
    if (savedFeatureFlags) {
      setFeatureFlags(JSON.parse(savedFeatureFlags));
    }
  };

  const showSaveMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminSessionExpiry');
      if ((window as any).adminLogout) {
        (window as any).adminLogout();
      }
    }
  };

  const hashPassword = (password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showSaveMessage('error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showSaveMessage('error', 'New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showSaveMessage('error', 'New password must be at least 6 characters long.');
      return;
    }
    
    const storedPasswordHash = localStorage.getItem('adminPassword');
    const currentPasswordHash = hashPassword(currentPassword);
    
    if (storedPasswordHash !== currentPasswordHash) {
      showSaveMessage('error', 'Current password is incorrect.');
      return;
    }
    
    const newPasswordHash = hashPassword(newPassword);
    localStorage.setItem('adminPassword', newPasswordHash);
    localStorage.setItem('isDefaultPassword', 'false');
    setIsDefaultPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showSaveMessage('success', 'Password changed successfully!');
  };

  const handleUserStatusChange = (userId: string, status: User['status']) => {
    updateUser(userId, { status });
    loadData();
    showSaveMessage('success', `User ${status} successfully!`);
  };

  const handleUserPlanChange = (userId: string, plan: User['plan']) => {
    const planConfig = PLAN_CONFIGS[plan];
    updateUser(userId, {
      plan,
      quota: planConfig.limits,
      features: planConfig.features,
    });
    loadData();
    showSaveMessage('success', `User plan changed to ${planConfig.displayName}!`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
      loadData();
      setSelectedUser(null);
      showSaveMessage('success', 'User deleted successfully!');
    }
  };

  const handleExportData = () => {
    const data = {
      users: getAllUsers(),
      activityLogs: getActivityLogs(),
      systemStats: getSystemStats(),
      branding: JSON.parse(localStorage.getItem('companyBranding') || '{}'),
      websiteSettings: JSON.parse(localStorage.getItem('websiteSettings') || '{}'),
      featureFlags: JSON.parse(localStorage.getItem('featureFlags') || '{}'),
      authorizedPersons: JSON.parse(localStorage.getItem('authorizedPersons') || '[]'),
      emergencyPlans: JSON.parse(localStorage.getItem('emergencyResponsePlans') || '[]'),
      savedTemplates: JSON.parse(localStorage.getItem('savedTemplates') || '[]'),
      customEditorTemplates: JSON.parse(localStorage.getItem('customEditorTemplates') || '[]'),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signage-system-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSaveMessage('success', 'Complete system data exported!');
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ WARNING: This will delete ALL data including users, logs, and settings. Are you absolutely sure?')) {
      if (confirm('This is your last chance. Type YES in your mind to confirm deletion.')) {
        localStorage.clear();
        // Reinitialize admin password
        const defaultPassword = hashPassword('admin123');
        localStorage.setItem('adminPassword', defaultPassword);
        localStorage.setItem('isDefaultPassword', 'true');
        showSaveMessage('info', 'All data cleared! Please refresh the page.');
        setTimeout(() => window.location.reload(), 2000);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.status === userFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Navigation items organized by category
  const navSections = [
    {
      title: 'Dashboard',
      items: [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
      ],
    },
    {
      title: 'Website Control',
      items: [
        { id: 'website-settings', label: 'Website Settings', icon: Settings },
        { id: 'homepage', label: 'Homepage & Content', icon: Home },
        { id: 'branding', label: 'Company Branding', icon: Building2 },
        { id: 'features', label: 'Feature Toggles', icon: ToggleRight },
      ],
    },
    {
      title: 'Content Management',
      items: [
        { id: 'templates', label: 'Template Library', icon: Layers },
        { id: 'ai-settings', label: 'AI Generator Settings', icon: Wand2 },
        { id: 'blog', label: 'Blog & Tutorials', icon: BookOpen },
        { id: 'export-settings', label: 'Export Settings', icon: FileType },
        { id: 'language-settings', label: 'Language Settings', icon: Languages },
      ],
    },
    {
      title: 'Personnel Management',
      items: [
        { id: 'authorized-persons', label: 'Authorized Persons', icon: Users },
        { id: 'emergency-teams', label: 'Emergency Teams', icon: AlertTriangle },
        { id: 'org-chart', label: 'Organization Charts', icon: Network },
      ],
    },
    {
      title: 'User Management',
      items: [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'plans', label: 'Plans & Pricing', icon: Crown },
        { id: 'quotas', label: 'Daily Quotas', icon: Target },
      ],
    },
    {
      title: 'Analytics & Reports',
      items: [
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'activity', label: 'Activity Logs', icon: Activity },
        { id: 'reports', label: 'Reports', icon: FileBarChart },
      ],
    },
    {
      title: 'System',
      items: [
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'system-health', label: 'System Health', icon: Monitor },
        { id: 'data', label: 'Data Management', icon: Database },
        { id: 'settings', label: 'Admin Settings', icon: Lock },
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Save Message */}
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

      {/* Header - Full Width Sticky */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10" />
              Signage System Admin Panel
            </h1>
            <p className="text-blue-200">Complete control over your Universal Smart Signage Generator</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <div className="text-sm text-blue-200">Logged in as</div>
              <div className="font-semibold">Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg flex items-center gap-2 transition-colors border border-white/20"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex max-w-[1920px] mx-auto">
        
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white border-r border-slate-200 min-h-[calc(100vh-104px)] sticky top-[104px] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <div className="text-xs text-slate-500 uppercase px-3 py-2 mb-1 tracking-wide font-semibold">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as AdminSection)}
                      className={`w-full px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 text-left text-sm ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Status Indicator */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-900 font-semibold">System Online</span>
              </div>
              <div className="text-xs text-green-700">
                All systems operational
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Content Sections */}
          {activeSection === 'overview' && (
            <OverviewSection stats={systemStats} featureFlags={featureFlags} onRefresh={loadData} />
          )}

          {activeSection === 'website-settings' && (
            <WebsiteSettingsSection 
              settings={websiteSettings} 
              setSettings={setWebsiteSettings} 
              showMessage={showSaveMessage} 
            />
          )}

          {activeSection === 'homepage' && (
            <HomepageSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'users' && (
            <UserManagementSection
              users={filteredUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onStatusChange={handleUserStatusChange}
              onPlanChange={handleUserPlanChange}
              onDeleteUser={handleDeleteUser}
              onRefresh={loadData}
              showMessage={showSaveMessage}
            />
          )}

          {activeSection === 'plans' && (
            <PlansSection onRefresh={loadData} showMessage={showSaveMessage} />
          )}

          {activeSection === 'analytics' && (
            <AnalyticsSection stats={systemStats} users={users} />
          )}

          {activeSection === 'activity' && (
            <ActivityLogsSection 
              logs={activityLogs} 
              onClear={() => {
                clearActivityLogs();
                loadData();
                showSaveMessage('info', 'Activity logs cleared!');
              }}
            />
          )}

          {activeSection === 'features' && (
            <FeatureTogglesSection 
              featureFlags={featureFlags} 
              setFeatureFlags={setFeatureFlags} 
              showMessage={showSaveMessage} 
            />
          )}

          {activeSection === 'templates' && (
            <TemplatesSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'ai-settings' && (
            <AISettingsSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'branding' && (
            <BrandingSection
              branding={branding}
              setBranding={setBranding}
              showMessage={showSaveMessage}
            />
          )}

          {activeSection === 'blog' && (
            <BlogManagementSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'authorized-persons' && (
            <AuthorizedPersonsSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'emergency-teams' && (
            <EmergencyTeamsSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'org-chart' && (
            <OrgChartSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'export-settings' && (
            <ExportSettingsSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'language-settings' && (
            <LanguageSettingsSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'quotas' && (
            <QuotaManagementSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'security' && (
            <SecuritySection showMessage={showSaveMessage} />
          )}

          {activeSection === 'reports' && (
            <ReportsSection users={users} showMessage={showSaveMessage} />
          )}

          {activeSection === 'notifications' && (
            <NotificationsSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'system-health' && (
            <SystemHealthSection showMessage={showSaveMessage} />
          )}

          {activeSection === 'data' && (
            <DataManagementSection
              onExport={handleExportData}
              onClearAll={handleClearAllData}
              showMessage={showSaveMessage}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsSection
              isDefaultPassword={isDefaultPassword}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              onChangePassword={handleChangePassword}
              onRefresh={loadData}
              showMessage={showSaveMessage}
            />
          )}
        </main>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Overview Section Component
function OverviewSection({ stats, featureFlags, onRefresh }: any) {
  const enabledFeatures = Object.values(featureFlags || {}).filter(Boolean).length;
  const totalFeatures = Object.keys(featureFlags || {}).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl mb-2">Welcome to Admin Panel</h2>
        <p className="text-blue-100">
          Manage your Universal Smart Signage Generator system. Control all aspects of your website from this central dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="from-blue-500 to-blue-600"
          subtitle={`${stats?.activeUsers || 0} active`}
        />
        <StatCard
          title="Total Signage Created"
          value={stats?.totalSignageGenerated || 0}
          icon={FileText}
          color="from-green-500 to-green-600"
          subtitle="All time"
        />
        <StatCard
          title="AI Generations"
          value={stats?.totalAIGenerations || 0}
          icon={Sparkles}
          color="from-purple-500 to-purple-600"
          subtitle="AI powered"
        />
        <StatCard
          title="Active Features"
          value={`${enabledFeatures}/${totalFeatures}`}
          icon={Zap}
          color="from-orange-500 to-orange-600"
          subtitle="Features enabled"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Website Settings"
          description="Configure site name, logo, colors"
          icon={Settings}
          color="bg-blue-500"
        />
        <QuickActionCard
          title="Manage Templates"
          description="Add, edit, delete templates"
          icon={Layers}
          color="bg-green-500"
        />
        <QuickActionCard
          title="Feature Toggles"
          description="Enable/disable features"
          icon={ToggleRight}
          color="bg-purple-500"
        />
        <QuickActionCard
          title="View Reports"
          description="Analytics and reports"
          icon={BarChart3}
          color="bg-orange-500"
        />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">System Status</h3>
            <Wifi className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <StatusItem label="Server" status="online" />
            <StatusItem label="Database" status="online" />
            <StatusItem label="AI Service" status="online" />
            <StatusItem label="Storage" status="online" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Recent Activity</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>New user registered</span>
              <span>2m ago</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Template created</span>
              <span>15m ago</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Signage exported</span>
              <span>1h ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-semibold">Quick Stats</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Templates</span>
              <span className="font-semibold text-slate-900">7,200+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Languages</span>
              <span className="font-semibold text-slate-900">50+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Downloads Today</span>
              <span className="font-semibold text-slate-900">{stats?.totalExports || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={onRefresh}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Dashboard
        </button>
      </div>
    </div>
  );
}

// Website Settings Section
function WebsiteSettingsSection({ settings, setSettings, showMessage }: any) {
  const handleSave = () => {
    localStorage.setItem('websiteSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('websiteSettingsUpdated', { detail: settings }));
    showMessage('success', 'Website settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Website Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Name */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Site Tagline */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Site Tagline</label>
            <input
              type="text"
              value={settings.siteTagline}
              onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Logo URL</label>
            <input
              type="text"
              value={settings.siteLogo}
              onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/logo.jpeg or https://..."
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Contact Phone</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2 font-medium">Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Text */}
          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2 font-medium">Footer Text</label>
            <textarea
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg text-slate-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-600" />
          Announcement Banner
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-slate-900 font-medium">Show Announcement Banner</div>
              <div className="text-sm text-slate-600">Display a banner at the top of the site</div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, showAnnouncementBanner: !settings.showAnnouncementBanner })}
              className={`px-6 py-2 rounded-lg transition-colors ${
                settings.showAnnouncementBanner
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
              }`}
            >
              {settings.showAnnouncementBanner ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">Banner Message</label>
            <textarea
              value={settings.announcementBanner}
              onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Enter announcement message..."
            />
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Maintenance Mode
            </h3>
            <p className="text-sm text-slate-600 mt-1">When enabled, users will see a maintenance page</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
            className={`px-6 py-2 rounded-lg transition-colors ${
              settings.maintenanceMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
            }`}
          >
            {settings.maintenanceMode ? 'ON - Site is in Maintenance' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-lg font-semibold"
      >
        <Save className="w-5 h-5" />
        Save Website Settings
      </button>
    </div>
  );
}

// Homepage Section
function HomepageSection({ showMessage }: any) {
  const [homepageContent, setHomepageContent] = useState({
    heroTitle: 'Create Professional Safety Signage',
    heroSubtitle: 'Generate ISO-compliant safety signs in minutes with our AI-powered system',
    showFeatureBadges: true,
    dashboardCards: [
      { title: 'Signage Generator', description: 'Create custom safety signage', enabled: true },
      { title: 'Template Library', description: '7200+ professional templates', enabled: true },
      { title: 'AI Generator', description: 'AI-powered sign creation', enabled: true },
      { title: 'Custom Editor', description: 'Advanced design tools', enabled: true },
    ],
  });

  useEffect(() => {
    const saved = localStorage.getItem('homepageContent');
    if (saved) {
      setHomepageContent(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('homepageContent', JSON.stringify(homepageContent));
    showMessage('success', 'Homepage content saved!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-6 flex items-center gap-2">
          <Home className="w-6 h-6 text-blue-600" />
          Homepage Content
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-700 mb-2 font-medium">Hero Title</label>
            <input
              type="text"
              value={homepageContent.heroTitle}
              onChange={(e) => setHomepageContent({ ...homepageContent, heroTitle: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">Hero Subtitle</label>
            <textarea
              value={homepageContent.heroSubtitle}
              onChange={(e) => setHomepageContent({ ...homepageContent, heroSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-slate-900 font-medium">Show Feature Badges</div>
              <div className="text-sm text-slate-600">Display AI Powered, Multi-Language, ISO 7010 badges</div>
            </div>
            <button
              onClick={() => setHomepageContent({ ...homepageContent, showFeatureBadges: !homepageContent.showFeatureBadges })}
              className={`px-6 py-2 rounded-lg transition-colors ${
                homepageContent.showFeatureBadges
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
              }`}
            >
              {homepageContent.showFeatureBadges ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save Homepage Content
      </button>
    </div>
  );
}

// Feature Toggles Section
function FeatureTogglesSection({ featureFlags, setFeatureFlags, showMessage }: any) {
  const handleSave = () => {
    localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
    window.dispatchEvent(new CustomEvent('featureFlagsUpdated', { detail: featureFlags }));
    showMessage('success', 'Feature settings saved! Some changes may require a page refresh.');
  };

  const toggleFeature = (key: keyof FeatureFlags) => {
    setFeatureFlags({ ...featureFlags, [key]: !featureFlags[key] });
  };

  const features = [
    { key: 'aiGenerator', label: 'AI Signage Generator', description: 'AI-powered automatic sign generation', icon: Wand2, color: 'purple' },
    { key: 'customEditor', label: 'Custom Sign Editor', description: 'Advanced drag-and-drop editor', icon: Palette, color: 'blue' },
    { key: 'templateLibrary', label: 'Template Library', description: '7200+ professional templates', icon: Layers, color: 'green' },
    { key: 'multiLanguage', label: 'Multi-Language Support', description: '50+ language translations', icon: Globe, color: 'indigo' },
    { key: 'companyBranding', label: 'Company Branding', description: 'Custom logos and branding', icon: Building2, color: 'orange' },
    { key: 'organizationChart', label: 'Organization Charts', description: 'Create org hierarchies', icon: Network, color: 'teal' },
    { key: 'emergencyTeam', label: 'Emergency Teams', description: 'Emergency response management', icon: AlertTriangle, color: 'red' },
    { key: 'authorizedPersons', label: 'Authorized Persons', description: 'Personnel management', icon: Users, color: 'cyan' },
    { key: 'blogSection', label: 'Blog & Tutorials', description: 'Safety tips and guides', icon: BookOpen, color: 'pink' },
    { key: 'exportPDF', label: 'PDF Export', description: 'High-quality PDF downloads', icon: FileType, color: 'rose' },
    { key: 'exportPNG', label: 'PNG Export', description: 'High-resolution PNG downloads', icon: Image, color: 'amber' },
    { key: 'qrCodeGenerator', label: 'QR Code Generator', description: 'Add QR codes to signage', icon: Target, color: 'lime' },
    { key: 'watermark', label: 'Watermark on Exports', description: 'Add watermark to free tier exports', icon: Shield, color: 'slate' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <ToggleRight className="w-8 h-8" />
          Feature Toggles
        </h2>
        <p className="text-purple-100">
          Enable or disable features across your signage system. Changes affect all users immediately.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div 
              key={feature.key}
              className={`p-4 rounded-lg border-2 transition-all ${
                featureFlags[feature.key as keyof FeatureFlags]
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <feature.icon className={`w-5 h-5 mt-0.5 ${
                    featureFlags[feature.key as keyof FeatureFlags] ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <div>
                    <div className="font-medium text-slate-900">{feature.label}</div>
                    <div className="text-sm text-slate-600">{feature.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFeature(feature.key as keyof FeatureFlags)}
                  className={`p-2 rounded-lg transition-colors ${
                    featureFlags[feature.key as keyof FeatureFlags]
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {featureFlags[feature.key as keyof FeatureFlags] ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-lg font-semibold"
      >
        <Save className="w-5 h-5" />
        Save Feature Settings
      </button>
    </div>
  );
}

// AI Settings Section
function AISettingsSection({ showMessage }: any) {
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    maxGenerationsPerDay: 10,
    defaultModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are a professional safety signage generator...',
    categories: ['danger', 'warning', 'caution', 'notice', 'safety', 'fire'],
  });

  useEffect(() => {
    const saved = localStorage.getItem('aiSettings');
    if (saved) {
      setAiSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('aiSettings', JSON.stringify(aiSettings));
    showMessage('success', 'AI settings saved!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl mb-2 flex items-center gap-2">
          <Wand2 className="w-8 h-8" />
          AI Generator Settings
        </h2>
        <p className="text-purple-100">
          Configure AI-powered signage generation settings and parameters.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-slate-900 font-medium">AI Generator Status</div>
              <div className="text-sm text-slate-600">Enable or disable AI signage generation</div>
            </div>
            <button
              onClick={() => setAiSettings({ ...aiSettings, enabled: !aiSettings.enabled })}
              className={`px-6 py-2 rounded-lg transition-colors ${
                aiSettings.enabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {aiSettings.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 mb-2 font-medium">Max Generations Per Day (Free Users)</label>
              <input
                type="number"
                value={aiSettings.maxGenerationsPerDay}
                onChange={(e) => setAiSettings({ ...aiSettings, maxGenerationsPerDay: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2 font-medium">Default AI Model</label>
              <select
                value={aiSettings.defaultModel}
                onChange={(e) => setAiSettings({ ...aiSettings, defaultModel: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4">GPT-4 (Most Capable)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                <option value="claude-3">Claude 3 (Alternative)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-2 font-medium">Temperature: {aiSettings.temperature}</label>
              <input
                type="range"
                value={aiSettings.temperature}
                onChange={(e) => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                className="w-full"
                min="0"
                max="1"
                step="0.1"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>More Focused</span>
                <span>More Creative</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-2 font-medium">Max Tokens</label>
              <input
                type="number"
                value={aiSettings.maxTokens}
                onChange={(e) => setAiSettings({ ...aiSettings, maxTokens: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="500"
                max="4000"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">System Prompt</label>
            <textarea
              value={aiSettings.systemPrompt}
              onChange={(e) => setAiSettings({ ...aiSettings, systemPrompt: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Instructions for the AI model..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save AI Settings
      </button>
    </div>
  );
}

// Export Settings Section
function ExportSettingsSection({ showMessage }: any) {
  const [exportSettings, setExportSettings] = useState({
    pdfEnabled: true,
    pngEnabled: true,
    defaultPDFQuality: 'high',
    defaultPNGQuality: 'high',
    maxResolution: 4096,
    watermarkEnabled: false,
    watermarkText: 'Created with Signage Creator',
    watermarkOpacity: 0.3,
    includeBleed: false,
    includeCropMarks: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('exportSettings');
    if (saved) {
      setExportSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('exportSettings', JSON.stringify(exportSettings));
    showMessage('success', 'Export settings saved!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-6 flex items-center gap-2">
          <FileType className="w-6 h-6 text-blue-600" />
          Export Settings
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-slate-900 font-medium">PDF Export</div>
                <div className="text-sm text-slate-600">Allow PDF downloads</div>
              </div>
              <button
                onClick={() => setExportSettings({ ...exportSettings, pdfEnabled: !exportSettings.pdfEnabled })}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  exportSettings.pdfEnabled ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {exportSettings.pdfEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-slate-900 font-medium">PNG Export</div>
                <div className="text-sm text-slate-600">Allow PNG downloads</div>
              </div>
              <button
                onClick={() => setExportSettings({ ...exportSettings, pngEnabled: !exportSettings.pngEnabled })}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  exportSettings.pngEnabled ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {exportSettings.pngEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 mb-2 font-medium">Default PDF Quality</label>
              <select
                value={exportSettings.defaultPDFQuality}
                onChange={(e) => setExportSettings({ ...exportSettings, defaultPDFQuality: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
              >
                <option value="low">Low (72 DPI)</option>
                <option value="medium">Medium (150 DPI)</option>
                <option value="high">High (300 DPI)</option>
                <option value="print">Print Ready (600 DPI)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-2 font-medium">Max Resolution (px)</label>
              <input
                type="number"
                value={exportSettings.maxResolution}
                onChange={(e) => setExportSettings({ ...exportSettings, maxResolution: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                min="1024"
                max="8192"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg text-slate-900 mb-4">Watermark Settings</h4>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-4">
              <div>
                <div className="text-slate-900 font-medium">Enable Watermark</div>
                <div className="text-sm text-slate-600">Add watermark to free tier exports</div>
              </div>
              <button
                onClick={() => setExportSettings({ ...exportSettings, watermarkEnabled: !exportSettings.watermarkEnabled })}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  exportSettings.watermarkEnabled ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {exportSettings.watermarkEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {exportSettings.watermarkEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 mb-2 font-medium">Watermark Text</label>
                  <input
                    type="text"
                    value={exportSettings.watermarkText}
                    onChange={(e) => setExportSettings({ ...exportSettings, watermarkText: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2 font-medium">Watermark Opacity: {Math.round(exportSettings.watermarkOpacity * 100)}%</label>
                  <input
                    type="range"
                    value={exportSettings.watermarkOpacity}
                    onChange={(e) => setExportSettings({ ...exportSettings, watermarkOpacity: parseFloat(e.target.value) })}
                    className="w-full"
                    min="0.1"
                    max="1"
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save Export Settings
      </button>
    </div>
  );
}

// Language Settings Section
function LanguageSettingsSection({ showMessage }: any) {
  const [languageSettings, setLanguageSettings] = useState({
    defaultLanguage: 'en',
    enabledLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ar', 'hi', 'pt', 'ja', 'ko'],
    autoDetect: true,
    showLanguageSelector: true,
  });

  const allLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('languageSettings');
    if (saved) {
      setLanguageSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('languageSettings', JSON.stringify(languageSettings));
    showMessage('success', 'Language settings saved!');
  };

  const toggleLanguage = (code: string) => {
    const enabled = languageSettings.enabledLanguages.includes(code);
    if (enabled) {
      setLanguageSettings({
        ...languageSettings,
        enabledLanguages: languageSettings.enabledLanguages.filter(l => l !== code),
      });
    } else {
      setLanguageSettings({
        ...languageSettings,
        enabledLanguages: [...languageSettings.enabledLanguages, code],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-6 flex items-center gap-2">
          <Languages className="w-6 h-6 text-blue-600" />
          Language Settings
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 mb-2 font-medium">Default Language</label>
              <select
                value={languageSettings.defaultLanguage}
                onChange={(e) => setLanguageSettings({ ...languageSettings, defaultLanguage: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
              >
                {allLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-slate-900 font-medium">Auto-Detect Language</div>
                <div className="text-sm text-slate-600">Based on browser settings</div>
              </div>
              <button
                onClick={() => setLanguageSettings({ ...languageSettings, autoDetect: !languageSettings.autoDetect })}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  languageSettings.autoDetect ? 'bg-green-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {languageSettings.autoDetect ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-medium">Enabled Languages</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {allLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    languageSettings.enabledLanguages.includes(lang.code)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save Language Settings
      </button>
    </div>
  );
}

// Authorized Persons Section
function AuthorizedPersonsSection({ showMessage }: any) {
  const [persons, setPersons] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('authorizedPersons');
    if (saved) {
      setPersons(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this authorized person?')) {
      const updated = persons.filter(p => p.id !== id);
      setPersons(updated);
      localStorage.setItem('authorizedPersons', JSON.stringify(updated));
      showMessage('success', 'Person deleted!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Authorized Persons Management
        </h3>
        <p className="text-slate-600 mb-6">Manage all authorized persons across your organization's signage.</p>

        <div className="space-y-3">
          {persons.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>No authorized persons added yet</p>
              <p className="text-sm">Users can add authorized persons from the Authorized Persons section</p>
            </div>
          ) : (
            persons.map(person => (
              <div key={person.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-slate-900">{person.name}</div>
                    <div className="text-sm text-slate-600">{person.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(person.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Emergency Teams Section
function EmergencyTeamsSection({ showMessage }: any) {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('emergencyResponsePlans');
    if (saved) {
      setTeams(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this emergency plan?')) {
      const updated = teams.filter(t => t.id !== id);
      setTeams(updated);
      localStorage.setItem('emergencyResponsePlans', JSON.stringify(updated));
      showMessage('success', 'Emergency plan deleted!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          Emergency Teams Management
        </h3>
        <p className="text-slate-600 mb-6">Manage emergency response plans and teams.</p>

        <div className="space-y-3">
          {teams.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>No emergency plans created yet</p>
              <p className="text-sm">Users can create emergency plans from the Emergency Team section</p>
            </div>
          ) : (
            teams.map(team => (
              <div key={team.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{team.name || 'Emergency Plan'}</div>
                  <div className="text-sm text-slate-600">{team.members?.length || 0} members</div>
                </div>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Organization Chart Section
function OrgChartSection({ showMessage }: any) {
  const [charts, setCharts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('organizationCharts');
    if (saved) {
      setCharts(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6 text-blue-600" />
          Organization Charts Management
        </h3>
        <p className="text-slate-600 mb-6">View and manage organization chart templates and configurations.</p>

        <div className="p-8 bg-slate-50 rounded-lg text-center">
          <Network className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600">Organization charts are managed in the main app</p>
          <p className="text-sm text-slate-500 mt-2">Charts are created and edited in the Organization Chart section</p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color, subtitle }: any) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8 opacity-80" />
        <TrendingUp className="w-5 h-5 opacity-60" />
      </div>
      <div className="text-3xl mb-1">{value}</div>
      <div className="text-sm opacity-90">{title}</div>
      {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
    </div>
  );
}

function QuickActionCard({ title, description, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h4 className="font-medium text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: 'online' | 'offline' | 'warning' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`flex items-center gap-1.5 text-sm ${
        status === 'online' ? 'text-green-600' :
        status === 'warning' ? 'text-yellow-600' :
        'text-red-600'
      }`}>
        <span className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

// Remaining sections (keeping the existing implementations)
function UserManagementSection({ users, selectedUser, setSelectedUser, userFilter, setUserFilter, searchQuery, setSearchQuery, onStatusChange, onPlanChange, onDeleteUser, onRefresh, showMessage }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">Filter by Status</label>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value as any)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="banned">Banned Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Users ({users.length})
          </h3>
          <button onClick={onRefresh} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600">User</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Plan</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Usage</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Last Active</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={user.plan} onChange={(e) => onPlanChange(user.id, e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'suspended' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-slate-600">
                      <div>Signage: {user.usage.signageGenerated}</div>
                      <div>AI: {user.usage.aiGenerations}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{new Date(user.lastActive).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedUser(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View Details"><Eye className="w-4 h-4" /></button>
                      {user.status === 'active' && <button onClick={() => onStatusChange(user.id, 'suspended')} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded" title="Suspend User"><Ban className="w-4 h-4" /></button>}
                      {user.status === 'suspended' && <button onClick={() => onStatusChange(user.id, 'active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Activate User"><CheckSquare className="w-4 h-4" /></button>}
                      <button onClick={() => onDeleteUser(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete User"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl text-slate-900">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded-lg"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-sm text-slate-600">Name</label><div className="text-slate-900">{selectedUser.name}</div></div>
              <div><label className="text-sm text-slate-600">Email</label><div className="text-slate-900">{selectedUser.email}</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-600">Plan</label><div className="text-slate-900 capitalize">{selectedUser.plan}</div></div>
                <div><label className="text-sm text-slate-600">Status</label><div className="text-slate-900 capitalize">{selectedUser.status}</div></div>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Usage Statistics</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg"><div className="text-xs text-blue-600">Signage Generated</div><div className="text-2xl text-blue-900">{selectedUser.usage.signageGenerated}</div></div>
                  <div className="p-3 bg-purple-50 rounded-lg"><div className="text-xs text-purple-600">AI Generations</div><div className="text-2xl text-purple-900">{selectedUser.usage.aiGenerations}</div></div>
                  <div className="p-3 bg-green-50 rounded-lg"><div className="text-xs text-green-600">Templates Used</div><div className="text-2xl text-green-900">{selectedUser.usage.templatesUsed}</div></div>
                  <div className="p-3 bg-orange-50 rounded-lg"><div className="text-xs text-orange-600">Exports</div><div className="text-2xl text-orange-900">{selectedUser.usage.exports}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlansSection({ onRefresh, showMessage }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(PLAN_CONFIGS).map((plan) => (
          <div key={plan.name} className="bg-white rounded-xl shadow-sm border-2 border-slate-200 p-6">
            <div className="text-center mb-4">
              <Crown className={`w-12 h-12 mx-auto mb-2 ${plan.name === 'free' ? 'text-slate-500' : plan.name === 'pro' ? 'text-blue-500' : 'text-purple-500'}`} />
              <h3 className="text-xl text-slate-900 mb-1">{plan.displayName}</h3>
              <div className="text-2xl text-slate-900">{plan.price}</div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="text-sm text-slate-600">Quotas:</div>
              {Object.entries(plan.limits).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-600">{key.replace('Limit', '')}:</span>
                  <span className="text-slate-900">{value === -1 ? 'Unlimited' : value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Features:</div>
              {Object.entries(plan.features).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {value ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-slate-300" />}
                  <span className={value ? 'text-slate-900' : 'text-slate-400'}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsSection({ stats, users }: any) {
  if (!stats) return <div>Loading analytics...</div>;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" />Platform Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg"><div className="text-sm text-blue-700 mb-1">Total Signage Generated</div><div className="text-3xl text-blue-900">{stats.totalSignageGenerated}</div></div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg"><div className="text-sm text-purple-700 mb-1">AI Generations</div><div className="text-3xl text-purple-900">{stats.totalAIGenerations}</div></div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg"><div className="text-sm text-green-700 mb-1">Templates Used</div><div className="text-3xl text-green-900">{stats.totalTemplatesUsed}</div></div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg"><div className="text-sm text-orange-700 mb-1">Total Exports</div><div className="text-3xl text-orange-900">{stats.totalExports}</div></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">User Engagement</h3>
        <div className="text-sm text-slate-600">Average signage per user: {users.length > 0 ? (stats.totalSignageGenerated / users.length).toFixed(1) : 0}</div>
      </div>
    </div>
  );
}

function ActivityLogsSection({ logs, onClear }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-slate-900 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" />Activity Logs ({logs.length})</h3>
          <button onClick={onClear} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"><Trash2 className="w-4 h-4" />Clear Logs</button>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Time</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">User</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Action</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Details</th>
                <th className="px-4 py-3 text-left text-xs text-slate-600">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log: ActivityLog) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{log.userName}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{log.details}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${log.category === 'signage' ? 'bg-blue-100 text-blue-700' : log.category === 'template' ? 'bg-green-100 text-green-700' : log.category === 'ai' ? 'bg-purple-100 text-purple-700' : log.category === 'export' ? 'bg-orange-100 text-orange-700' : log.category === 'user' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'}`}>{log.category}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TemplatesSection({ showMessage }: any) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => { loadTemplates(); }, []);
  const loadTemplates = async () => { try { const { TEMPLATE_DATABASE } = await import('../data/templateDatabase'); setTemplates(TEMPLATE_DATABASE); } catch (error) { showMessage('error', 'Failed to load templates'); } };
  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h3 className="text-slate-900 flex items-center gap-2"><Layers className="w-5 h-5 text-blue-600" />Template Management</h3><p className="text-sm text-slate-600 mt-1">{filteredTemplates.length} of {templates.length} templates</p></div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"><Plus className="w-4 h-4" />Add Template</button>
        </div>
        <div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search templates..." className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.slice(0, 50).map(template => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <h4 className="text-slate-900 mb-1 line-clamp-1">{template.name}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{template.description}</p>
            <div className="flex items-center gap-2"><span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: template.color + '20', color: template.color }}>{template.category}</span></div>
          </div>
        ))}
      </div>
      {filteredTemplates.length > 50 && <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center"><p className="text-blue-900">Showing first 50 templates. Use search to find specific templates.</p></div>}
    </div>
  );
}

function BrandingSection({ branding, setBranding, showMessage }: any) {
  const handleSaveBranding = () => { localStorage.setItem('companyBranding', JSON.stringify(branding)); window.dispatchEvent(new CustomEvent('brandingUpdated', { detail: branding })); showMessage('success', 'Company branding saved successfully!'); };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-6 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" />Company Branding Configuration</h3>
        <div className="space-y-6">
          <div><label className="block text-slate-700 mb-2">Company Name</label><input type="text" value={branding.companyName} onChange={(e) => setBranding({ ...branding, companyName: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter company name" /></div>
          <div><label className="block text-slate-700 mb-2">Contact Information</label><textarea value={branding.contactInfo} onChange={(e) => setBranding({ ...branding, contactInfo: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Enter contact details" /></div>
          <div><label className="block text-slate-700 mb-2">Client Logo URL</label><input type="text" value={branding.clientLogo} onChange={(e) => setBranding({ ...branding, clientLogo: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter client logo URL" /></div>
          <div><label className="block text-slate-700 mb-2">Contractor Logo URL</label><input type="text" value={branding.contractorLogo} onChange={(e) => setBranding({ ...branding, contractorLogo: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter contractor logo URL" /></div>
          <button onClick={handleSaveBranding} className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"><Save className="w-4 h-4" />Save Branding</button>
        </div>
      </div>
    </div>
  );
}

function BlogManagementSection({ showMessage }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => { const stored = localStorage.getItem('blogPosts'); if (stored) setPosts(JSON.parse(stored)); }, []);
  const handleDelete = (id: string) => { if (confirm('Delete this post?')) { const updated = posts.filter(p => p.id !== id); setPosts(updated); localStorage.setItem('blogPosts', JSON.stringify(updated)); showMessage('success', 'Post deleted!'); } };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" />Blog Posts Management</h3>
        <div className="space-y-3">
          {posts.length === 0 ? <div className="text-center py-8 text-slate-500">No blog posts yet</div> : posts.map(post => (
            <div key={post.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-start justify-between">
              <div className="flex-1"><h4 className="text-slate-900 mb-1">{post.title}</h4><div className="text-sm text-slate-600">By {post.author} • {new Date(post.createdAt).toLocaleDateString()}</div></div>
              <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuotaManagementSection({ showMessage }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-blue-900 mb-3 flex items-center gap-2"><Target className="w-5 h-5" />Daily Quota System</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <div><strong>Free Plan:</strong> 3 signage + 1 AI generation per day (resets at midnight)</div>
          <div><strong>Pro Plan:</strong> Unlimited signage and AI generations ($5/month)</div>
          <div><strong>Enterprise Plan:</strong> Unlimited everything + priority support ($50/month)</div>
        </div>
      </div>
    </div>
  );
}

function DataManagementSection({ onExport, onClearAll, showMessage }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-blue-600" />Data Management</h3>
        <div className="space-y-4">
          <button onClick={onExport} className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"><Download className="w-5 h-5" />Export Complete System Backup</button>
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-start gap-3 mb-4"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><div><h4 className="text-red-900 mb-1">Danger Zone</h4><p className="text-sm text-red-700">This action will permanently delete ALL data.</p></div></div>
            <button onClick={onClearAll} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"><Trash2 className="w-4 h-4" />Clear All System Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ isDefaultPassword, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword, onChangePassword, onRefresh, showMessage }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6"><h3 className="text-slate-900 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-600" />Admin Security</h3></div>
        {isDefaultPassword && <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><div><p className="text-amber-900"><strong>Security Warning:</strong> You are using the default password. Please change it immediately.</p></div></div>}
        <div className="space-y-4">
          <h4 className="text-slate-900">Change Admin Password</h4>
          <div><label className="block text-sm text-slate-700 mb-2">Current Password</label><div className="relative"><input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter current password" /><button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
          <div><label className="block text-sm text-slate-700 mb-2">New Password</label><div className="relative"><input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter new password (min. 6 characters)" /><button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
          <div><label className="block text-sm text-slate-700 mb-2">Confirm New Password</label><div className="relative"><input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm new password" /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
          <button onClick={onChangePassword} className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"><Key className="w-4 h-4" />Change Password</button>
        </div>
      </div>
    </div>
  );
}
