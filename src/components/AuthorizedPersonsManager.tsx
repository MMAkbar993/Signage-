import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { AuthorizedPerson, SignageCategory } from '../types/signage';
import { Plus, Trash2, Upload, User, Clock, Phone, Image as ImageIcon, Briefcase, Hash, Building2, Award, Calendar, Eye, ChevronDown, Printer, Layout, Edit2 } from 'lucide-react';
import { getCategoryConfig } from '../utils/categoryConfig';

const SHIFT_OPTIONS = [
  '1st Shift',
  '2nd Shift',
  '3rd Shift',
  '4th Shift',
];

const PAPER_SIZE_OPTIONS = [
  { value: 'a5', label: 'A5 (148 × 210 mm)' },
  { value: 'a4', label: 'A4 (210 × 297 mm)' },
  { value: 'a3', label: 'A3 (297 × 420 mm)' },
  { value: 'letter', label: 'Letter (216 × 279 mm)' },
  { value: 'legal', label: 'Legal (216 × 356 mm)' },
];

const ORIENTATION_OPTIONS = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
];

const CATEGORY_OPTIONS: { value: SignageCategory; label: string; color: string }[] = [
  { value: 'danger', label: 'Danger', color: '#D60000' },
  { value: 'warning', label: 'Warning', color: '#FFD600' },
  { value: 'mandatory', label: 'Mandatory', color: '#005BBB' },
  { value: 'prohibition', label: 'Prohibition', color: '#D60000' },
  { value: 'emergency', label: 'Emergency', color: '#009E2A' },
];

export function AuthorizedPersonsManager() {
  const [persons, setPersons] = useState<AuthorizedPerson[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<AuthorizedPerson[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'single' | 'multi' | null>(null);
  const [editingPerson, setEditingPerson] = useState<AuthorizedPerson | null>(null);
  
  // Manual resize controls
  const [cardScale, setCardScale] = useState<number>(100); // 20-150%
  const [photoScale, setPhotoScale] = useState<number>(100); // 50-150%
  const [multiPaperSize, setMultiPaperSize] = useState<'a5' | 'a4' | 'a3' | 'letter' | 'legal'>('a4');
  const [multiOrientation, setMultiOrientation] = useState<'landscape' | 'portrait'>('landscape');
  
  const [formData, setFormData] = useState({
    name: '',
    shift: '',
    designation: '',
    employeeId: '',
    department: '',
    contact: '',
    certifications: '',
    validFrom: '',
    validUntil: '',
    photo: '',
    format: 'paper' as 'paper',
    category: 'mandatory' as SignageCategory,
    paperSize: 'a4' as 'a5' | 'a4' | 'a3' | 'letter' | 'legal',
    orientation: 'landscape' as 'landscape' | 'portrait',
    headerText: 'AUTHORIZED PERSONNEL',
    footerText: 'ISO 7010 Compliant • EHS Safety',
    backgroundColor: '#ffffff',
  });
  
  // Global settings for header and footer (applied to all signage)
  const [headerText, setHeaderText] = useState('AUTHORIZED PERSONNEL');
  const [footerText, setFooterText] = useState('ISO 7010 Compliant • EHS Safety');
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#ffffff'); // Fallback color if person doesn't have backgroundColor
  const [previewImage, setPreviewImage] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('authorizedPersons');
    if (saved) {
      const loadedPersons = JSON.parse(saved);
      const updatedPersons = loadedPersons.map((person: any) => ({
        ...person,
        format: 'paper',
        category: person.category || 'mandatory',
        backgroundColor: person.backgroundColor || '#ffffff',
      }));
      setPersons(updatedPersons);
    }
  }, []);

  // Save to localStorage whenever persons change
  useEffect(() => {
    localStorage.setItem('authorizedPersons', JSON.stringify(persons));
    window.dispatchEvent(new CustomEvent('authorizedPersonsUpdated', { detail: persons }));
  }, [persons]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, photo: base64 });
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPerson = () => {
    if (formData.name && formData.designation && formData.department && formData.contact) {
      const newPerson: AuthorizedPerson = {
        id: Date.now().toString(),
        name: formData.name,
        shift: formData.shift,
        designation: formData.designation,
        employeeId: formData.employeeId,
        department: formData.department,
        contact: formData.contact,
        certifications: formData.certifications,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        photo: formData.photo,
        format: formData.format,
        category: formData.category,
        backgroundColor: formData.backgroundColor || '#ffffff',
        ...(formData.format === 'paper' && {
          paperSize: formData.paperSize,
          orientation: formData.orientation,
        }),
      };
      setPersons([...persons, newPerson]);
      setFormData({ 
        name: '', 
        shift: '', 
        designation: '', 
        employeeId: '', 
        department: '', 
        contact: '', 
        certifications: '', 
        validFrom: '', 
        validUntil: '', 
        photo: '',
        format: 'paper',
        category: 'mandatory',
        paperSize: 'a4',
        orientation: 'landscape',
        backgroundColor: '#ffffff',
      });
      setPreviewImage('');
    }
  };

  const handleRemovePerson = (id: string) => {
    setPersons(persons.filter(p => p.id !== id));
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setSelectedPersons([]);
    setViewMode(null);
  };

  const handleCheckboxToggle = (person: AuthorizedPerson) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(person.id)) {
        newSet.delete(person.id);
      } else {
        if (newSet.size < 6) {
          newSet.add(person.id);
        }
      }
      return newSet;
    });
  };

  const handleGenerateMultiSignage = () => {
    const selected = persons.filter(p => selectedIds.has(p.id));
    if (selected.length > 0) {
      setViewMode('multi');
      setSelectedPersons(selected);
    }
  };

  const handleViewSignage = (person: AuthorizedPerson) => {
    setViewMode('multi');
    setSelectedPersons([person]);
    // Scroll to preview after a short delay to ensure it's rendered
    setTimeout(() => {
      const previewElement = document.getElementById('signage-preview-section');
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleEditPerson = (person: AuthorizedPerson) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      shift: person.shift || '',
      designation: person.designation,
      employeeId: person.employeeId || '',
      department: person.department,
      contact: person.contact,
      certifications: person.certifications || '',
      validFrom: person.validFrom || '',
      validUntil: person.validUntil || '',
      photo: person.photo || '',
      format: person.format,
      category: person.category,
      paperSize: person.paperSize || 'a4',
      orientation: person.orientation || 'landscape',
      headerText: headerText,
      footerText: footerText,
      backgroundColor: person.backgroundColor || '#ffffff',
    });
    setPreviewImage(person.photo || '');
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('add-person-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleUpdatePerson = () => {
    if (editingPerson && formData.name && formData.designation && formData.department && formData.contact) {
      const updatedPerson: AuthorizedPerson = {
        ...editingPerson,
        name: formData.name,
        shift: formData.shift,
        designation: formData.designation,
        employeeId: formData.employeeId,
        department: formData.department,
        contact: formData.contact,
        certifications: formData.certifications,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        photo: formData.photo,
        format: formData.format,
        category: formData.category,
        backgroundColor: formData.backgroundColor || '#ffffff',
        ...(formData.format === 'paper' && {
          paperSize: formData.paperSize,
          orientation: formData.orientation,
        }),
      };
      setPersons(persons.map(p => p.id === editingPerson.id ? updatedPerson : p));
      // Reset form
      setEditingPerson(null);
      setFormData({ 
        name: '', 
        shift: '', 
        designation: '', 
        employeeId: '', 
        department: '', 
        contact: '', 
        certifications: '', 
        validFrom: '', 
        validUntil: '', 
        photo: '',
        format: 'paper',
        category: 'mandatory',
        paperSize: 'a4',
        orientation: 'landscape',
        backgroundColor: '#ffffff',
      });
      setPreviewImage('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setFormData({ 
      name: '', 
      shift: '', 
      designation: '', 
      employeeId: '', 
      department: '', 
      contact: '', 
      certifications: '', 
      validFrom: '', 
      validUntil: '', 
      photo: '',
      format: 'paper',
      category: 'mandatory',
      paperSize: 'a4',
      orientation: 'landscape',
      backgroundColor: '#ffffff',
    });
    setPreviewImage('');
  };

  const handlePrint = () => {
    // Use the native print functionality with proper media queries
    window.print();
  };

  const renderMultiPersonLandscape = (persons: AuthorizedPerson[]) => {
    if (!persons || persons.length === 0) {
      return (
        <div className="text-center py-12 text-slate-500">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p>No persons selected</p>
        </div>
      );
    }
    const config = getCategoryConfig(persons[0].category);
    const displayPersons = persons.slice(0, 6);
    const personCount = displayPersons.length;
    
    // Use multi-person controls
    const paperSize = multiPaperSize;
    const orientation = multiOrientation;
    
    // Full paper dimensions in mm
    const paperDimensions = {
      a5: { landscape: { width: 210, height: 148 }, portrait: { width: 148, height: 210 } },
      a4: { landscape: { width: 297, height: 210 }, portrait: { width: 210, height: 297 } },
      a3: { landscape: { width: 420, height: 297 }, portrait: { width: 297, height: 420 } },
      letter: { landscape: { width: 279, height: 216 }, portrait: { width: 216, height: 279 } },
      legal: { landscape: { width: 356, height: 216 }, portrait: { width: 216, height: 356 } }
    };
    
    // Get dimensions
    const fullDimensions = paperDimensions[paperSize][orientation];
    const width = fullDimensions.width;
    const height = fullDimensions.height;
    
    // Dynamic grid layout based on person count
    // 1 person: 1 column, 1 row
    // 2 persons: 2 columns, 1 row
    // 3 persons: 3 columns, 1 row
    // 4 persons: 2 columns, 2 rows
    // 5-6 persons: 3 columns, 2 rows
    let columns = 3;
    let rows = 2;
    
    if (personCount === 1) {
      columns = 1;
      rows = 1;
    } else if (personCount === 2) {
      columns = 2;
      rows = 1;
    } else if (personCount === 3) {
      columns = 3;
      rows = 1;
    } else if (personCount === 4) {
      columns = 2;
      rows = 2;
    } else {
      columns = 3;
      rows = 2;
    }
    
    // Calculate card dimensions based on manual scale and dynamic grid
    const baseCardWidth = (width - 50) / columns;
    const baseCardHeight = (height - 90) / rows;
    const cardWidth = baseCardWidth * (cardScale / 100);
    const cardHeight = baseCardHeight * (cardScale / 100);
    
    // Calculate photo size based on manual scale (larger for better identification)
    const basePhotoSize = 80;
    const photoSize = basePhotoSize * (photoScale / 100);
    
    return (
      <div id="authorized-preview-content" style={{ display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: '#f8fafc' }}>
        <div style={{ 
          width: `${width}mm`,
          height: `${height}mm`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          border: `4px solid ${config.color}`,
          backgroundColor: config.color,
          boxSizing: 'border-box',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div 
            style={{ 
              flexShrink: 0,
              padding: '15px',
              textAlign: 'center',
              background: config.color,
              color: '#ffffff',
              borderBottom: `3px solid ${config.borderColor}`
            }}
          >
            <div style={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '1.2'
            }}>
              {headerText}
            </div>
          </div>

          {/* Grid of Persons - Dynamic Grid Layout with Numbers */}
          <div style={{ 
            flex: '1 1 0',
            minHeight: 0,
            padding: '15px',
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: '12px',
            overflow: 'auto'
          }}>
            {displayPersons.map((person, index) => (
              <div 
                key={person.id}
                style={{ 
                  border: `3px solid ${config.color}`,
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: person.backgroundColor || cardBackgroundColor,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                  minWidth: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: config.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 10
                }}>
                  {index + 1}
                </div>
                
                {/* Photo Centered at Top */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt={person.name}
                      style={{
                        width: `${photoSize}px`,
                        height: `${photoSize}px`,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: `3px solid ${config.color}`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: `${photoSize}px`,
                      height: `${photoSize}px`,
                      borderRadius: '8px',
                      border: `3px solid ${config.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f1f5f9'
                    }}>
                      <User style={{ width: `${photoSize * 0.5}px`, height: `${photoSize * 0.5}px`, color: '#94a3b8' }} />
                    </div>
                  )}
                </div>

                {/* All Details Below Photo in Order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px', flex: 1, minHeight: 0 }}>
                  {/* Name */}
                  <div style={{ 
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#1e293b',
                    fontWeight: 700,
                    lineHeight: '1.2',
                    marginBottom: '2px'
                  }}>
                    {person.name}
                  </div>
                  
                  {/* Employee ID */}
                  {person.employeeId && (
                    <div style={{ 
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Hash style={{ width: '10px', height: '10px', color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ color: '#64748b', fontWeight: 600 }}>ID:</span>
                      <span style={{ color: '#1e293b', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {person.employeeId}
                      </span>
                    </div>
                  )}
                  
                  {/* Designation */}
                  {person.designation && (
                    <div style={{ 
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Briefcase style={{ width: '10px', height: '10px', color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ color: '#64748b', fontWeight: 600 }}>Role:</span>
                      <span style={{ color: config.color, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {person.designation}
                      </span>
                    </div>
                  )}
                  
                  {/* Department */}
                  {person.department && (
                    <div style={{ 
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Building2 style={{ width: '10px', height: '10px', color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ color: '#64748b', fontWeight: 600 }}>Dept:</span>
                      <span style={{ color: '#1e293b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {person.department}
                      </span>
                    </div>
                  )}
                  
                  {/* Shift */}
                  {person.shift && (
                    <div style={{ 
                      padding: '5px 6px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      backgroundColor: config.color,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '10px'
                    }}>
                      <Clock style={{ width: '10px', height: '10px', display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                      {person.shift}
                    </div>
                  )}
                  
                  {/* Contact */}
                  {person.contact && (
                    <div style={{ 
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Phone style={{ width: '10px', height: '10px', color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ color: '#1e293b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {person.contact}
                      </span>
                    </div>
                  )}
                  
                  {/* Certifications */}
                  {person.certifications && (
                    <div style={{ 
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fde047',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Award style={{ width: '10px', height: '10px', color: '#f59e0b', flexShrink: 0 }} />
                      <span style={{ 
                        color: '#92400e',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        fontSize: '9px'
                      }}>
                        {person.certifications}
                      </span>
                    </div>
                  )}
                  
                  {/* Valid From / Valid Until */}
                  {(person.validFrom || person.validUntil) && (
                    <div style={{ 
                      padding: '4px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      fontSize: '8px'
                    }}>
                      {person.validFrom && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: person.validUntil ? '2px' : '0' }}>
                          <Calendar style={{ width: '9px', height: '9px', color: '#16a34a', flexShrink: 0 }} />
                          <span style={{ color: '#16a34a', fontWeight: 600 }}>From:</span>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>{new Date(person.validFrom).toLocaleDateString()}</span>
                        </div>
                      )}
                      {person.validUntil && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar style={{ width: '9px', height: '9px', color: '#16a34a', flexShrink: 0 }} />
                          <span style={{ color: '#16a34a', fontWeight: 600 }}>Until:</span>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>{new Date(person.validUntil).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ 
            flexShrink: 0,
            padding: '10px 15px',
            backgroundColor: '#1e293b',
            color: '#ffffff'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              fontWeight: 600
            }}>
              <div>{footerText}</div>
              <div>{displayPersons.length} Person{displayPersons.length > 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const selectedCategory = CATEGORY_OPTIONS.find(c => c.value === formData.category);

  return (
    <div className="p-3 sm:p-6">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          /* Hide everything except the authorized persons preview */
          body * {
            visibility: hidden;
          }
          
          /* Make the authorized preview and its children visible */
          #authorized-preview-content,
          #authorized-preview-content * {
            visibility: visible !important;
          }
          
          /* Position the preview at the top of the page */
          #authorized-preview-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Force all background colors and images to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Make the preview container fill the page */
          body, html {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          
          /* Page break settings */
          #authorized-preview-content {
            page-break-inside: avoid !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
          }
          
          /* Force all background colors, gradients, and images to print */
          *,
          *::before,
          *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Set page orientation based on multiOrientation state */
          @page {
            margin: 0;
            size: ${multiOrientation === 'landscape' ? 'landscape' : 'portrait'};
          }
          
          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-slate-900 mb-2">Authorized Persons Management</h2>
          <p className="text-slate-600 text-sm sm:text-base">Create professional paper signage for authorized personnel</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Panel - Form */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div id="add-person-form" className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6 xl:sticky xl:top-6 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                {editingPerson ? (
                  <>
                    <Edit2 className="w-5 h-5 text-blue-600" />
                    Edit Person
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Person
                  </>
                )}
              </h3>

              <div className="space-y-4">
                {/* Header Text */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Header Text
                  </label>
                  <input
                    type="text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="e.g., AUTHORIZED PERSONNEL"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Footer Text */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="e.g., ISO 7010 Compliant • EHS Safety"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Person Background Color */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Card Background Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-16 h-10 rounded-lg border-2 border-slate-300 cursor-pointer"
                      title="Pick a color"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Background color for this person's card</p>
                </div>

                {/* Paper Size */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Paper Size *
                  </label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <select
                      value={formData.paperSize}
                      onChange={(e) => setFormData({ ...formData, paperSize: e.target.value as any })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      {PAPER_SIZE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Orientation *
                  </label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <select
                      value={formData.orientation}
                      onChange={(e) => setFormData({ ...formData, orientation: e.target.value as any })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      {ORIENTATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Category Selection - Dropdown with Colors */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Signage Category *
                  </label>
                  <div className="relative">
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded border-2 border-white shadow z-10"
                      style={{ backgroundColor: selectedCategory?.color || '#005BBB' }}
                    />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as SignageCategory })}
                      className="w-full pl-12 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Photo *
                  </label>
                  <div className="flex flex-col items-center">
                    {previewImage ? (
                      <div className="relative w-32 h-32 mb-3">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border-2 border-slate-300"
                        />
                        <button
                          onClick={() => {
                            setPreviewImage('');
                            setFormData({ ...formData, photo: '' });
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center mb-3">
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-500">No photo</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-sm flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., John Doe"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Employee ID
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="e.g., EMP-12345"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Designation *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g., Safety Supervisor"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Department *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., EHS Department"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Shift */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Shift
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="">Select Shift</option>
                      {SHIFT_OPTIONS.map((shift) => (
                        <option key={shift} value={shift}>
                          {shift}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="e.g., +1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Certifications / Licenses
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      placeholder="e.g., OSHA 30, First Aid"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Valid Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Valid From</label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                        className="w-full pl-8 pr-2 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Valid Until</label>
                    <div className="relative">
                      <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        className="w-full pl-8 pr-2 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Add/Update Button */}
                {editingPerson ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdatePerson}
                      disabled={!formData.name || !formData.designation || !formData.department || !formData.contact}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                      Update Person
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddPerson}
                    disabled={!formData.name || !formData.designation || !formData.department || !formData.contact}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Authorized Person
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - List and Preview */}
          <div className="xl:col-span-2 order-1 xl:order-2 space-y-6">
            {/* List of Persons */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-900">Authorized Personnel List</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {persons.length} {persons.length === 1 ? 'Person' : 'Persons'}
                </span>
              </div>

              {persons.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">No authorized persons added yet</p>
                  <p className="text-sm text-slate-400">Add your first authorized person using the form</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {persons.map((person) => {
                      const config = getCategoryConfig(person.category);
                      const isChecked = selectedIds.has(person.id);
                      return (
                        <div
                          key={person.id}
                          className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow relative"
                          style={{ borderColor: config.color }}
                        >
                          {/* Checkbox */}
                          <div className="absolute top-3 right-3 z-10">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxToggle(person)}
                              disabled={!isChecked && selectedIds.size >= 6}
                              className="w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-5ยป00 cursor-pointer disabled:opacity-50"
                              style={{ accentColor: config.color }}
                            />
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {person.photo ? (
                                <img
                                  src={person.photo}
                                  alt={person.name}
                                  className="w-20 h-20 object-cover rounded-lg border-2"
                                  style={{ borderColor: config.color }}
                                />
                              ) : (
                                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center border-2" style={{ borderColor: config.color }}>
                                  <User className="w-10 h-10 text-slate-400" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 pr-8">
                              <h4 className="text-slate-900 mb-0.5 truncate">{person.name}</h4>
                              <div className="text-xs text-slate-600 mb-2">{person.designation}</div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span 
                                  className="px-2 py-0.5 rounded text-xs text-white"
                                  style={{ backgroundColor: config.color }}
                                >
                                  {config.name}
                                </span>
                              </div>
                              {/* Background Color Picker */}
                              <div className="mt-2 flex items-center gap-2">
                                <label className="text-xs text-slate-600">Card Color:</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="color"
                                    value={person.backgroundColor || '#ffffff'}
                                    onChange={(e) => {
                                      setPersons(persons.map(p => 
                                        p.id === person.id ? { ...p, backgroundColor: e.target.value } : p
                                      ));
                                    }}
                                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                                    title="Change card background color"
                                  />
                                  <input
                                    type="text"
                                    value={person.backgroundColor || '#ffffff'}
                                    onChange={(e) => {
                                      setPersons(persons.map(p => 
                                        p.id === person.id ? { ...p, backgroundColor: e.target.value } : p
                                      ));
                                    }}
                                    className="w-20 px-2 py-1 text-xs border border-slate-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="#ffffff"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleViewSignage(person)}
                              className="flex-1 px-3 py-2 hover:opacity-90 text-white rounded-lg text-xs flex items-center justify-center gap-1 transition-opacity"
                              style={{ backgroundColor: config.color }}
                            >
                              <Eye className="w-3 h-3" />
                              View Signage
                            </button>
                            <button
                              onClick={() => handleEditPerson(person)}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemovePerson(person.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Generate Multi-Person Button */}
                  {selectedIds.size > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <div className="text-slate-900 mb-1">
                            {selectedIds.size} Person{selectedIds.size > 1 ? 's' : ''} Selected
                          </div>
                          <div className="text-sm text-slate-600">
                            Select up to 6 persons to generate multi-person signage
                          </div>
                        </div>
                        <button
                          onClick={handleGenerateMultiSignage}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          Generate Multi-Person Signage
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Multi-person Selector */}
            {viewMode === 'multi' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-slate-900 mb-4">Select Team Members (Maximum 6)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {persons
                    .filter(p => p.category === selectedPersons[0]?.category)
                    .map((person) => {
                      const isSelected = selectedPersons.some(p => p.id === person.id);
                      return (
                        <button
                          key={person.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPersons(selectedPersons.filter(p => p.id !== person.id));
                            } else if (selectedPersons.length < 4) {
                              setSelectedPersons([...selectedPersons, person]);
                            }
                          }}
                          disabled={!isSelected && selectedPersons.length >= 6}
                          className={`p-3 border-2 rounded-lg text-left transition-all ${
                            isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-center gap-2">
                            {person.photo ? (
                              <img src={person.photo} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{person.name}</div>
                              <div className="text-xs text-slate-500 truncate">{person.designation}</div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
                <div className="text-sm text-slate-600 mb-4">
                  Selected: {selectedPersons.length} / 6 persons
                </div>
              </div>
            )}

            {/* Signage Preview */}
            {viewMode && selectedPersons.length > 0 && (
              <div id="signage-preview-section" className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                  <h3 className="text-slate-900">
                    {viewMode === 'multi' 
                      ? 'Multi-Person Signage Preview' 
                      : selectedPersons[0].format === 'badge' 
                        ? 'Wearable Badge Preview' 
                        : 'Paper Signage Preview'
                    }
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                      onClick={() => {
                        setViewMode(null);
                        setSelectedPersons([]);
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Manual Adjustment Controls - Only for Multi-Person View */}
                {viewMode === 'multi' && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                    <h4 className="text-slate-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Manual Adjustments
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Paper Size */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">
                          Paper Size
                        </label>
                        <div className="relative">
                          <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                          <select
                            value={multiPaperSize}
                            onChange={(e) => setMultiPaperSize(e.target.value as any)}
                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                          >
                            {PAPER_SIZE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Orientation */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">
                          Orientation
                        </label>
                        <div className="relative">
                          <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                          <select
                            value={multiOrientation}
                            onChange={(e) => setMultiOrientation(e.target.value as any)}
                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                          >
                            {ORIENTATION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>


                      {/* Photo Scale Slider */}
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">
                          Photo Size: {photoScale}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={photoScale}
                          onChange={(e) => setPhotoScale(Number(e.target.value))}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            accentColor: '#2563eb'
                          }}
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>50%</span>
                          <span>100%</span>
                          <span>150%</span>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setCardScale(100);
                          setPhotoScale(100);
                          setMultiPaperSize('a4');
                          setMultiOrientation('landscape');
                        }}
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset to Default
                      </button>
                    </div>
                  </div>
                )}

                <div ref={previewRef} className="overflow-auto">
                  {renderMultiPersonLandscape(selectedPersons)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}