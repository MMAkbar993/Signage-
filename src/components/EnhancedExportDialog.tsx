import { useState } from 'react';
import { Download, FileImage, FileType, File, X, Check, Image as ImageIcon } from 'lucide-react';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
  icon: any;
  dpi?: number;
  quality?: string;
}

interface EnhancedExportDialogProps {
  onExport: (format: string, options: ExportOptions) => void;
  onClose: () => void;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'webp';
  dpi: number;
  quality: number;
  transparentBackground: boolean;
  includeImage: boolean;
  includeBranding: boolean;
  includeQR: boolean;
  paperSize?: 'a4' | 'a5' | 'letter' | 'legal';
}

export function EnhancedExportDialog({ onExport, onClose }: EnhancedExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg' | 'pdf' | 'webp'>('png');
  const [dpi, setDpi] = useState(300);
  const [quality, setQuality] = useState(100);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [includeQR, setIncludeQR] = useState(true);
  const [paperSize, setPaperSize] = useState<'a4' | 'a5' | 'letter' | 'legal'>('a4');

  const formats: ExportFormat[] = [
    {
      id: 'png',
      name: 'PNG Image',
      description: 'High-quality raster image',
      extension: '.png',
      icon: FileImage,
      dpi: 300,
      quality: '100%'
    },
    {
      id: 'svg',
      name: 'SVG Vector',
      description: 'Scalable vector graphics',
      extension: '.svg',
      icon: FileType,
      quality: 'Infinite'
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Print-ready A4 format',
      extension: '.pdf',
      icon: File,
      dpi: 300,
      quality: 'Print Ready'
    },
    {
      id: 'webp',
      name: 'WebP Image',
      description: 'Optimized for web',
      extension: '.webp',
      icon: ImageIcon,
      dpi: 150,
      quality: '90%'
    }
  ];

  const handleExport = () => {
    const options: ExportOptions = {
      format: selectedFormat,
      dpi,
      quality,
      transparentBackground,
      includeImage,
      includeBranding,
      includeQR,
      ...(selectedFormat === 'pdf' && { paperSize })
    };
    onExport(selectedFormat, options);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Export Signage</h2>
              <p className="text-sm text-slate-500">Choose format and options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-slate-900 mb-3">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.id;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id as any)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium mb-0.5 ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                          {format.name}
                        </div>
                        <div className="text-xs text-slate-500 mb-2">{format.description}</div>
                        <div className="flex items-center gap-3 text-xs">
                          {format.dpi && (
                            <span className="text-slate-600">
                              {format.dpi} DPI
                            </span>
                          )}
                          <span className="text-slate-600">
                            {format.quality}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resolution (PNG/WebP) */}
          {(selectedFormat === 'png' || selectedFormat === 'webp') && (
            <div>
              <label className="block text-slate-900 mb-3">
                Resolution: {dpi} DPI
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="72"
                  max="600"
                  step="50"
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>72 DPI (Screen)</span>
                  <span>150 DPI (Web)</span>
                  <span>300 DPI (Print)</span>
                  <span>600 DPI (Premium)</span>
                </div>
              </div>
            </div>
          )}

          {/* Quality (PNG/WebP) */}
          {(selectedFormat === 'png' || selectedFormat === 'webp') && (
            <div>
              <label className="block text-slate-900 mb-3">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}

          {/* Paper Size (PDF only) */}
          {selectedFormat === 'pdf' && (
            <div>
              <label className="block text-slate-900 mb-3">Paper Size</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'a4', label: 'A4 (210 × 297 mm)' },
                  { value: 'a5', label: 'A5 (148 × 210 mm)' },
                  { value: 'letter', label: 'Letter (216 × 279 mm)' },
                  { value: 'legal', label: 'Legal (216 × 356 mm)' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setPaperSize(size.value as any)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      paperSize === size.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="border-t border-slate-200 pt-6">
            <label className="block text-slate-900 mb-4">Export Options</label>
            <div className="space-y-3">
              {/* Transparent Background */}
              {(selectedFormat === 'png' || selectedFormat === 'webp') && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm text-slate-900">Transparent Background</div>
                    <div className="text-xs text-slate-500">Remove white background</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={transparentBackground}
                      onChange={(e) => setTransparentBackground(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              )}

              {/* Include Image */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-900">Include Image/Photo</div>
                  <div className="text-xs text-slate-500">Export with uploaded images</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeImage}
                    onChange={(e) => setIncludeImage(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Include Branding */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-900">Include Company Branding</div>
                  <div className="text-xs text-slate-500">Export with logos and custom headers</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBranding}
                    onChange={(e) => setIncludeBranding(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Include QR Code */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-slate-900">Include QR Code</div>
                  <div className="text-xs text-slate-500">Export with QR code if enabled</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeQR}
                    onChange={(e) => setIncludeQR(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Estimated File Size */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-900 mb-1">Estimated File Size</div>
                <div className="text-xs text-slate-500">Based on selected options</div>
              </div>
              <div className="text-2xl text-blue-600">
                {selectedFormat === 'svg' ? '~50 KB' :
                 selectedFormat === 'pdf' ? `~${Math.round(dpi / 30)} MB` :
                 selectedFormat === 'webp' ? `~${Math.round((dpi * quality) / 15000)} MB` :
                 `~${Math.round((dpi * quality) / 10000)} MB`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export {selectedFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
