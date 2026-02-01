import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Copy,
  Grid3x3,
  List,
  Zap,
  AlertTriangle,
  Shield,
  XCircle,
  CheckCircle,
  AlertOctagon,
  Flame,
  Droplet,
  Wrench,
  HardHat,
  Radio,
  FileWarning,
  X,
  Building2,
  Factory,
  Truck,
  Heart,
  Beaker,
  Mountain,
  Ship,
  Trees,
  Cookie,
  Settings,
  Gauge,
  ChevronDown,
  TrendingUp,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { getAllTemplates } from '../data/templateGenerator';
import type { Template } from '../data/templateDatabase';

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export function TemplateLibrary({ onSelectTemplate, onClose }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'name' | 'risk'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 24;

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const allTemplates = getAllTemplates();
        setTemplates(allTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteTemplates');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid3x3, color: '#64748b' },
    { id: 'danger', name: 'Danger', icon: AlertOctagon, color: '#D60000' },
    { id: 'warning', name: 'Warning', icon: AlertTriangle, color: '#FFD600' },
    { id: 'mandatory', name: 'Mandatory', icon: CheckCircle, color: '#005BBB' },
    { id: 'prohibition', name: 'Prohibition', icon: XCircle, color: '#D60000' },
    { id: 'emergency', name: 'Emergency', icon: Shield, color: '#009E2A' },
    { id: 'fire', name: 'Fire Safety', icon: Flame, color: '#FF4500' },
    { id: 'chemical', name: 'Chemical', icon: Droplet, color: '#9333EA' },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: '#FFB800' },
    { id: 'mechanical', name: 'Mechanical', icon: Wrench, color: '#475569' },
    { id: 'ppe', name: 'PPE', icon: HardHat, color: '#0EA5E9' },
    { id: 'stp', name: 'STP/Wastewater', icon: Droplet, color: '#06B6D4' }
  ];

  const industries = [
    { id: 'all', name: 'All Industries', icon: Grid3x3 },
    { id: 'construction', name: 'Construction', icon: Building2 },
    { id: 'manufacturing', name: 'Manufacturing', icon: Factory },
    { id: 'healthcare', name: 'Healthcare', icon: Heart },
    { id: 'laboratory', name: 'Laboratory', icon: Beaker },
    { id: 'transportation', name: 'Transportation', icon: Truck },
    { id: 'mining', name: 'Mining', icon: Mountain },
    { id: 'marine', name: 'Marine/Offshore', icon: Ship },
    { id: 'food', name: 'Food Safety', icon: Cookie },
    { id: 'oil-gas', name: 'Oil & Gas', icon: Flame },
    { id: 'utilities', name: 'Utilities', icon: Zap }
  ];

  const activities = [
    { id: 'all', name: 'All Activities', icon: Grid3x3 },
    { id: 'confined-space', name: 'Confined Space', icon: AlertOctagon },
    { id: 'forklift', name: 'Forklift Operation', icon: AlertTriangle },
    { id: 'chemical-storage', name: 'Chemical Storage', icon: Droplet },
    { id: 'machinery', name: 'Heavy Machinery', icon: Wrench },
    { id: 'aeration', name: 'Aeration Tank', icon: Droplet },
    { id: 'sludge', name: 'Sludge Handling', icon: Droplet },
    { id: 'chlorine-tank', name: 'Chlorine Contact Tank', icon: Droplet },
    { id: 'panel-room', name: 'Panel Room - Control', icon: Zap },
    { id: 'pump-room', name: 'Pump Room', icon: Wrench },
    { id: 'corrosive', name: 'Corrosive Material', icon: Droplet },
    { id: 'toxic', name: 'Toxic Substances', icon: Droplet },
    { id: 'flammable', name: 'Flammable Liquids', icon: Flame },
    { id: 'panel', name: 'Electrical Panel', icon: Zap },
    { id: 'live-wires', name: 'Live Wires', icon: Zap },
    { id: 'fire-alarm', name: 'Fire Alarm', icon: Flame },
    { id: 'fire-hose', name: 'Fire Hose Reel', icon: Flame }
  ];

  const riskLevels = [
    { id: 'all', name: 'All Risk Levels', icon: Grid3x3 },
    { id: 'low', name: 'Low Risk', icon: AlertTriangle },
    { id: 'medium', name: 'Medium Risk', icon: AlertTriangle },
    { id: 'high', name: 'High Risk', icon: AlertTriangle }
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             template.category === selectedCategory ||
                             template.subcategory === selectedCategory;
      const matchesIndustry = selectedIndustry === 'all' || 
                              template.industry === selectedIndustry;
      const matchesActivity = selectedActivity === 'all' || 
                              template.activity === selectedActivity;
      const matchesRiskLevel = selectedRiskLevel === 'all' || 
                               template.riskLevel === selectedRiskLevel;
      return matchesSearch && matchesCategory && matchesIndustry && matchesActivity && matchesRiskLevel;
    });
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedActivity, selectedRiskLevel]);

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteTemplates', JSON.stringify(Array.from(newFavorites)));
  };

  const sortedTemplates = useMemo(() => {
    return [...filteredTemplates].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      } else if (sortBy === 'new') {
        return (b.new ? 1 : 0) - (a.new ? 1 : 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'risk') {
        return (a.riskLevel || 'low').localeCompare(b.riskLevel || 'low');
      }
      return 0;
    });
  }, [filteredTemplates, sortBy]);

  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedTemplates.slice(start, end);
  }, [sortedTemplates, currentPage]);

  const totalPages = Math.ceil(sortedTemplates.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-slate-900 mb-2">Template Library</h1>
              <p className="text-slate-600">
                Choose from {templates.length}+ professional safety signage templates
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 border rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 border rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{templates.length}+</p>
                  <p className="text-sm text-slate-600">Total Templates</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{templates.filter(t => t.popular).length}</p>
                  <p className="text-sm text-slate-600">Popular</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{templates.filter(t => t.new).length}</p>
                  <p className="text-sm text-slate-600">New Additions</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{industries.length - 1}</p>
                  <p className="text-sm text-slate-600">Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Categories Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon 
                        className="w-4 h-4" 
                        style={{ color: isActive ? category.color : undefined }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Templates Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading templates...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTemplates.map((template) => {
                      // Map icon string to actual component
                      const iconMap: Record<string, any> = {
                        'AlertOctagon': AlertOctagon,
                        'AlertTriangle': AlertTriangle,
                        'Zap': Zap,
                        'Droplet': Droplet,
                        'Flame': Flame,
                        'Wrench': Wrench,
                        'Heart': Heart,
                        'Beaker': Beaker,
                        'Truck': Truck,
                        'Shield': Shield,
                        'XCircle': XCircle,
                        'CheckCircle': CheckCircle,
                        'HardHat': HardHat,
                        'Radio': Radio,
                        'Building2': Building2,
                        'Factory': Factory,
                        'Mountain': Mountain,
                        'Ship': Ship,
                        'Cookie': Cookie
                      };
                      const Icon = iconMap[template.icon] || AlertTriangle;
                      const isFavorite = favorites.has(template.id);
                      return (
                        <div
                          key={template.id}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                        >
                          <div 
                            className="h-48 flex items-center justify-center relative"
                            style={{ backgroundColor: `${template.color}15` }}
                          >
                            <Icon 
                              className="w-24 h-24 opacity-20"
                              style={{ color: template.color }}
                            />
                            {template.popular && (
                              <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                                Popular
                              </div>
                            )}
                            {template.new && (
                              <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                New
                              </div>
                            )}
                            <button
                              onClick={() => toggleFavorite(template.id)}
                              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Star 
                                className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`}
                              />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="text-slate-900 mb-1">{template.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{template.description}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => onSelectTemplate(template)}
                                className="flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                style={{ backgroundColor: template.color }}
                              >
                                <Copy className="w-4 h-4" />
                                Use Template
                              </button>
                              <button 
                                onClick={() => setPreviewTemplate(template)}
                                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedTemplates.map((template) => {
                      const iconMap: Record<string, any> = {
                        'AlertOctagon': AlertOctagon,
                        'AlertTriangle': AlertTriangle,
                        'Zap': Zap,
                        'Droplet': Droplet,
                        'Flame': Flame,
                        'Wrench': Wrench,
                        'Heart': Heart,
                        'Beaker': Beaker,
                        'Truck': Truck,
                        'Shield': Shield,
                        'XCircle': XCircle,
                        'CheckCircle': CheckCircle,
                        'HardHat': HardHat,
                        'Radio': Radio,
                        'Building2': Building2,
                        'Factory': Factory,
                        'Mountain': Mountain,
                        'Ship': Ship,
                        'Cookie': Cookie
                      };
                      const Icon = iconMap[template.icon] || AlertTriangle;
                      const isFavorite = favorites.has(template.id);
                      return (
                        <div
                          key={template.id}
                          className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${template.color}15` }}
                            >
                              <Icon className="w-8 h-8" style={{ color: template.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="text-slate-900">{template.name}</h3>
                                {template.popular && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    Popular
                                  </span>
                                )}
                                {template.new && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">{template.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleFavorite(template.id)}
                                className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                              >
                                <Star 
                                  className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`}
                                />
                              </button>
                              <button 
                                onClick={() => setPreviewTemplate(template)}
                                className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                              >
                                <Eye className="w-4 h-4 text-slate-700" />
                              </button>
                              <button
                                onClick={() => onSelectTemplate(template)}
                                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: template.color }}
                              >
                                Use Template
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    <p className="text-sm text-slate-600">
                      Page {currentPage} of {totalPages}
                    </p>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-slate-900">{previewTemplate.name}</h2>
                <p className="text-sm text-slate-600">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Modal Content - Preview */}
            <div className="p-6">
              <div 
                className="w-full aspect-[3/4] rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${previewTemplate.color}15` }}
              >
                {(() => {
                  const iconMap: Record<string, any> = {
                    'AlertOctagon': AlertOctagon,
                    'AlertTriangle': AlertTriangle,
                    'Zap': Zap,
                    'Droplet': Droplet,
                    'Flame': Flame,
                    'Wrench': Wrench,
                    'Heart': Heart,
                    'Beaker': Beaker,
                    'Truck': Truck,
                    'Shield': Shield,
                    'XCircle': XCircle,
                    'CheckCircle': CheckCircle,
                    'HardHat': HardHat,
                    'Radio': Radio,
                    'Building2': Building2,
                    'Factory': Factory,
                    'Mountain': Mountain,
                    'Ship': Ship,
                    'Cookie': Cookie
                  };
                  const PreviewIcon = iconMap[previewTemplate.icon] || AlertTriangle;
                  return (
                    <PreviewIcon 
                      className="w-48 h-48 opacity-30"
                      style={{ color: previewTemplate.color }}
                    />
                  );
                })()}
              </div>

              {/* Template Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm text-slate-600 mb-1">Category</h3>
                  <p className="text-slate-900 capitalize">{previewTemplate.category}</p>
                </div>
                <div>
                  <h3 className="text-sm text-slate-600 mb-1">Color Code</h3>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border-2 border-slate-300"
                      style={{ backgroundColor: previewTemplate.color }}
                    />
                    <p className="text-slate-900 font-mono">{previewTemplate.color}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-slate-600 mb-1">ISO Compliance</h3>
                  <p className="text-slate-900">ISO 7010 Compliant</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>📌 Note:</strong> This template will pre-fill the signage generator with appropriate settings. You can customize all fields after selection.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ backgroundColor: previewTemplate.color }}
                >
                  <Copy className="w-5 h-5" />
                  Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}