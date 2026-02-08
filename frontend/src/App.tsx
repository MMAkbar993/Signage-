import React from 'react';
import { useState, useEffect } from 'react';
import { SignageGenerator } from './components/SignageGenerator';
import { AuthorizedPersonsManager } from './components/AuthorizedPersonsManager';
import { EmergencyResponseTeam } from './components/EmergencyResponseTeam';
import { Dashboard } from './components/Dashboard';
import { TemplateLibraryV2 } from './components/TemplateLibraryV2';
import { AISignageGenerator } from './components/AISignageGenerator';
import { ComprehensiveAdminPanel } from './components/ComprehensiveAdminPanel';
import { AdminAuth } from './components/AdminAuth';
import { BlogTutorials } from './components/BlogTutorials';
import { CustomSignageEditor } from './components/CustomSignageEditor';
import { Sidebar } from './components/Sidebar';
import OrganizationChart from './components/OrganizationChart';
import { Library } from './components/Library';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { SignageData } from './types/signage';
import { mapPPEStringsToTypes } from './utils/ppeMapper';
import { 
  Menu, 
  X, 
  Sparkles,
  Globe,
  LogIn,
  UserPlus,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

type TabType = 'dashboard' | 'signage' | 'authorized' | 'emergency' | 'templates' | 'ai-generator' | 'custom-editor' | 'blog' | 'admin' | 'organization-chart' | 'library' | 'profile';

function App() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<Partial<SignageData> | null>(null);
  const [templateData, setTemplateData] = useState<Partial<SignageData> | null>(null);
  const [loadedSignageData, setLoadedSignageData] = useState<Partial<SignageData> | null>(null);
  const [loadedCustomEditorData, setLoadedCustomEditorData] = useState<any>(null);

  // Handle URL hash-based navigation for admin panel
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'admin') {
        setActiveTab('admin');
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when navigating to/from admin
  useEffect(() => {
    if (activeTab === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      // Clear the hash when leaving admin
      history.replaceState(null, '', window.location.pathname);
    }
  }, [activeTab]);

  const handleNavigate = (tab: TabType, data?: any) => {
    setActiveTab(tab);
    setMenuOpen(false);
    
    // Handle loading saved signage data
    if (data) {
      if (tab === 'signage' && data.title !== undefined) {
        // Regular signage data
        setLoadedSignageData(data);
        setAiGeneratedData(null);
        setTemplateData(null);
      } else if (tab === 'custom-editor') {
        // Custom editor data
        setLoadedCustomEditorData(data);
      }
    } else {
      // Clear loaded data when navigating without data
      setLoadedSignageData(null);
      setLoadedCustomEditorData(null);
    }
  };

  const handleAIGenerate = (generatedData: Partial<SignageData>) => {
    setAiGeneratedData(generatedData);
    setTemplateData(null);
    handleNavigate('signage');
  };

  const handleTemplateSelect = (template: any) => {
    // Convert template to SignageData format
    const signageData: Partial<SignageData> = {
      title: template.name,
      description: template.detailedDescription || template.description,
      category: template.category,
      hazards: template.hazards || [],
      procedures: template.safetyProcedures || [],
      ppe: [], // Will be populated from requiredPPE string array
      customPPEImages: [], // Initialize custom PPE images
      emergencyContacts: template.emergencyContacts?.map((contact: string) => {
        // Parse contact string format like "Fire Department: 911" or "Safety Officer"
        const parts = contact.split(':');
        return {
          label: parts[0]?.trim() || contact,
          number: parts[1]?.trim() || 'Emergency'
        };
      }) || [
        { label: 'Emergency', number: '911' },
        { label: 'Safety Officer', number: 'On-call' }
      ]
    };

    // Convert string PPE requirements to PPE types
    if (template.requiredPPE && Array.isArray(template.requiredPPE)) {
      signageData.ppe = mapPPEStringsToTypes(template.requiredPPE);
    }

    setTemplateData(signageData);
    setAiGeneratedData(null);
    handleNavigate('signage');
  };

  const isAdminView = activeTab === 'admin';

  const mainContent = (
    <>
      {activeTab === 'dashboard' && (
        <Dashboard onNavigate={(section: any) => handleNavigate(section)} />
      )}
      {activeTab === 'signage' && <SignageGenerator aiGeneratedData={loadedSignageData || aiGeneratedData || templateData} onDataUsed={() => { setAiGeneratedData(null); setTemplateData(null); setLoadedSignageData(null); }} />}
      {activeTab === 'authorized' && <AuthorizedPersonsManager />}
      {activeTab === 'emergency' && <EmergencyResponseTeam />}
      {activeTab === 'organization-chart' && <OrganizationChart />}
      {activeTab === 'templates' && <TemplateLibraryV2 onSelectTemplate={handleTemplateSelect} onClose={() => handleNavigate('dashboard')} />}
      {activeTab === 'ai-generator' && <AISignageGenerator onGenerate={handleAIGenerate} onClose={() => handleNavigate('dashboard')} />}
      {activeTab === 'custom-editor' && <CustomSignageEditor initialData={loadedCustomEditorData} onDataLoaded={() => setLoadedCustomEditorData(null)} />}
      {activeTab === 'library' && <Library onNavigate={handleNavigate} />}
      {activeTab === 'blog' && <BlogTutorials />}
      {activeTab === 'profile' && <UserProfile />}
      {activeTab === 'admin' && (
        <AdminAuth children={<ComprehensiveAdminPanel />} />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {isAdminView ? (
        <main className="w-full min-h-screen">{mainContent}</main>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                    aria-label="Toggle menu"
                  >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-slate-900 text-base sm:text-lg md:text-xl">Safete Gram</h1>
                    <p className="text-slate-600 mt-0.5 text-xs sm:text-sm hidden sm:block">Professional EHS, Safety & Industrial Signage System</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {!authLoading && (
                    user ? (
                      <div className="relative">
                        <button
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.firstName?.[0] || user.username?.[0] || user.email[0] || '?').toUpperCase()
                            )}
                          </div>
                          <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                            {user.firstName || user.username || user.email.split('@')[0]}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {userMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                            <div className="absolute right-0 mt-1 py-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                              <button
                                onClick={() => { setActiveTab('profile'); setUserMenuOpen(false); setMenuOpen(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <User className="w-4 h-4" />
                                Profile
                              </button>
                              <button
                                onClick={() => { logout(); setUserMenuOpen(false); setMenuOpen(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <LogOut className="w-4 h-4" />
                                Logout
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <LogIn className="w-4 h-4" />
                          <span className="hidden sm:inline">Login</span>
                        </button>
                        <button
                          onClick={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Sign Up</span>
                        </button>
                      </div>
                    )
                  )}
                  <div className="hidden md:flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Multi-Language
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Powered
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      ISO 7010
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="flex max-w-[1920px] mx-auto relative">
            <Sidebar activeTab={activeTab} onNavigate={handleNavigate} menuOpen={menuOpen} />
            {menuOpen && (
              <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setMenuOpen(false)} />
            )}
            <main className="flex-1 w-full">{mainContent}</main>
          </div>
        </>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;