import { useState, useEffect } from 'react';
import { SignageData, QRCodeConfig, QRCodeType, QRCodeSource, QRCodeContentBox, AuthorizedPerson } from '../types/signage';
import { Plus, X, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react';

interface EnhancedQRCodeSectionProps {
  signageData: SignageData;
  onUpdate: (updates: Partial<SignageData>) => void;
}

const getDefaultQRCodeConfig = (): QRCodeConfig => ({
  type: 'generate',
  sources: ['custom'],
  contentBoxes: [],
  showOnlyTitleAndQR: false,
});

export function EnhancedQRCodeSection({ signageData, onUpdate }: EnhancedQRCodeSectionProps) {
  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>([]);
  const [organizationCharts, setOrganizationCharts] = useState<any[]>([]); // Placeholder for future
  const [safetyCommittees, setSafetyCommittees] = useState<any[]>([]); // Placeholder for future

  const qrConfig: QRCodeConfig = signageData.qrCodeConfig || getDefaultQRCodeConfig();

  // Load authorized persons from localStorage
  useEffect(() => {
    const loadAuthorizedPersons = () => {
      const saved = localStorage.getItem('authorizedPersons');
      if (saved) {
        try {
          setAuthorizedPersons(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading authorized persons:', e);
        }
      }
    };
    loadAuthorizedPersons();
    window.addEventListener('authorizedPersonsUpdated', loadAuthorizedPersons);
    return () => window.removeEventListener('authorizedPersonsUpdated', loadAuthorizedPersons);
  }, []);

  const updateQRConfig = (updates: Partial<QRCodeConfig>) => {
    const newConfig: QRCodeConfig = { ...qrConfig, ...updates };
    onUpdate({ qrCodeConfig: newConfig });
  };

  const handleSourceToggle = (source: QRCodeSource) => {
    const newSources = qrConfig.sources.includes(source)
      ? qrConfig.sources.filter(s => s !== source)
      : [...qrConfig.sources, source];
    updateQRConfig({ sources: newSources });
  };

  const handleAddContentBox = () => {
    const newBox: QRCodeContentBox = {
      id: Date.now().toString(),
      url: '',
      title: '',
    };
    updateQRConfig({ contentBoxes: [...qrConfig.contentBoxes, newBox] });
  };

  const handleRemoveContentBox = (id: string) => {
    updateQRConfig({ contentBoxes: qrConfig.contentBoxes.filter(box => box.id !== id) });
  };

  const handleUpdateContentBox = (id: string, updates: Partial<QRCodeContentBox>) => {
    const updatedBoxes = qrConfig.contentBoxes.map(box =>
      box.id === id ? { ...box, ...updates } : box
    );
    updateQRConfig({ contentBoxes: updatedBoxes });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        QR Code (Optional)
      </label>

      {/* QR Code Type */}
      <div className="space-y-3">
        <div className="text-sm text-slate-700 font-medium">QR Code Type</div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="qrCodeType"
              value="generate"
              checked={qrConfig.type === 'generate'}
              onChange={(e) => updateQRConfig({ type: e.target.value as QRCodeType })}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-slate-700">Generate New QR Code</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="qrCodeType"
              value="existing"
              checked={qrConfig.type === 'existing'}
              onChange={(e) => updateQRConfig({ type: e.target.value as QRCodeType })}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm text-slate-700">Use Existing QR Code</span>
          </label>
        </div>
      </div>

      {/* Upload Existing QR Code Image */}
      {qrConfig.type === 'existing' && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Upload Existing QR Code Image
          </label>
          {qrConfig.existingQRCodeImage ? (
            <div className="relative">
              <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                <img 
                  src={qrConfig.existingQRCodeImage} 
                  alt="QR Code" 
                  className="w-32 h-32 mx-auto object-contain"
                />
              </div>
              <button
                onClick={() => updateQRConfig({ existingQRCodeImage: undefined })}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600">Click to upload QR code image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 5 * 1024 * 1024) {
                    alert('File is too large. Maximum size is 5MB');
                    return;
                  }

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    updateQRConfig({ existingQRCodeImage: base64String });
                  };
                  reader.readAsDataURL(file);
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* QR Code Source */}
      <div className="space-y-3">
        <div className="text-sm text-slate-700 font-medium">QR Code Source</div>
        <div className="space-y-2">
          {(['custom', 'authorizedPerson', 'organizationChart', 'safetyCommittee'] as QRCodeSource[]).map((source) => {
            const labels: Record<QRCodeSource, string> = {
              custom: 'Custom Link / URL',
              authorizedPerson: 'Authorized Person',
              organizationChart: 'Organization Chart',
              safetyCommittee: 'Safety Committee Team',
            };
            return (
              <label key={source} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={qrConfig.sources.includes(source)}
                  onChange={() => handleSourceToggle(source)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">{labels[source]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Select Authorized Person */}
      {qrConfig.sources.includes('authorizedPerson') && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Select Authorized Person
          </label>
          <div className="relative">
            <select
              value={qrConfig.selectedAuthorizedPersonId || ''}
              onChange={(e) => updateQRConfig({ selectedAuthorizedPersonId: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Authorized Person</option>
              {authorizedPersons.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} - {person.designation}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-500">
            Click to select an authorized person to generate a QR code linking to their details.
          </p>
        </div>
      )}

      {/* Select Organization Chart */}
      {qrConfig.sources.includes('organizationChart') && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Select Organization Chart
          </label>
          <div className="relative">
            <select
              value={qrConfig.selectedOrganizationChartId || ''}
              onChange={(e) => updateQRConfig({ selectedOrganizationChartId: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Organization Chart</option>
              {organizationCharts.map((chart) => (
                <option key={chart.id} value={chart.id}>
                  {chart.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-500">
            Click to select an organization chart to generate a QR code linking to the chart.
          </p>
        </div>
      )}

      {/* Select Safety Committee Team */}
      {qrConfig.sources.includes('safetyCommittee') && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Select Safety Committee Team
          </label>
          <div className="relative">
            <select
              value={qrConfig.selectedSafetyCommitteeId || ''}
              onChange={(e) => updateQRConfig({ selectedSafetyCommitteeId: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="">Select Safety Committee Team</option>
              {safetyCommittees.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-500">
            Click to select a safety committee team to generate a QR code linking to the team details.
          </p>
        </div>
      )}

      {/* Content Boxes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-700 font-medium">Content Boxes</div>
            <p className="text-xs text-slate-500 mt-1">
              Add multiple content boxes with custom URLs or websites. Each box will have its own space in the QR code.
            </p>
          </div>
          <button
            onClick={handleAddContentBox}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-3 h-3" />
            Add Box
          </button>
        </div>

        {qrConfig.contentBoxes.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <p className="text-sm text-slate-500 mb-1">No boxes added yet</p>
            <p className="text-xs text-slate-400">Click 'Add Box' to create your first content box</p>
          </div>
        ) : (
          <div className="space-y-3">
            {qrConfig.contentBoxes.map((box) => (
              <div key={box.id} className="border border-slate-300 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Content Box {qrConfig.contentBoxes.indexOf(box) + 1}</span>
                  <button
                    onClick={() => handleRemoveContentBox(box.id)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Title (Optional)"
                  value={box.title || ''}
                  onChange={(e) => handleUpdateContentBox(box.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Enter URL or website"
                  value={box.url}
                  onChange={(e) => handleUpdateContentBox(box.id, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Or Enter Single URL (Legacy) */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <div className="text-sm text-slate-700 font-medium">Or Enter Single URL (Legacy)</div>
        <input
          type="url"
          value={qrConfig.legacyUrl || ''}
          onChange={(e) => updateQRConfig({ legacyUrl: e.target.value || undefined })}
          placeholder="Enter URL or text to generate QR code"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-500">
          Enter a single URL or text that will be encoded in the QR code. (This will replace boxes if used)
        </p>
      </div>

      {/* Show Only Title and QR Code */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={qrConfig.showOnlyTitleAndQR || false}
            onChange={(e) => updateQRConfig({ showOnlyTitleAndQR: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-slate-300"
          />
          <span className="text-sm text-slate-700 font-medium">Show Only Title and QR Code</span>
        </label>
        <p className="text-xs text-slate-500 ml-6">
          Display only the title and QR code on the paper (no other sections)
        </p>
      </div>
    </div>
  );
}
