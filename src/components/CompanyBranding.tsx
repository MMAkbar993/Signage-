import { useState, useRef } from 'react';
import { Upload, Palette, Type, Layout, X, Plus, Minus } from 'lucide-react';

export interface BrandingConfig {
  enabled: boolean;
  logo?: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-top' | 'center-bottom';
  logoSize: number; // 50-150%
  logoOpacity: number; // 0-100%
  // Client and Contractor Logos
  clientLogo?: string;
  contractorLogo?: string;
  clientPosition: 'left' | 'right'; // Which side client logo appears in header
  headerLogosEnabled: boolean; // Toggle for header logos
  headerEnabled: boolean;
  headerText: string;
  headerColor: string;
  headerBgColor: string;
  footerEnabled: boolean;
  footerText: string;
  footerColor: string;
  footerBgColor: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  qrCodeEnabled: boolean;
  qrCodeData: string;
}

interface CompanyBrandingProps {
  config: BrandingConfig;
  onChange: (config: BrandingConfig) => void;
}

export function CompanyBranding({ config, onChange }: CompanyBrandingProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const clientLogoInputRef = useRef<HTMLInputElement>(null);
  const contractorLogoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...config,
          logo: reader.result as string,
          enabled: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...config,
          clientLogo: reader.result as string,
          enabled: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContractorLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...config,
          contractorLogo: reader.result as string,
          enabled: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateConfig = (updates: Partial<BrandingConfig>) => {
    onChange({ ...config, ...updates });
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full px-4 py-3 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        <Palette className="w-4 h-4" />
        Add Company Branding
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden">
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          <h3 className="text-slate-900 text-sm">Company Branding</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Client & Contractor Logos for Header - ALWAYS VISIBLE */}
        <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-slate-900">🏢 Client & Contractor Logos (Header)</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.headerLogosEnabled}
                onChange={(e) => updateConfig({ headerLogosEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {config.headerLogosEnabled && (
            <div className="space-y-4">
              {/* Client Logo Upload */}
              <div>
                <label className="block text-xs text-slate-600 mb-2 font-semibold">📁 Client Logo</label>
                {config.clientLogo ? (
                  <div className="relative w-full h-24 bg-white rounded-lg flex items-center justify-center border-2 border-green-500">
                    <img
                      src={config.clientLogo}
                      alt="Client Logo"
                      className="max-w-full max-h-full object-contain p-2"
                    />
                    <button
                      onClick={() => updateConfig({ clientLogo: undefined })}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => clientLogoInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 hover:border-blue-600 hover:bg-blue-100 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">Browse Client Logo</span>
                    <span className="text-xs text-slate-500">(PNG, JPG, SVG)</span>
                  </button>
                )}
                <input
                  ref={clientLogoInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                  onChange={handleClientLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Contractor Logo Upload */}
              <div>
                <label className="block text-xs text-slate-600 mb-2 font-semibold">📁 Contractor Logo</label>
                {config.contractorLogo ? (
                  <div className="relative w-full h-24 bg-white rounded-lg flex items-center justify-center border-2 border-green-500">
                    <img
                      src={config.contractorLogo}
                      alt="Contractor Logo"
                      className="max-w-full max-h-full object-contain p-2"
                    />
                    <button
                      onClick={() => updateConfig({ contractorLogo: undefined })}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => contractorLogoInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-purple-400 rounded-lg bg-purple-50 hover:border-purple-600 hover:bg-purple-100 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-purple-600" />
                    <span className="text-sm text-purple-700 font-medium">Browse Contractor Logo</span>
                    <span className="text-xs text-slate-500">(PNG, JPG, SVG)</span>
                  </button>
                )}
                <input
                  ref={contractorLogoInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                  onChange={handleContractorLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Logo Position Selection */}
              {(config.clientLogo || config.contractorLogo) && (
                <div>
                  <label className="block text-xs text-slate-600 mb-2">Client Logo Position in Header</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateConfig({ clientPosition: 'left' })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                        config.clientPosition === 'left'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      ← Client Left | Contractor Right →
                    </button>
                    <button
                      onClick={() => updateConfig({ clientPosition: 'right' })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                        config.clientPosition === 'right'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      ← Contractor Left | Client Right →
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Choose which logo appears on the left or right side of the signage header
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">Company Logo (Watermark)</label>
          <div className="space-y-3">
            {config.logo ? (
              <div className="relative w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-slate-300">
                <img
                  src={config.logo}
                  alt="Company Logo"
                  className="max-w-full max-h-full object-contain"
                  style={{ opacity: config.logoOpacity / 100 }}
                />
                <button
                  onClick={() => updateConfig({ logo: undefined })}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-sm text-slate-600">Upload Logo (PNG/SVG)</span>
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        {config.logo && (
          <>
            {/* Logo Position */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">Logo Position</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'top-left', label: '↖ Top Left' },
                  { value: 'center-top', label: '↑ Center Top' },
                  { value: 'top-right', label: '↗ Top Right' },
                  { value: 'bottom-left', label: '↙ Bottom Left' },
                  { value: 'center-bottom', label: '↓ Center Bottom' },
                  { value: 'bottom-right', label: '↘ Bottom Right' }
                ].map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => updateConfig({ logoPosition: pos.value as any })}
                    className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                      config.logoPosition === pos.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Size */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Logo Size: {config.logoSize}%
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateConfig({ logoSize: Math.max(50, config.logoSize - 10) })}
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={config.logoSize}
                  onChange={(e) => updateConfig({ logoSize: Number(e.target.value) })}
                  className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => updateConfig({ logoSize: Math.min(150, config.logoSize + 10) })}
                  className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Logo Opacity */}
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Logo Opacity: {config.logoOpacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.logoOpacity}
                onChange={(e) => updateConfig({ logoOpacity: Number(e.target.value) })}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </>
        )}

        {/* Custom Header */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-700">Custom Header</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.headerEnabled}
                onChange={(e) => updateConfig({ headerEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {config.headerEnabled && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Header Text (e.g., ABC Corporation)"
                value={config.headerText}
                onChange={(e) => updateConfig({ headerText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={config.headerColor}
                    onChange={(e) => updateConfig({ headerColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={config.headerBgColor}
                    onChange={(e) => updateConfig({ headerBgColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Footer */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-700">Custom Footer</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.footerEnabled}
                onChange={(e) => updateConfig({ footerEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {config.footerEnabled && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Footer Text (e.g., ISO 7010 Compliant)"
                value={config.footerText}
                onChange={(e) => updateConfig({ footerText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={config.footerColor}
                    onChange={(e) => updateConfig({ footerColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={config.footerBgColor}
                    onChange={(e) => updateConfig({ footerBgColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-700">Add QR Code (SOP/Safety Code)</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.qrCodeEnabled}
                onChange={(e) => updateConfig({ qrCodeEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {config.qrCodeEnabled && (
            <input
              type="text"
              placeholder="URL or Text for QR Code"
              value={config.qrCodeData}
              onChange={(e) => updateConfig({ qrCodeData: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Brand Colors */}
        <div className="border-t border-slate-200 pt-4">
          <label className="block text-sm text-slate-700 mb-3">Brand Colors</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Primary</label>
              <input
                type="color"
                value={config.brandColors.primary}
                onChange={(e) => updateConfig({
                  brandColors: { ...config.brandColors, primary: e.target.value }
                })}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Secondary</label>
              <input
                type="color"
                value={config.brandColors.secondary}
                onChange={(e) => updateConfig({
                  brandColors: { ...config.brandColors, secondary: e.target.value }
                })}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Accent</label>
              <input
                type="color"
                value={config.brandColors.accent}
                onChange={(e) => updateConfig({
                  brandColors: { ...config.brandColors, accent: e.target.value }
                })}
                className="w-full h-12 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default branding configuration
export const defaultBrandingConfig: BrandingConfig = {
  enabled: false,
  logoPosition: 'top-right',
  logoSize: 100,
  logoOpacity: 100,
  clientPosition: 'left',
  headerLogosEnabled: false,
  headerEnabled: false,
  headerText: '',
  headerColor: '#ffffff',
  headerBgColor: '#1e293b',
  footerEnabled: false,
  footerText: '',
  footerColor: '#ffffff',
  footerBgColor: '#1e293b',
  brandColors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b'
  },
  qrCodeEnabled: false,
  qrCodeData: ''
};