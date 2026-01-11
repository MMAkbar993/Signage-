import { useState } from 'react';
import {
  Search,
  Star,
  Eye,
  Copy,
  Grid3x3,
  List,
  X,
  FileWarning,
  AlertTriangle,
  HardHat,
  ClipboardCheck,
  ClipboardList,
  Phone,
  CheckCircle,
  Flame,
  Droplet,
  Zap,
  AlertOctagon,
  XCircle,
  Shield,
  Info,
  Package,
  Truck,
  Factory,
  Construction,
  Heart,
  Warehouse,
  TestTube,
  Wrench
} from 'lucide-react';
import { signageTemplatesDatabase, type SignageTemplate } from '../data/signageTemplates';

interface TemplateLibraryProps {
  onSelectTemplate: (template: SignageTemplate) => void;
  onClose: () => void;
}

// Icon mapping
const iconMap: Record<string, any> = {
  'flame': Flame,
  'droplet': Droplet,
  'zap': Zap,
  'alert-octagon': AlertOctagon,
  'alert-triangle': AlertTriangle,
  'shield': Shield,
  'x-circle': XCircle,
  'check-circle': CheckCircle,
  'hard-hat': HardHat,
  'info': Info,
  'package': Package,
  'truck': Truck,
  'factory': Factory,
  'construction': Construction,
  'heart': Heart,
  'warehouse': Warehouse,
  'test-tube': TestTube,
  'wrench': Wrench,
  'cog': Wrench,
  'lock': Shield,
  'anchor': Shield,
  'plane': Package,
  'radio': Zap,
  'monitor': Info,
  'paintbrush': Wrench,
  'biohazard': AlertOctagon,
  'volume-2': AlertTriangle,
  'wind': Droplet,
  'move': Truck,
  'drill': Wrench,
  'arrow-up': AlertTriangle,
  'clipboard-check': ClipboardCheck,
  'clipboard-list': ClipboardList,
  'box': Package,
  'trash-2': Package,
  'home': Construction,
  'hammer': Wrench,
  'layers': Construction
};

export function TemplateLibraryV2({ onSelectTemplate, onClose }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewTemplate, setPreviewTemplate] = useState<SignageTemplate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'general', name: 'General Workplace' },
    { id: 'construction', name: 'Construction' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'warehouse', name: 'Warehouse & Logistics' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'office', name: 'Office & Administrative' },
    { id: 'food-service', name: 'Food Service' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'laboratory', name: 'Laboratory' },
    { id: 'agriculture', name: 'Agriculture' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'retail', name: 'Retail' },
    { id: 'environmental', name: 'Environmental' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'telecommunications', name: 'Telecommunications' },
    { id: 'maritime', name: 'Maritime' },
    { id: 'aviation', name: 'Aviation' }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', color: '#64748b' },
    { id: 'danger', name: 'Danger', color: '#D60000' },
    { id: 'warning', name: 'Warning', color: '#FFD600' },
    { id: 'mandatory', name: 'Mandatory', color: '#005BBB' },
    { id: 'prohibition', name: 'Prohibition', color: '#D60000' },
    { id: 'emergency', name: 'Emergency', color: '#009E2A' },
    { id: 'information', name: 'Information', color: '#0EA5E9' }
  ];

  // Filtering logic
  const filteredTemplates = signageTemplatesDatabase.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      template.hazards.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    const matchesRisk = selectedRiskLevel === 'all' || template.riskLevel === selectedRiskLevel;
    
    return matchesSearch && matchesCategory && matchesIndustry && matchesRisk;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const getRiskBadgeColor = (level: string) => {
    switch(level) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || AlertTriangle;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Professional Template Library</h2>
              <p className="text-sm text-slate-600 mt-1">{signageTemplatesDatabase.length}+ Ready-to-Use Activity Signage Templates</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search activities, hazards, procedures..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Industry Filter */}
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {industries.map(industry => (
                <option key={industry.id} value={industry.id}>{industry.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-sm text-slate-600">Risk Level:</span>
            {['all', 'high', 'medium', 'low'].map(level => (
              <button
                key={level}
                onClick={() => {
                  setSelectedRiskLevel(level);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedRiskLevel === level
                    ? level === 'high' ? 'bg-red-600 text-white' :
                      level === 'medium' ? 'bg-yellow-600 text-white' :
                      level === 'low' ? 'bg-green-600 text-white' :
                      'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Results count and view mode */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-slate-600">
              Showing {paginatedTemplates.length} of {filteredTemplates.length} templates
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedTemplates.map((template) => {
                const Icon = getIconComponent(template.icon);
                return (
                  <div
                    key={template.id}
                    className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: template.color + '20' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: template.color }} />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favorites.has(template.id)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1 text-sm line-clamp-2 group-hover:text-blue-600 min-h-[2.5rem]">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(template.riskLevel)}`}>
                        {template.riskLevel.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs capitalize">
                        {template.industry.replace('-', ' ')}
                      </span>
                      {template.popular && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTemplate(template);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Use Template
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                        className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedTemplates.map((template) => {
                const Icon = getIconComponent(template.icon);
                return (
                  <div
                    key={template.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: template.color + '20' }}
                      >
                        <Icon className="w-8 h-8" style={{ color: template.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1 text-base">
                              {template.name}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                              <span>Industry: <span className="font-medium capitalize">{template.industry.replace('-', ' ')}</span></span>
                              <span>•</span>
                              <span>Category: <span className="font-medium capitalize">{template.category}</span></span>
                              <span>•</span>
                              <span>{template.hazards.length} Hazards</span>
                              <span>•</span>
                              <span>{template.requiredPPE.length} PPE Items</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(template.id);
                            }}
                            className="p-1 hover:bg-slate-100 rounded transition-colors ml-2"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                favorites.has(template.id)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-400'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(template.riskLevel)}`}>
                              {template.riskLevel.toUpperCase()} RISK
                            </span>
                            {template.hazards.slice(0, 3).map((hazard, index) => (
                              <span key={index} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                                {hazard}
                              </span>
                            ))}
                            {template.hazards.length > 3 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                                +{template.hazards.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewTemplate(template);
                              }}
                              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTemplate(template);
                              }}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Use Template
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileWarning className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No templates found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedIndustry('all');
                  setSelectedRiskLevel('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  {(() => {
                    const Icon = getIconComponent(previewTemplate.icon);
                    return (
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: previewTemplate.color + '20' }}
                      >
                        <Icon className="w-8 h-8" style={{ color: previewTemplate.color }} />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{previewTemplate.name}</h2>
                    <p className="text-slate-600 mb-3">{previewTemplate.detailedDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(previewTemplate.riskLevel)}`}>
                        {previewTemplate.riskLevel.toUpperCase()} RISK
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                        {previewTemplate.industry.replace('-', ' ')}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm capitalize">
                        {previewTemplate.category}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm capitalize">
                        {previewTemplate.activityType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-4"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hazards */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Identified Hazards ({previewTemplate.hazards.length})
                  </h3>
                  <ul className="space-y-2">
                    {previewTemplate.hazards.map((hazard, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                        {hazard}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required PPE */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-blue-600" />
                    Required PPE ({previewTemplate.requiredPPE.length})
                  </h3>
                  <ul className="space-y-2">
                    {previewTemplate.requiredPPE.map((ppe, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {ppe}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safety Procedures */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-purple-600" />
                    Safety Procedures ({previewTemplate.safetyProcedures.length})
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {previewTemplate.safetyProcedures.map((procedure, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-purple-600 font-bold flex-shrink-0">{index + 1}.</span>
                        {procedure}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Emergency Contacts */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    Emergency Contacts
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {previewTemplate.emergencyContacts.map((contact, index) => (
                      <span key={index} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                        {contact}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-slate-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    onSelectTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Use This Template - Load Complete Signage
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
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