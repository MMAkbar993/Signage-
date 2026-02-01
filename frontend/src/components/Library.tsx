import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  Grid3x3,
  List,
  Download,
  Eye
} from 'lucide-react';
import { 
  getSavedSignages, 
  deleteSavedSignage, 
  SavedSignage 
} from '../utils/storageManager';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface LibraryProps {
  onNavigate: (tab: string, data?: any) => void;
}

export function Library({ onNavigate }: LibraryProps) {
  const [savedSignages, setSavedSignages] = useState<SavedSignage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Load from localStorage
    setSavedSignages(getSavedSignages());
    
    // Listen for updates
    const handleUpdate = () => {
      setSavedSignages(getSavedSignages());
    };
    
    window.addEventListener('signagesUpdated', handleUpdate);
    window.addEventListener('libraryUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('signagesUpdated', handleUpdate);
      window.removeEventListener('libraryUpdated', handleUpdate);
    };
  }, []);

  const handleEditSignage = (signage: SavedSignage) => {
    if (signage.type === 'custom' && signage.customEditorData) {
      // Load custom editor data with ID for updates
      onNavigate('custom-editor', { ...signage.customEditorData, id: signage.id });
    } else if (signage.type === 'identification' && signage.identificationData) {
      // Load identification signage data
      onNavigate('signage', { 
        identificationData: signage.identificationData, 
        id: signage.id,
        type: 'identification'
      });
    } else if (signage.signageData) {
      // Load regular signage data with ID for updates
      onNavigate('signage', { ...signage.signageData, id: signage.id });
    }
  };

  const handleDeleteSignage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this signage from your library?')) {
      if (deleteSavedSignage(id)) {
        setSavedSignages(getSavedSignages());
        toast.success('Signage deleted from library');
      } else {
        toast.error('Failed to delete signage');
      }
    }
  };

  const handleExportSignage = async (signage: SavedSignage) => {
    try {
      // This would need to be implemented based on the signage type
      toast.info('Export functionality coming soon');
    } catch (error) {
      toast.error('Failed to export signage');
    }
  };

  // Filter signages
  const filteredSignages = savedSignages.filter(signage => {
    const matchesSearch = signage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         signage.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || signage.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = Array.from(new Set(savedSignages.map(s => s.type)));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Library</h1>
            <p className="text-slate-600 text-sm sm:text-base">
              All your saved signages in one place
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          {savedSignages.length} {savedSignages.length === 1 ? 'signage' : 'signages'} saved
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Grid View"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {savedSignages.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 text-xl font-semibold mb-2">No saved signages yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Create and save signages from Signage Generator, Custom Editor, or Identification Signage to access them here
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => onNavigate('signage')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Signage
            </button>
            <button
              onClick={() => onNavigate('custom-editor')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Custom Editor
            </button>
          </div>
        </div>
      ) : filteredSignages.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 text-xl font-semibold mb-2">No signages found</h3>
          <p className="text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSignages.map((signage) => (
            <div
              key={signage.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-b border-slate-200 relative">
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
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded ml-2">
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
                    <Eye className="w-3 h-3" />
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-200">
            {filteredSignages.map((signage) => (
              <div
                key={signage.id}
                className="p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
                    {signage.thumbnail ? (
                      <img
                        src={signage.thumbnail}
                        alt={signage.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-slate-900 font-medium truncate">
                        {signage.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded ml-2 flex-shrink-0">
                        {signage.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 capitalize">{signage.category}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Modified: {new Date(signage.lastModified).toLocaleDateString()}</span>
                      <span>Created: {new Date(signage.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditSignage(signage)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSignage(signage.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
