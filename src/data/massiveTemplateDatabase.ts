// Massive Template Database - 5000+ Pre-generated Safety Signage Templates
import type { Template } from './templateDatabase';

const CATEGORIES = ['danger', 'warning', 'mandatory', 'prohibition', 'emergency'];

const COLORS: Record<string, string> = {
  danger: '#D60000',
  warning: '#FFD600',
  mandatory: '#005BBB',
  prohibition: '#D60000',
  emergency: '#009E2A'
};

const ICONS = [
  'AlertOctagon', 'AlertTriangle', 'Zap', 'Droplet', 'Flame',
  'Wrench', 'Heart', 'Beaker', 'Truck', 'Shield', 'XCircle',
  'CheckCircle', 'HardHat', 'Radio', 'Building2', 'Factory',
  'Mountain', 'Ship', 'Cookie'
];

// Comprehensive Activities List (200 activities)
const ACTIVITIES = [
  // Civil & Construction
  'Excavation', 'Backfilling', 'Trenching', 'Shoring installation', 'Formwork installation',
  'Steel reinforcement fixing', 'Concrete pouring', 'Asphalt paving', 'Compaction work',
  'Scaffolding erection', 'Scaffolding dismantling', 'Blockwork', 'Masonry work',
  'Plastering', 'Painting work', 'Tiling installation', 'Roof waterproofing',
  'Carpentry work', 'Welding and cutting', 'Grinding operations', 'Tower crane lifting',
  'Mobile crane lifting', 'Material lifting with forklift', 'Rebar cutting and bending',
  'Pile drilling', 'Sheet piling', 'Surveying work', 'Landscaping', 'Hand tool operation',
  'Heavy machinery movement', 'Road marking', 'Pipeline laying', 'Cable trenching',
  'Fence installation', 'Slab casting', 'Demolition', 'Structural steel erection',
  'Bricklaying', 'Joint sealing', 'Concrete coring',
  
  // Electrical
  'LV panel installation', 'MV panel installation', 'Cable pulling', 'Cable termination',
  'Electrical testing', 'Megger testing', 'Transformer installation', 'Generator connection',
  'Earthing work', 'UPS installation', 'Battery bank handling', 'Light fixture installation',
  'Switchgear maintenance', 'Cable tray installation', 'Solar panel installation',
  'Streetlight maintenance', 'MCC room work', 'Electrical troubleshooting',
  'Breaker replacement', 'Motor rewinding', 'Electrical isolation (LOTO)', 'Feeder testing',
  'Control panel wiring', 'Relay testing', 'Busbar installation', 'Fiber optic pulling',
  'Earthing pit testing', 'Electrical inspection', 'Electrical calibration',
  'Transformer oil sampling',
  
  // Mechanical
  'Pump installation', 'Pump dismantling', 'Valve replacement', 'Pipe installation',
  'Pipe pressure testing', 'Pipe hydrotesting', 'Flange alignment', 'HVAC duct installation',
  'AHU maintenance', 'Chiller maintenance', 'Diesel tank cleaning', 'Generator maintenance',
  'Blower installation', 'Compressor repair', 'Boiler inspection', 'Mechanical lubrication',
  'Conveyor maintenance', 'Belt replacement', 'Motor installation', 'Gearbox repair',
  'Welding of pipelines', 'Gas cutting', 'Mechanical pressure testing', 'Mechanical lifting',
  'Seal replacement', 'Bearing replacement', 'Mechanical calibration', 'Vibration testing',
  'Motor coupling alignment', 'Pump priming',
  
  // Confined Space & STP
  'Manhole entry', 'Wet well cleaning', 'Dry well maintenance', 'Clarifier pit entry',
  'Aeration tank entry', 'Inlet chamber cleaning', 'Sludge tank entry', 'Chemical tank entry',
  'Polymer dosing area management', 'RAS/WAS pump room entry', 'Belt press maintenance',
  'Oil/water separator cleaning', 'Grit chamber entry', 'Screening room cleaning',
  'Diffuser replacement', 'Backwash system repair', 'UV disinfection unit maintenance',
  'Chlorine room maintenance', 'Gas detector calibration', 'STP odor control system servicing',
  'Sludge drying bed cleaning', 'Biofilter maintenance', 'Wet chemical handling',
  'Tank desludging', 'Skimmer arm maintenance', 'Mixing chamber cleaning',
  'Aeration blower maintenance', 'Sludge pipeline flushing', 'Filter media replacement',
  'Chlorine leak testing',
  
  // Work at Height
  'Ladder work', 'Scaffolding work', 'Working on roof', 'Working on tanks top', 'Tower work',
  'Mast climbing', 'Rope access work', 'Painting at height', 'Welding at height',
  'Maintenance on elevated platforms', 'Aircraft hangar work', 'Billboard installation',
  'Façade cleaning', 'Gutter maintenance', 'Antenna installation', 'Telecom tower climbing',
  'MEWP operation', 'Window cleaning at height', 'Roof truss installation',
  'Elevated walkway maintenance',
  
  // Hot Work
  'Welding', 'Cutting', 'Grinding', 'Brazing', 'Soldering', 'Heat treatment', 'Torch cutting',
  'Furnace work', 'Hot tar application', 'Metal melting', 'Pipe welding', 'Hot tapping',
  'Gas welding', 'Electrical hot work', 'Plasma cutting', 'Thermoplastic welding',
  'Furnace repair', 'Foundry work', 'Boiler welding', 'Fire watch duty',
  
  // Safety & Inspection
  'Fire extinguisher inspection', 'SCBA inspection', 'Gas detector calibration',
  'Crane inspection', 'Forklift inspection', 'Ladder inspection', 'PPE inspection',
  'Hot work permit issuance', 'Confined space permit issuance', 'LOTO verification',
  'Electrical panel inspection', 'Chemical storage inspection', 'Housekeeping audit',
  'Environmental monitoring', 'Noise level monitoring', 'Risk assessment preparation',
  'Toolbox talk delivery', 'Emergency drill', 'Vehicle inspection', 'Spill kit inspection',
  
  // General Industrial
  'Warehouse operations', 'Material loading', 'Material unloading', 'Waste handling',
  'Chemical mixing', 'Cleaning operations', 'HVAC servicing', 'Plumbing repair',
  'Office maintenance', 'Pest control operations'
];

// Actions performed
const ACTIONS = [
  'Operation', 'Inspection', 'Repair', 'Installation', 'Replacement', 'Maintenance',
  'Testing', 'Alignment', 'Cleaning', 'Troubleshooting', 'Servicing', 'Calibration',
  'Assembly', 'Removal', 'Modification', 'Preparation', 'Execution', 'Monitoring'
];

// Work locations
const LOCATIONS = [
  'Manhole', 'Wet Well', 'Dry Well', 'STP Tank', 'Substation', 'Control Room',
  'Panel Room', 'Generator Room', 'Chemical Room', 'Pipeline Trench', 'Cable Tray',
  'Roof', 'Scaffold Platform', 'Excavated Area', 'Workshop', 'Storage Yard',
  'Pump Room', 'HVAC Duct', 'Sewer Line', 'Clarifier', 'Aeration Tank',
  'Chlorine Room', 'Transformer Yard', 'Electrical Room', 'Boiler Room',
  'Compressed Air Room', 'Cooling Tower', 'Water Tank', 'Fire Pump Room',
  'Loading Dock', 'Confined Space'
];

// Hazards associated with activities
const HAZARDS = [
  'fall-hazard', 'slip-trip', 'electrocution', 'arc-flash', 'confined-space',
  'toxic-gas', 'fire-explosion', 'chemical-exposure', 'manual-handling',
  'crush-hazard', 'caught-between', 'struck-by', 'noise', 'vibration',
  'heat-stress', 'cold-exposure', 'oxygen-deficiency', 'toxic-atmosphere',
  'falling-objects', 'sharp-edges', 'rotating-machinery', 'pressure',
  'biological-hazards', 'radiation', 'dust-exposure', 'fumes'
];

function getRiskLevel(hazard: string): 'low' | 'medium' | 'high' | 'critical' {
  const criticalHazards = ['electrocution', 'arc-flash', 'confined-space', 'toxic-gas', 
                          'fire-explosion', 'fall-hazard', 'crush-hazard', 'oxygen-deficiency'];
  const highHazards = ['chemical-exposure', 'toxic-atmosphere', 'caught-between', 'struck-by',
                      'falling-objects', 'pressure', 'radiation'];
  const mediumHazards = ['manual-handling', 'slip-trip', 'noise', 'vibration', 'heat-stress',
                        'dust-exposure', 'fumes', 'sharp-edges'];
  
  if (criticalHazards.some(h => hazard.includes(h))) return 'critical';
  if (highHazards.some(h => hazard.includes(h))) return 'high';
  if (mediumHazards.some(h => hazard.includes(h))) return 'medium';
  return 'low';
}

function getRequiredPPE(activity: string, location: string): string[] {
  const ppe: string[] = [];
  
  // Base PPE
  ppe.push('safety glasses', 'safety boots', 'hard hat');
  
  // Activity-specific PPE
  if (activity.toLowerCase().includes('electric') || activity.toLowerCase().includes('panel')) {
    ppe.push('insulated gloves', 'arc flash suit', 'voltage-rated tools');
  }
  if (activity.toLowerCase().includes('weld') || activity.toLowerCase().includes('hot')) {
    ppe.push('welding helmet', 'welding gloves', 'fire-resistant clothing');
  }
  if (activity.toLowerCase().includes('chemical') || activity.toLowerCase().includes('stp')) {
    ppe.push('chemical gloves', 'respirator', 'chemical suit');
  }
  if (activity.toLowerCase().includes('height') || activity.toLowerCase().includes('scaffold') || 
      activity.toLowerCase().includes('roof')) {
    ppe.push('safety harness', 'lanyard', 'fall arrest system');
  }
  if (activity.toLowerCase().includes('confined') || location.toLowerCase().includes('manhole') ||
      location.toLowerCase().includes('tank')) {
    ppe.push('respirator', 'gas monitor', 'rescue equipment');
  }
  if (activity.toLowerCase().includes('noise') || activity.toLowerCase().includes('grinding')) {
    ppe.push('ear protection');
  }
  
  return [...new Set(ppe)];
}

function getIndustryFromActivity(activity: string): string {
  if (activity.toLowerCase().includes('electric') || activity.toLowerCase().includes('panel') ||
      activity.toLowerCase().includes('cable') || activity.toLowerCase().includes('transformer')) {
    return 'electrical';
  }
  if (activity.toLowerCase().includes('pump') || activity.toLowerCase().includes('pipe') ||
      activity.toLowerCase().includes('valve') || activity.toLowerCase().includes('mechanical')) {
    return 'mechanical';
  }
  if (activity.toLowerCase().includes('stp') || activity.toLowerCase().includes('manhole') ||
      activity.toLowerCase().includes('sludge') || activity.toLowerCase().includes('clarifier')) {
    return 'wastewater';
  }
  if (activity.toLowerCase().includes('concrete') || activity.toLowerCase().includes('excavat') ||
      activity.toLowerCase().includes('scaffold') || activity.toLowerCase().includes('steel')) {
    return 'construction';
  }
  if (activity.toLowerCase().includes('weld') || activity.toLowerCase().includes('hot')) {
    return 'hot-work';
  }
  if (activity.toLowerCase().includes('height') || activity.toLowerCase().includes('roof') ||
      activity.toLowerCase().includes('tower')) {
    return 'work-at-height';
  }
  if (activity.toLowerCase().includes('chemical') || activity.toLowerCase().includes('hazmat')) {
    return 'chemical';
  }
  return 'general-industry';
}

// Generate all templates
function generateAllTemplates(): Template[] {
  const templates: Template[] = [];
  let idCounter = 1;

  // Generate templates from activity-action-location combinations
  for (const activity of ACTIVITIES) {
    for (const action of ACTIONS) {
      // Generate templates for each location (limit to create realistic number)
      const locationsToUse = LOCATIONS.slice(0, Math.min(10, LOCATIONS.length));
      
      for (const location of locationsToUse) {
        // Select appropriate hazards based on activity
        const actIndex = ACTIVITIES.indexOf(activity);
        const actionIndex = ACTIONS.indexOf(action);
        const relevantHazards = HAZARDS.filter((_, idx) => {
          // Use modulo to select different hazards for different activities
          return (actIndex + actionIndex + idx) % 3 === 0;
        }).slice(0, 2); // Take 2 hazards per template
        
        for (const hazard of relevantHazards) {
          const category = CATEGORIES[(idCounter) % CATEGORIES.length];
          const riskLevel = getRiskLevel(hazard);
          const icon = ICONS[idCounter % ICONS.length];
          const industry = getIndustryFromActivity(activity);
          
          const name = `${activity} ${action} at ${location}`;
          const description = `Safety signage for ${activity.toLowerCase()} ${action.toLowerCase()} - ${location}`;
          
          templates.push({
            id: `TMPL-${String(idCounter).padStart(5, '0')}`,
            name,
            category,
            subcategory: hazard,
            industry,
            activity: activity.toLowerCase().replace(/\s+/g, '-'),
            description,
            preview: `${activity.toLowerCase().replace(/\s+/g, '-')}-${idCounter}`,
            color: COLORS[category],
            icon,
            popular: Math.random() > 0.97,
            new: Math.random() > 0.98,
            tags: [
              industry,
              activity.toLowerCase(),
              action.toLowerCase(),
              location.toLowerCase(),
              hazard
            ],
            standard: 'ISO 7010',
            riskLevel,
            requiredPPE: getRequiredPPE(activity, location)
          });
          
          idCounter++;
        }
      }
    }
  }

  console.log(`✅ Successfully generated ${templates.length} safety signage templates!`);
  return templates;
}

// Generate and export templates immediately
export const MASSIVE_TEMPLATES = generateAllTemplates();
export const MASSIVE_TEMPLATE_COUNT = MASSIVE_TEMPLATES.length;

// Log on module load to verify generation
if (typeof window !== 'undefined') {
  console.log(`🎉 MASSIVE TEMPLATE DATABASE LOADED: ${MASSIVE_TEMPLATES.length} templates generated!`);
}