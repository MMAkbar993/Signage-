import React from 'react';
import { 
  Home, 
  FileText, 
  Grid3x3, 
  Sparkles,
  Palette,
  Users, 
  AlertTriangle, 
  BookOpen,
  Settings,
  Network
} from 'lucide-react';

type TabType = 'dashboard' | 'signage' | 'authorized' | 'emergency' | 'templates' | 'ai-generator' | 'custom-editor' | 'blog' | 'admin' | 'organization-chart';

interface SidebarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  menuOpen: boolean;
}

export function Sidebar({ activeTab, onNavigate, menuOpen }: SidebarProps) {
  return (
    <aside 
      className={`
        fixed top-0 left-0 
        h-full
        w-72 bg-white border-r border-slate-200 p-4 z-[60]
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <nav className="space-y-2">
        {/* Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Home className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Dashboard</div>
            <div className={`text-xs ${activeTab === 'dashboard' ? 'text-blue-100' : 'text-slate-500'}`}>
              Overview & quick actions
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-slate-200"></div>
          <div className="text-xs text-slate-500 mt-2 px-2">CREATE SIGNAGE</div>
        </div>

        {/* Signage Generator */}
        <button
          onClick={() => onNavigate('signage')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'signage'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Signage Generator</div>
            <div className={`text-xs ${activeTab === 'signage' ? 'text-blue-100' : 'text-slate-500'}`}>
              Create safety signage
            </div>
          </div>
        </button>

        {/* Template Library */}
        <button
          onClick={() => onNavigate('templates')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Grid3x3 className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Template Library</div>
            <div className={`text-xs ${activeTab === 'templates' ? 'text-blue-100' : 'text-slate-500'}`}>
              500+ ready templates
            </div>
          </div>
        </button>

        {/* AI Generator */}
        <button
          onClick={() => onNavigate('ai-generator')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'ai-generator'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">AI Generator</div>
            <div className={`text-xs ${activeTab === 'ai-generator' ? 'text-purple-100' : 'text-slate-500'}`}>
              Auto-create with AI
            </div>
          </div>
          {activeTab !== 'ai-generator' && (
            <span className="ml-auto px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
              NEW
            </span>
          )}
        </button>

        {/* Custom Editor */}
        <button
          onClick={() => onNavigate('custom-editor')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'custom-editor'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Custom Editor</div>
            <div className={`text-xs ${activeTab === 'custom-editor' ? 'text-blue-100' : 'text-slate-500'}`}>
              Edit and design
            </div>
          </div>
          {activeTab !== 'custom-editor' && (
            <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
              NEW
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-slate-200"></div>
          <div className="text-xs text-slate-500 mt-2 px-2">MANAGE PERSONNEL</div>
        </div>

        {/* Authorized Persons */}
        <button
          onClick={() => onNavigate('authorized')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'authorized'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Authorized Persons</div>
            <div className={`text-xs ${activeTab === 'authorized' ? 'text-blue-100' : 'text-slate-500'}`}>
              Manage personnel
            </div>
          </div>
        </button>

        {/* Emergency Response Team */}
        <button
          onClick={() => onNavigate('emergency')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'emergency'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Emergency Team</div>
            <div className={`text-xs ${activeTab === 'emergency' ? 'text-blue-100' : 'text-slate-500'}`}>
              Emergency response
            </div>
          </div>
        </button>

        {/* Organization Chart */}
        <button
          onClick={() => onNavigate('organization-chart')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'organization-chart'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Network className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Organization Chart</div>
            <div className={`text-xs ${activeTab === 'organization-chart' ? 'text-blue-100' : 'text-slate-500'}`}>
              Create org hierarchy
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-slate-200"></div>
          <div className="text-xs text-slate-500 mt-2 px-2">RESOURCES</div>
        </div>

        {/* Blog */}
        <button
          onClick={() => onNavigate('blog')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'blog'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Blog & Tutorials</div>
            <div className={`text-xs ${activeTab === 'blog' ? 'text-blue-100' : 'text-slate-500'}`}>
              Learn safety tips
            </div>
          </div>
        </button>

        {/* Admin Panel */}
        <button
          onClick={() => onNavigate('admin')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'admin'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Admin Panel</div>
            <div className={`text-xs ${activeTab === 'admin' ? 'text-blue-100' : 'text-slate-500'}`}>
              System settings
            </div>
          </div>
        </button>
      </nav>

      {/* Sidebar Info */}
      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm text-blue-900">Pro Features</h3>
        </div>
        <ul className="text-xs text-blue-700 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>AI-powered generation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>Multi-language support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>Company branding</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>500+ templates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">✓</span>
            <span>High-res export</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
