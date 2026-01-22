export type SignageCategory = 
  | 'danger'
  | 'warning'
  | 'caution'
  | 'mandatory'
  | 'prohibition'
  | 'emergency'
  | 'fire'
  | 'chemical'
  | 'electrical'
  | 'stp'
  | 'traffic'
  | 'informational'
  | 'custom';

export type PPEType = 
  // General PPE
  | 'hardhat'
  | 'safety-glasses'
  | 'hearing-protection'
  | 'gloves'
  | 'safety-boots'
  | 'high-vis'
  | 'respirator'
  | 'harness'
  
  // Electrical Work PPE
  | 'arc-flash-suit'
  | 'insulated-gloves'
  | 'voltage-detector'
  | 'insulated-boots'
  | 'face-shield-electrical'
  | 'arc-rated-clothing'
  | 'electrical-safety-mat'
  
  // Confined Space PPE
  | 'scba'
  | 'gas-monitor'
  | 'multi-gas-detector'
  | 'retrieval-system'
  | 'tripod'
  | 'lifeline'
  | 'ventilation-equipment'
  | 'emergency-escape-respirator'
  | 'full-body-harness-confined'
  | 'fire-extinguisher'
  | 'apron'
  | 'emergency-light'
  | 'winch'
  
  // Chemical Work PPE
  | 'chemical-suit'
  | 'chemical-gloves'
  | 'chemical-goggles'
  | 'acid-resistant-boots'
  | 'face-shield-chemical'
  | 'chemical-apron'
  | 'full-face-respirator'
  
  // Height Work PPE
  | 'fall-arrest-system'
  | 'lanyard'
  | 'anchor-point'
  | 'rope-grab'
  | 'rescue-kit'
  | 'positioning-belt'
  | 'shock-absorber'
  | 'safety-harness-height'
  | 'harness-belt'
  | 'double-lanyard'
  | 'vertical-lifeline'
  | 'horizontal-lifeline'
  | 'self-retracting-lifeline'
  
  // Welding PPE
  | 'welding-helmet'
  | 'welding-gloves'
  | 'welding-jacket'
  | 'welding-screen'
  | 'leather-apron'
  | 'welding-goggles'
  | 'welding-face-shield'
  
  // Fire Safety PPE
  | 'fire-suit'
  | 'fire-helmet'
  | 'fire-boots'
  | 'fire-gloves'
  | 'fire-extinguisher'
  | 'fire-blanket'
  | 'smoke-hood'
  
  // Medical/Healthcare PPE
  | 'surgical-mask'
  | 'medical-gloves'
  | 'face-shield-medical'
  | 'gown'
  | 'scrubs'
  | 'shoe-covers'
  | 'hair-net'
  
  // Heavy Machinery PPE
  | 'steel-toe-boots'
  | 'cut-resistant-gloves'
  | 'bump-cap'
  | 'knee-pads'
  | 'back-support'
  | 'anti-vibration-gloves'
  | 'metatarsal-guards'
  
  // Food Safety PPE
  | 'food-safe-gloves'
  | 'beard-net'
  | 'white-coat'
  | 'plastic-apron'
  | 'food-safe-hairnet'
  
  // Cold Work PPE
  | 'insulated-jacket'
  | 'thermal-gloves'
  | 'cold-weather-boots'
  | 'balaclava'
  
  // Hot Work PPE
  | 'heat-resistant-gloves'
  | 'cooling-vest'
  | 'heat-shield-face'
  | 'aluminized-suit'
  
  // Radiation PPE
  | 'lead-apron'
  | 'dosimeter'
  | 'radiation-badge'
  | 'lead-gloves'
  
  // Noise Protection
  | 'ear-plugs'
  | 'ear-muffs'
  | 'noise-canceling-headset'
  
  // Eye Protection
  | 'safety-goggles'
  | 'laser-safety-glasses'
  | 'tinted-glasses'
  | 'prescription-safety-glasses'
  
  // Hand Protection
  | 'nitrile-gloves'
  | 'latex-gloves'
  | 'cotton-gloves'
  | 'leather-gloves'
  | 'rubber-gloves'
  
  // Foot Protection
  | 'rubber-boots'
  | 'anti-static-boots'
  | 'wellington-boots'
  
  // Respiratory Protection
  | 'dust-mask'
  | 'half-face-respirator'
  | 'powered-air-respirator'
  | 'oxygen-supply';

export type SizeType = 'a3' | 'a4' | 'custom';
export type ResolutionType = '72dpi' | '300dpi';
export type PermitRequiredType = 'yes' | 'no';

export interface AuthorizedPerson {
  id: string;
  shift: string;
  name: string;
  designation: string;
  employeeId: string;
  department: string;
  contact: string;
  certifications: string;
  validFrom: string;
  validUntil: string;
  photo: string; // Base64 or URL
  format: 'badge' | 'paper'; // Badge to wear or paper signage
  category: SignageCategory; // Color category
  paperSize?: 'a4' | 'a3' | 'letter' | 'legal'; // Paper size (only for paper format)
  orientation?: 'landscape' | 'portrait'; // Orientation (only for paper format)
  backgroundColor?: string; // Background color for the person's card
}

export interface EmergencyContact {
  label: string;
  number: string;
}

export interface CustomPPE {
  image: string; // Base64 encoded image
  name: string;  // Custom name for the PPE
}

export interface QRCodeContentBox {
  id: string;
  url: string;
  title?: string;
}

export type QRCodeType = 'generate' | 'existing';
export type QRCodeSource = 'custom' | 'authorizedPerson' | 'organizationChart' | 'safetyCommittee';

export interface QRCodeConfig {
  type: QRCodeType;
  sources: QRCodeSource[];
  selectedAuthorizedPersonId?: string; // Legacy support - single person
  selectedAuthorizedPersonIds?: string[]; // Multiple persons support
  selectedOrganizationChartId?: string; // Legacy support - single chart
  selectedOrganizationChartIds?: string[]; // Multiple charts support
  selectedSafetyCommitteeId?: string; // Legacy support - single committee
  selectedSafetyCommitteeIds?: string[]; // Multiple committees support
  contentBoxes: QRCodeContentBox[];
  legacyUrl?: string; // Single URL (legacy mode)
  showOnlyTitleAndQR?: boolean;
  existingQRCodeImage?: string; // Base64 image when using existing QR code
}

export interface SignageData {
  title: string;
  purpose: string;
  description: string;
  category: SignageCategory;
  customColor: string;
  location: string;
  hazards: string[];
  ppe: PPEType[];
  customPPEImages: CustomPPE[]; // Custom PPE with images and names (max 7)
  procedures: string[];
  permitRequired: PermitRequiredType;
  permitDetails: string;
  emergencyContacts: EmergencyContact[];
  authorizedPersons: AuthorizedPerson[];
  qrCode: string; // Legacy - kept for backward compatibility
  qrCodeConfig?: QRCodeConfig; // New enhanced QR code configuration
  size: SizeType;
  customWidth: number;
  customHeight: number;
  resolution: ResolutionType;
  warningIcon?: string | null; // Optional warning icon (image URL or base64)
  backgroundImage?: string | null; // Optional background image (image URL or base64)
  footerText?: string; // Footer text (editable)
  titleColor?: string; // Title text color (default: white)
}

export interface CategoryConfig {
  name: string;
  color: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
}