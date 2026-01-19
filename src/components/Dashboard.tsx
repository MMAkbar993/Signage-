import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Star, 
  Image as ImageIcon, 
  Clock, 
  Download,
  Sparkles,
  Upload,
  Grid3x3,
  TrendingUp,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { getRecentSignages, getUploadedImages, getFavoriteTemplates, saveUploadedImage, getSavedSignages, deleteSavedSignage } from '../utils/storageManager';
import { SavedSignage } from '../utils/storageManager';
import { Edit, Trash2 } from 'lucide-react';

interface RecentSignage {
  id: string;
  type: 'safety' | 'identification' | 'authorized' | 'emergency';
  title: string;
  category: string;
  timestamp: number;
  thumbnail?: string;
}

interface DashboardProps {
  onNavigate: (section: 'signage' | 'authorized' | 'emergency' | 'templates' | 'ai-generator' | 'custom-editor', data?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [recentSignages, setRecentSignages] = useState<RecentSignage[]>([]);
  const [savedSignages, setSavedSignages] = useState<SavedSignage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load from localStorage
    setRecentSignages(getRecentSignages());
    setSavedSignages(getSavedSignages());
    setUploadedImages(getUploadedImages());
    setFavorites(getFavoriteTemplates());
    
    // Listen for updates
    const handleUpdate = () => {
      setRecentSignages(getRecentSignages());
      setSavedSignages(getSavedSignages());
      setUploadedImages(getUploadedImages());
      setFavorites(getFavoriteTemplates());
    };
    
    window.addEventListener('signagesUpdated', handleUpdate);
    window.addEventListener('libraryUpdated', handleUpdate);
    window.addEventListener('imagesUpdated', handleUpdate);
    window.addEventListener('favoritesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('signagesUpdated', handleUpdate);
      window.removeEventListener('libraryUpdated', handleUpdate);
      window.removeEventListener('imagesUpdated', handleUpdate);
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, []);

  const handleEditSignage = (signage: SavedSignage) => {
    if (signage.type === 'custom' && signage.customEditorData) {
      // Load custom editor data with ID for updates
      onNavigate('custom-editor', { ...signage.customEditorData, id: signage.id });
    } else if (signage.signageData) {
      // Load regular signage data with ID for updates
      onNavigate('signage', { ...signage.signageData, id: signage.id });
    }
  };

  const handleDeleteSignage = (id: string) => {
    if (confirm('Are you sure you want to delete this signage?')) {
      deleteSavedSignage(id);
      setSavedSignages(getSavedSignages());
    }
  };

  const filteredSignages = savedSignages.filter(signage => 
    signage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    signage.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: 'Saved Signages',
      value: savedSignages.length,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Uploaded Images',
      value: uploadedImages.length,
      icon: ImageIcon,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      label: 'Favorites',
      value: favorites.length,
      icon: Star,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      label: 'This Week',
      value: recentSignages.filter(s => {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return s.timestamp > weekAgo;
      }).length,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    }
  ];

  const quickActions = [
    {
      title: 'Create Safety Signage',
      description: 'Design professional safety signs',
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      action: () => onNavigate('signage')
    },
    {
      title: 'AI Signage Generator',
      description: 'Auto-generate with AI',
      icon: Sparkles,
      color: 'purple',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      action: () => onNavigate('ai-generator')
    },
    {
      title: 'Browse Templates',
      description: 'Choose from 500+ templates',
      icon: Grid3x3,
      color: 'indigo',
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      action: () => onNavigate('templates')
    },
    {
      title: 'Upload Image',
      description: 'Upload and edit photos',
      icon: Upload,
      color: 'green',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      action: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const newImages = [...uploadedImages, reader.result as string];
              setUploadedImages(newImages);
              saveUploadedImage(newImages);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">
            Welcome to Universal Smart Signage Generator
          </h1>
          <p className="text-slate-600">
            Create professional ISO 7010-compliant safety signage in minutes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-xl p-6 transition-all hover:shadow-lg hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center border-2 ${stat.borderColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`text-3xl ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-slate-700">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.bgColor} text-white rounded-xl p-6 text-left transition-all hover:shadow-xl hover:scale-105 group`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-white mb-1">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved Signages Library */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">My Signage Library</h2>
              <span className="text-sm text-slate-500">({savedSignages.length} saved)</span>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {savedSignages.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 mb-2">No saved signages yet</h3>
              <p className="text-slate-500 mb-6">
                Create and save signages to access them here for later editing
              </p>
              <button
                onClick={() => onNavigate('signage')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Signage
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSignages.map((signage) => (
                <div
                  key={signage.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-b border-slate-200 relative">
                    {signage.thumbnail ? (
                      <img
                        src={signage.thumbnail}
                        alt={signage.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-16 h-16 text-slate-400" />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditSignage(signage)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSignage(signage.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-slate-900 text-sm font-medium truncate flex-1">
                        {signage.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                        {signage.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 capitalize">{signage.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {new Date(signage.lastModified).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleEditSignage(signage)}
                        className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1 font-medium"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">My Uploaded Images</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedImages.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Getting Started Guide */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-white mb-2">New to the platform?</h2>
              <p className="text-blue-100 mb-4">
                Learn how to create professional safety signage in just 3 easy steps
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Watch Tutorial
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-white/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}