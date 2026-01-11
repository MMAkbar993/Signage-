import { useState, useRef } from 'react';
import { Download, Upload, Droplet, Zap, Settings, Warehouse, Wind, Filter, Trash2, Fuel, Building2, Package, Wrench, Home, Activity, FlaskConical, Plug2, Image as ImageIcon, Maximize2, Move, RotateCw, X, RotateCcw, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface IdentificationData {
  areaName: string;
  icon: string;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
  showHeader: boolean;
  headerText: string;
  showFooter: boolean;
  footerText: string;
  showImage: boolean;
  uploadedImage: string;
  imagePosition: 'top' | 'center' | 'bottom' | 'background';
  imageSize: number;
  imageOpacity: number;
  fontSize: number;
  iconSize: number;
  paperSize: 'a4' | 'a5' | 'a3' | 'letter' | 'square';
  orientation: 'landscape' | 'portrait';
  borderRadius: number;
  showBorder: boolean;
  borderColor: string;
  borderWidth: number;
  iconPosition: { x: number; y: number };
  textPosition: { x: number; y: number };
}

interface ColorfulTemplate {
  name: string;
  areaName: string;
  icon: string;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
  imageUrl: string;
  description: string;
}

const ICON_OPTIONS = [
  { id: 'droplet', name: 'Water/Liquid', component: Droplet },
  { id: 'zap', name: 'Electrical', component: Zap },
  { id: 'settings', name: 'Mechanical', component: Settings },
  { id: 'warehouse', name: 'Storage', component: Warehouse },
  { id: 'wind', name: 'Ventilation', component: Wind },
  { id: 'filter', name: 'Filter', component: Filter },
  { id: 'trash', name: 'Waste', component: Trash2 },
  { id: 'fuel', name: 'Generator', component: Fuel },
  { id: 'building', name: 'Building', component: Building2 },
  { id: 'package', name: 'Package', component: Package },
  { id: 'wrench', name: 'Workshop', component: Wrench },
  { id: 'home', name: 'Office', component: Home },
  { id: 'activity', name: 'Control', component: Activity },
  { id: 'flask', name: 'Chemical', component: FlaskConical },
  { id: 'plug', name: 'Power', component: Plug2 }
];

const COLORFUL_TEMPLATES: ColorfulTemplate[] = [
  {
    name: 'Water Treatment',
    areaName: 'INLET AREA',
    icon: 'droplet',
    bgColor: '#0EA5E9',
    textColor: '#FFFFFF',
    iconBgColor: '#0284C7',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Water treatment facility entrance'
  },
  {
    name: 'Electrical Panel',
    areaName: 'PANEL ROOM',
    icon: 'zap',
    bgColor: '#F59E0B',
    textColor: '#FFFFFF',
    iconBgColor: '#D97706',
    imageUrl: 'https://images.unsplash.com/photo-1745169921021-3304a3eed8ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Electrical control panel area'
  },
  {
    name: 'Generator',
    areaName: 'GENERATOR ROOM',
    icon: 'fuel',
    bgColor: '#EF4444',
    textColor: '#FFFFFF',
    iconBgColor: '#DC2626',
    imageUrl: 'https://images.unsplash.com/photo-1558054665-fbe00cd7d920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Emergency generator facility'
  },
  {
    name: 'Chemical Storage',
    areaName: 'CHEMICAL STORE',
    icon: 'flask',
    bgColor: '#8B5CF6',
    textColor: '#FFFFFF',
    iconBgColor: '#7C3AED',
    imageUrl: 'https://images.unsplash.com/photo-1585830150304-38e0aea8ec05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Chemical storage facility'
  },
  {
    name: 'Control Room',
    areaName: 'CONTROL ROOM',
    icon: 'activity',
    bgColor: '#10B981',
    textColor: '#FFFFFF',
    iconBgColor: '#059669',
    imageUrl: 'https://images.unsplash.com/photo-1738918937796-743064feefa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Central control and monitoring'
  },
  {
    name: 'Workshop',
    areaName: 'WORKSHOP',
    icon: 'wrench',
    bgColor: '#6366F1',
    textColor: '#FFFFFF',
    iconBgColor: '#4F46E5',
    imageUrl: 'https://images.unsplash.com/photo-1522832712787-3fbd36c9fe2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Maintenance and repair area'
  },
  {
    name: 'Aeration Tank',
    areaName: 'AERATION TANK',
    icon: 'wind',
    bgColor: '#14B8A6',
    textColor: '#FFFFFF',
    iconBgColor: '#0D9488',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Biological treatment area'
  },
  {
    name: 'Pump Room',
    areaName: 'RAS/WAS PUMP ROOM',
    icon: 'settings',
    bgColor: '#0057B7',
    textColor: '#FFFFFF',
    iconBgColor: '#004494',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Return/waste activated sludge'
  },
  {
    name: 'Clarifier',
    areaName: 'CLARIFIER AREA',
    icon: 'droplet',
    bgColor: '#0891B2',
    textColor: '#FFFFFF',
    iconBgColor: '#0E7490',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Sedimentation tank area'
  },
  {
    name: 'Transformer',
    areaName: 'TRANSFORMER ROOM',
    icon: 'plug',
    bgColor: '#F97316',
    textColor: '#FFFFFF',
    iconBgColor: '#EA580C',
    imageUrl: 'https://images.unsplash.com/photo-1745169921021-3304a3eed8ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Power transformation unit'
  },
  {
    name: 'Sand Filter',
    areaName: 'SAND FILTER ROOM',
    icon: 'filter',
    bgColor: '#EC4899',
    textColor: '#FFFFFF',
    iconBgColor: '#DB2777',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Filtration system area'
  },
  {
    name: 'Sludge Area',
    areaName: 'SLUDGE AREA',
    icon: 'trash',
    bgColor: '#64748B',
    textColor: '#FFFFFF',
    iconBgColor: '#475569',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Sludge processing zone'
  },
  {
    name: 'Chlorine Room',
    areaName: 'CHLORINE ROOM',
    icon: 'flask',
    bgColor: '#84CC16',
    textColor: '#FFFFFF',
    iconBgColor: '#65A30D',
    imageUrl: 'https://images.unsplash.com/photo-1585830150304-38e0aea8ec05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Disinfection chemical storage'
  },
  {
    name: 'Admin Office',
    areaName: 'ADMIN OFFICE',
    icon: 'home',
    bgColor: '#06B6D4',
    textColor: '#FFFFFF',
    iconBgColor: '#0891B2',
    imageUrl: 'https://images.unsplash.com/photo-1522832712787-3fbd36c9fe2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Administrative office space'
  },
  {
    name: 'Store Room',
    areaName: 'STORE ROOM',
    icon: 'warehouse',
    bgColor: '#A855F7',
    textColor: '#FFFFFF',
    iconBgColor: '#9333EA',
    imageUrl: 'https://images.unsplash.com/photo-1585830150304-38e0aea8ec05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Equipment and materials storage'
  },
  {
    name: 'Wet Well',
    areaName: 'WET WELL',
    icon: 'droplet',
    bgColor: '#3B82F6',
    textColor: '#FFFFFF',
    iconBgColor: '#2563EB',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Wastewater collection point'
  },
  {
    name: 'Belt Press',
    areaName: 'BELT PRESS AREA',
    icon: 'settings',
    bgColor: '#F43F5E',
    textColor: '#FFFFFF',
    iconBgColor: '#E11D48',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Sludge dewatering equipment'
  },
  {
    name: 'Chlorine Panel',
    areaName: 'CHLORINE PANEL ROOM',
    icon: 'zap',
    bgColor: '#22C55E',
    textColor: '#FFFFFF',
    iconBgColor: '#16A34A',
    imageUrl: 'https://images.unsplash.com/photo-1745169921021-3304a3eed8ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Chlorination control panel'
  },
  {
    name: 'Chlorine Pump',
    areaName: 'CHLORINE PUMP ROOM',
    icon: 'settings',
    bgColor: '#FACC15',
    textColor: '#1F2937',
    iconBgColor: '#EAB308',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Chlorine dosing pumps'
  },
  {
    name: 'Backwash Pump',
    areaName: 'BACKWASH WASTE PUMP',
    icon: 'droplet',
    bgColor: '#14B8A6',
    textColor: '#FFFFFF',
    iconBgColor: '#0D9488',
    imageUrl: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Filter backwash system'
  }
];

export function IdentificationSignage() {
  const [data, setData] = useState<IdentificationData>({
    areaName: 'INLET AREA',
    icon: 'droplet',
    bgColor: '#0EA5E9',
    textColor: '#FFFFFF',
    iconBgColor: '#0284C7',
    showHeader: true,
    headerText: 'AREA IDENTIFICATION',
    showFooter: true,
    footerText: 'Authorized Personnel Only',
    showImage: true,
    uploadedImage: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    imagePosition: 'background',
    imageSize: 200,
    imageOpacity: 30,
    fontSize: 48,
    iconSize: 80,
    paperSize: 'a4',
    orientation: 'landscape',
    borderRadius: 12,
    showBorder: true,
    borderColor: '#FFFFFF',
    borderWidth: 4,
    iconPosition: { x: 0, y: 0 },
    textPosition: { x: 0, y: 0 }
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const paperDimensions = {
    a5: { landscape: { width: 210, height: 148 }, portrait: { width: 148, height: 210 } },
    a4: { landscape: { width: 297, height: 210 }, portrait: { width: 210, height: 297 } },
    a3: { landscape: { width: 420, height: 297 }, portrait: { width: 297, height: 420 } },
    letter: { landscape: { width: 279, height: 216 }, portrait: { width: 216, height: 279 } },
    square: { landscape: { width: 210, height: 210 }, portrait: { width: 210, height: 210 } }
  };

  const dims = paperDimensions[data.paperSize][data.orientation];
  const mmToPixel = 3.7795275591;
  const pageWidth = dims.width * mmToPixel;
  const pageHeight = dims.height * mmToPixel;
  const scale = 0.35;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setData({ ...data, uploadedImage: event.target?.result as string, showImage: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (template: ColorfulTemplate) => {
    setData({
      ...data,
      areaName: template.areaName,
      icon: template.icon,
      bgColor: template.bgColor,
      textColor: template.textColor,
      iconBgColor: template.iconBgColor,
      uploadedImage: template.imageUrl,
      showImage: true,
      imagePosition: 'background'
    });
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;

    const element = previewRef.current;
    
    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Function to convert oklch/computed colors to hex
    const convertComputedStylesToInline = (el: HTMLElement, original: HTMLElement) => {
      const computed = window.getComputedStyle(original);
      
      // Override all color-related properties with computed values
      el.style.color = computed.color;
      el.style.backgroundColor = computed.backgroundColor;
      el.style.borderColor = computed.borderColor;
      el.style.borderTopColor = computed.borderTopColor;
      el.style.borderRightColor = computed.borderRightColor;
      el.style.borderBottomColor = computed.borderBottomColor;
      el.style.borderLeftColor = computed.borderLeftColor;
      
      // Remove all classes to prevent CSS interference
      el.className = '';
      
      // Process children recursively
      Array.from(el.children).forEach((child, index) => {
        if (child instanceof HTMLElement && original.children[index] instanceof HTMLElement) {
          convertComputedStylesToInline(child, original.children[index] as HTMLElement);
        }
      });
    };
    
    convertComputedStylesToInline(clone, element);
    
    // Position off-screen
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: data.bgColor,
        allowTaint: true,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Convert all colors to standard RGB format
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            const computedStyle = window.getComputedStyle(element);
            
            // Browser automatically converts oklch to rgb in computed styles
            if (computedStyle.color) {
              element.style.color = computedStyle.color;
            }
            if (computedStyle.backgroundColor) {
              element.style.backgroundColor = computedStyle.backgroundColor;
            }
            if (computedStyle.borderColor) {
              element.style.borderColor = computedStyle.borderColor;
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: data.orientation,
        unit: 'mm',
        format: data.paperSize === 'letter' ? [216, 279] : data.paperSize === 'square' ? [210, 210] : data.paperSize
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`identification-${data.areaName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
      toast.success('PDF exported successfully!');
    } finally {
      document.body.removeChild(clone);
    }
  };

  const exportToPNG = async () => {
    if (!previewRef.current) return;

    const element = previewRef.current;
    
    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Function to convert oklch/computed colors to hex
    const convertComputedStylesToInline = (el: HTMLElement, original: HTMLElement) => {
      const computed = window.getComputedStyle(original);
      
      // Override all color-related properties with computed values
      el.style.color = computed.color;
      el.style.backgroundColor = computed.backgroundColor;
      el.style.borderColor = computed.borderColor;
      el.style.borderTopColor = computed.borderTopColor;
      el.style.borderRightColor = computed.borderRightColor;
      el.style.borderBottomColor = computed.borderBottomColor;
      el.style.borderLeftColor = computed.borderLeftColor;
      
      // Remove all classes to prevent CSS interference
      el.className = '';
      
      // Process children recursively
      Array.from(el.children).forEach((child, index) => {
        if (child instanceof HTMLElement && original.children[index] instanceof HTMLElement) {
          convertComputedStylesToInline(child, original.children[index] as HTMLElement);
        }
      });
    };
    
    convertComputedStylesToInline(clone, element);
    
    // Position off-screen
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: data.bgColor,
        allowTaint: true,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Convert all colors to standard RGB format
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            const computedStyle = window.getComputedStyle(element);
            
            // Browser automatically converts oklch to rgb in computed styles
            if (computedStyle.color) {
              element.style.color = computedStyle.color;
            }
            if (computedStyle.backgroundColor) {
              element.style.backgroundColor = computedStyle.backgroundColor;
            }
            if (computedStyle.borderColor) {
              element.style.borderColor = computedStyle.borderColor;
            }
          });
        }
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `identification-${data.areaName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('PNG exported successfully!');
        }
      });
    } finally {
      document.body.removeChild(clone);
    }
  };

  const getIconComponent = (iconId: string) => {
    const icon = ICON_OPTIONS.find(i => i.id === iconId);
    return icon ? icon.component : Droplet;
  };

  const IconComponent = getIconComponent(data.icon);

  // Drag handlers for Icon
  const handleIconMouseDown = (e: React.MouseEvent) => {
    setIsDraggingIcon(true);
    const rect = previewRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left) / scale - data.iconPosition.x,
        y: (e.clientY - rect.top) / scale - data.iconPosition.y
      });
    }
  };

  // Drag handlers for Text
  const handleTextMouseDown = (e: React.MouseEvent) => {
    setIsDraggingText(true);
    const rect = previewRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left) / scale - data.textPosition.x,
        y: (e.clientY - rect.top) / scale - data.textPosition.y
      });
    }
  };

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale - dragOffset.x;
    const y = (e.clientY - rect.top) / scale - dragOffset.y;

    if (isDraggingIcon) {
      setData({ ...data, iconPosition: { x, y } });
    } else if (isDraggingText) {
      setData({ ...data, textPosition: { x, y } });
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    setIsDraggingIcon(false);
    setIsDraggingText(false);
  };

  // Reset position handlers
  const resetIconPosition = () => {
    setData({ ...data, iconPosition: { x: 0, y: 0 } });
  };

  const resetTextPosition = () => {
    setData({ ...data, textPosition: { x: 0, y: 0 } });
  };

  const resetAllPositions = () => {
    setData({ ...data, iconPosition: { x: 0, y: 0 }, textPosition: { x: 0, y: 0 } });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          /* Hide everything except the identification signage */
          body * {
            visibility: hidden;
          }
          
          /* Make the signage and its parents visible */
          #printable-identification-signage,
          #printable-identification-signage * {
            visibility: visible !important;
          }
          
          /* Position the signage container at the top of the page */
          #printable-identification-signage {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: visible !important;
            transform: none !important;
          }
          
          /* Ensure the signage content fills the entire page */
          #printable-identification-signage > div {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            transform: none !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
          }
          
          /* Force all background colors, gradients, and images to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Optimize page layout - Set specific size based on signage size */
          @page {
            size: ${
              data.paperSize === 'a3' ? 'A3' : 
              data.paperSize === 'a5' ? 'A5' :
              data.paperSize === 'letter' ? '216mm 279mm' :
              data.paperSize === 'square' ? '210mm 210mm' :
              'A4'
            } ${data.orientation};
            margin: 0;
          }
          
          /* Prevent page breaks */
          html, body {
            width: 100% !important;
            height: 100% !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Left Panel - Controls */}
      <div className="order-2 lg:order-1 space-y-4 no-print">
        {/* Colorful Templates Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-slate-900 mb-3 font-medium">Colorful Templates</h3>
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {COLORFUL_TEMPLATES.map((template) => {
              const TemplateIcon = getIconComponent(template.icon);
              return (
                <button
                  key={template.name}
                  onClick={() => applyTemplate(template)}
                  className="relative overflow-hidden rounded-lg border-2 border-slate-200 hover:border-blue-400 transition-all group"
                  style={{ aspectRatio: '3/2' }}
                >
                  {/* Template Background Image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${template.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.3
                    }}
                  />
                  
                  {/* Template Color Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: template.bgColor,
                      opacity: 0.85
                    }}
                  />
                  
                  {/* Template Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{
                        backgroundColor: template.iconBgColor
                      }}
                    >
                      <TemplateIcon className="w-5 h-5" style={{ color: template.textColor }} />
                    </div>
                    <div
                      className="text-xs font-bold text-center leading-tight"
                      style={{ color: template.textColor }}
                    >
                      {template.areaName}
                    </div>
                    <div className="text-[10px] text-white/80 mt-1 text-center">
                      {template.description}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Customization Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-slate-900 mb-3 font-medium">Customize Signage</h3>

          {/* Area Name */}
          <div className="mb-4">
            <label className="block text-sm text-slate-700 mb-2">Area Name</label>
            <input
              type="text"
              value={data.areaName}
              onChange={(e) => setData({ ...data, areaName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Enter area name"
            />
          </div>

          {/* Icon Selection */}
          <div className="mb-4">
            <label className="block text-sm text-slate-700 mb-2">Icon</label>
            <select
              value={data.icon}
              onChange={(e) => setData({ ...data, icon: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon.id} value={icon.id}>
                  {icon.name}
                </option>
              ))}
            </select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="block text-xs text-slate-700 mb-2">Background</label>
              <input
                type="color"
                value={data.bgColor}
                onChange={(e) => setData({ ...data, bgColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-700 mb-2">Text</label>
              <input
                type="color"
                value={data.textColor}
                onChange={(e) => setData({ ...data, textColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-700 mb-2">Icon BG</label>
              <input
                type="color"
                value={data.iconBgColor}
                onChange={(e) => setData({ ...data, iconBgColor: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Header Settings */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={data.showHeader}
                onChange={(e) => setData({ ...data, showHeader: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Show Header</span>
            </label>
            {data.showHeader && (
              <input
                type="text"
                value={data.headerText}
                onChange={(e) => setData({ ...data, headerText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Header text"
              />
            )}
          </div>

          {/* Footer Settings */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={data.showFooter}
                onChange={(e) => setData({ ...data, showFooter: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Show Footer</span>
            </label>
            {data.showFooter && (
              <input
                type="text"
                value={data.footerText}
                onChange={(e) => setData({ ...data, footerText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Footer text"
              />
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-700">Area Image</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showImage}
                  onChange={(e) => setData({ ...data, showImage: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xs text-slate-600">Show</span>
              </label>
            </div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              {data.uploadedImage ? (
                <img src={data.uploadedImage} alt="Area" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">Click to upload</span>
                  <span className="text-xs text-slate-400">or use templates above</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Position */}
          {data.showImage && data.uploadedImage && (
            <>
              <div className="mb-4">
                <label className="block text-sm text-slate-700 mb-2">Image Position</label>
                <div className="grid grid-cols-4 gap-2">
                  {['top', 'center', 'bottom', 'background'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setData({ ...data, imagePosition: pos as any })}
                      className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
                        data.imagePosition === pos
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Opacity */}
              {data.imagePosition === 'background' && (
                <div className="mb-4">
                  <label className="block text-sm text-slate-700 mb-2">
                    Image Opacity: {data.imageOpacity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={data.imageOpacity}
                    onChange={(e) => setData({ ...data, imageOpacity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}

              {/* Image Size */}
              {data.imagePosition !== 'background' && (
                <div className="mb-4">
                  <label className="block text-sm text-slate-700 mb-2">
                    Image Size: {data.imageSize}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={data.imageSize}
                    onChange={(e) => setData({ ...data, imageSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}

          {/* Font & Icon Size */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Font: {data.fontSize}px
              </label>
              <input
                type="range"
                min="24"
                max="72"
                value={data.fontSize}
                onChange={(e) => setData({ ...data, fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Icon: {data.iconSize}px
              </label>
              <input
                type="range"
                min="40"
                max="120"
                value={data.iconSize}
                onChange={(e) => setData({ ...data, iconSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Position Reset Controls */}
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <label className="block text-sm text-slate-700 mb-2 flex items-center gap-2">
              <Move className="w-4 h-4" />
              Position Controls
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={resetIconPosition}
                disabled={data.iconPosition.x === 0 && data.iconPosition.y === 0}
                className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Icon
              </button>
              <button
                onClick={resetTextPosition}
                disabled={data.textPosition.x === 0 && data.textPosition.y === 0}
                className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Text
              </button>
              <button
                onClick={resetAllPositions}
                disabled={data.iconPosition.x === 0 && data.iconPosition.y === 0 && data.textPosition.x === 0 && data.textPosition.y === 0}
                className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs flex items-center justify-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Drag icon or text in preview to reposition
            </div>
          </div>

          {/* Border Settings */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={data.showBorder}
                onChange={(e) => setData({ ...data, showBorder: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-700">Show Border</span>
            </label>
            {data.showBorder && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={data.borderColor}
                    onChange={(e) => setData({ ...data, borderColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Width: {data.borderWidth}px</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.borderWidth}
                    onChange={(e) => setData({ ...data, borderWidth: parseInt(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Paper Size */}
          <div className="mb-4">
            <label className="block text-sm text-slate-700 mb-2">Paper Size</label>
            <select
              value={data.paperSize}
              onChange={(e) => setData({ ...data, paperSize: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="a5">A5 (148 × 210 mm)</option>
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="a3">A3 (297 × 420 mm)</option>
              <option value="letter">Letter (216 × 279 mm)</option>
              <option value="square">Square (210 × 210 mm)</option>
            </select>
          </div>

          {/* Orientation */}
          <div className="mb-4">
            <label className="block text-sm text-slate-700 mb-2">Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setData({ ...data, orientation: 'landscape' })}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  data.orientation === 'landscape'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Landscape
              </button>
              <button
                onClick={() => setData({ ...data, orientation: 'portrait' })}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  data.orientation === 'portrait'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Portrait
              </button>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportToPNG}
              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export PNG
            </button>
            <button
              onClick={exportToPDF}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-medium">Live Preview</h3>
            <div className="text-xs text-slate-500">
              {data.paperSize.toUpperCase()} • {data.orientation} • 300 DPI
            </div>
          </div>
          <div className="overflow-auto border border-slate-300 rounded-lg bg-slate-100 p-6">
            <div
              id="printable-identification-signage"
              ref={previewRef}
              style={{
                width: `${pageWidth}px`,
                height: `${pageHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                backgroundColor: data.bgColor,
                borderRadius: `${data.borderRadius}px`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                border: data.showBorder ? `${data.borderWidth}px solid ${data.borderColor}` : 'none'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Background Image */}
              {data.showImage && data.uploadedImage && data.imagePosition === 'background' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${data.uploadedImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: data.imageOpacity / 100
                  }}
                />
              )}

              {/* Header */}
              {data.showHeader && (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '15px 20px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <span
                    style={{
                      color: data.textColor,
                      fontSize: '20px',
                      fontWeight: 700,
                      letterSpacing: '3px'
                    }}
                  >
                    {data.headerText}
                  </span>
                </div>
              )}

              {/* Main Content */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '35px',
                  padding: '40px',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {/* Top Image */}
                {data.showImage && data.uploadedImage && data.imagePosition === 'top' && (
                  <div
                    style={{
                      width: `${data.imageSize}px`,
                      height: `${data.imageSize}px`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `3px solid ${data.borderColor}`,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <img
                      src={data.uploadedImage}
                      alt="Area"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                {/* Icon - Draggable */}
                <div
                  style={{
                    position: data.iconPosition.x !== 0 || data.iconPosition.y !== 0 ? 'absolute' : 'relative',
                    left: data.iconPosition.x !== 0 ? `${data.iconPosition.x}px` : undefined,
                    top: data.iconPosition.y !== 0 ? `${data.iconPosition.y}px` : undefined,
                    width: `${data.iconSize + 70}px`,
                    height: `${data.iconSize + 70}px`,
                    backgroundColor: data.iconBgColor,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `${data.borderWidth}px solid ${data.borderColor}`,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                    cursor: 'move'
                  }}
                  onMouseDown={handleIconMouseDown}
                >
                  <IconComponent
                    style={{
                      width: `${data.iconSize}px`,
                      height: `${data.iconSize}px`,
                      color: data.textColor,
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {/* Center Image */}
                {data.showImage && data.uploadedImage && data.imagePosition === 'center' && (
                  <div
                    style={{
                      width: `${data.imageSize}px`,
                      height: `${data.imageSize}px`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `3px solid ${data.borderColor}`,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <img
                      src={data.uploadedImage}
                      alt="Area"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                {/* Area Name - Draggable */}
                <h1
                  style={{
                    position: data.textPosition.x !== 0 || data.textPosition.y !== 0 ? 'absolute' : 'relative',
                    left: data.textPosition.x !== 0 ? `${data.textPosition.x}px` : undefined,
                    top: data.textPosition.y !== 0 ? `${data.textPosition.y}px` : undefined,
                    color: data.textColor,
                    fontSize: `${data.fontSize}px`,
                    fontWeight: 800,
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    maxWidth: '85%',
                    wordWrap: 'break-word',
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
                    cursor: 'move'
                  }}
                  onMouseDown={handleTextMouseDown}
                >
                  {data.areaName}
                </h1>

                {/* Bottom Image */}
                {data.showImage && data.uploadedImage && data.imagePosition === 'bottom' && (
                  <div
                    style={{
                      width: `${data.imageSize}px`,
                      height: `${data.imageSize}px`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `3px solid ${data.borderColor}`,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <img
                      src={data.uploadedImage}
                      alt="Area"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {data.showFooter && (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '12px 20px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <span
                    style={{
                      color: data.textColor,
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '1.5px'
                    }}
                  >
                    {data.footerText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}