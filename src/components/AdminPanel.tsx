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
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  LogOut,
  Lock,
  Key,
} from 'lucide-react';

interface CompanyBranding {
  clientLogo: string;
  contractorLogo: string;
  companyName: string;
  contactInfo: string;
}

interface SystemStats {
  totalSignageGenerated: number;
  totalTemplates: number;
  totalAuthorizedPersons: number;
  totalEmergencyPlans: number;
  storageUsed: string;
}

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<'overview' | 'branding' | 'data' | 'settings'>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [branding, setBranding] = useState<CompanyBranding>({
    clientLogo: '',
    contractorLogo: '',
    companyName: '',
    contactInfo: '',
  });
  const [stats, setStats] = useState<SystemStats>({
    totalSignageGenerated: 0,
    totalTemplates: 7200,
    totalAuthorizedPersons: 0,
    totalEmergencyPlans: 0,
    storageUsed: '0 KB',
  });
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    loadSystemData();
    
    // Check if using default password
    const defaultPasswordCheck = localStorage.getItem('isDefaultPassword') === 'true';
    setIsDefaultPassword(defaultPasswordCheck);
    
    // Listen for updates
    const handleUpdate = () => loadSystemData();
    window.addEventListener('authorizedPersonsUpdated', handleUpdate);
    window.addEventListener('emergencyPlansUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('authorizedPersonsUpdated', handleUpdate);
      window.removeEventListener('emergencyPlansUpdated', handleUpdate);
    };
  }, []);

  const loadSystemData = () => {
    // Load branding
    const savedBranding = localStorage.getItem('companyBranding');
    if (savedBranding) {
      setBranding(JSON.parse(savedBranding));
    }

    // Calculate stats
    const authorizedPersons = JSON.parse(localStorage.getItem('authorizedPersons') || '[]');
    const emergencyPlans = JSON.parse(localStorage.getItem('emergencyResponsePlans') || '[]');
    const signageHistory = JSON.parse(localStorage.getItem('signageHistory') || '[]');
    
    // Calculate storage size
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        totalSize += localStorage.getItem(key)?.length || 0;
      }
    }
    const sizeInKB = (totalSize / 1024).toFixed(2);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    const storageUsed = parseFloat(sizeInMB) > 1 ? `${sizeInMB} MB` : `${sizeInKB} KB`;

    setStats({
      totalSignageGenerated: signageHistory.length,
      totalTemplates: 7200,
      totalAuthorizedPersons: authorizedPersons.length,
      totalEmergencyPlans: emergencyPlans.length,
      storageUsed,
    });
  };

  const handleLogoUpload = (type: 'client' | 'contractor', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedBranding = {
          ...branding,
          [type === 'client' ? 'clientLogo' : 'contractorLogo']: base64,
        };
        setBranding(updatedBranding);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    localStorage.setItem('companyBranding', JSON.stringify(branding));
    window.dispatchEvent(new CustomEvent('brandingUpdated', { detail: branding }));
    showSaveMessage('success', 'Company branding saved successfully!');
  };

  const handleExportData = () => {
    const data = {
      authorizedPersons: JSON.parse(localStorage.getItem('authorizedPersons') || '[]'),
      emergencyPlans: JSON.parse(localStorage.getItem('emergencyResponsePlans') || '[]'),
      branding: JSON.parse(localStorage.getItem('companyBranding') || '{}'),
      signageHistory: JSON.parse(localStorage.getItem('signageHistory') || '[]'),
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
    
    showSaveMessage('success', 'Data exported successfully!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.authorizedPersons) {
            localStorage.setItem('authorizedPersons', JSON.stringify(data.authorizedPersons));
          }
          if (data.emergencyPlans) {
            localStorage.setItem('emergencyResponsePlans', JSON.stringify(data.emergencyPlans));
          }
          if (data.branding) {
            localStorage.setItem('companyBranding', JSON.stringify(data.branding));
            setBranding(data.branding);
          }
          if (data.signageHistory) {
            localStorage.setItem('signageHistory', JSON.stringify(data.signageHistory));
          }
          
          loadSystemData();
          showSaveMessage('success', 'Data imported successfully!');
        } catch (error) {
          showSaveMessage('error', 'Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = (dataType: 'all' | 'authorized' | 'emergency' | 'history') => {
    if (!confirm(`Are you sure you want to clear ${dataType === 'all' ? 'ALL DATA' : dataType}? This action cannot be undone.`)) {
      return;
    }

    switch (dataType) {
      case 'all':
        localStorage.clear();
        setBranding({ clientLogo: '', contractorLogo: '', companyName: '', contactInfo: '' });
        showSaveMessage('info', 'All data cleared!');
        break;
      case 'authorized':
        localStorage.removeItem('authorizedPersons');
        showSaveMessage('info', 'Authorized persons data cleared!');
        break;
      case 'emergency':
        localStorage.removeItem('emergencyResponsePlans');
        showSaveMessage('info', 'Emergency plans data cleared!');
        break;
      case 'history':
        localStorage.removeItem('signageHistory');
        showSaveMessage('info', 'Signage history cleared!');
        break;
    }
    
    loadSystemData();
  };

  const showSaveMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Simple hash function for password (same as in AdminAuth)
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
    // Validate inputs
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

    // Verify current password
    const storedPasswordHash = localStorage.getItem('adminPassword');
    const currentPasswordHash = hashPassword(currentPassword);

    if (storedPasswordHash !== currentPasswordHash) {
      showSaveMessage('error', 'Current password is incorrect.');
      return;
    }

    // Update password
    const newPasswordHash = hashPassword(newPassword);
    localStorage.setItem('adminPassword', newPasswordHash);
    localStorage.setItem('isDefaultPassword', 'false');
    setIsDefaultPassword(false);

    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    showSaveMessage('success', 'Password changed successfully!');
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

  return (
    <div className="p-3 sm:p-8">
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            System Administration Panel
          </h1>
          <p className="text-slate-600">Manage your signage system, branding, and data</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeSection === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveSection('branding')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeSection === 'branding'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Branding</span>
            </button>
            <button
              onClick={() => setActiveSection('data')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeSection === 'data'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Data Management</span>
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeSection === 'settings'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-3xl mb-1">{stats.totalSignageGenerated}</div>
                <div className="text-sm opacity-90">Signage Generated</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Database className="w-8 h-8 opacity-80" />
                  <CheckCircle className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-3xl mb-1">{stats.totalTemplates.toLocaleString()}</div>
                <div className="text-sm opacity-90">Available Templates</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-3xl mb-1">{stats.totalAuthorizedPersons}</div>
                <div className="text-sm opacity-90">Authorized Persons</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="w-8 h-8 opacity-80" />
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-3xl mb-1">{stats.totalEmergencyPlans}</div>
                <div className="text-sm opacity-90">Emergency Plans</div>
              </div>
            </div>

            {/* System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Storage Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Total Storage Used</span>
                    <span className="text-slate-900">{stats.storageUsed}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Browser Storage Limit</span>
                    <span className="text-slate-900">~10 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Storage Health</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Healthy
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  System Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">System Version</span>
                    <span className="text-slate-900">v2.0.0</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">ISO Standard</span>
                    <span className="text-slate-900">ISO 7010</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">System Status</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branding Section */}
        {activeSection === 'branding' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Company Branding Configuration
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Upload your company logos and information to be displayed on all signage
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Logo */}
                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Client Logo
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    {branding.clientLogo ? (
                      <div className="space-y-3">
                        <img
                          src={branding.clientLogo}
                          alt="Client Logo"
                          className="max-h-32 mx-auto"
                        />
                        <button
                          onClick={() => setBranding({ ...branding, clientLogo: '' })}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block hover:bg-blue-700">
                            Upload Client Logo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload('client', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contractor Logo */}
                <div>
                  <label className="block text-sm text-slate-700 mb-3">
                    Contractor Logo
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    {branding.contractorLogo ? (
                      <div className="space-y-3">
                        <img
                          src={branding.contractorLogo}
                          alt="Contractor Logo"
                          className="max-h-32 mx-auto"
                        />
                        <button
                          onClick={() => setBranding({ ...branding, contractorLogo: '' })}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block hover:bg-blue-700">
                            Upload Contractor Logo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload('contractor', e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                    placeholder="e.g., ABC Safety Solutions Ltd."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Contact Information
                  </label>
                  <textarea
                    value={branding.contactInfo}
                    onChange={(e) => setBranding({ ...branding, contactInfo: e.target.value })}
                    placeholder="e.g., +1 (555) 123-4567 | safety@company.com"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveBranding}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Branding
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Management Section */}
        {activeSection === 'data' && (
          <div className="space-y-6">
            {/* Export/Import */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Backup & Restore
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                Export all your data for backup or import previously exported data
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export All Data
                </button>

                <label className="cursor-pointer">
                  <div className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-5 h-5" />
                    Import Data
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Clear Data */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Clear Data
              </h3>
              <p className="text-slate-600 mb-6 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Warning: These actions cannot be undone
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleClearData('authorized')}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Authorized Persons
                </button>

                <button
                  onClick={() => handleClearData('emergency')}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Emergency Plans
                </button>

                <button
                  onClick={() => handleClearData('history')}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Signage History
                </button>

                <button
                  onClick={() => handleClearData('all')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear ALL Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                System Preferences
              </h3>

              <div className="space-y-6">
                {/* Print Settings */}
                <div>
                  <h4 className="text-slate-900 mb-3">Print Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <div className="text-slate-900">Auto-fit to page</div>
                        <div className="text-xs text-slate-500">Automatically scale content to fit paper size</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <div className="text-slate-900">Print backgrounds</div>
                        <div className="text-xs text-slate-500">Include background colors and images</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Default Settings */}
                <div>
                  <h4 className="text-slate-900 mb-3">Default Signage Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Default Paper Size</label>
                      <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>A4 (210 × 297 mm)</option>
                        <option>A3 (297 × 420 mm)</option>
                        <option>Letter (216 × 279 mm)</option>
                        <option>Legal (216 × 356 mm)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-2">Default Orientation</label>
                      <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Landscape</option>
                        <option>Portrait</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* System Actions */}
                <div>
                  <h4 className="text-slate-900 mb-3">System Actions</h4>
                  <button
                    onClick={() => {
                      loadSystemData();
                      showSaveMessage('success', 'System data refreshed!');
                    }}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh System Data
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Security - Password Change */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Admin Security
                </h3>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              {isDefaultPassword && (
                <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-900">
                      <strong>Security Warning:</strong> You are using the default password. Please change it immediately to secure your admin panel.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-slate-900 mb-3">Change Admin Password</h4>
                
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>

                <p className="text-xs text-slate-500 mt-2">
                  Password must be at least 6 characters long. Never share your admin password with anyone.
                </p>
              </div>
            </div>
          </div>
        )}
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