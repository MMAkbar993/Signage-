import { useState, useRef } from 'react';
import { Upload, Users, Download, Plus, Trash2, User, X, Flame, AlertTriangle, Droplet, Printer, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

type PlanType = 'fire-risk' | 'fire-response' | 'chlorine-response';

interface TeamMember {
  id: string;
  photo: string;
  name: string;
  contact: string;
  designation: string;
}

interface ResponseTeam {
  id: string;
  title: string;
  color: string;
  members: TeamMember[];
}

export function EmergencyResponseTeam() {
  const [planType, setPlanType] = useState<PlanType>('fire-risk');
  const [paperSize, setPaperSize] = useState<'a5' | 'a4' | 'a3' | 'letter' | 'legal'>('a4');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  
  // Logo uploads for emergency response plans
  const [clientLogo, setClientLogo] = useState<string>('');
  const [contractorLogo, setContractorLogo] = useState<string>('');
  
  // Fire Risk state
  const [fireRiskTeam, setFireRiskTeam] = useState<TeamMember[]>([]);
  
  // Fire Response state
  const [fireResponseTeams, setFireResponseTeams] = useState<ResponseTeam[]>([
    { id: '1', title: 'Carry the injured and put them in a safe area', color: '#F8B4C4', members: [] },
    { id: '2', title: 'Submission of other works', color: '#F8B4C4', members: [] },
    { id: '3', title: 'Restart the facility', color: '#F8B4C4', members: [] }
  ]);
  
  // Chlorine Response state
  const [chlorineResponseTeams, setChlorineResponseTeams] = useState<ResponseTeam[]>([
    { id: '1', title: 'Disconnect the power supply, close the panel safety lock', color: '#F8B4C4', members: [] },
    { id: '2', title: 'Evacuate the facility from the workers and direct them to the assembly point', color: '#F8B4C4', members: [] },
    { id: '3', title: 'Use of fire extinguishers', color: '#F8B4C4', members: [] },
    { id: '4', title: 'Inform the Civil Defense', color: '#F8B4C4', members: [] },
    { id: '5', title: 'Civil Defense directive', color: '#F8B4C4', members: [] }
  ]);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Paper dimensions in mm
  const paperDimensions = {
    a5: { landscape: { width: 210, height: 148 }, portrait: { width: 148, height: 210 } },
    a4: { landscape: { width: 297, height: 210 }, portrait: { width: 210, height: 297 } },
    a3: { landscape: { width: 420, height: 297 }, portrait: { width: 297, height: 420 } },
    letter: { landscape: { width: 279, height: 216 }, portrait: { width: 216, height: 279 } },
    legal: { landscape: { width: 356, height: 216 }, portrait: { width: 216, height: 356 } }
  };

  const dims = paperDimensions[paperSize][orientation];
  const mmToPixel = 3.7795275591;
  const pageWidth = dims.width * mmToPixel;
  const pageHeight = dims.height * mmToPixel;
  const scale = 0.35;

  // Fire Risk functions
  const addFireRiskMember = () => {
    setFireRiskTeam([...fireRiskTeam, {
      id: Date.now().toString(),
      photo: '',
      name: '',
      contact: '',
      designation: ''
    }]);
  };

  const removeFireRiskMember = (memberId: string) => {
    setFireRiskTeam(fireRiskTeam.filter(m => m.id !== memberId));
  };

  const updateFireRiskMember = (memberId: string, field: keyof TeamMember, value: string) => {
    setFireRiskTeam(fireRiskTeam.map(member => {
      if (member.id === memberId) {
        return { ...member, [field]: value };
      }
      return member;
    }));
  };

  // Response team functions
  const addMemberToResponseTeam = (teamId: string) => {
    if (planType === 'fire-response') {
      setFireResponseTeams(fireResponseTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: [...team.members, {
              id: Date.now().toString(),
              photo: '',
              name: '',
              contact: '',
              designation: ''
            }]
          };
        }
        return team;
      }));
    } else if (planType === 'chlorine-response') {
      setChlorineResponseTeams(chlorineResponseTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: [...team.members, {
              id: Date.now().toString(),
              photo: '',
              name: '',
              contact: '',
              designation: ''
            }]
          };
        }
        return team;
      }));
    }
  };

  const removeMemberFromResponseTeam = (teamId: string, memberId: string) => {
    if (planType === 'fire-response') {
      setFireResponseTeams(fireResponseTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(m => m.id !== memberId)
          };
        }
        return team;
      }));
    } else if (planType === 'chlorine-response') {
      setChlorineResponseTeams(chlorineResponseTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter(m => m.id !== memberId)
          };
        }
        return team;
      }));
    }
  };

  const updateResponseTeamMember = (teamId: string, memberId: string, field: keyof TeamMember, value: string) => {
    if (planType === 'fire-response') {
      setFireResponseTeams(fireResponseTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.map(member => {
              if (member.id === memberId) {
                return { ...member, [field]: value };
              }
              return member;
            })
          };
        }
        return team;
      }));
    } else if (planType === 'chlorine-response') {
      setChlorineResponseTeams(chlorineResponseTeams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.map(member => {
              if (member.id === memberId) {
                return { ...member, [field]: value };
              }
              return member;
            })
          };
        }
        return team;
      }));
    }
  };

  const handlePhotoUpload = (teamId: string | null, memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (planType === 'fire-risk' && teamId === null) {
          updateFireRiskMember(memberId, 'photo', result);
        } else if (teamId) {
          updateResponseTeamMember(teamId, memberId, 'photo', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (type: 'client' | 'contractor', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'client') {
          setClientLogo(result);
        } else {
          setContractorLogo(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToPDF = async () => {
    if (!previewRef.current) return;

    try {
      toast.info('Generating high-resolution PDF...');
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
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
        orientation: orientation,
        unit: 'mm',
        format: paperSize === 'letter' ? [216, 279] : paperSize === 'legal' ? [216, 356] : paperSize
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`emergency-response-${planType}-${Date.now()}.pdf`);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const exportToPNG = async () => {
    if (!previewRef.current) return;

    try {
      toast.info('Generating high-resolution PNG...');
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 4, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
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
          a.download = `emergency-response-${planType}-${Date.now()}-300dpi.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast.success('PNG downloaded successfully!');
        } else {
          toast.error('Failed to generate PNG');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('PNG export error:', error);
      toast.error('Failed to generate PNG. Please try again.');
    }
  };

  const handlePrint = () => {
    // Use the native print functionality with proper media queries
    window.print();
  };

  const getCurrentTeams = () => {
    if (planType === 'fire-response') return fireResponseTeams;
    if (planType === 'chlorine-response') return chlorineResponseTeams;
    return [];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          /* Hide everything except the emergency response preview */
          body * {
            visibility: hidden;
          }
          
          /* Make the emergency preview and its children visible */
          #emergency-preview-content,
          #emergency-preview-content * {
            visibility: visible !important;
          }
          
          /* Position the preview at the top of the page */
          #emergency-preview-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Force all background colors, gradients, and images to print */
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
          #emergency-preview-content {
            page-break-inside: avoid !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
          }
          
          /* Optimize page layout - Set specific page size */
          @page {
            margin: 0;
          }
          
          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="max-w-[1800px] mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-slate-900 flex items-center gap-2 text-xl sm:text-2xl">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                Emergency Response Team
              </h2>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Create emergency response plans and team signage</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={exportToPNG}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 h-fit">
            <h3 className="text-slate-900 mb-4">Settings</h3>
            
            {/* Plan Type Selector */}
            <div className="mb-4">
              <label className="block text-sm text-slate-700 mb-2">Plan Type</label>
              <div className="space-y-2">
                <button
                  onClick={() => setPlanType('fire-risk')}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors flex items-center gap-3 ${
                    planType === 'fire-risk'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm">Fire Risk</div>
                  </div>
                </button>
                <button
                  onClick={() => setPlanType('fire-response')}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors flex items-center gap-3 ${
                    planType === 'fire-response'
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm">Emergency Response Plan</div>
                    <div className={`text-xs ${planType === 'fire-response' ? 'text-orange-100' : 'text-slate-500'}`}>
                      In case of fire
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setPlanType('chlorine-response')}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors flex items-center gap-3 ${
                    planType === 'chlorine-response'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Droplet className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm">Emergency Response Plan</div>
                    <div className={`text-xs ${planType === 'chlorine-response' ? 'text-teal-100' : 'text-slate-500'}`}>
                      In case of chlorine leakage
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <hr className="my-4 border-slate-200" />

            {/* Team Management based on plan type */}
            {planType === 'fire-risk' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900 text-sm">Safety Committee</h3>
                  <button
                    onClick={addFireRiskMember}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs text-slate-500 mb-2">
                  {fireRiskTeam.length} member{fireRiskTeam.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {(planType === 'fire-response' || planType === 'chlorine-response') && (
              <div>
                <h3 className="text-slate-900 text-sm mb-3">Response Teams</h3>
                <div className="space-y-3">
                  {getCurrentTeams().map((team) => (
                    <div key={team.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="text-xs mb-2" style={{ color: '#64748b' }}>
                        {team.title}
                      </div>
                      <button
                        onClick={() => addMemberToResponseTeam(team.id)}
                        className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Member
                      </button>
                      {team.members.length > 0 && (
                        <div className="mt-2 text-xs text-slate-500">
                          {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <h3 className="text-slate-900 mb-4">Preview & Member Forms</h3>
            
            {/* Logo Upload - Only for response plans */}
            {(planType === 'fire-response' || planType === 'chlorine-response') && (
              <div className="mb-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h4 className="text-sm mb-3 text-slate-900">Company Logos</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Client Logo</label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      {clientLogo ? (
                        <img src={clientLogo} alt="Client" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload('client', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Contractor Logo</label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      {contractorLogo ? (
                        <img src={contractorLogo} alt="Contractor" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload('contractor', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Logo Upload - For Fire Risk */}
            {planType === 'fire-risk' && (
              <div className="mb-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
                <h4 className="text-sm mb-3 text-slate-900">Company Logos</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Client Logo</label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      {clientLogo ? (
                        <img src={clientLogo} alt="Client" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload('client', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-2">Contractor Logo</label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                      {contractorLogo ? (
                        <img src={contractorLogo} alt="Contractor" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload('contractor', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Member Forms */}
            <div className="mb-6 space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {planType === 'fire-risk' && fireRiskTeam.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm mb-3 text-slate-900">Safety Committee (Firefighting)</h4>
                  <div className="space-y-3">
                    {fireRiskTeam.map((member) => (
                      <div key={member.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                        <div className="flex justify-between items-start mb-3">
                          <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-sm">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(null, member.id, e)}
                              className="hidden"
                            />
                          </label>
                          <button
                            onClick={() => removeFireRiskMember(member.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => updateFireRiskMember(member.id, 'name', e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Contact"
                            value={member.contact}
                            onChange={(e) => updateFireRiskMember(member.id, 'contact', e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(planType === 'fire-response' || planType === 'chlorine-response') && getCurrentTeams().some(t => t.members.length > 0) && (
                <div className="space-y-4">
                  {getCurrentTeams().map((team) => (
                    team.members.length > 0 && (
                      <div key={team.id} className="border border-slate-200 rounded-lg p-4">
                        <h4 className="text-sm mb-3" style={{ color: '#64748b' }}>
                          {team.title}
                        </h4>
                        <div className="space-y-3">
                          {team.members.map((member) => (
                            <div key={member.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                              <div className="flex justify-between items-start mb-3">
                                <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-sm">
                                  <Upload className="w-4 h-4" />
                                  Upload Photo
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoUpload(team.id, member.id, e)}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  onClick={() => removeMemberFromResponseTeam(team.id, member.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={member.name}
                                  onChange={(e) => updateResponseTeamMember(team.id, member.id, 'name', e.target.value)}
                                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Contact"
                                  value={member.contact}
                                  onChange={(e) => updateResponseTeamMember(team.id, member.id, 'contact', e.target.value)}
                                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                                <input
                                  type="text"
                                  placeholder="Designation"
                                  value={member.designation}
                                  onChange={(e) => updateResponseTeamMember(team.id, member.id, 'designation', e.target.value)}
                                  className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Page Preview */}
            <div className="overflow-auto border border-slate-300 rounded-lg bg-slate-100 p-8">
              <div
                id="emergency-preview-content"
                ref={previewRef}
                style={{
                  width: `${pageWidth}px`,
                  height: `${pageHeight}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  backgroundColor: '#ffffff',
                  padding: '30px',
                  border: '8px solid #8B0000',
                  boxSizing: 'border-box'
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '3px solid #000000'
                }}>
                  {/* Client Logo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: clientLogo ? 'transparent' : '#e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '5px'
                  }}>
                    {clientLogo && (
                      <img
                        src={clientLogo}
                        alt="Client Logo"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </div>
                  
                  <h1 style={{
                    fontSize: planType === 'fire-risk' ? '32px' : '28px',
                    fontWeight: 700,
                    color: '#1e293b',
                    textAlign: 'center',
                    flex: 1,
                    margin: '0 20px'
                  }}>
                    {planType === 'fire-risk' && 'Fire risk'}
                    {planType === 'fire-response' && (
                      <>
                        Emergency Response plan<br/>
                        <span style={{ color: '#dc2626', fontSize: '30px' }}>In case of fire</span>
                      </>
                    )}
                    {planType === 'chlorine-response' && (
                      <>
                        Emergency Response plan<br/>
                        <span style={{ color: '#0891b2', fontSize: '30px' }}>In case of chlorine leakage</span>
                      </>
                    )}
                  </h1>
                  
                  {/* Contractor Logo */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: contractorLogo ? 'transparent' : '#e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '5px'
                  }}>
                    {contractorLogo && (
                      <img
                        src={contractorLogo}
                        alt="Contractor Logo"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Content based on plan type */}
                {planType === 'fire-risk' && (
                  <>
                    {/* Fire Risk Header Info */}
                    <div style={{
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: '15px'
                    }}>
                      Why Run an Electricity Safety?<br/>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>
                        1.Fire prevention  2.Fire safety  3.Firefighting and what to do in case of a fire
                      </span>
                    </div>

                    {/* How do fires start */}
                    <div style={{
                      backgroundColor: '#cbd5e1',
                      padding: '15px',
                      marginBottom: '15px',
                      borderRadius: '8px',
                      border: '2px solid #000000'
                    }}>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#475569', textAlign: 'center', margin: '0 0 10px 0' }}>
                        How do fires start?
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                        <div style={{ backgroundColor: '#fef08a', padding: '10px', border: '2px solid #000', textAlign: 'center', fontWeight: 700, fontSize: '16px' }}>Heat</div>
                        <div style={{ backgroundColor: '#ffffff', padding: '10px', border: '2px solid #000', fontSize: '14px' }}>
                          an ignition source e.g. electrical fault, naked flame, weld torch or hot embers.
                        </div>
                        <div style={{ backgroundColor: '#fef08a', padding: '10px', border: '2px solid #000', textAlign: 'center', fontWeight: 700, fontSize: '16px' }}>Fuel</div>
                        <div style={{ backgroundColor: '#ffffff', padding: '10px', border: '2px solid #000', fontSize: '14px' }}>
                          something that will burn e.g. dry timber, chemical, plastics, paper or cardboard.
                        </div>
                        <div style={{ backgroundColor: '#fef08a', padding: '10px', border: '2px solid #000', textAlign: 'center', fontWeight: 700, fontSize: '16px' }}>Oxygen</div>
                        <div style={{ backgroundColor: '#ffffff', padding: '10px', border: '2px solid #000', fontSize: '14px' }}>
                          found in the atmosphere.
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#fef08a', padding: '10px', marginTop: '8px', border: '2px solid #000', textAlign: 'center', fontStyle: 'italic', fontSize: '14px' }}>
                        If you remove one of these from the triangle, fires will be prevented.
                      </div>
                    </div>

                    {/* Fire Prevention */}
                    <div style={{
                      backgroundColor: '#F8B4C4',
                      padding: '12px',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      border: '2px solid #000000'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#7f1d1d', textAlign: 'center', margin: 0 }}>
                        Fire Prevention
                      </h3>
                    </div>
                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '12px',
                      marginBottom: '12px',
                      border: '2px solid #000',
                      fontSize: '13px',
                      lineHeight: '1.6'
                    }}>
                      • Use proper sealed containers for flammable liquids<br/>
                      • Do not overload electrical sockets – 'one socket, one plug'<br/>
                      • Ensure electrical equipment or appliance is not faulty and are currently certified<br/>
                      • Do not smoke in areas where smoking is prohibited<br/>
                      • Apply "hot work" permits and processes in workplaces
                    </div>

                    {/* Fire Safety */}
                    <div style={{
                      backgroundColor: '#F8B4C4',
                      padding: '12px',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      border: '2px solid #000000'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#7f1d1d', textAlign: 'center', margin: 0 }}>
                        Fire Safety
                      </h3>
                    </div>
                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '12px',
                      marginBottom: '12px',
                      border: '2px solid #000',
                      fontSize: '13px',
                      lineHeight: '1.6'
                    }}>
                      • Ensure escape routes are clear<br/>
                      • Fire drill arrangements<br/>
                      • Know where your extinguishers are located and how to use them<br/>
                      • Know your assembly point
                    </div>

                    {/* Firefighting */}
                    <div style={{
                      backgroundColor: '#F8B4C4',
                      padding: '12px',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      border: '2px solid #000000'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#7f1d1d', textAlign: 'center', margin: 0 }}>
                        Firefighting and What To Do In The Case Of a Fire
                      </h3>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '15px',
                      justifyContent: 'center'
                    }}>
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num} style={{
                          width: '120px',
                          height: '100px',
                          backgroundColor: '#e2e8f0',
                          border: '2px solid #000',
                          borderRadius: '8px'
                        }} />
                      ))}
                    </div>

                    {/* Extinguisher types */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '8px',
                      marginBottom: '15px'
                    }}>
                      {['WATER', 'FOAM', 'POWDER', 'CO2', 'WET CHEMICAL'].map((type, idx) => (
                        <div key={type} style={{
                          backgroundColor: idx === 0 ? '#60a5fa' : idx === 1 ? '#f87171' : idx === 2 ? '#3b82f6' : idx === 3 ? '#1e293b' : '#fbbf24',
                          color: '#ffffff',
                          padding: '8px',
                          textAlign: 'center',
                          border: '2px solid #000',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          {type}
                        </div>
                      ))}
                    </div>

                    {/* Safety Committee */}
                    <div style={{
                      backgroundColor: '#F8B4C4',
                      padding: '12px',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      border: '2px solid #000000'
                    }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#7f1d1d', textAlign: 'center', margin: 0 }}>
                        Safety Committee (Firefighting)
                      </h3>
                    </div>

                    {/* Fire Risk Team Members */}
                    {fireRiskTeam.length > 0 ? (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '15px'
                      }}>
                        {fireRiskTeam.map((member) => (
                          <div key={member.id} style={{
                            display: 'flex',
                            gap: '12px',
                            border: '3px solid #000000',
                            padding: '12px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px'
                          }}>
                            <div style={{
                              width: '120px',
                              height: '120px',
                              flexShrink: 0,
                              backgroundColor: '#f1f5f9',
                              border: '3px solid #000000',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {member.photo ? (
                                <img
                                  src={member.photo}
                                  alt={member.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <User style={{ width: '50px', height: '50px', color: '#94a3b8' }} />
                              )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                              <div style={{
                                backgroundColor: '#fef08a',
                                padding: '8px 12px',
                                border: '2px solid #000000',
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#1e293b',
                                textAlign: 'center'
                              }}>
                                {member.name || 'Name'}
                              </div>
                              <div style={{
                                backgroundColor: '#fef08a',
                                padding: '8px 12px',
                                border: '2px solid #000000',
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#1e293b',
                                textAlign: 'center'
                              }}>
                                {member.contact || 'Contact'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: '30px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '16px'
                      }}>
                        Add safety committee members
                      </div>
                    )}
                  </>
                )}

                {(planType === 'fire-response' || planType === 'chlorine-response') && (
                  <>
                    {getCurrentTeams().some(t => t.members.length > 0) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {getCurrentTeams().map((team) => (
                          team.members.length > 0 && (
                            <div key={team.id}>
                              <div style={{
                                backgroundColor: team.color,
                                padding: '12px',
                                marginBottom: '12px',
                                borderRadius: '8px',
                                border: '2px solid #000000'
                              }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#7f1d1d', textAlign: 'center', margin: 0 }}>
                                  {team.title}
                                </h3>
                              </div>

                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '15px'
                              }}>
                                {team.members.map((member) => (
                                  <div key={member.id} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    border: '3px solid #000000',
                                    padding: '12px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px'
                                  }}>
                                    <div style={{
                                      width: '100px',
                                      height: '100px',
                                      flexShrink: 0,
                                      backgroundColor: '#f1f5f9',
                                      border: '3px solid #000000',
                                      borderRadius: '8px',
                                      overflow: 'hidden',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      {member.photo ? (
                                        <img
                                          src={member.photo}
                                          alt={member.name}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                          }}
                                        />
                                      ) : (
                                        <User style={{ width: '40px', height: '40px', color: '#94a3b8' }} />
                                      )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                                      <div style={{
                                        backgroundColor: '#fef08a',
                                        padding: '6px 10px',
                                        border: '2px solid #000000',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: '#1e293b'
                                      }}>
                                        {member.name || 'Name'}
                                      </div>
                                      <div style={{
                                        backgroundColor: '#fef08a',
                                        padding: '6px 10px',
                                        border: '2px solid #000000',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#1e293b'
                                      }}>
                                        {member.designation || 'Designation'}
                                      </div>
                                      <div style={{
                                        backgroundColor: '#fef08a',
                                        padding: '6px 10px',
                                        border: '2px solid #000000',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#1e293b'
                                      }}>
                                        {member.contact || 'Contact'}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        color: '#94a3b8',
                        fontSize: '18px',
                        textAlign: 'center'
                      }}>
                        Add response teams and members to see preview
                      </div>
                    )}
                  </>
                )}

                {/* Footer */}
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '30px',
                  right: '30px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#64748b',
                  borderTop: '2px solid #cbd5e1',
                  paddingTop: '10px'
                }}>
                  <span>HSE Department</span>
                  <span>Emergency Response Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}