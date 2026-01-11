import React from 'react';
import { useState } from 'react';
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
import { SignageData } from './types/signage';
import { 
  Shield, 
  Menu, 
  X, 
  Sparkles,
  Globe
} from 'lucide-react';

type TabType = 'dashboard' | 'signage' | 'authorized' | 'emergency' | 'templates' | 'ai-generator' | 'custom-editor' | 'blog' | 'admin' | 'organization-chart';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<Partial<SignageData> | null>(null);
  const [templateData, setTemplateData] = useState<Partial<SignageData> | null>(null);

  const handleNavigate = (tab: TabType) => {
    setActiveTab(tab);
    setMenuOpen(false);
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

    // Convert string PPE requirements to PPE types (best effort mapping)
    if (template.requiredPPE && Array.isArray(template.requiredPPE)) {
      // We'll store the string descriptions in the procedures or create a custom field
      // For now, add them as text to help user understand what PPE is needed
      signageData.description = (signageData.description || '') + 
        '\n\nRequired PPE: ' + template.requiredPPE.join(', ');
    }

    setTemplateData(signageData);
    setAiGeneratedData(null);
    handleNavigate('signage');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Burger menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900 text-base sm:text-lg md:text-xl">Universal Smart Signage Generator</h1>
                <p className="text-slate-600 mt-0.5 text-xs sm:text-sm hidden sm:block">Professional EHS, Safety & Industrial Signage System</p>
              </div>
            </div>
            
            {/* Desktop badges */}
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
      </header>

      <div className="flex max-w-[1920px] mx-auto relative">
        {/* Sidebar Navigation - Overlay on all devices */}
        <Sidebar 
          activeTab={activeTab} 
          onNavigate={handleNavigate} 
          menuOpen={menuOpen}
        />

        {/* Overlay backdrop */}
        {menuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {activeTab === 'dashboard' && (
            <Dashboard onNavigate={(section: any) => handleNavigate(section)} />
          )}
          {activeTab === 'signage' && <SignageGenerator aiGeneratedData={aiGeneratedData || templateData} onDataUsed={() => { setAiGeneratedData(null); setTemplateData(null); }} />}
          {activeTab === 'authorized' && <AuthorizedPersonsManager />}
          {activeTab === 'emergency' && <EmergencyResponseTeam />}
          {activeTab === 'organization-chart' && <OrganizationChart />}
          {activeTab === 'templates' && <TemplateLibraryV2 onSelectTemplate={handleTemplateSelect} onClose={() => handleNavigate('dashboard')} />}
          {activeTab === 'ai-generator' && <AISignageGenerator onGenerate={handleAIGenerate} onClose={() => handleNavigate('dashboard')} />}
          {activeTab === 'custom-editor' && <CustomSignageEditor />}
          {activeTab === 'blog' && <BlogTutorials />}
          {activeTab === 'admin' && (
            <AdminAuth>
              <ComprehensiveAdminPanel />
            </AdminAuth>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;