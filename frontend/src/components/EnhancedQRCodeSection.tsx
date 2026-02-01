import React from 'react';
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
  const [safetyCommittees, setSafetyCommittees] = useState<any[]>([]);

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

  // Load organization charts from localStorage
  useEffect(() => {
    const loadOrganizationCharts = () => {
      const savedMembers = localStorage.getItem('organizationChartMembers');
      if (savedMembers) {
        try {
          const membersData = JSON.parse(savedMembers);
          // If there's data, create a selectable entry for the Organization Chart
          if (Array.isArray(membersData) && membersData.length > 0) {
            setOrganizationCharts([{
              id: 'organization-chart',
              name: 'Organization Chart',
              memberCount: membersData.length,
              data: membersData
            }]);
          } else {
            setOrganizationCharts([]);
          }
        } catch (e) {
          console.error('Error loading organization charts:', e);
          setOrganizationCharts([]);
        }
      } else {
        setOrganizationCharts([]);
      }
    };
    loadOrganizationCharts();
    // Listen for updates (can be extended later)
    window.addEventListener('organizationChartUpdated', loadOrganizationCharts);
    return () => window.removeEventListener('organizationChartUpdated', loadOrganizationCharts);
  }, []);

  // Load safety committee (Emergency Response Team) from localStorage
  useEffect(() => {
    const loadSafetyCommittees = () => {
      const saved = localStorage.getItem('emergencyResponseTeam');
      if (saved) {
        try {
          const committeeData = JSON.parse(saved);
          // If there's data, create a selectable entry for the Safety Committee
          if (Array.isArray(committeeData) && committeeData.length > 0) {
            setSafetyCommittees([{
              id: 'emergency-response-team',
              name: 'Safety Committee',
              memberCount: committeeData.length,
              data: committeeData
            }]);
          } else {
            setSafetyCommittees([]);
          }
        } catch (e) {
          console.error('Error loading safety committee:', e);
          setSafetyCommittees([]);
        }
      } else {
        setSafetyCommittees([]);
      }
    };
    loadSafetyCommittees();
    // Listen for updates from EmergencyResponseTeam component
    window.addEventListener('emergencyResponseTeamUpdated', loadSafetyCommittees);
    return () => window.removeEventListener('emergencyResponseTeamUpdated', loadSafetyCommittees);
  }, []);

  // Auto-select safety committee when source is selected and data is available (legacy support)
  useEffect(() => {
    if (qrConfig.sources.includes('safetyCommittee') && 
        !qrConfig.selectedSafetyCommitteeId && 
        !qrConfig.selectedSafetyCommitteeIds &&
        safetyCommittees.length > 0) {
      updateQRConfig({ selectedSafetyCommitteeIds: ['emergency-response-team'] });
    }
  }, [qrConfig.sources, qrConfig.selectedSafetyCommitteeId, qrConfig.selectedSafetyCommitteeIds, safetyCommittees.length]);

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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Select one or more sources below. All selected sources will be combined into a single QR code. Manual URL input or content boxes will override the selected sources.
          </p>
        </div>
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
        {qrConfig.sources.length > 1 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
            <p className="text-xs text-green-800">
              <strong>✓ All Selected Sources Will Be Combined:</strong> When you generate the QR code, all checked sources above will be included in one QR code.
            </p>
          </div>
        )}
      </div>

      {/* Select Authorized Person(s) */}
      {qrConfig.sources.includes('authorizedPerson') && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Select Authorized Person(s)
          </label>
          
          {authorizedPersons.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-500">No authorized persons available</p>
              <p className="text-xs text-slate-400 mt-1">Add authorized persons from the Authorized Persons section first</p>
            </div>
          ) : (
            <div className="border border-slate-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-white">
              {/* Select All Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer mb-3 pb-3 border-b border-slate-200">
                <input
                  type="checkbox"
                  checked={authorizedPersons.length > 0 && 
                    (qrConfig.selectedAuthorizedPersonIds || []).length === authorizedPersons.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all
                      updateQRConfig({ 
                        selectedAuthorizedPersonIds: authorizedPersons.map(p => p.id),
                        selectedAuthorizedPersonId: undefined // Clear legacy single selection
                      });
                    } else {
                      // Deselect all
                      updateQRConfig({ 
                        selectedAuthorizedPersonIds: [],
                        selectedAuthorizedPersonId: undefined
                      });
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 font-medium">Select All ({authorizedPersons.length})</span>
              </label>
              
              {/* Individual Person Checkboxes */}
              <div className="space-y-2">
                {authorizedPersons.map((person) => {
                  const selectedIds = qrConfig.selectedAuthorizedPersonIds || [];
                  const isChecked = selectedIds.includes(person.id);
                  
                  return (
                    <label key={person.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentIds = qrConfig.selectedAuthorizedPersonIds || [];
                          let newIds: string[];
                          
                          if (e.target.checked) {
                            // Add person
                            newIds = [...currentIds, person.id];
                          } else {
                            // Remove person
                            newIds = currentIds.filter(id => id !== person.id);
                          }
                          
                          updateQRConfig({ 
                            selectedAuthorizedPersonIds: newIds.length > 0 ? newIds : undefined,
                            selectedAuthorizedPersonId: undefined // Clear legacy single selection
                          });
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">
                        {person.name} - {person.designation}
                      </span>
                    </label>
                  );
                })}
              </div>
              
              {(qrConfig.selectedAuthorizedPersonIds || []).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-blue-600 font-medium">
                    ✓ {(qrConfig.selectedAuthorizedPersonIds || []).length} person(s) selected
                  </p>
                </div>
              )}
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            Select one or more authorized persons. All selected persons will be included in the QR code along with other selected sources.
          </p>
        </div>
      )}

      {/* Select Organization Chart(s) */}
      {qrConfig.sources.includes('organizationChart') && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Select Organization Chart(s)
          </label>
          
          {organizationCharts.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-500">No organization charts available</p>
              <p className="text-xs text-slate-400 mt-1">Create an organization chart from the Organization Chart section first</p>
            </div>
          ) : (
            <div className="border border-slate-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-white">
              {/* Select All Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer mb-3 pb-3 border-b border-slate-200">
                <input
                  type="checkbox"
                  checked={organizationCharts.length > 0 && 
                    (qrConfig.selectedOrganizationChartIds || []).length === organizationCharts.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all
                      updateQRConfig({ 
                        selectedOrganizationChartIds: organizationCharts.map(c => c.id),
                        selectedOrganizationChartId: undefined // Clear legacy single selection
                      });
                    } else {
                      // Deselect all
                      updateQRConfig({ 
                        selectedOrganizationChartIds: [],
                        selectedOrganizationChartId: undefined
                      });
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 font-medium">Select All ({organizationCharts.length})</span>
              </label>
              
              {/* Individual Chart Checkboxes */}
              <div className="space-y-2">
                {organizationCharts.map((chart) => {
                  const selectedIds = qrConfig.selectedOrganizationChartIds || [];
                  const isChecked = selectedIds.includes(chart.id);
                  
                  return (
                    <label key={chart.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentIds = qrConfig.selectedOrganizationChartIds || [];
                          let newIds: string[];
                          
                          if (e.target.checked) {
                            // Add chart
                            newIds = [...currentIds, chart.id];
                          } else {
                            // Remove chart
                            newIds = currentIds.filter(id => id !== chart.id);
                          }
                          
                          updateQRConfig({ 
                            selectedOrganizationChartIds: newIds.length > 0 ? newIds : undefined,
                            selectedOrganizationChartId: undefined // Clear legacy single selection
                          });
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">
                        {chart.name} {chart.memberCount ? `(${chart.memberCount} members)` : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
              
              {(qrConfig.selectedOrganizationChartIds || []).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-blue-600 font-medium">
                    ✓ {(qrConfig.selectedOrganizationChartIds || []).length} chart(s) selected
                  </p>
                </div>
              )}
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            Select one or more organization charts. All selected charts will be included in the QR code along with other selected sources.
          </p>
        </div>
      )}

      {/* Select Safety Committee Team(s) */}
      {qrConfig.sources.includes('safetyCommittee') && (
        <div className="space-y-2">
          <label className="block text-sm text-slate-700 font-medium">
            Select Safety Committee Team(s)
          </label>
          
          {safetyCommittees.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-500">No safety committees available</p>
              <p className="text-xs text-slate-400 mt-1">Create a safety committee from the Emergency Response Team section first</p>
            </div>
          ) : (
            <div className="border border-slate-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-white">
              {/* Select All Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer mb-3 pb-3 border-b border-slate-200">
                <input
                  type="checkbox"
                  checked={safetyCommittees.length > 0 && 
                    (qrConfig.selectedSafetyCommitteeIds || []).length === safetyCommittees.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all
                      updateQRConfig({ 
                        selectedSafetyCommitteeIds: safetyCommittees.map(t => t.id),
                        selectedSafetyCommitteeId: undefined // Clear legacy single selection
                      });
                    } else {
                      // Deselect all
                      updateQRConfig({ 
                        selectedSafetyCommitteeIds: [],
                        selectedSafetyCommitteeId: undefined
                      });
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 font-medium">Select All ({safetyCommittees.length})</span>
              </label>
              
              {/* Individual Committee Checkboxes */}
              <div className="space-y-2">
                {safetyCommittees.map((team) => {
                  const selectedIds = qrConfig.selectedSafetyCommitteeIds || [];
                  const isChecked = selectedIds.includes(team.id);
                  
                  return (
                    <label key={team.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentIds = qrConfig.selectedSafetyCommitteeIds || [];
                          let newIds: string[];
                          
                          if (e.target.checked) {
                            // Add committee
                            newIds = [...currentIds, team.id];
                          } else {
                            // Remove committee
                            newIds = currentIds.filter(id => id !== team.id);
                          }
                          
                          updateQRConfig({ 
                            selectedSafetyCommitteeIds: newIds.length > 0 ? newIds : undefined,
                            selectedSafetyCommitteeId: undefined // Clear legacy single selection
                          });
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">
                        {team.name} {team.memberCount ? `(${team.memberCount} members)` : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
              
              {(qrConfig.selectedSafetyCommitteeIds || []).length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-blue-600 font-medium">
                    ✓ {(qrConfig.selectedSafetyCommitteeIds || []).length} team(s) selected
                  </p>
                </div>
              )}
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            Select one or more safety committee teams. All selected teams will be included in the QR code along with other selected sources.
          </p>
        </div>
      )}

      {/* Custom Link / URL - Only show if 'custom' source is selected */}
      {qrConfig.sources.includes('custom') && (
        <>
          {/* Content Boxes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-700 font-medium">Content Boxes (Custom URLs)</div>
                <p className="text-xs text-slate-500 mt-1">
                  Add multiple content boxes with custom URLs or websites. These will be combined with other selected sources in the QR code.
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

          {/* Or Enter Single URL */}
          <div className="space-y-2">
            <div className="text-sm text-slate-700 font-medium">Or Enter Single URL</div>
            <input
              type="url"
              value={qrConfig.legacyUrl || ''}
              onChange={(e) => updateQRConfig({ legacyUrl: e.target.value || undefined })}
              placeholder="Enter URL or text to generate QR code"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">
              Enter a single URL or text. This will be combined with other selected sources in the QR code.
            </p>
          </div>
        </>
      )}

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
