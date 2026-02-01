import { useState, useEffect } from 'react';
import React from 'react';
import { InputPanel } from './InputPanel';
import { SignagePreview } from './SignagePreview';
import { IdentificationSignage } from './IdentificationSignage';
import { SignageData } from '../types/signage';
import { AlertTriangle, MapPin, Palette, Save } from 'lucide-react';
import { CompanyBranding, BrandingConfig, defaultBrandingConfig } from './CompanyBranding';
import { saveSignageToLibrary, generateSignageId } from '../utils/storageManager';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

type SignageType = 'safety' | 'identification';

interface SignageGeneratorProps {
  aiGeneratedData?: Partial<SignageData> | null;
  onDataUsed?: () => void;
}

export function SignageGenerator({ aiGeneratedData, onDataUsed }: SignageGeneratorProps) {
  const [signageType, setSignageType] = useState<SignageType>('safety');
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>(defaultBrandingConfig);
  const [currentSignageId, setCurrentSignageId] = useState<string | null>(null);
  const [signageData, setSignageData] = useState<SignageData>({
    title: '',
    purpose: '',
    description: '',
    category: 'danger',
    customColor: '#D60000',
    location: '',
    hazards: [],
    ppe: [],
    customPPEImages: [], // Custom uploaded PPE images
    procedures: [],
    permitRequired: 'no',
    permitDetails: '',
    emergencyContacts: [
      { label: 'Emergency', number: '911' },
      { label: 'Safety Officer', number: '+1 (555) 123-4567' }
    ],
    authorizedPersons: [],
    qrCode: '',
    size: 'a4',
    customWidth: 210,
    customHeight: 297,
    resolution: '300dpi',
    warningIcon: null,
    backgroundImage: null,
    footerText: 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually',
  });

  // Load AI generated data or saved signage data when available
  useEffect(() => {
    if (aiGeneratedData) {
      const data = aiGeneratedData as any;
      
      // Check if this is identification signage
      if (data.type === 'identification' || data.identificationData) {
        setSignageType('identification');
        // Identification data will be passed to IdentificationSignage component via props
      } else {
        setSignageType('safety');
        // Check if this is a loaded saved signage (has an id property)
        if (data.id) {
          setCurrentSignageId(data.id);
          // Remove id from data before setting
          const { id, ...dataWithoutId } = data;
          setSignageData(prev => ({
            ...prev,
            ...dataWithoutId
          }));
        } else {
          setSignageData(prev => ({
            ...prev,
            ...aiGeneratedData
          }));
        }
      }
      
      if (onDataUsed) {
        onDataUsed();
      }
    }
  }, [aiGeneratedData, onDataUsed]);

  const handleUpdate = (updates: Partial<SignageData>) => {
    setSignageData(prev => ({ ...prev, ...updates }));
  };

  const handleSaveToLibrary = async () => {
    try {
      // Generate thumbnail from preview
      const previewElement = document.getElementById('signage-preview');
      let thumbnail: string | undefined;
      
      if (previewElement) {
        try {
          const canvas = await html2canvas(previewElement as HTMLElement, {
            scale: 0.3,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          thumbnail = canvas.toDataURL('image/png');
        } catch (error) {
          console.warn('Could not generate thumbnail:', error);
        }
      }

      const savedSignage = {
        id: currentSignageId || generateSignageId(),
        type: 'safety' as const,
        title: signageData.title || 'Untitled Signage',
        category: signageData.category || 'danger',
        timestamp: currentSignageId ? Date.now() : Date.now(), // Keep original timestamp if updating
        lastModified: Date.now(),
        thumbnail,
        signageData: { ...signageData }
      };

      if (currentSignageId) {
        setCurrentSignageId(savedSignage.id); // Ensure we keep the same ID
      } else {
        setCurrentSignageId(savedSignage.id); // Store new ID for future updates
      }

      saveSignageToLibrary(savedSignage);
      toast.success(currentSignageId ? 'Signage updated in library!' : 'Signage saved to library!', {
        description: 'You can access it from the Dashboard anytime.'
      });
    } catch (error) {
      console.error('Error saving signage:', error);
      toast.error('Failed to save signage', {
        description: 'Please try again.'
      });
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* AI Generated Notice */}
        {aiGeneratedData && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-purple-900 font-medium">Template Loaded Successfully</div>
                  <div className="text-purple-700 text-sm">Content pre-filled from professional template. Review, customize as needed, and print.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Controls Bar */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Signage Type Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-slate-900 mb-3 text-sm font-medium">Signage Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSignageType('safety')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  signageType === 'safety'
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Safety Signage</div>
                  <div className={`text-xs ${signageType === 'safety' ? 'text-red-100' : 'text-slate-500'}`}>
                    Danger, Warning, etc.
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setSignageType('identification')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  signageType === 'identification'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Identification</div>
                  <div className={`text-xs ${signageType === 'identification' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Area labels
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Save to Library Button */}
          {signageType === 'safety' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-end">
              <button
                onClick={handleSaveToLibrary}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save to Library
              </button>
            </div>
          )}
        </div>

        {/* Render based on signage type */}
        {signageType === 'safety' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Left Panel - Input Form */}
            <div className="order-2 lg:order-1 space-y-4">
              <InputPanel 
                signageData={signageData} 
                onUpdate={handleUpdate}
              />
              
              {/* Company Branding */}
              <CompanyBranding config={brandingConfig} onChange={setBrandingConfig} />
            </div>

            {/* Right Panel - Preview */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
              <SignagePreview 
                signageData={signageData}
                brandingConfig={brandingConfig}
                onBrandingConfigChange={setBrandingConfig}
              />
            </div>
          </div>
        ) : (
          <IdentificationSignage 
            initialData={(aiGeneratedData as any)?.identificationData}
            id={(aiGeneratedData as any)?.id}
            onDataLoaded={onDataUsed}
          />
        )}
      </div>
    </div>
  );
}