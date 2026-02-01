import React from 'react';
import { SignageData, QRCodeConfig } from '../types/signage';
import { AlertTriangle, AlertCircle, Shield, Ban, Activity, Flame, Droplet, Zap, Waves, Car, Info, Settings, Download, FileDown, MapPin, Phone, Globe, Printer, X, Move, Maximize2 } from 'lucide-react';
import { getCategoryConfig } from '../utils/categoryConfig';
import { getPPEIcon, getPPELabel } from '../utils/ppeUtils';
import { QRCodeSVG } from 'qrcode.react';
import { BrandingConfig } from './CompanyBranding';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';

interface SignagePreviewProps {
  signageData: SignageData;
  brandingConfig?: BrandingConfig;
  onBrandingConfigChange?: (config: BrandingConfig) => void;
}

// Helper function to get QR code value from config (usable in exports)
const getQRCodeValueFromConfig = (signageData: SignageData): { value: string | null; isExistingImage: boolean; imageData?: string } => {
  const qrConfig = signageData.qrCodeConfig;
  
  // If using existing QR code image
  if (qrConfig?.type === 'existing' && qrConfig.existingQRCodeImage) {
    return { value: null, isExistingImage: true, imageData: qrConfig.existingQRCodeImage };
  }
  
  // Legacy support - use old qrCode field if no config
  if (!qrConfig && signageData.qrCode) {
    return { value: signageData.qrCode, isExistingImage: false };
  }
  
  if (!qrConfig) return { value: null, isExistingImage: false };
  
  // Combine all selected sources into one QR code
  const selectedSources: string[] = [];
  
  // Include Custom URLs if 'custom' source is selected
  if (qrConfig.sources.includes('custom')) {
    // Add legacy URL if provided
    if (qrConfig.legacyUrl && qrConfig.legacyUrl.trim()) {
      selectedSources.push(`=== CUSTOM URL ===\n${qrConfig.legacyUrl.trim()}`);
    }
    
    // Add content boxes URLs if provided
    if (qrConfig.contentBoxes && qrConfig.contentBoxes.length > 0) {
      const urls = qrConfig.contentBoxes
        .filter(box => box.url && box.url.trim())
        .map(box => {
          if (box.title) {
            return `${box.title}: ${box.url.trim()}`;
          }
          return box.url.trim();
        });
      if (urls.length > 0) {
        selectedSources.push(`=== CUSTOM LINKS ===\n${urls.join('\n')}`);
      }
    }
  } else {
    // If 'custom' is not selected but URLs exist, use them as fallback (legacy behavior)
    if (qrConfig.legacyUrl && qrConfig.legacyUrl.trim()) {
      return { value: qrConfig.legacyUrl.trim(), isExistingImage: false };
    }
    if (qrConfig.contentBoxes && qrConfig.contentBoxes.length > 0) {
      const urls = qrConfig.contentBoxes
        .filter(box => box.url && box.url.trim())
        .map(box => box.url.trim());
      if (urls.length > 0) {
        return { value: urls.join('\n'), isExistingImage: false };
      }
    }
  }
  
  // Include Authorized Person(s) if selected
  if (qrConfig.sources.includes('authorizedPerson')) {
    const selectedPersonIds = qrConfig.selectedAuthorizedPersonIds || 
      (qrConfig.selectedAuthorizedPersonId ? [qrConfig.selectedAuthorizedPersonId] : []);
    
    if (selectedPersonIds.length > 0) {
      try {
        // Load authorized persons from localStorage
        const savedPersons = localStorage.getItem('authorizedPersons');
        if (savedPersons) {
          const allPersons = JSON.parse(savedPersons);
          const selectedPersons = allPersons.filter((p: any) => selectedPersonIds.includes(p.id));
          
          if (selectedPersons.length > 0) {
            const personInfo: string[] = [];
            personInfo.push(`=== AUTHORIZED PERSON${selectedPersons.length > 1 ? 'S' : ''} ===`);
            
            selectedPersons.forEach((person: any, index: number) => {
              personInfo.push(`\nPerson ${index + 1}:`);
              if (person.name) personInfo.push(`Name: ${person.name}`);
              if (person.designation) personInfo.push(`Designation: ${person.designation}`);
              if (person.department) personInfo.push(`Department: ${person.department}`);
              if (person.employeeId) personInfo.push(`Employee ID: ${person.employeeId}`);
              if (person.shift) personInfo.push(`Shift: ${person.shift}`);
              if (person.contact) personInfo.push(`Contact: ${person.contact}`);
              if (person.certifications) personInfo.push(`Certifications: ${person.certifications}`);
              if (person.validFrom) personInfo.push(`Valid From: ${person.validFrom}`);
              if (person.validUntil) personInfo.push(`Valid Until: ${person.validUntil}`);
            });
            
            selectedSources.push(personInfo.join('\n'));
          } else {
            // Fallback to IDs if data not found
            selectedSources.push(`=== AUTHORIZED PERSON${selectedPersonIds.length > 1 ? 'S' : ''} ===\n${selectedPersonIds.map(id => `authorized-person:${id}`).join('\n')}`);
          }
        } else {
          // Fallback to IDs if localStorage not available
          selectedSources.push(`=== AUTHORIZED PERSON${selectedPersonIds.length > 1 ? 'S' : ''} ===\n${selectedPersonIds.map(id => `authorized-person:${id}`).join('\n')}`);
        }
      } catch (error) {
        console.error('Error loading authorized persons data:', error);
        // Fallback to IDs on error
        selectedSources.push(`=== AUTHORIZED PERSON${selectedPersonIds.length > 1 ? 'S' : ''} ===\n${selectedPersonIds.map(id => `authorized-person:${id}`).join('\n')}`);
      }
    }
  }
  
  // Include Organization Chart(s) if selected
  if (qrConfig.sources.includes('organizationChart')) {
    const selectedChartIds = qrConfig.selectedOrganizationChartIds || 
      (qrConfig.selectedOrganizationChartId ? [qrConfig.selectedOrganizationChartId] : []);
    
    if (selectedChartIds.length > 0) {
      try {
        // Load organization chart data from localStorage
        const savedMembers = localStorage.getItem('organizationChartMembers');
        const savedPositions = localStorage.getItem('organizationChartPositions');
        
        if (savedMembers) {
          const allMembers = JSON.parse(savedMembers);
          const positions = savedPositions ? JSON.parse(savedPositions) : {};
          
          if (Array.isArray(allMembers) && allMembers.length > 0) {
            const chartInfo: string[] = [];
            chartInfo.push(`=== ORGANIZATION CHART${selectedChartIds.length > 1 ? 'S' : ''} ===`);
            
            allMembers.forEach((member: any, index: number) => {
              chartInfo.push(`\nMember ${index + 1}:`);
              if (member.name) chartInfo.push(`Name: ${member.name}`);
              if (member.title || member.position) chartInfo.push(`Position: ${member.title || member.position}`);
              if (member.department) chartInfo.push(`Department: ${member.department}`);
              if (member.email) chartInfo.push(`Email: ${member.email}`);
              if (member.phone) chartInfo.push(`Phone: ${member.phone}`);
            });
            
            selectedSources.push(chartInfo.join('\n'));
          } else {
            // Fallback to IDs if data not found
            selectedSources.push(`=== ORGANIZATION CHART${selectedChartIds.length > 1 ? 'S' : ''} ===\n${selectedChartIds.map(id => `organization-chart:${id}`).join('\n')}`);
          }
        } else {
          // Fallback to IDs if localStorage not available
          selectedSources.push(`=== ORGANIZATION CHART${selectedChartIds.length > 1 ? 'S' : ''} ===\n${selectedChartIds.map(id => `organization-chart:${id}`).join('\n')}`);
        }
      } catch (error) {
        console.error('Error loading organization chart data:', error);
        // Fallback to IDs on error
        selectedSources.push(`=== ORGANIZATION CHART${selectedChartIds.length > 1 ? 'S' : ''} ===\n${selectedChartIds.map(id => `organization-chart:${id}`).join('\n')}`);
      }
    }
  }
  
  // Include Safety Committee Team(s) if selected
  if (qrConfig.sources.includes('safetyCommittee')) {
    const selectedCommitteeIds = qrConfig.selectedSafetyCommitteeIds || 
      (qrConfig.selectedSafetyCommitteeId ? [qrConfig.selectedSafetyCommitteeId] : []);
    
    if (selectedCommitteeIds.length > 0) {
      try {
        // Load actual safety committee data from localStorage
        const savedCommittee = localStorage.getItem('emergencyResponseTeam');
        if (savedCommittee) {
          const committeeData = JSON.parse(savedCommittee);
          if (Array.isArray(committeeData) && committeeData.length > 0) {
            // Format the safety committee data
            const committeeInfo: string[] = [];
            committeeInfo.push(`=== SAFETY COMMITTEE TEAM${selectedCommitteeIds.length > 1 ? 'S' : ''} ===`);
            
            committeeData.forEach((member: any, index: number) => {
              if (member.name || member.role || member.phone || member.email) {
                committeeInfo.push(`\nMember ${index + 1}:`);
                if (member.name) committeeInfo.push(`Name: ${member.name}`);
                if (member.role) committeeInfo.push(`Role: ${member.role}`);
                if (member.phone) committeeInfo.push(`Phone: ${member.phone}`);
                if (member.email) committeeInfo.push(`Email: ${member.email}`);
              }
            });
            
            selectedSources.push(committeeInfo.join('\n'));
          } else {
            // Fallback to IDs if data not found
            selectedSources.push(`=== SAFETY COMMITTEE TEAM${selectedCommitteeIds.length > 1 ? 'S' : ''} ===\n${selectedCommitteeIds.map(id => `safety-committee:${id}`).join('\n')}`);
          }
        } else {
          // Fallback to IDs if localStorage not available
          selectedSources.push(`=== SAFETY COMMITTEE TEAM${selectedCommitteeIds.length > 1 ? 'S' : ''} ===\n${selectedCommitteeIds.map(id => `safety-committee:${id}`).join('\n')}`);
        }
      } catch (error) {
        console.error('Error loading safety committee data:', error);
        // Fallback to IDs on error
        selectedSources.push(`=== SAFETY COMMITTEE TEAM${selectedCommitteeIds.length > 1 ? 'S' : ''} ===\n${selectedCommitteeIds.map(id => `safety-committee:${id}`).join('\n')}`);
      }
    }
  }
  
  if (selectedSources.length > 0) {
    return { value: selectedSources.join('\n\n'), isExistingImage: false };
  }
  
  return { value: null, isExistingImage: false };
};

// Helper function to generate watermark HTML
const getWatermarkHTML = (brandingConfig?: BrandingConfig): string => {
  if (!brandingConfig?.logo || !brandingConfig.enabled) return '';
  
  const position = brandingConfig.logoPosition || 'top-right';
  const size = brandingConfig.logoSize || 100;
  const opacity = brandingConfig.logoOpacity || 100;
  
  // Calculate position styles
  let positionStyle = '';
  switch (position) {
    case 'top-left':
      positionStyle = 'top: 20px; left: 20px;';
      break;
    case 'top-right':
      positionStyle = 'top: 20px; right: 20px;';
      break;
    case 'bottom-left':
      positionStyle = 'bottom: 20px; left: 20px;';
      break;
    case 'bottom-right':
      positionStyle = 'bottom: 20px; right: 20px;';
      break;
    case 'center-top':
      positionStyle = 'top: 20px; left: 50%; transform: translateX(-50%);';
      break;
    case 'center-bottom':
      positionStyle = 'bottom: 20px; left: 50%; transform: translateX(-50%);';
      break;
  }
  
  return `
    <div style="
      position: absolute;
      ${positionStyle}
      width: ${size}px;
      height: auto;
      opacity: ${opacity / 100};
      z-index: 1;
      pointer-events: none;
    ">
      <img 
        src="${brandingConfig.logo}" 
        alt="Watermark" 
        style="width: 100%; height: auto; object-fit: contain;"
      />
    </div>
  `;
};

// Helper function to generate full-page repeating watermark HTML
const getFullPageWatermarkHTML = (brandingConfig?: BrandingConfig): string => {
  if (!brandingConfig?.logo || !brandingConfig.enabled) return '';
  
  const size = brandingConfig.logoSize || 100;
  const opacity = brandingConfig.logoOpacity || 100;
  
  // Create a repeating pattern across the entire page
  return `
    <div style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      background-image: url(${brandingConfig.logo});
      background-repeat: repeat;
      background-size: ${size * 2}px ${size * 2}px;
      opacity: ${opacity / 100};
      background-position: 0 0;
    "></div>
  `;
};

export function SignagePreview({ signageData, brandingConfig, onBrandingConfigChange }: SignagePreviewProps) {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, aspectRatio: 1 });
  
  const config = signageData.category === 'custom' 
    ? {
        name: 'Custom',
        color: signageData.customColor || '#64748B',
        borderColor: signageData.customColor || '#64748B',
        backgroundColor: '#FFFFFF',
        textColor: signageData.customColor || '#64748B',
        icon: 'Settings',
      }
    : getCategoryConfig(signageData.category) || {
        name: 'Custom',
        color: '#64748B',
        borderColor: '#64748B',
        backgroundColor: '#F8FAFC',
        textColor: '#334155',
        icon: 'Settings',
      };
  
  // Debug: Log branding config
  console.log('🔍 Branding Config:', {
    enabled: brandingConfig?.enabled,
    headerLogosEnabled: brandingConfig?.headerLogosEnabled,
    hasClientLogo: !!brandingConfig?.clientLogo,
    hasContractorLogo: !!brandingConfig?.contractorLogo,
    clientPosition: brandingConfig?.clientPosition
  });

  const headerRef = useRef<HTMLDivElement>(null);

  // Handle logo dragging
  const handleLogoMouseDown = (e: React.MouseEvent, logoType: 'client' | 'contractor') => {
    // Don't start drag if clicking on resize handle
    const target = e.target as HTMLElement;
    if (target.closest('.resize-handle')) {
      return;
    }
    
    if (!headerRef.current || !onBrandingConfigChange || !brandingConfig) return;
    
    // Prevent default to avoid text selection and image dragging
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(logoType);
    
    const rect = headerRef.current.getBoundingClientRect();
    const logoElement = (e.currentTarget as HTMLElement);
    const logoRect = logoElement.getBoundingClientRect();
    
    // Calculate offset from mouse to logo top-left corner (accounting for border)
    const borderWidth = 2; // Match the border width
    const offsetX = e.clientX - logoRect.left;
    const offsetY = e.clientY - logoRect.top;
    
    // Store initial mouse position and offset
    setDragStart({ 
      x: e.clientX,
      y: e.clientY,
      offsetX: offsetX,
      offsetY: offsetY
    });
  };

  // Handle logo resizing
  const handleResizeMouseDown = (e: React.MouseEvent, logoType: 'client' | 'contractor') => {
    if (!headerRef.current || !onBrandingConfigChange || !brandingConfig) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(logoType);
    
    const logoConfig = logoType === 'client' 
      ? { pos: brandingConfig.clientLogoPosition || { x: 5, y: 5 }, size: brandingConfig.clientLogoSize || { width: 96, height: 64 } }
      : { pos: brandingConfig.contractorLogoPosition || { x: 95, y: 5 }, size: brandingConfig.contractorLogoSize || { width: 96, height: 64 } };
    
    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Calculate aspect ratio to maintain during resize
    const aspectRatio = logoConfig.size.width / logoConfig.size.height;
    
    setResizeStart({ 
      x, 
      y, 
      width: logoConfig.size.width, 
      height: logoConfig.size.height,
      aspectRatio 
    });
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current || !onBrandingConfigChange || !brandingConfig) return;

      if (isDragging) {
        const rect = headerRef.current.getBoundingClientRect();
        
        // Calculate new position accounting for the offset
        const newLogoLeft = e.clientX - dragStart.offsetX;
        const newLogoTop = e.clientY - dragStart.offsetY;
        
        // Convert to percentage relative to header
        const newX = ((newLogoLeft - rect.left) / rect.width) * 100;
        const newY = ((newLogoTop - rect.top) / rect.height) * 100;
        
        // Get current logo size to clamp properly
        const logoSize = isDragging === 'client'
          ? brandingConfig.clientLogoSize || { width: 96, height: 64 }
          : brandingConfig.contractorLogoSize || { width: 96, height: 64 };
        
        // Clamp values to stay within bounds (accounting for logo size)
        const maxX = 100 - (logoSize.width / rect.width * 100);
        const maxY = 100 - (logoSize.height / rect.height * 100);
        const clampedX = Math.max(0, Math.min(maxX, newX));
        const clampedY = Math.max(0, Math.min(maxY, newY));
        
        if (isDragging === 'client') {
          onBrandingConfigChange({
            ...brandingConfig,
            clientLogoPosition: { x: clampedX, y: clampedY }
          });
        } else {
          onBrandingConfigChange({
            ...brandingConfig,
            contractorLogoPosition: { x: clampedX, y: clampedY }
          });
        }
      } else if (isResizing) {
        // Resize from bottom-right corner only - top-left position stays fixed
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        // Calculate new size based on mouse movement from the resize handle
        // Use the larger delta to determine scale, maintaining aspect ratio
        const scaleX = (resizeStart.width + deltaX) / resizeStart.width;
        const scaleY = (resizeStart.height + deltaY) / resizeStart.height;
        
        // Use the average of both scales to maintain aspect ratio
        const scale = (scaleX + scaleY) / 2;
        
        // Calculate new dimensions maintaining aspect ratio
        let newWidth = resizeStart.width * scale;
        let newHeight = newWidth / resizeStart.aspectRatio;
        
        // Apply constraints while maintaining aspect ratio
        const minWidth = 40;
        const minHeight = 30;
        const maxWidth = 300;
        const maxHeight = 200;
        
        // Clamp to min/max while maintaining aspect ratio
        if (newWidth < minWidth) {
          newWidth = minWidth;
          newHeight = newWidth / resizeStart.aspectRatio;
        } else if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = newWidth / resizeStart.aspectRatio;
        }
        
        // Check height constraints and adjust if needed
        if (newHeight < minHeight) {
          newHeight = minHeight;
          newWidth = newHeight * resizeStart.aspectRatio;
        } else if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * resizeStart.aspectRatio;
        }
        
        // IMPORTANT: Only update size, NOT position - position stays fixed at top-left
        // Explicitly preserve the current position to ensure it doesn't change
        if (isResizing === 'client') {
          onBrandingConfigChange({
            ...brandingConfig,
            // Explicitly preserve position - only size changes from bottom-right
            clientLogoPosition: brandingConfig.clientLogoPosition || { x: 5, y: 5 },
            clientLogoSize: { width: Math.round(newWidth), height: Math.round(newHeight) }
          });
        } else {
          onBrandingConfigChange({
            ...brandingConfig,
            // Explicitly preserve position - only size changes from bottom-right
            contractorLogoPosition: brandingConfig.contractorLogoPosition || { x: 95, y: 5 },
            contractorLogoSize: { width: Math.round(newWidth), height: Math.round(newHeight) }
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, brandingConfig, onBrandingConfigChange]);
  
  const handleExportPDF = async () => {
    try {
      toast.info('Generating high-resolution PDF...');
      
      // Create a clean export version with NO Tailwind classes - only RGB/HEX colors
      const exportElement = document.createElement('div');
      exportElement.id = 'export-signage-temp';
      exportElement.style.cssText = `
        position: absolute;
        left: -99999px;
        top: 0;
        width: 800px;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;
      
      // Get actual RGB colors from config
      const headerColor = signageData.category === 'custom' 
        ? signageData.customColor 
        : getCategoryConfig(signageData.category).color;
      
      // Always use white background for preview
      const bgColor = '#FFFFFF';
      
      const headerBgStyle = signageData.backgroundImage 
        ? `background-image: url(${signageData.backgroundImage}); background-size: cover; background-position: center;`
        : `background: linear-gradient(135deg, ${headerColor} 0%, ${headerColor}dd 100%);`;
      
      // Watermark HTML - Always single watermark positioned (default: bottom-right)
      const watermarkHTML = brandingConfig?.logo && brandingConfig?.enabled ? `
        <div style="
          position: absolute;
          ${brandingConfig.logoPosition === 'top-left' ? 'top: 20px; left: 20px;' :
            brandingConfig.logoPosition === 'top-right' ? 'top: 20px; right: 20px;' :
            brandingConfig.logoPosition === 'bottom-left' ? 'bottom: 20px; left: 20px;' :
            brandingConfig.logoPosition === 'center-top' ? 'top: 20px; left: 50%; transform: translateX(-50%);' :
            brandingConfig.logoPosition === 'center-bottom' ? 'bottom: 20px; left: 50%; transform: translateX(-50%);' :
            'bottom: 20px; right: 20px;'}
          width: ${brandingConfig.logoSize || 100}px;
          height: auto;
          opacity: ${(brandingConfig.logoOpacity || 100) / 100};
          z-index: 1;
          pointer-events: none;
        ">
          <img src="${brandingConfig.logo}" alt="Watermark" style="width: 100%; height: auto; object-fit: contain;" />
        </div>
      ` : '';
      
      // Build clean HTML with inline RGB styles only
      exportElement.innerHTML = signageData.qrCodeConfig?.showOnlyTitleAndQR ? `
        <div style="max-width: 800px; margin: 0 auto; background: ${bgColor}; border-radius: 8px; overflow: hidden; border: 4px solid #000000; min-height: 100vh; display: flex; flex-direction: column; position: relative;">
          ${watermarkHTML}
          
          <!-- Full Page QR Code Layout -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; ${headerBgStyle}">
            <!-- Title -->
            <div style="color: ${signageData.titleColor || '#ffffff'}; font-size: 36px; font-weight: bold; margin-bottom: 40px; text-align: center;">
              ${signageData.title || 'SIGNAGE TITLE'}
            </div>
            
            <!-- QR Code - Large and Centered -->
            ${(() => {
              const qrData = getQRCodeValueFromConfig(signageData);
              if (!qrData.isExistingImage && !qrData.value) return '';
              return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  ${qrData.isExistingImage && qrData.imageData ? `
                    <img src="${qrData.imageData}" alt="QR Code" style="width: 300px; height: 300px; object-fit: contain;" />
                  ` : qrData.value ? `
                    <div style="width: 300px; height: 300px; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; text-align: center;">
                      QR Code
                    </div>
                  ` : ''}
                  <div style="font-size: 18px; text-align: center; color: #334155; margin-top: 16px; font-weight: 500;">Scan QR Code</div>
                </div>
              `;
            })()}
          </div>

          <!-- Footer -->
          <div style="padding: 12px 16px; background: #000000; text-align: center;">
            <div style="color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              ${signageData.footerText || 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually'}
            </div>
          </div>

        </div>
      ` : `
        <div style="max-width: 800px; margin: 0 auto; background: ${bgColor}; border-radius: 8px; overflow: hidden; border: 4px solid #000000; position: relative;">
          ${watermarkHTML}
          
          <!-- Header Section -->
          <div style="padding: 24px 16px; text-align: center; ${headerBgStyle}">
            ${signageData.warningIcon ? `
              <div style="margin-bottom: 12px; display: flex; justify-content: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                  <img src="${signageData.warningIcon}" alt="Warning Icon" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              </div>
            ` : ''}
            <div style="color: ${signageData.titleColor || '#ffffff'}; font-size: 24px; font-weight: bold; margin-bottom: 8px;">
              ${signageData.title || 'SIGNAGE TITLE'}
            </div>
            ${signageData.purpose ? `
              <div style="color: white; font-size: 14px; opacity: 0.9;">
                ${signageData.purpose}
              </div>
            ` : ''}
          </div>

          <!-- Location -->
          ${signageData.location ? `
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.9); border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 12px;">
                <span style="color: #64748b; text-transform: uppercase;">Location: </span>
                <span style="color: #0f172a;">${signageData.location}</span>
              </div>
            </div>
          ` : ''}

          <!-- Description -->
          ${signageData.description ? `
            <div style="padding: 12px 16px; background: rgba(248,250,252,0.9); border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 12px; color: #334155; line-height: 1.6;">
                ${signageData.description}
              </div>
            </div>
          ` : ''}

          <!-- Hazards -->
          ${displayHazards.length > 0 ? `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
              <div style="background: ${headerColor}; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  ⚠ HAZARDS
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(${
                displayHazards.length <= 4 ? 4 :
                displayHazards.length <= 6 ? 3 :
                displayHazards.length <= 12 ? 4 :
                displayHazards.length <= 20 ? 5 :
                6
              }, 1fr); gap: 8px;">
                ${displayHazards.map((hazard, index) => `
                  <div style="background: #dc2626; border-radius: 4px; padding: 8px; text-align: center;">
                    <div style="width: 20px; height: 20px; background: white; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto; font-size: 10px; font-weight: bold;">
                      ${index + 1}
                    </div>
                    <div style="font-size: 9px; color: white; text-transform: uppercase; line-height: 1.2;">
                      ⚠ ${hazard}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- PPE -->
          ${(signageData.ppe.length > 0 || (signageData.customPPEImages && signageData.customPPEImages.length > 0)) ? `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
              <div style="background: #2563eb; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  🛡 MANDATORY PPE (${signageData.ppe.length + (signageData.customPPEImages?.length || 0)})
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(${(signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 4 ? 4 : (signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 8 ? 4 : 6}, 1fr); gap: 8px;">
                ${signageData.ppe.map(ppe => `
                  <div style="background: #2563eb; border-radius: 4px; padding: 12px; text-align: center;">
                    <div style="color: white; font-size: 10px; text-transform: uppercase; line-height: 1.2;">
                      ${getPPELabel(ppe)}
                    </div>
                  </div>
                `).join('')}
                ${signageData.customPPEImages ? signageData.customPPEImages.map((ppe, index) => `
                  <div style="background: #2563eb; border-radius: 4px; padding: 12px; text-align: center;">
                    <img src="${ppe.image}" alt="${ppe.name || `Custom PPE ${index + 1}`}" style="width: 30px; height: 30px; object-fit: contain; margin: 0 auto 4px auto;" />
                    <div style="color: white; font-size: 10px; text-transform: uppercase; line-height: 1.2;">
                      ${ppe.name || `Custom PPE ${index + 1}`}
                    </div>
                  </div>
                `).join('') : ''}
              </div>
            </div>
          ` : ''}

          <!-- Procedures -->
          ${displayProcedures.length > 0 ? `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
              <div style="background: #16a34a; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  ✓ SAFETY PROCEDURES
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(${
                displayProcedures.length <= 4 ? 4 :
                displayProcedures.length <= 6 ? 3 :
                displayProcedures.length <= 12 ? 4 :
                displayProcedures.length <= 20 ? 5 :
                6
              }, 1fr); gap: 8px;">
                ${displayProcedures.map((procedure, index) => `
                  <div style="background: #16a34a; border-radius: 4px; padding: 8px; text-align: center;">
                    <div style="width: 20px; height: 20px; background: white; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto; font-size: 10px; font-weight: bold;">
                      ${index + 1}
                    </div>
                    <div style="font-size: 9px; color: white; text-transform: uppercase; line-height: 1.2;">
                      ${procedure}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Permit Required -->
          ${signageData.permitRequired === 'yes' ? `
            <div style="padding: 16px; background: #b91c1c; border-bottom: 1px solid #e2e8f0;">
              <div style="color: white; font-size: 14px; font-weight: bold; text-transform: uppercase;">
                🚫 PERMIT REQUIRED
              </div>
              ${signageData.permitDetails ? `
                <div style="color: white; font-size: 12px; margin-top: 4px; opacity: 0.9;">
                  ${signageData.permitDetails}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Emergency Contacts + QR Code - Side by side -->
          <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 12px;">
            <!-- Emergency Contacts -->
            <div style="flex: 1;">
              <div style="background: #f97316; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  📞 EMERGENCY CONTACTS
                </div>
              </div>
              <div style="background: #fff7ed; border-radius: 4px; padding: 8px 12px;">
                ${signageData.emergencyContacts.map(contact => `
                  <div style="font-size: 12px; color: #9a3412; margin-bottom: 4px;">
                    <span style="font-weight: bold;">${contact.label}:</span> ${contact.number}
                  </div>
                `).join('')}
              </div>
            </div>
            <!-- QR Code -->
            ${(() => {
              const qrData = getQRCodeValueFromConfig(signageData);
              if (!qrData.isExistingImage && !qrData.value) return '';
              return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
                  ${qrData.isExistingImage && qrData.imageData ? `
                    <img src="${qrData.imageData}" alt="QR Code" style="width: 50px; height: 50px; object-fit: contain;" />
                  ` : qrData.value ? `
                    <div style="width: 50px; height: 50px; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; text-align: center;">
                      QR Code
                    </div>
                  ` : ''}
                  <div style="font-size: 8px; text-align: center; color: #64748b; margin-top: 4px;">Scan</div>
                </div>
              `;
            })()}
          </div>

          <!-- Footer -->
          <div style="padding: 12px 16px; background: #000000; text-align: center;">
            <div style="color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              ${signageData.footerText || 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually'}
            </div>
          </div>

        </div>
      `;
      
      document.body.appendChild(exportElement);
      
      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture with html2canvas
      const canvas = await html2canvas(exportElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Convert all oklch/modern CSS colors to standard formats
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            const computedStyle = window.getComputedStyle(element);
            
            // Override computed styles that might use oklch
            if (computedStyle.color && computedStyle.color.includes('oklch')) {
              element.style.color = computedStyle.color;
            }
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
              element.style.backgroundColor = computedStyle.backgroundColor;
            }
            if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
              element.style.borderColor = computedStyle.borderColor;
            }
          });
        }
      });
      
      // Remove temp element
      document.body.removeChild(exportElement);

      // Determine page size
      let pageWidth = 210;
      let pageHeight = 297;
      
      if (signageData.size === 'a3') {
        pageWidth = 297;
        pageHeight = 420;
      } else if (signageData.size === 'custom') {
        pageWidth = signageData.customWidth || 210;
        pageHeight = signageData.customHeight || 297;
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: pageHeight > pageWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pageWidth, pageHeight]
      });

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);

      const fileName = `${signageData.title.replace(/[^a-z0-9]/gi, '_') || 'signage'}_${signageData.size}_${signageData.resolution}.pdf`;
      pdf.save(fileName);
      
      toast.success('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('❌ PDF export error:', error);
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExportPNG = async () => {
    try {
      toast.info('Generating high-resolution PNG...');
      
      // Create a clean export version with NO Tailwind classes - only RGB/HEX colors
      const exportElement = document.createElement('div');
      exportElement.id = 'export-signage-temp-png';
      exportElement.style.cssText = `
        position: absolute;
        left: -99999px;
        top: 0;
        width: 800px;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;
      
      // Get actual RGB colors from config
      const headerColor = signageData.category === 'custom' 
        ? signageData.customColor 
        : getCategoryConfig(signageData.category).color;
      
      // Always use white background for preview
      const bgColor = '#FFFFFF';
      
      const headerBgStyle = signageData.backgroundImage 
        ? `background-image: url(${signageData.backgroundImage}); background-size: cover; background-position: center;`
        : `background: linear-gradient(135deg, ${headerColor} 0%, ${headerColor}dd 100%);`;
      
      // Watermark HTML for PNG export - Always single watermark positioned (default: bottom-right)
      const watermarkHTMLPNG = brandingConfig?.logo && brandingConfig?.enabled ? `
        <div style="
          position: absolute;
          ${brandingConfig.logoPosition === 'top-left' ? 'top: 20px; left: 20px;' :
            brandingConfig.logoPosition === 'top-right' ? 'top: 20px; right: 20px;' :
            brandingConfig.logoPosition === 'bottom-left' ? 'bottom: 20px; left: 20px;' :
            brandingConfig.logoPosition === 'center-top' ? 'top: 20px; left: 50%; transform: translateX(-50%);' :
            brandingConfig.logoPosition === 'center-bottom' ? 'bottom: 20px; left: 50%; transform: translateX(-50%);' :
            'bottom: 20px; right: 20px;'}
          width: ${brandingConfig.logoSize || 100}px;
          height: auto;
          opacity: ${(brandingConfig.logoOpacity || 100) / 100};
          z-index: 1;
          pointer-events: none;
        ">
          <img src="${brandingConfig.logo}" alt="Watermark" style="width: 100%; height: auto; object-fit: contain;" />
        </div>
      ` : '';
      
      // Build clean HTML with inline RGB styles only
      exportElement.innerHTML = signageData.qrCodeConfig?.showOnlyTitleAndQR ? `
        <div style="max-width: 800px; margin: 0 auto; background: ${bgColor}; border-radius: 8px; overflow: hidden; border: 4px solid #000000; min-height: 100vh; display: flex; flex-direction: column; position: relative;">
          ${watermarkHTMLPNG}
          
          <!-- Full Page QR Code Layout -->
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; ${headerBgStyle}">
            <!-- Title -->
            <div style="color: ${signageData.titleColor || '#ffffff'}; font-size: 36px; font-weight: bold; margin-bottom: 40px; text-align: center;">
              ${signageData.title || 'SIGNAGE TITLE'}
            </div>
            
            <!-- QR Code - Large and Centered -->
            ${(() => {
              const qrData = getQRCodeValueFromConfig(signageData);
              if (!qrData.isExistingImage && !qrData.value) return '';
              return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  ${qrData.isExistingImage && qrData.imageData ? `
                    <img src="${qrData.imageData}" alt="QR Code" style="width: 300px; height: 300px; object-fit: contain;" />
                  ` : qrData.value ? `
                    <div style="width: 300px; height: 300px; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; text-align: center;">
                      QR Code
                    </div>
                  ` : ''}
                  <div style="font-size: 18px; text-align: center; color: #334155; margin-top: 16px; font-weight: 500;">Scan QR Code</div>
                </div>
              `;
            })()}
          </div>

          <!-- Footer -->
          <div style="padding: 12px 16px; background: #000000; text-align: center;">
            <div style="color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              ${signageData.footerText || 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually'}
            </div>
          </div>

        </div>
      ` : `
        <div style="max-width: 800px; margin: 0 auto; background: ${bgColor}; border-radius: 8px; overflow: hidden; border: 4px solid #000000; position: relative;">
          ${watermarkHTMLPNG}
          
          <!-- Header Section -->
          <div style="padding: 24px 16px; text-align: center; ${headerBgStyle}">
            ${signageData.warningIcon ? `
              <div style="margin-bottom: 12px; display: flex; justify-content: center;">
                <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                  <img src="${signageData.warningIcon}" alt="Warning Icon" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              </div>
            ` : ''}
            <div style="color: ${signageData.titleColor || '#ffffff'}; font-size: 24px; font-weight: bold; margin-bottom: 8px;">
              ${signageData.title || 'SIGNAGE TITLE'}
            </div>
            ${signageData.purpose ? `
              <div style="color: white; font-size: 14px; opacity: 0.9;">
                ${signageData.purpose}
              </div>
            ` : ''}
          </div>

          <!-- Location -->
          ${signageData.location ? `
            <div style="padding: 12px 16px; background: rgba(255,255,255,0.9); border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 12px;">
                <span style="color: #64748b; text-transform: uppercase;">Location: </span>
                <span style="color: #0f172a;">${signageData.location}</span>
              </div>
            </div>
          ` : ''}

          <!-- Description -->
          ${signageData.description ? `
            <div style="padding: 12px 16px; background: rgba(248,250,252,0.9); border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 12px; color: #334155; line-height: 1.6;">
                ${signageData.description}
              </div>
            </div>
          ` : ''}

          <!-- Hazards -->
          ${displayHazards.length > 0 ? `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
              <div style="background: ${headerColor}; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  ⚠ HAZARDS
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(${
                displayHazards.length <= 4 ? 4 :
                displayHazards.length <= 6 ? 3 :
                displayHazards.length <= 12 ? 4 :
                displayHazards.length <= 20 ? 5 :
                6
              }, 1fr); gap: 8px;">
                ${displayHazards.map((hazard, index) => `
                  <div style="background: #dc2626; border-radius: 4px; padding: 8px; text-align: center;">
                    <div style="width: 20px; height: 20px; background: white; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto; font-size: 10px; font-weight: bold;">
                      ${index + 1}
                    </div>
                    <div style="font-size: 9px; color: white; text-transform: uppercase; line-height: 1.2;">
                      ⚠ ${hazard}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- PPE -->
          ${(signageData.ppe.length > 0 || (signageData.customPPEImages && signageData.customPPEImages.length > 0)) ? `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
              <div style="background: #2563eb; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  🛡 MANDATORY PPE (${signageData.ppe.length + (signageData.customPPEImages?.length || 0)})
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(${(signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 4 ? 4 : (signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 8 ? 4 : 6}, 1fr); gap: 8px;">
                ${signageData.ppe.map(ppe => `
                  <div style="background: #2563eb; border-radius: 4px; padding: 12px; text-align: center;">
                    <div style="color: white; font-size: 10px; text-transform: uppercase; line-height: 1.2;">
                      ${getPPELabel(ppe)}
                    </div>
                  </div>
                `).join('')}
                ${signageData.customPPEImages ? signageData.customPPEImages.map((ppe, index) => `
                  <div style="background: #2563eb; border-radius: 4px; padding: 12px; text-align: center;">
                    <img src="${ppe.image}" alt="${ppe.name || `Custom PPE ${index + 1}`}" style="width: 50px; height: 50px; object-fit: contain; margin: 0 auto 4px auto;" />
                    <div style="color: white; font-size: 10px; text-transform: uppercase; line-height: 1.2;">
                      ${ppe.name || `Custom PPE ${index + 1}`}
                    </div>
                  </div>
                `).join('') : ''}
              </div>
            </div>
          ` : ''}

          <!-- Procedures -->
          ${displayProcedures.length > 0 ? `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
              <div style="background: #16a34a; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  ✓ SAFETY PROCEDURES
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(${
                displayProcedures.length <= 4 ? 4 :
                displayProcedures.length <= 6 ? 3 :
                displayProcedures.length <= 12 ? 4 :
                displayProcedures.length <= 20 ? 5 :
                6
              }, 1fr); gap: 8px;">
                ${displayProcedures.map((procedure, index) => `
                  <div style="background: #16a34a; border-radius: 4px; padding: 8px; text-align: center;">
                    <div style="width: 20px; height: 20px; background: white; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 4px auto; font-size: 10px; font-weight: bold;">
                      ${index + 1}
                    </div>
                    <div style="font-size: 9px; color: white; text-transform: uppercase; line-height: 1.2;">
                      ${procedure}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Permit Required -->
          ${signageData.permitRequired === 'yes' ? `
            <div style="padding: 16px; background: #b91c1c; border-bottom: 1px solid #e2e8f0;">
              <div style="color: white; font-size: 14px; font-weight: bold; text-transform: uppercase;">
                🚫 PERMIT REQUIRED
              </div>
              ${signageData.permitDetails ? `
                <div style="color: white; font-size: 12px; margin-top: 4px; opacity: 0.9;">
                  ${signageData.permitDetails}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Emergency Contacts + QR Code - Side by side -->
          <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; display: flex; gap: 12px;">
            <!-- Emergency Contacts -->
            <div style="flex: 1;">
              <div style="background: #f97316; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px;">
                <div style="color: white; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  📞 EMERGENCY CONTACTS
                </div>
              </div>
              <div style="background: #fff7ed; border-radius: 4px; padding: 8px 12px;">
                ${signageData.emergencyContacts.map(contact => `
                  <div style="font-size: 12px; color: #9a3412; margin-bottom: 4px;">
                    <span style="font-weight: bold;">${contact.label}:</span> ${contact.number}
                  </div>
                `).join('')}
              </div>
            </div>
            <!-- QR Code -->
            ${(() => {
              const qrData = getQRCodeValueFromConfig(signageData);
              if (!qrData.isExistingImage && !qrData.value) return '';
              return `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
                  ${qrData.isExistingImage && qrData.imageData ? `
                    <img src="${qrData.imageData}" alt="QR Code" style="width: 50px; height: 50px; object-fit: contain;" />
                  ` : qrData.value ? `
                    <div style="width: 50px; height: 50px; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; text-align: center;">
                      QR Code
                    </div>
                  ` : ''}
                  <div style="font-size: 8px; text-align: center; color: #64748b; margin-top: 4px;">Scan</div>
                </div>
              `;
            })()}
          </div>

          <!-- Footer -->
          <div style="padding: 12px 16px; background: #000000; text-align: center;">
            <div style="color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              ${signageData.footerText || 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually'}
            </div>
          </div>

        </div>
      `;
      
      document.body.appendChild(exportElement);
      
      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Determine scale based on resolution
      let scale = 2;
      if (signageData.resolution === '300dpi') {
        scale = 4;
      } else if (signageData.resolution === '72dpi') {
        scale = 2;
      }

      // Capture with html2canvas
      const canvas = await html2canvas(exportElement, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Convert all oklch/modern CSS colors to standard formats
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const element = el as HTMLElement;
            const computedStyle = window.getComputedStyle(element);
            
            // Override computed styles that might use oklch
            if (computedStyle.color && computedStyle.color.includes('oklch')) {
              element.style.color = computedStyle.color;
            }
            if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
              element.style.backgroundColor = computedStyle.backgroundColor;
            }
            if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
              element.style.borderColor = computedStyle.borderColor;
            }
          });
        }
      });
      
      // Remove temp element
      document.body.removeChild(exportElement);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate PNG');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${signageData.title.replace(/[^a-z0-9]/gi, '_') || 'signage'}_${signageData.size}_${signageData.resolution}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('✅ PNG downloaded successfully!');
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('❌ PNG export error:', error);
      toast.error(`Failed to generate PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePrint = () => {
    // Use window.print with proper setup
    window.print();
  };

  const getCategoryIcon = () => {
    const iconClass = "w-12 h-12";
    switch (config.icon) {
      case 'AlertTriangle': return <AlertTriangle className={iconClass} />;
      case 'AlertCircle': return <AlertCircle className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      case 'Ban': return <Ban className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      case 'Droplet': return <Droplet className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Waves': return <Waves className={iconClass} />;
      case 'Car': return <Car className={iconClass} />;
      case 'Info': return <Info className={iconClass} />;
      default: return <Settings className={iconClass} />;
    }
  };

  // Display all items
  const displayProcedures = signageData.procedures || [];
  const displayHazards = signageData.hazards || [];
  
  // Get QR code data using helper function
  const qrCodeData = getQRCodeValueFromConfig(signageData);
  const qrCodeValue = qrCodeData.value;
  const showQRCode = qrCodeValue !== null || qrCodeData.isExistingImage;
  
  // Determine header background style (background image behind the header)
  const headerBackgroundStyle = signageData.backgroundImage 
    ? { 
        backgroundImage: `url(${signageData.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { 
        background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`
      };
  
  // Overall container background - always white
  const containerBackgroundStyle = { backgroundColor: '#FFFFFF' };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          /* Hide everything except the signage */
          body * {
            visibility: hidden;
          }
          
          /* Make the signage and its parents visible */
          #printable-signage-container,
          #printable-signage-container *,
          #signage-preview-content,
          #signage-preview-content * {
            visibility: visible !important;
          }
          
          /* Position the signage container at the top of the page */
          #printable-signage-container {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: visible !important;
          }
          
          /* Ensure the signage content fills the entire page */
          #signage-preview-content {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 4px solid black !important;
            border-radius: 8px !important;
            overflow: visible !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            box-shadow: none !important;
            transform: none !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          /* Force all background colors, gradients, and images to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Ensure SVG and canvas elements are visible */
          svg, canvas {
            display: block !important;
          }
          
          /* Preserve all inline styles */
          [style] {
            display: block !important;
          }
          
          /* Optimize page layout - Set specific size based on signage size */
          @page {
            size: ${
              signageData.size === 'a3' ? 'A3' : 
              'A4'
            } portrait;
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

      <div className="flex items-center justify-between mb-6 no-print">
        <h2 className="text-slate-900">Live Preview</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {signageData.size.toUpperCase()} - {signageData.resolution}
          </span>
        </div>
      </div>

      {/* Preview Container - Fit everything on one page */}
      <div id="printable-signage-container" className="bg-white rounded-lg p-4 mb-6 overflow-hidden">
        <div 
          id="signage-preview-content" 
          className={`max-w-2xl mx-auto shadow-2xl rounded-lg overflow-hidden border-4 border-black bg-white relative ${
            signageData.qrCodeConfig?.showOnlyTitleAndQR ? 'flex flex-col min-h-full' : ''
          }`}
          style={containerBackgroundStyle}
        >
          {/* Watermark - Always single watermark positioned (default: bottom-right) */}
          {brandingConfig?.logo && brandingConfig?.enabled && (
            <div 
              className="absolute pointer-events-none z-0"
              style={{
                ...(brandingConfig.logoPosition === 'top-left' ? { top: '20px', left: '20px' } :
                    brandingConfig.logoPosition === 'top-right' ? { top: '20px', right: '20px' } :
                    brandingConfig.logoPosition === 'bottom-left' ? { bottom: '20px', left: '20px' } :
                    brandingConfig.logoPosition === 'center-top' ? { top: '20px', left: '50%', transform: 'translateX(-50%)' } :
                    brandingConfig.logoPosition === 'center-bottom' ? { bottom: '20px', left: '50%', transform: 'translateX(-50%)' } :
                    { bottom: '20px', right: '20px' }), // Default: bottom-right
                width: `${brandingConfig.logoSize || 100}px`,
                height: 'auto',
                opacity: (brandingConfig.logoOpacity || 100) / 100,
              }}
            >
              <img 
                src={brandingConfig.logo} 
                alt="Watermark" 
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          )}
          
          {/* Full Page QR Code Layout (when showOnlyTitleAndQR is true) */}
          {signageData.qrCodeConfig?.showOnlyTitleAndQR && showQRCode ? (
            <>
              {/* Title and QR Code Section - Full Page with White Background */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-white">
                {/* Title */}
                <div className="mb-6 tracking-wide text-center" style={{ color: signageData.titleColor || '#000000' }}>
                  {signageData.title ? (
                    <h1 className="text-3xl md:text-4xl font-bold">{signageData.title}</h1>
                  ) : (
                    <h1 className="text-3xl md:text-4xl font-bold">SIGNAGE TITLE</h1>
                  )}
                </div>
                
                {/* QR Code - Large and Centered on White Background */}
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg">
                  {signageData.qrCodeConfig.type === 'existing' && signageData.qrCodeConfig.existingQRCodeImage ? (
                    <img 
                      src={signageData.qrCodeConfig.existingQRCodeImage} 
                      alt="QR Code" 
                      className="w-64 h-64 md:w-80 md:h-80 object-contain"
                    />
                  ) : qrCodeValue ? (
                    <QRCodeSVG value={qrCodeValue} size={320} />
                  ) : null}
                  <div className="text-base md:text-lg text-center text-slate-700 mt-4 font-medium">Scan QR Code</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Header Section - Colored with gradient and optional background image */}
              <div 
                ref={headerRef}
                className="px-4 py-4 text-center relative overflow-visible" 
                style={headerBackgroundStyle}
              >
                {/* Client & Contractor Logos - Draggable and Resizable */}
                {brandingConfig?.headerLogosEnabled && (
                  <>
                    {/* Client Logo */}
                    {brandingConfig?.clientLogo && (
                      <div
                        data-logo-type="client"
                        className="absolute cursor-move z-20 group select-none"
                        style={{
                          left: `${brandingConfig.clientLogoPosition?.x || 5}%`,
                          top: `${brandingConfig.clientLogoPosition?.y || 5}%`,
                          width: `${brandingConfig.clientLogoSize?.width || 96}px`,
                          height: `${brandingConfig.clientLogoSize?.height || 64}px`,
                          border: '2px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '4px',
                          padding: 0,
                          boxSizing: 'border-box',
                          transformOrigin: 'top left',
                        }}
                        onMouseDown={(e) => {
                          // Don't start drag if clicking on resize handle
                          if (!(e.target as HTMLElement).closest('.resize-handle')) {
                            handleLogoMouseDown(e, 'client');
                          }
                        }}
                      >
                        <img 
                          src={brandingConfig.clientLogo} 
                          alt="Client Logo" 
                          className="pointer-events-none"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                            padding: 0,
                            margin: 0,
                          }}
                          draggable="false"
                        />
                        {/* Resize handle */}
                        <div
                          className="resize-handle absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-tl-lg cursor-nwse-resize opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center z-10 shadow-md"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleResizeMouseDown(e, 'client');
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Maximize2 className="w-3 h-3 text-white" />
                        </div>
                        {/* Drag indicator */}
                        <div className="absolute top-0 left-0 w-full h-6 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Move className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    )}
                    
                    {/* Contractor Logo */}
                    {brandingConfig?.contractorLogo && (
                      <div
                        data-logo-type="contractor"
                        className="absolute cursor-move z-20 group select-none"
                        style={{
                          left: `${brandingConfig.contractorLogoPosition?.x || 95}%`,
                          top: `${brandingConfig.contractorLogoPosition?.y || 5}%`,
                          width: `${brandingConfig.contractorLogoSize?.width || 96}px`,
                          height: `${brandingConfig.contractorLogoSize?.height || 64}px`,
                          border: '2px solid rgba(168, 85, 247, 0.3)',
                          borderRadius: '4px',
                          padding: 0,
                          boxSizing: 'border-box',
                          transformOrigin: 'top left',
                        }}
                        onMouseDown={(e) => {
                          // Don't start drag if clicking on resize handle
                          if (!(e.target as HTMLElement).closest('.resize-handle')) {
                            handleLogoMouseDown(e, 'contractor');
                          }
                        }}
                      >
                        <img 
                          src={brandingConfig.contractorLogo} 
                          alt="Contractor Logo" 
                          className="pointer-events-none"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                            padding: 0,
                            margin: 0,
                          }}
                          draggable="false"
                        />
                        {/* Resize handle */}
                        <div
                          className="resize-handle absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-tl-lg cursor-nwse-resize opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center z-10 shadow-md"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleResizeMouseDown(e, 'contractor');
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Maximize2 className="w-3 h-3 text-white" />
                        </div>
                        {/* Drag indicator */}
                        <div className="absolute top-0 left-0 w-full h-6 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Move className="w-3 h-3 text-purple-600" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Icons - Only show if user uploaded one */}
                {signageData.warningIcon && (
                  <div className="flex justify-center gap-3 mb-2 text-white opacity-90">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <img 
                        src={signageData.warningIcon} 
                        alt="Warning Icon" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {/* Title */}
                <div className="mb-1 tracking-wide" style={{ color: signageData.titleColor || '#ffffff' }}>
                  {signageData.title ? (
                    <h1 className="text-xl">{signageData.title}</h1>
                  ) : (
                    <h1 className="text-xl">SIGNAGE TITLE</h1>
                  )}
                </div>
                
                {/* Purpose */}
                {signageData.purpose && (
                  <p className="text-white text-sm opacity-90">
                    {signageData.purpose}
                  </p>
                )}
              </div>

              {/* Location Section */}
              {signageData.location && (
                <div className="px-3 py-2 bg-white border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <div className="text-xs">
                      <span className="text-slate-500 uppercase">Location: </span>
                      <span className="text-slate-900">{signageData.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Description */}
              {signageData.description && (
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {signageData.description}
                  </p>
                </div>
              )}


              {/* Hazards / Warnings Section */}
              {displayHazards.length > 0 && (
                <div className="px-3 py-2 border-b border-slate-200">
                  <div style={{ background: config.color, padding: '8px 12px', borderRadius: '4px', marginBottom: '12px' }}>
                    <div className="text-white text-xs font-bold uppercase">
                      ⚠ HAZARDS
                    </div>
                  </div>
                  <div className={`grid gap-2 ${
                    displayHazards.length <= 4 ? 'grid-cols-4' :
                    displayHazards.length <= 6 ? 'grid-cols-3' :
                    displayHazards.length <= 12 ? 'grid-cols-4' :
                    displayHazards.length <= 20 ? 'grid-cols-5' :
                    'grid-cols-6'
                  }`}>
                    {displayHazards.map((hazard, index) => (
                      <div key={index} className="bg-red-600 rounded p-2 text-center">
                        <div className="w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center mx-auto mb-1 text-[9px] font-bold">
                          {index + 1}
                        </div>
                        <div className="text-[9px] text-white uppercase leading-tight line-clamp-2">
                          ⚠ {hazard}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PPE Section - Compact */}
              {(signageData.ppe.length > 0 || (signageData.customPPEImages && signageData.customPPEImages.length > 0)) && (
                <div className="px-3 py-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-blue-600 rounded text-xs">
                    <Shield className="w-3 h-3 text-white" />
                    <h3 className="text-white uppercase tracking-wide">
                      Mandatory PPE ({signageData.ppe.length + (signageData.customPPEImages?.length || 0)})
                    </h3>
                  </div>
                  <div className={`grid gap-2 ${
                    (signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 4 ? 'grid-cols-4' :
                    (signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 6 ? 'grid-cols-3' :
                    (signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 12 ? 'grid-cols-4' :
                    (signageData.ppe.length + (signageData.customPPEImages?.length || 0)) <= 20 ? 'grid-cols-5' :
                    'grid-cols-6'
                  }`}>
                    {signageData.ppe.map((ppe) => (
                      <div key={ppe} className="bg-blue-600 rounded p-2 text-center">
                        <div className="flex justify-center mb-1 text-white">
                          {getPPEIcon(ppe, 'w-6 h-6')}
                        </div>
                        <div className="text-[9px] text-white uppercase leading-tight">
                          {getPPELabel(ppe)}
                        </div>
                      </div>
                    ))}
                    {/* Custom PPE Images */}
                    {signageData.customPPEImages && signageData.customPPEImages.map((ppe, index) => (
                      <div key={`custom-${index}`} className="bg-blue-600 rounded p-2 text-center">
                        <div className="flex justify-center mb-1">
                          <img 
                            src={ppe.image} 
                            alt={ppe.name || `Custom PPE ${index + 1}`}
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                        <div className="text-[9px] text-white uppercase leading-tight">
                          {ppe.name || `Custom PPE ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Procedures Section - Compact */}
              {displayProcedures.length > 0 && (
                <div className="px-3 py-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-green-600 rounded text-xs">
                    <Shield className="w-3 h-3 text-white" />
                    <h3 className="text-white uppercase tracking-wide">
                      Safety Procedures
                    </h3>
                  </div>
                  <div className={`grid gap-2 ${
                    displayProcedures.length <= 4 ? 'grid-cols-4' :
                    displayProcedures.length <= 6 ? 'grid-cols-3' :
                    displayProcedures.length <= 12 ? 'grid-cols-4' :
                    displayProcedures.length <= 20 ? 'grid-cols-5' :
                    'grid-cols-6'
                  }`}>
                    {displayProcedures.map((procedure, index) => (
                      <div key={index} className="bg-green-600 rounded p-2 text-center">
                        <div className="w-5 h-5 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-1 text-[9px] font-bold">
                          {index + 1}
                        </div>
                        <div className="text-[9px] text-white uppercase leading-tight line-clamp-2">
                          {procedure}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permit Required Section */}
              {signageData.permitRequired === 'yes' && (
                <div className="px-4 py-3 bg-red-700 border-b border-slate-200">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                      <Ban className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="uppercase tracking-wider text-sm">Permit Required</div>
                      {signageData.permitDetails && (
                        <div className="text-xs mt-0.5 opacity-90">{signageData.permitDetails}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Contacts + QR Code - Side by side */}
              <div className="px-3 py-2 border-b border-slate-200 flex gap-3">
                {/* Emergency Contacts */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 px-2 py-1 bg-orange-500 rounded text-xs">
                    <Phone className="w-3 h-3 text-white" />
                    <h3 className="text-white uppercase tracking-wide">Emergency</h3>
                  </div>
                  <div className="bg-orange-50 rounded px-2 py-1 space-y-0.5">
                    {signageData.emergencyContacts.map((contact, index) => (
                      <div key={index} className="text-xs text-orange-900">
                        <span className="font-semibold">{contact.label}:</span> {contact.number}
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code */}
                {showQRCode && (
                  <div className="flex flex-col items-center justify-center bg-white p-2 rounded border border-slate-200">
                    {signageData.qrCodeConfig?.type === 'existing' && signageData.qrCodeConfig.existingQRCodeImage ? (
                      <img 
                        src={signageData.qrCodeConfig.existingQRCodeImage} 
                        alt="QR Code" 
                        className="w-[50px] h-[50px] object-contain"
                      />
                    ) : qrCodeValue ? (
                      <QRCodeSVG value={qrCodeValue} size={50} />
                    ) : null}
                    <div className="text-[8px] text-center text-slate-600 mt-1">Scan</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-3 py-2 bg-black text-white text-center">
            <div className="text-[9px] uppercase tracking-wider">
              {signageData.footerText || 'ISO 7010 Compliant • Last Updated: December 2025 • Review Annually'}
            </div>
          </div>

        </div>
      </div>

      {/* Export Buttons */}
      <div className="space-y-3 no-print">
        <button
          onClick={() => setShowDownloadModal(true)}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>
        <button
          onClick={handlePrint}
          className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-5 h-5" />
          <span>Print</span>
        </button>
      </div>

      {/* Download Format Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Choose Download Format</h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleExportPDF();
                  setShowDownloadModal(false);
                }}
                className="w-full px-6 py-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-400 rounded-lg transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileDown className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">PDF Document</div>
                  <div className="text-sm text-slate-600">High-quality PDF for printing</div>
                </div>
              </button>

              <button
                onClick={() => {
                  handleExportPNG();
                  setShowDownloadModal(false);
                }}
                className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-lg transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">PNG Image</div>
                  <div className="text-sm text-slate-600">High-resolution image format</div>
                </div>
              </button>

              <button
                onClick={() => {
                  handlePrint();
                  setShowDownloadModal(false);
                }}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-400 rounded-lg transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">Print Directly</div>
                  <div className="text-sm text-slate-600">Send to printer immediately</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowDownloadModal(false)}
              className="mt-4 w-full px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg no-print">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="mb-1">
              Signage is optimized to fit all content on a single {signageData.size.toUpperCase()} page.
            </p>
            <p className="text-xs text-blue-700">
              All sections are automatically scaled and limited to ensure professional print-ready output.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}