import { useState, useEffect } from 'react';
import { SignageData, SignageCategory, PPEType } from '../types/signage';
import { AlertTriangle, Shield, AlertCircle, Ban, Activity, Flame, Droplet, Zap, Waves, Car, Info, Settings, Plus, Trash2, ChevronDown, Check, Upload, X, Image as ImageIcon } from 'lucide-react';
import { CategoryDropdown } from './CategoryDropdown';
import { EnhancedQRCodeSection } from './EnhancedQRCodeSection';

interface InputPanelProps {
  signageData: SignageData;
  onUpdate: (updates: Partial<SignageData>) => void;
}

const categoryOptions: { value: SignageCategory; label: string; color: string }[] = [
  { value: 'danger', label: 'Danger', color: '#D60000' },
  { value: 'warning', label: 'Warning', color: '#FFD600' },
  { value: 'caution', label: 'Caution', color: '#FF8C00' },
  { value: 'mandatory', label: 'Mandatory', color: '#005BBB' },
  { value: 'prohibition', label: 'Prohibition', color: '#D60000' },
  { value: 'emergency', label: 'Emergency', color: '#009E2A' },
  { value: 'fire', label: 'Fire Safety', color: '#D60000' },
  { value: 'chemical', label: 'Chemical Safety', color: '#FF8C00' },
  { value: 'electrical', label: 'Electrical Safety', color: '#FFD600' },
  { value: 'stp', label: 'STP / Wastewater', color: '#005BBB' },
  { value: 'traffic', label: 'Traffic / Road', color: '#D60000' },
  { value: 'informational', label: 'Informational', color: '#009E2A' },
  { value: 'custom', label: 'Custom Color', color: '#64748B' },
];

// PPE Options organized by work type
const ppeCategories = {
  general: [
    { value: 'hardhat', label: 'Hard Hat / Helmet', emoji: '🪖' },
    { value: 'safety-glasses', label: 'Safety Glasses', emoji: '🥽' },
    { value: 'hearing-protection', label: 'Ear Protection', emoji: '🔇' },
    { value: 'gloves', label: 'Safety Gloves', emoji: '🧤' },
    { value: 'safety-boots', label: 'Safety Boots', emoji: '👢' },
    { value: 'high-vis', label: 'Hi-Vis Vest', emoji: '🦺' },
    { value: 'respirator', label: 'Respirator Mask', emoji: '😷' },
    { value: 'harness', label: 'Safety Harness', emoji: '🪢' },
  ],
  electrical: [
    { value: 'arc-flash-suit', label: 'Arc Flash Suit', emoji: '🧥' },
    { value: 'insulated-gloves', label: 'Insulated Gloves', emoji: '🧤' },
    { value: 'voltage-detector', label: 'Voltage Detector', emoji: '⚡' },
    { value: 'insulated-boots', label: 'Insulated Boots', emoji: '👢' },
    { value: 'face-shield-electrical', label: 'Face Shield (Electrical)', emoji: '🛡️' },
    { value: 'arc-rated-clothing', label: 'Arc-Rated Clothing', emoji: '👕' },
    { value: 'electrical-safety-mat', label: 'Electrical Safety Mat', emoji: '📋' },
  ],
  confinedSpace: [
    { value: 'scba', label: 'SCBA (Self-Contained Breathing)', emoji: '🫁' },
    { value: 'gas-monitor', label: 'Gas Monitor/Detector', emoji: '📟' },
    { value: 'multi-gas-detector', label: 'Multi Gas Detector', emoji: '📟' },
    { value: 'retrieval-system', label: 'Retrieval System', emoji: '🔗' },
    { value: 'tripod', label: 'Rescue Tripod', emoji: '🏗️' },
    { value: 'lifeline', label: 'Lifeline/Rope', emoji: '🪢' },
    { value: 'ventilation-equipment', label: 'Ventilation Equipment', emoji: '💨' },
    { value: 'emergency-escape-respirator', label: 'Emergency Escape Respirator', emoji: '😷' },
    { value: 'full-body-harness-confined', label: 'Full Body Harness', emoji: '🎽' },
    { value: 'fire-extinguisher', label: 'Fire Extinguisher', emoji: '🧯' },
    { value: 'apron', label: 'Safety Apron', emoji: '👔' },
    { value: 'emergency-light', label: 'Emergency Light', emoji: '🔦' },
    { value: 'winch', label: 'Rescue Winch', emoji: '⚙️' },
  ],
  chemical: [
    { value: 'chemical-suit', label: 'Chemical Protective Suit', emoji: '🧑‍🔬' },
    { value: 'chemical-gloves', label: 'Chemical Resistant Gloves', emoji: '🧤' },
    { value: 'chemical-goggles', label: 'Chemical Goggles', emoji: '🥽' },
    { value: 'acid-resistant-boots', label: 'Acid Resistant Boots', emoji: '👢' },
    { value: 'face-shield-chemical', label: 'Face Shield (Chemical)', emoji: '🛡️' },
    { value: 'chemical-apron', label: 'Chemical Apron', emoji: '👔' },
    { value: 'full-face-respirator', label: 'Full Face Respirator', emoji: '😷' },
  ],
  heightWork: [
    { value: 'fall-arrest-system', label: 'Fall Arrest System', emoji: '⚓' },
    { value: 'lanyard', label: 'Safety Lanyard', emoji: '🔗' },
    { value: 'anchor-point', label: 'Anchor Point', emoji: '⚓' },
    { value: 'rope-grab', label: 'Rope Grab Device', emoji: '🪢' },
    { value: 'rescue-kit', label: 'Rescue Kit', emoji: '🆘' },
    { value: 'positioning-belt', label: 'Positioning Belt', emoji: '🎽' },
    { value: 'shock-absorber', label: 'Shock Absorber', emoji: '🔧' },
    { value: 'safety-harness-height', label: 'Safety Harness', emoji: '🪢' },
    { value: 'harness-belt', label: 'Harness Belt', emoji: '🎽' },
    { value: 'double-lanyard', label: 'Double Lanyard', emoji: '🔗' },
    { value: 'vertical-lifeline', label: 'Vertical Lifeline', emoji: '🪢' },
    { value: 'horizontal-lifeline', label: 'Horizontal Lifeline', emoji: '🪢' },
    { value: 'self-retracting-lifeline', label: 'Self-Retracting Lifeline', emoji: '🔗' },
  ],
  welding: [
    { value: 'welding-helmet', label: 'Welding Helmet', emoji: '🪖' },
    { value: 'welding-gloves', label: 'Welding Gloves', emoji: '🧤' },
    { value: 'welding-jacket', label: 'Welding Jacket', emoji: '🧥' },
    { value: 'welding-screen', label: 'Welding Screen', emoji: '🛡️' },
    { value: 'leather-apron', label: 'Leather Apron', emoji: '👔' },
    { value: 'welding-respirator', label: 'Welding Respirator', emoji: '😷' },
    { value: 'spats', label: 'Leather Spats', emoji: '👢' },
    { value: 'welding-goggles', label: 'Welding Goggles', emoji: '🥽' },
    { value: 'welding-face-shield', label: 'Welding Face Shield', emoji: '🛡️' },
  ],
  fire: [
    { value: 'fire-suit', label: 'Fire Resistant Suit', emoji: '🧑‍🚒' },
    { value: 'fire-helmet', label: 'Fire Helmet', emoji: '🪖' },
    { value: 'fire-boots', label: 'Fire Boots', emoji: '👢' },
    { value: 'fire-gloves', label: 'Fire Gloves', emoji: '🧤' },
    { value: 'fire-extinguisher', label: 'Fire Extinguisher', emoji: '🧯' },
    { value: 'fire-blanket', label: 'Fire Blanket', emoji: '🧣' },
    { value: 'smoke-hood', label: 'Smoke Hood', emoji: '🎭' },
  ],
  medical: [
    { value: 'surgical-mask', label: 'Surgical Mask', emoji: '😷' },
    { value: 'medical-gloves', label: 'Medical Gloves', emoji: '🧤' },
    { value: 'face-shield-medical', label: 'Face Shield (Medical)', emoji: '🛡️' },
    { value: 'gown', label: 'Medical Gown', emoji: '👔' },
    { value: 'scrubs', label: 'Scrubs', emoji: '👕' },
    { value: 'shoe-covers', label: 'Shoe Covers', emoji: '👟' },
    { value: 'hair-net', label: 'Hair Net', emoji: '🧢' },
  ],
  machinery: [
    { value: 'steel-toe-boots', label: 'Steel Toe Boots', emoji: '👢' },
    { value: 'cut-resistant-gloves', label: 'Cut Resistant Gloves', emoji: '🧤' },
    { value: 'bump-cap', label: 'Bump Cap', emoji: '🧢' },
    { value: 'knee-pads', label: 'Knee Pads', emoji: '🦵' },
    { value: 'back-support', label: 'Back Support Belt', emoji: '🎽' },
    { value: 'anti-vibration-gloves', label: 'Anti-Vibration Gloves', emoji: '🧤' },
    { value: 'metatarsal-guards', label: 'Metatarsal Guards', emoji: '🛡️' },
  ],
  foodSafety: [
    { value: 'food-safe-gloves', label: 'Food Safe Gloves', emoji: '🧤' },
    { value: 'beard-net', label: 'Beard Net', emoji: '🧔' },
    { value: 'white-coat', label: 'White Coat', emoji: '🥼' },
    { value: 'plastic-apron', label: 'Plastic Apron', emoji: '👔' },
    { value: 'food-safe-hairnet', label: 'Food Safe Hair Net', emoji: '🧢' },
  ],
  coldWork: [
    { value: 'insulated-jacket', label: 'Insulated Jacket', emoji: '🧥' },
    { value: 'thermal-gloves', label: 'Thermal Gloves', emoji: '🧤' },
    { value: 'cold-weather-boots', label: 'Cold Weather Boots', emoji: '👢' },
    { value: 'balaclava', label: 'Balaclava', emoji: '🎭' },
  ],
  hotWork: [
    { value: 'heat-resistant-gloves', label: 'Heat Resistant Gloves', emoji: '🧤' },
    { value: 'cooling-vest', label: 'Cooling Vest', emoji: '🦺' },
    { value: 'heat-shield-face', label: 'Heat Shield Face', emoji: '🛡️' },
    { value: 'aluminized-suit', label: 'Aluminized Suit', emoji: '🧑‍🚒' },
  ],
  radiation: [
    { value: 'lead-apron', label: 'Lead Apron', emoji: '🦺' },
    { value: 'dosimeter', label: 'Dosimeter Badge', emoji: '📛' },
    { value: 'radiation-badge', label: 'Radiation Badge', emoji: '🏷️' },
    { value: 'lead-gloves', label: 'Lead Gloves', emoji: '🧤' },
  ],
  eyeProtection: [
    { value: 'safety-goggles', label: 'Safety Goggles', emoji: '🥽' },
    { value: 'laser-safety-glasses', label: 'Laser Safety Glasses', emoji: '🕶️' },
    { value: 'tinted-glasses', label: 'Tinted Safety Glasses', emoji: '🕶️' },
    { value: 'prescription-safety-glasses', label: 'Prescription Safety Glasses', emoji: '👓' },
  ],
  handProtection: [
    { value: 'nitrile-gloves', label: 'Nitrile Gloves', emoji: '🧤' },
    { value: 'latex-gloves', label: 'Latex Gloves', emoji: '🧤' },
    { value: 'cotton-gloves', label: 'Cotton Gloves', emoji: '🧤' },
    { value: 'leather-gloves', label: 'Leather Gloves', emoji: '🧤' },
    { value: 'rubber-gloves', label: 'Rubber Gloves', emoji: '🧤' },
  ],
  footProtection: [
    { value: 'rubber-boots', label: 'Rubber Boots', emoji: '👢' },
    { value: 'anti-static-boots', label: 'Anti-Static Boots', emoji: '👢' },
    { value: 'wellington-boots', label: 'Wellington Boots', emoji: '👢' },
  ],
  respiratory: [
    { value: 'dust-mask', label: 'Dust Mask', emoji: '😷' },
    { value: 'half-face-respirator', label: 'Half-Face Respirator', emoji: '😷' },
    { value: 'powered-air-respirator', label: 'Powered Air Respirator', emoji: '😷' },
    { value: 'oxygen-supply', label: 'Oxygen Supply System', emoji: '🫁' },
  ],
  noise: [
    { value: 'ear-plugs', label: 'Ear Plugs', emoji: '👂' },
    { value: 'ear-muffs', label: 'Ear Muffs', emoji: '🔇' },
    { value: 'noise-canceling-headset', label: 'Noise Canceling Headset', emoji: '🎧' },
  ],
} as const;

// Flatten all PPE options for easy rendering
const allPPEOptions = Object.values(ppeCategories).flat();

export function InputPanel({ signageData, onUpdate }: InputPanelProps) {
  const [newProcedure, setNewProcedure] = useState('');
  const [newHazard, setNewHazard] = useState('');
  const [newContact, setNewContact] = useState({ label: '', number: '' });
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);

  const handlePPEToggle = (ppe: PPEType) => {
    const newPPE = signageData.ppe.includes(ppe)
      ? signageData.ppe.filter(p => p !== ppe)
      : [...signageData.ppe, ppe];
    onUpdate({ ppe: newPPE });
  };

  const handleCustomPPEUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = signageData.customPPEImages || [];
    const remainingSlots = 7 - currentImages.length;

    if (remainingSlots <= 0) {
      alert('Maximum 7 custom PPE images allowed');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdate({ 
          customPPEImages: [...(signageData.customPPEImages || []), { image: base64String, name: '' }] 
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCustomPPE = (index: number) => {
    const newImages = (signageData.customPPEImages || []).filter((_, i) => i !== index);
    onUpdate({ customPPEImages: newImages });
  };

  const updateCustomPPEName = (index: number, name: string) => {
    const newImages = [...(signageData.customPPEImages || [])];
    newImages[index] = { ...newImages[index], name };
    onUpdate({ customPPEImages: newImages });
  };

  // Keyboard support for image modal (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedImageIndex !== null) {
        setExpandedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImageIndex]);

  const handleWarningIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdate({ warningIcon: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdate({ backgroundImage: base64String });
    };
    reader.readAsDataURL(file);
  };

  const addProcedure = () => {
    if (newProcedure.trim()) {
      onUpdate({ procedures: [...signageData.procedures, newProcedure.trim()] });
      setNewProcedure('');
    }
  };

  const removeProcedure = (index: number) => {
    onUpdate({ procedures: signageData.procedures.filter((_, i) => i !== index) });
  };

  const addHazard = () => {
    if (newHazard.trim()) {
      onUpdate({ hazards: [...signageData.hazards, newHazard.trim()] });
      setNewHazard('');
    }
  };

  const removeHazard = (index: number) => {
    onUpdate({ hazards: signageData.hazards.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-900">Signage Configuration</h2>
        <span className="text-sm text-slate-500">Complete All Fields</span>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Signage Title / Name *
          </label>
          <input
            type="text"
            value={signageData.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g., INLET AREA - HIGH RISK ZONE"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Purpose / Description
          </label>
          <input
            type="text"
            value={signageData.purpose}
            onChange={(e) => onUpdate({ purpose: e.target.value })}
            placeholder="e.g., Confined Space Entry Control"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Selection with Colors */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Signage Category / Type *
          </label>
          <CategoryDropdown
            value={signageData.category}
            options={categoryOptions}
            onChange={(cat, color) => {
              onUpdate({ category: cat, customColor: color });
            }}
          />
          <p className="text-xs text-slate-500 mt-1">Background color comes from the selected category</p>
        </div>

        {/* Background Image (Optional) */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Background Image (Optional)
          </label>
          {signageData.backgroundImage ? (
            <div className="relative">
              <img 
                src={signageData.backgroundImage} 
                alt="Background" 
                className="w-full h-32 object-cover rounded-lg border border-slate-300"
              />
              <button
                onClick={() => onUpdate({ backgroundImage: null })}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-500 mt-1">Background image will replace the category background color</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600">Click to upload background image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Custom Color Picker */}
        {signageData.category === 'custom' && (
          <div>
            <label className="block text-sm text-slate-700 mb-2">
              Custom Color - Click to Select
            </label>
            
            {/* Color Palette Grid - Like Painting Apps */}
            <div className="bg-white border border-slate-300 rounded-lg p-4 mb-3">
              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                🎨 <span>Popular Safety Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {/* Safety Red Shades */}
                {['#D60000', '#FF0000', '#C41E3A', '#E32636', '#B22222', '#8B0000', '#DC143C', '#A52A2A'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                ⚠️ <span>Warning & Caution Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {/* Yellow/Orange Shades */}
                {['#FFD700', '#FFA500', '#FF8C00', '#FF6600', '#FFCC00', '#F39C12', '#E67E22', '#D68910'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                🟢 <span>Safe & Emergency Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {/* Green Shades */}
                {['#00A86B', '#228B22', '#008000', '#006400', '#2E8B57', '#3CB371', '#00FF00', '#32CD32'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                🔵 <span>Mandatory & Information Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {/* Blue Shades */}
                {['#0066CC', '#0051A5', '#003DA5', '#1E90FF', '#0000FF', '#000080', '#4169E1', '#6495ED'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                🟣 <span>Chemical & Radiation Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {/* Purple/Magenta Shades */}
                {['#800080', '#9932CC', '#8B008B', '#9400D3', '#FF00FF', '#DA70D6', '#BA55D3', '#663399'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                ⚫ <span>Neutral & Dark Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {/* Black/Gray Shades */}
                {['#000000', '#2C3E50', '#34495E', '#555555', '#708090', '#808080', '#A9A9A9', '#C0C0C0'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                🟤 <span>Earth & Industrial Colors</span>
              </p>
              <div className="grid grid-cols-8 gap-2">
                {/* Brown/Earth Shades */}
                {['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B', '#DAA520', '#BDB76B', '#F4A460'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdate({ customColor: color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      signageData.customColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Picker & Hex Input */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <p className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                🎨 <span>Custom Color Picker</span>
              </p>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <input
                    type="color"
                    value={signageData.customColor}
                    onChange={(e) => onUpdate({ customColor: e.target.value })}
                    className="w-16 h-16 rounded-lg border-2 border-slate-300 cursor-pointer"
                    title="Click to open color picker"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white border-2 border-slate-300 rounded-full p-1">
                    <span className="text-xs">🎨</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-600 mb-1 block">Hex Color Code:</label>
                  <input
                    type="text"
                    value={signageData.customColor}
                    onChange={(e) => onUpdate({ customColor: e.target.value })}
                    placeholder="#D60000"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
              </div>

              {/* Selected Color Preview */}
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-slate-300"
                    style={{ backgroundColor: signageData.customColor }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-600">Selected Color:</p>
                    <p className="font-mono text-sm text-slate-900">{signageData.customColor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Description */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Additional Description
          </label>
          <textarea
            value={signageData.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Enter detailed description..."
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Location / Area
          </label>
          <input
            type="text"
            value={signageData.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="e.g., Building A - Floor 2"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Warning Icon (Optional) */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Warning Icon (Optional)
          </label>
          {signageData.warningIcon ? (
            <div className="relative">
              <img 
                src={signageData.warningIcon} 
                alt="Warning Icon" 
                className="w-24 h-24 object-contain mx-auto rounded-lg border border-slate-300 bg-white p-2"
              />
              <button
                onClick={() => onUpdate({ warningIcon: null })}
                className="absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full -mr-2 -mt-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <AlertTriangle className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600">Click to upload warning icon</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleWarningIconUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Hazards / Warnings - Dynamic List */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Hazards / Warnings
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newHazard}
              onChange={(e) => setNewHazard(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHazard()}
              placeholder="Add hazard (e.g., H₂S Gas Present)"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={addHazard}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {signageData.hazards.map((hazard, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1 text-sm text-slate-800">{hazard}</div>
                <button onClick={() => removeHazard(index)} className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PPE Selection - Categorized */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            PPE Required (Multi-Select) - {signageData.ppe.length} Selected
          </label>
          
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            {/* General PPE */}
            <details className="group" open>
              <summary className="px-4 py-3 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">⚙️ General PPE ({ppeCategories.general.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.general.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Electrical Work PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-yellow-50 hover:bg-yellow-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">⚡ Electrical Work PPE ({ppeCategories.electrical.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.electrical.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Confined Space PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-purple-50 hover:bg-purple-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🫁 Confined Space PPE ({ppeCategories.confinedSpace.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.confinedSpace.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Chemical Work PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-orange-50 hover:bg-orange-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🧪 Chemical Work PPE ({ppeCategories.chemical.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.chemical.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Height Work PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-red-50 hover:bg-red-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🪂 Height Work PPE ({ppeCategories.heightWork.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.heightWork.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Welding PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-amber-50 hover:bg-amber-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🔥 Welding PPE ({ppeCategories.welding.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.welding.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Fire Safety PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-red-50 hover:bg-red-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🧯 Fire Safety PPE ({ppeCategories.fire.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.fire.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Medical/Healthcare PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-green-50 hover:bg-green-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🏥 Medical/Healthcare PPE ({ppeCategories.medical.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.medical.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Heavy Machinery PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-slate-100 hover:bg-slate-200 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🏗️ Heavy Machinery PPE ({ppeCategories.machinery.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.machinery.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Food Safety PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🍽️ Food Safety PPE ({ppeCategories.foodSafety.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.foodSafety.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Cold Work PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-cyan-50 hover:bg-cyan-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">❄️ Cold Work PPE ({ppeCategories.coldWork.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.coldWork.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Hot Work PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-red-50 hover:bg-red-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🔥 Hot Work PPE ({ppeCategories.hotWork.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.hotWork.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Radiation PPE */}
            <details className="group">
              <summary className="px-4 py-3 bg-yellow-50 hover:bg-yellow-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">☢️ Radiation PPE ({ppeCategories.radiation.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.radiation.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Noise Protection */}
            <details className="group">
              <summary className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🔊 Noise Protection ({ppeCategories.noise.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.noise.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Eye Protection */}
            <details className="group">
              <summary className="px-4 py-3 bg-pink-50 hover:bg-pink-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">👁️ Eye Protection ({ppeCategories.eyeProtection.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.eyeProtection.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Hand Protection */}
            <details className="group">
              <summary className="px-4 py-3 bg-teal-50 hover:bg-teal-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">🖐️ Hand Protection ({ppeCategories.handProtection.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.handProtection.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Foot Protection */}
            <details className="group">
              <summary className="px-4 py-3 bg-stone-50 hover:bg-stone-100 cursor-pointer flex items-center justify-between border-b border-slate-200">
                <span className="text-sm text-slate-900">👢 Foot Protection ({ppeCategories.footProtection.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.footProtection.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>

            {/* Respiratory Protection */}
            <details className="group">
              <summary className="px-4 py-3 bg-sky-50 hover:bg-sky-100 cursor-pointer flex items-center justify-between">
                <span className="text-sm text-slate-900">😷 Respiratory Protection ({ppeCategories.respiratory.length} items)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                {ppeCategories.respiratory.map((option) => {
                  const isSelected = signageData.ppe.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handlePPEToggle(option.value)}
                      className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </details>
          </div>

          {/* Selected PPE Summary */}
          {signageData.ppe.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 mb-2">✅ Selected PPE ({signageData.ppe.length}):</p>
              <div className="flex flex-wrap gap-1">
                {signageData.ppe.map((ppeValue) => {
                  const ppeItem = allPPEOptions.find(opt => opt.value === ppeValue);
                  return ppeItem ? (
                    <span key={ppeValue} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs flex items-center gap-1">
                      <span>{ppeItem.emoji}</span>
                      <span>{ppeItem.label}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Custom PPE Upload Section */}
          <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm text-purple-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Upload Custom PPE Images
                </h4>
                <p className="text-xs text-purple-700 mt-1">
                  Add your own PPE images (up to 7 images, max 5MB each)
                </p>
              </div>
              <span className="text-sm text-purple-900 px-3 py-1 bg-purple-100 rounded-full">
                {(signageData.customPPEImages || []).length}/7
              </span>
            </div>

            {/* Upload Button */}
            {(signageData.customPPEImages || []).length < 7 && (
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Browse & Upload PPE Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCustomPPEUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Uploaded Images Preview */}
            {(signageData.customPPEImages || []).length > 0 && (
              <div className="mt-3 space-y-3">
                {(signageData.customPPEImages || []).map((ppe, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border-2 border-purple-200">
                    <div className="relative group w-36 h-36 bg-slate-50 rounded-lg overflow-hidden border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-purple-500 transition-all">
                      <img
                        src={ppe.image}
                        alt={`Custom PPE ${index + 1}`}
                        className="w-full h-full object-contain hover:scale-110 transition-transform"
                        onClick={() => setExpandedImageIndex(index)}
                        title="Click to view full size"
                      />
                      <button
                        onClick={() => removeCustomPPE(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        Click to enlarge
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-700 mb-1">
                        PPE Name #{index + 1}
                      </label>
                      <input
                        type="text"
                        value={ppe.name}
                        onChange={(e) => updateCustomPPEName(index, e.target.value)}
                        placeholder={`e.g., Safety Goggles, Fire Blanket`}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        This name will appear below the PPE icon
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Image Expansion Modal */}
            {expandedImageIndex !== null && (
              <div 
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={() => setExpandedImageIndex(null)}
              >
                <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
                  {/* Close button */}
                  <button
                    onClick={() => setExpandedImageIndex(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg z-10"
                    title="Close (Esc)"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  {/* Escape key hint */}
                  <div className="absolute top-4 left-4 bg-white/90 text-slate-800 text-xs px-3 py-2 rounded-lg shadow-lg z-10 flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-slate-200 rounded border border-slate-300 text-xs">Esc</kbd>
                    <span>to close</span>
                  </div>
                  
                  <img
                    src={(signageData.customPPEImages || [])[expandedImageIndex]?.image}
                    alt={`Custom PPE ${expandedImageIndex + 1} - Full Size`}
                    className="w-full h-full object-contain max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-center">
                      {(signageData.customPPEImages || [])[expandedImageIndex]?.name || `Custom PPE ${expandedImageIndex + 1}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Message */}
            <div className="mt-3 flex items-start gap-2 p-2 bg-purple-100 rounded-lg">
              <Info className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-800">
                These custom PPE images will appear in your signage along with the standard PPE icons selected above.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Procedures - Dynamic List */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Safety Procedures
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newProcedure}
              onChange={(e) => setNewProcedure(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProcedure()}
              placeholder="Add procedure (e.g., Gas test required)"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={addProcedure}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {signageData.procedures.map((procedure, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                  {index + 1}
                </div>
                <span className="flex-1 text-sm text-slate-800">{procedure}</span>
                <button onClick={() => removeProcedure(index)} className="text-green-600 hover:text-green-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Permit Required */}
        <div>
          <label className="block text-sm text-slate-700 mb-3">
            Permit Required
          </label>
          <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg bg-white">
            <span className="text-slate-900">Permit Required</span>
            <button
              onClick={() => onUpdate({ permitRequired: signageData.permitRequired === 'yes' ? 'no' : 'yes' })}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                signageData.permitRequired === 'yes' ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  signageData.permitRequired === 'yes' ? 'translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          
          {/* Permit Details - Only show when enabled */}
          {signageData.permitRequired === 'yes' && (
            <div className="mt-3">
              <input
                type="text"
                value={signageData.permitDetails}
                onChange={(e) => onUpdate({ permitDetails: e.target.value })}
                placeholder="e.g., Electrical Work Permit - Category 3"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Emergency Contacts
          </label>
          <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <span className="text-sm text-slate-600 sm:w-32">Emergency:</span>
              <input
                type="text"
                value={signageData.emergencyContacts[0]?.number || ''}
                onChange={(e) => {
                  const contacts = [...signageData.emergencyContacts];
                  contacts[0] = { label: 'Emergency', number: e.target.value };
                  onUpdate({ emergencyContacts: contacts });
                }}
                placeholder="911"
                className="w-full flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <span className="text-sm text-slate-600 sm:w-32">Safety Officer:</span>
              <input
                type="text"
                value={signageData.emergencyContacts[1]?.number || ''}
                onChange={(e) => {
                  const contacts = [...signageData.emergencyContacts];
                  contacts[1] = { label: 'Safety Officer', number: e.target.value };
                  onUpdate({ emergencyContacts: contacts });
                }}
                placeholder="+1 (555) 123-4567"
                className="w-full flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              />
            </div>
            
            {/* Additional contacts */}
            {signageData.emergencyContacts.slice(2).map((contact, index) => (
              <div key={index + 2} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 bg-white rounded border border-slate-200">
                <span className="text-sm text-slate-600 sm:w-32">{contact.label}:</span>
                <input
                  type="text"
                  value={contact.number}
                  onChange={(e) => {
                    const contacts = [...signageData.emergencyContacts];
                    contacts[index + 2] = { ...contact, number: e.target.value };
                    onUpdate({ emergencyContacts: contacts });
                  }}
                  className="w-full flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => {
                    const contacts = signageData.emergencyContacts.filter((_, i) => i !== index + 2);
                    onUpdate({ emergencyContacts: contacts });
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs w-full sm:w-auto"
                >
                  Remove
                </button>
              </div>
            ))}
            
            {/* Add new contact */}
            <div className="pt-2 border-t border-slate-300">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm text-slate-600 sm:w-32">Add Contact:</span>
                  <input
                    type="text"
                    value={newContact.label}
                    onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                    placeholder="Label (e.g., Fire Dept)"
                    className="w-full flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newContact.number}
                    onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
                    placeholder="Phone Number"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                  <button
                    onClick={() => {
                      if (newContact.label && newContact.number) {
                        onUpdate({ emergencyContacts: [...signageData.emergencyContacts, newContact] });
                        setNewContact({ label: '', number: '' });
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced QR Code Section */}
        <EnhancedQRCodeSection 
          signageData={signageData} 
          onUpdate={onUpdate}
        />

        {/* Footer Text */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Footer Text
          </label>
          <input
            type="text"
            value={signageData.footerText || 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually'}
            onChange={(e) => onUpdate({ footerText: e.target.value })}
            placeholder="ISO 7010 Compliant • Last Updated: December 2025 • Review Annually"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">This text will appear at the bottom of the signage</p>
        </div>

        {/* Select Size - Dropdown */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Select Size
          </label>
          <div className="relative">
            <select
              value={signageData.size}
              onChange={(e) => {
                const size = e.target.value as 'a3' | 'a4' | 'a5' | 'custom';
                if (size === 'a3') onUpdate({ size, customWidth: 297, customHeight: 420 });
                else if (size === 'a4') onUpdate({ size, customWidth: 210, customHeight: 297 });
                else if (size === 'a5') onUpdate({ size, customWidth: 148, customHeight: 210 });
                else onUpdate({ size });
              }}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="a3">A3 (297×420 mm)</option>
              <option value="a4">A4 (210×297 mm)</option>
              <option value="a5">A5 (148×210 mm)</option>
              <option value="custom">Custom Size</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
          {signageData.size === 'custom' && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Width (mm)</label>
                <input
                  type="number"
                  value={signageData.customWidth}
                  onChange={(e) => onUpdate({ customWidth: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Height (mm)</label>
                <input
                  type="number"
                  value={signageData.customHeight}
                  onChange={(e) => onUpdate({ customHeight: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resolution - Dropdown */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Resolution
          </label>
          <div className="relative">
            <select
              value={signageData.resolution}
              onChange={(e) => onUpdate({ resolution: e.target.value as '72dpi' | '300dpi' })}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="300dpi">Print Quality (300 DPI)</option>
              <option value="72dpi">Screen Quality (72 DPI)</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}