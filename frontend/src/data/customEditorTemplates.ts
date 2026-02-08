/**
 * Safety sign templates for Custom Signage Editor - Template Library
 */

export const manualTemplates = [
  // ==========================================
  // DANGER SIGNS (Red/Black/White - Immediate Hazards)
  // ==========================================

  // DANGER - FLAMMABLE / EXPLOSIVE / CHEMICAL
  { id: 'd-flam-001', type: 'danger', category: 'Chemical', text: 'FLAMMABLE MATERIAL', subText: 'NO SMOKING OR OPEN FLAMES', icon: 'Flame', layout: 'standard' },
  { id: 'd-flam-002', type: 'danger', category: 'Chemical', text: 'EXPLOSIVE GAS', subText: 'NO SMOKING', icon: 'Flame', layout: 'visual' },
  { id: 'd-flam-003', type: 'danger', category: 'Chemical', text: 'CHEMICAL WASTE', subText: 'STORAGE AREA', icon: 'FlaskConical', layout: 'standard' },
  { id: 'd-flam-004', type: 'danger', category: 'Chemical', text: 'ACID', subText: 'WEAR PPE', icon: 'FlaskConical', layout: 'visual' },
  { id: 'd-flam-005', type: 'danger', category: 'Chemical', text: 'CAUSTIC', subText: 'HANDLE WITH CARE', icon: 'FlaskConical', layout: 'standard' },
  { id: 'd-flam-006', type: 'danger', category: 'Chemical', text: 'DIESEL FUEL', subText: 'NO SMOKING', icon: 'Fuel', layout: 'standard' },
  { id: 'd-flam-007', type: 'danger', category: 'Chemical', text: 'PROPANE', subText: 'FLAMMABLE GAS', icon: 'Flame', layout: 'left-icon' },
  { id: 'd-flam-008', type: 'danger', category: 'Chemical', text: 'OXYGEN', subText: 'NO SMOKING / NO OIL OR GREASE', icon: 'Flame', layout: 'standard' },

  // DANGER - ELECTRICAL
  { id: 'd-elec-001', type: 'danger', category: 'Electrical', text: 'HIGH VOLTAGE', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Zap', layout: 'left-icon' },
  { id: 'd-elec-002', type: 'danger', category: 'Electrical', text: 'HIGH VOLTAGE', subText: 'KEEP OUT', icon: 'Zap', layout: 'visual' },
  { id: 'd-elec-003', type: 'danger', category: 'Electrical', text: 'ELECTRICAL HAZARD', subText: 'TURN OFF POWER BEFORE SERVICING', icon: 'Zap', layout: 'standard' },
  { id: 'd-elec-004', type: 'danger', category: 'Electrical', text: '480 VOLTS', subText: 'STAND CLEAR', icon: 'Zap', layout: 'left-icon' },
  { id: 'd-elec-005', type: 'danger', category: 'Electrical', text: 'ARC FLASH HAZARD', subText: 'APPROPRIATE PPE REQUIRED', icon: 'Zap', layout: 'visual' },
  { id: 'd-elec-006', type: 'danger', category: 'Electrical', text: 'BURIED CABLE', subText: 'CALL BEFORE DIGGING', icon: 'Zap', layout: 'standard' },
  { id: 'd-elec-007', type: 'danger', category: 'Electrical', text: 'HIGH VOLTAGE OVERHEAD', subText: 'LOOK UP', icon: 'Zap', layout: 'top-icon' },
  { id: 'd-elec-008', type: 'danger', category: 'Electrical', text: 'LIVE WIRES', subText: 'DO NOT TOUCH', icon: 'Zap', layout: 'left-icon' },
  { id: 'd-elec-009', type: 'danger', category: 'Electrical', text: 'ELECTRICAL ROOM', subText: 'NO STORAGE PERMITTED', icon: 'Zap', layout: 'standard' },
  { id: 'd-elec-010', type: 'danger', category: 'Electrical', text: 'HIGH VOLTAGE TEST AREA', subText: 'KEEP OUT', icon: 'Zap', layout: 'visual' },

  // GENERAL SAFETY / ACCESS
  { id: 'd-gen-001', type: 'danger', category: 'General', text: 'KEEP OUT', subText: 'HAZARDOUS AREA', icon: 'Hand', layout: 'visual' },
  { id: 'd-gen-002', type: 'danger', category: 'General', text: 'DO NOT ENTER', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Ban', layout: 'left-icon' },
  { id: 'd-gen-003', type: 'danger', category: 'General', text: 'CONFINED SPACE', subText: 'PERMIT REQUIRED FOR ENTRY', icon: 'Box', layout: 'standard' },
  { id: 'd-gen-004', type: 'danger', category: 'General', text: 'CRANE OVERHEAD', subText: 'WATCH FOR MOVING LOADS', icon: 'ArrowDown', layout: 'visual' },
  { id: 'd-gen-005', type: 'danger', category: 'General', text: 'OPEN PIT', subText: 'FALL HAZARD', icon: 'ArrowDown', layout: 'left-icon' },
  { id: 'd-gen-006', type: 'danger', category: 'General', text: 'FALL PROTECTION REQUIRED', subText: 'BEYOND THIS POINT', icon: 'Anchor', layout: 'standard' },
  { id: 'd-gen-007', type: 'danger', category: 'General', text: 'SUSPENDED LOAD', subText: 'STAY CLEAR', icon: 'ArrowDown', layout: 'visual' },

  // DANGER - MACHINERY & PHYSICAL
  { id: 'd-mach-001', type: 'danger', category: 'Machinery', text: 'AUTOMATIC START', subText: 'EQUIPMENT STARTS SUDDENLY', icon: 'Settings', layout: 'left-icon' },
  { id: 'd-mach-002', type: 'danger', category: 'Machinery', text: 'PINCH POINT', subText: 'KEEP HANDS CLEAR', icon: 'AlertTriangle', layout: 'visual' },
  { id: 'd-mach-003', type: 'danger', category: 'Machinery', text: 'MOVING PARTS', subText: 'DO NOT OPERATE WITHOUT GUARDS', icon: 'Settings', layout: 'standard' },
  { id: 'd-mach-004', type: 'danger', category: 'Machinery', text: 'LOCKOUT/TAGOUT', subText: 'REQUIRED BEFORE SERVICING', icon: 'Lock', layout: 'left-icon' },
  { id: 'd-mach-005', type: 'danger', category: 'Machinery', text: 'MOVING MACHINERY', subText: 'STAY CLEAR', icon: 'Settings', layout: 'visual' },
  { id: 'd-mach-006', type: 'danger', category: 'Machinery', text: 'KEEP GUARDS IN PLACE', subText: 'DO NOT REMOVE', icon: 'Shield', layout: 'standard' },
  { id: 'd-mach-007', type: 'danger', category: 'Machinery', text: 'KEEP HANDS AND FINGERS AWAY', subText: 'PINCH POINTS', icon: 'Hand', layout: 'standard' },
  { id: 'd-mach-008', type: 'danger', category: 'Machinery', text: 'CRUSH HAZARD', subText: 'STAY CLEAR', icon: 'ArrowDown', layout: 'visual' },
  { id: 'd-mach-009', type: 'danger', category: 'Machinery', text: 'ROTATING BLADES', subText: 'KEEP HANDS CLEAR', icon: 'AlertTriangle', layout: 'standard' },

  // WARNING - HAZARDS
  { id: 'w-haz-001', type: 'warning', category: 'Hazards', text: 'MAGNETIC FIELD', subText: 'CAN BE HARMFUL TO PACEMAKER WEARERS', icon: 'Magnet', layout: 'left-icon' },
  { id: 'w-haz-002', type: 'warning', category: 'Hazards', text: 'LOUD NOISE HAZARD', subText: 'EAR PROTECTION REQUIRED', icon: 'Headphones', layout: 'standard' },
  { id: 'w-haz-003', type: 'warning', category: 'Hazards', text: 'FALL HAZARD', subText: 'WATCH YOUR STEP', icon: 'ArrowDown', layout: 'standard' },
  { id: 'w-haz-004', type: 'warning', category: 'Hazards', text: 'CRUSH HAZARD', subText: 'KEEP CLEAR', icon: 'AlertTriangle', layout: 'visual' },
  { id: 'w-haz-005', type: 'warning', category: 'Hazards', text: 'HOT SURFACE', subText: 'DO NOT TOUCH', icon: 'Flame', layout: 'standard' },
  { id: 'w-haz-006', type: 'warning', category: 'Hazards', text: 'LASER HAZARD', subText: 'AVOID DIRECT EYE EXPOSURE', icon: 'Sun', layout: 'standard' },
  { id: 'w-haz-007', type: 'warning', category: 'Hazards', text: 'EXPLOSIVE MATERIAL', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'AlertTriangle', layout: 'standard' },
  { id: 'w-haz-008', type: 'warning', category: 'Hazards', text: 'ASBESTOS', subText: 'CANCER AND LUNG DISEASE HAZARD', icon: 'Skull', layout: 'standard' },

  // WARNING - WELDING
  { id: 'w-weld-001', type: 'warning', category: 'Welding', text: 'WELDING ARC', subText: 'WEAR PROPER EYE PROTECTION', icon: 'Eye', layout: 'left-icon' },
  { id: 'w-weld-002', type: 'warning', category: 'Welding', text: 'WELDING IN PROGRESS', subText: 'DO NOT WATCH ARC', icon: 'Eye', layout: 'standard' },

  // ==========================================
  // WARNING SIGNS (Orange/Black - Potential Hazards)
  // ==========================================

  // ACCESS & GENERAL
  { id: 'w-acc-001', type: 'warning', category: 'Access', text: 'DO NOT ENTER', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Hand', layout: 'standard' },
  { id: 'w-acc-002', type: 'warning', category: 'Access', text: 'NO TRESPASSING', subText: 'VIOLATORS WILL BE PROSECUTED', icon: 'Hand', layout: 'standard' },
  { id: 'w-acc-003', type: 'warning', category: 'Access', text: 'KEEP OUT', subText: 'RESTRICTED AREA', icon: 'Hand', layout: 'standard' },
  { id: 'w-acc-004', type: 'warning', category: 'Access', text: 'RESTRICTED AREA', subText: 'AUTHORIZED EMPLOYEES ONLY', icon: 'Hand', layout: 'standard' },

  // BIOLOGICAL / CHEMICAL
  { id: 'w-bio-001', type: 'warning', category: 'Biohazard', text: 'BIOHAZARD', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Biohazard', layout: 'left-icon' },
  { id: 'w-bio-002', type: 'warning', category: 'Biohazard', text: 'CHEMICAL STORAGE', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'FlaskConical', layout: 'standard' },
  { id: 'w-bio-003', type: 'warning', category: 'Biohazard', text: 'HOT SURFACE', subText: 'DO NOT TOUCH', icon: 'Flame', layout: 'standard' },

  // ELECTRICAL
  { id: 'w-elec-001', type: 'warning', category: 'Electrical', text: 'ELECTRICAL HAZARD', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Zap', layout: 'standard' },
  { id: 'w-elec-002', type: 'warning', category: 'Electrical', text: 'HIGH VOLTAGE', subText: 'KEEP AWAY', icon: 'Zap', layout: 'left-icon' },
  { id: 'w-elec-003', type: 'warning', category: 'Electrical', text: 'BATTERY CHARGING AREA', subText: 'NO SMOKING', icon: 'Zap', layout: 'standard' },

  // MACHINERY / PHYSICAL
  { id: 'w-mach-001', type: 'warning', category: 'Machinery', text: 'PINCH POINT', subText: 'KEEP HANDS CLEAR', icon: 'AlertTriangle', layout: 'standard' },
  { id: 'w-mach-002', type: 'warning', category: 'Machinery', text: 'THIS MACHINE STARTS AUTOMATICALLY', subText: 'STAY CLEAR', icon: 'Settings', layout: 'standard' },
  { id: 'w-mach-003', type: 'warning', category: 'Machinery', text: 'WATCH YOUR HANDS', subText: 'KEEP OUT OF MACHINERY', icon: 'Hand', layout: 'left-icon' },
  { id: 'w-mach-004', type: 'warning', category: 'Machinery', text: 'CHOCK WHEELS', subText: 'BEFORE LOADING AND UNLOADING', icon: 'Truck', layout: 'standard' },

  // PERSONAL SAFETY
  { id: 'w-pers-001', type: 'warning', category: 'Personal Safety', text: 'WATCH YOUR HEAD', subText: 'LOW CLEARANCE', icon: 'ArrowUp', layout: 'standard' },
  { id: 'w-pers-002', type: 'warning', category: 'Personal Safety', text: 'WATCH YOUR STEP', subText: 'UNEVEN SURFACE', icon: 'Footprints', layout: 'left-icon' },
  { id: 'w-pers-003', type: 'warning', category: 'Personal Safety', text: 'SLIPPERY WHEN WET', subText: 'USE CAUTION', icon: 'Droplets', layout: 'standard' },
  { id: 'w-pers-004', type: 'warning', category: 'Personal Safety', text: 'HIGH NOISE AREA', subText: 'WEAR EAR PROTECTION', icon: 'Headphones', layout: 'standard' },
  { id: 'w-pers-005', type: 'warning', category: 'Personal Safety', text: 'EAR PROTECTION REQUIRED', subText: 'WHILE EQUIPMENT IS OPERATING', icon: 'Headphones', layout: 'left-icon' },
  { id: 'w-pers-006', type: 'warning', category: 'Personal Safety', text: 'NO SMOKING', subText: 'MATCHES, OR OPEN LIGHTS', icon: 'CigaretteOff', layout: 'standard' },

  // TEMPLATES
  { id: 'w-temp-001', type: 'warning', category: 'Templates', text: 'Place Text Here', subText: 'Additional Text', icon: 'AlertTriangle', layout: 'visual' },
  { id: 'w-temp-002', type: 'warning', category: 'Templates', text: 'Place Text Here', subText: 'Place Image Here', icon: 'Image', layout: 'visual' },

  // ==========================================
  // CAUTION SIGNS (Yellow/Black - Safety Instructions)
  // ==========================================

  // ACCESS
  { id: 'c-acc-001', type: 'caution', category: 'Access', text: 'AUTHORIZED PERSONNEL ONLY', subText: 'KEEP OUT', icon: 'Hand', layout: 'standard' },
  { id: 'c-acc-002', type: 'caution', category: 'Access', text: 'KEEP GATE CLOSED', subText: 'AT ALL TIMES', icon: 'DoorClosed', layout: 'standard' },
  { id: 'c-acc-003', type: 'caution', category: 'Access', text: 'CONSTRUCTION AREA', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'HardHat', layout: 'standard' },
  { id: 'c-acc-004', type: 'caution', category: 'Access', text: 'DO NOT ENTER', subText: 'THIS ENCLOSURE', icon: 'Ban', layout: 'standard' },

  // PHYSICAL HAZARDS
  { id: 'c-phys-001', type: 'caution', category: 'Physical', text: 'LOW HEAD ROOM', subText: 'WATCH YOUR HEAD', icon: 'ArrowUp', layout: 'standard' },
  { id: 'c-phys-002', type: 'caution', category: 'Physical', text: 'WATCH YOUR STEP', subText: 'TRIPPING HAZARD', icon: 'Footprints', layout: 'left-icon' },
  { id: 'c-phys-003', type: 'caution', category: 'Physical', text: 'STEP DOWN', subText: 'USE HANDRAIL', icon: 'Footprints', layout: 'standard' },
  { id: 'c-phys-004', type: 'caution', category: 'Physical', text: 'STEP UP', subText: 'USE HANDRAIL', icon: 'Footprints', layout: 'standard' },
  { id: 'c-phys-005', type: 'caution', category: 'Physical', text: 'WET FLOOR', subText: 'SLIPPERY', icon: 'Droplets', layout: 'standard' },
  { id: 'c-phys-006', type: 'caution', category: 'Physical', text: 'FALLING ICE', subText: 'WATCH OVERHEAD', icon: 'CloudFog', layout: 'standard' },
  { id: 'c-phys-007', type: 'caution', category: 'Physical', text: 'HOT SURFACE', subText: 'DO NOT TOUCH', icon: 'Flame', layout: 'left-icon' },
  { id: 'c-phys-008', type: 'caution', category: 'Physical', text: 'MICROWAVE OVEN IN USE', subText: 'DO NOT OPERATE', icon: 'Zap', layout: 'standard' },

  // PPE & INSTRUCTIONS
  { id: 'c-ppe-001', type: 'caution', category: 'PPE', text: 'EAR PROTECTION AREA', subText: 'REQUIRED BEYOND THIS POINT', icon: 'Headphones', layout: 'standard' },
  { id: 'c-ppe-002', type: 'caution', category: 'PPE', text: 'EYE PROTECTION REQUIRED', subText: 'SAFETY GLASSES MUST BE WORN', icon: 'Eye', layout: 'left-icon' },
  { id: 'c-ppe-003', type: 'caution', category: 'PPE', text: 'HARD HAT AREA', subText: 'MUST BE WORN', icon: 'HardHat', layout: 'standard' },
  { id: 'c-ppe-004', type: 'caution', category: 'PPE', text: 'SAFETY SHOES REQUIRED', subText: 'STEEL TOE BOOTS', icon: 'Footprints', layout: 'standard' },
  { id: 'c-ppe-005', type: 'caution', category: 'PPE', text: 'USE HANDRAIL', subText: 'FOR SAFETY', icon: 'ArrowUp', layout: 'standard' },

  // MACHINERY
  { id: 'c-mach-001', type: 'caution', category: 'Machinery', text: 'THIS MACHINE STARTS AUTOMATICALLY', subText: 'KEEP CLEAR', icon: 'Settings', layout: 'standard' },
  { id: 'c-mach-002', type: 'caution', category: 'Machinery', text: 'CONVEYOR MAY START', subText: 'WITHOUT WARNING', icon: 'Settings', layout: 'standard' },
  { id: 'c-mach-003', type: 'caution', category: 'Machinery', text: 'FORKLIFT TRAFFIC', subText: 'KEEP CLEAR', icon: 'Truck', layout: 'left-icon' },
  { id: 'c-mach-004', type: 'caution', category: 'Machinery', text: 'ROBOT OPERATING AREA', subText: 'DO NOT ENTER', icon: 'Bot', layout: 'standard' },

  // ==========================================
  // NOTICE SIGNS (Blue/White - Information/Policy)
  // ==========================================

  // NOTICE - RULES & POLICY
  { id: 'n-rule-001', type: 'notice', category: 'Rules', text: 'NO SMOKING', subText: 'IN THIS AREA', icon: 'CigaretteOff', layout: 'left-icon' },
  { id: 'n-rule-002', type: 'notice', category: 'Rules', text: 'NO FOOD OR DRINK', subText: 'ALLOWED IN THIS AREA', icon: 'Coffee', layout: 'left-icon' },
  { id: 'n-rule-003', type: 'notice', category: 'Rules', text: 'DO NOT BLOCK DOOR', subText: 'KEEP CLEAR', icon: 'DoorOpen', layout: 'standard' },
  { id: 'n-rule-004', type: 'notice', category: 'Rules', text: 'EMPLOYEES ONLY', subText: 'BEYOND THIS POINT', icon: 'Users', layout: 'standard' },
  { id: 'n-rule-005', type: 'notice', category: 'Rules', text: 'ALL VISITORS MUST REGISTER', subText: 'AT OFFICE', icon: 'ClipboardList', layout: 'standard' },
  { id: 'n-rule-006', type: 'notice', category: 'Rules', text: 'CAMERAS NOT ALLOWED', subText: 'NO PHOTOGRAPHY', icon: 'CameraOff', layout: 'left-icon' },
  { id: 'n-rule-007', type: 'notice', category: 'Rules', text: 'NO CELL PHONES', subText: 'TURN OFF', icon: 'PhoneOff', layout: 'standard' },
  { id: 'n-rule-008', type: 'notice', category: 'Rules', text: 'NO SOLICITING', subText: 'VIOLATORS PROSECUTED', icon: 'Ban', layout: 'standard' },
  { id: 'n-rule-009', type: 'notice', category: 'Rules', text: 'PRIVATE PROPERTY', subText: 'NO TRESPASSING', icon: 'Hand', layout: 'standard' },
  { id: 'n-rule-010', type: 'notice', category: 'Rules', text: 'NO DUMPING', subText: 'VIOLATORS WILL BE PROSECUTED', icon: 'Trash2', layout: 'standard' },
  { id: 'n-rule-011', type: 'notice', category: 'Rules', text: 'KEEP GATE CLOSED', subText: 'AT ALL TIMES', icon: 'DoorClosed', layout: 'standard' },
  { id: 'n-rule-012', type: 'notice', category: 'Rules', text: 'NO EXIT', subText: 'DO NOT ENTER', icon: 'Ban', layout: 'standard' },
  { id: 'n-rule-013', type: 'notice', category: 'Rules', text: 'AUTHORIZED PERSONNEL ONLY', subText: 'RESTRICTED AREA', icon: 'Shield', layout: 'standard' },
  { id: 'n-rule-014', type: 'notice', category: 'Rules', text: 'HAIR COVERING REQUIRED', subText: 'IN THIS AREA', icon: 'User', layout: 'left-icon' },
  { id: 'n-rule-015', type: 'notice', category: 'Rules', text: 'BEARDS MUST BE COVERED', subText: 'IN THIS AREA', icon: 'User', layout: 'left-icon' },

  // NOTICE - SAFETY & HYGIENE
  { id: 'n-safe-001', type: 'notice', category: 'Safety', text: 'WASH HANDS', subText: 'BEFORE RETURNING TO WORK', icon: 'Droplets', layout: 'left-icon' },
  { id: 'n-safe-002', type: 'notice', category: 'Safety', text: 'SANITIZE HANDS', subText: 'STATION HERE', icon: 'Droplets', layout: 'standard' },
  { id: 'n-safe-003', type: 'notice', category: 'Safety', text: 'KEEP AREA CLEAN', subText: 'CLEAN UP SPILLS', icon: 'CheckCircle', layout: 'standard' },
  { id: 'n-safe-004', type: 'notice', category: 'Safety', text: 'SAFETY GLASSES REQUIRED', subText: 'IN THIS AREA', icon: 'Eye', layout: 'left-icon' },
  { id: 'n-safe-005', type: 'notice', category: 'Safety', text: 'HARD HAT AREA', subText: 'WEAR PPE', icon: 'HardHat', layout: 'left-icon' },
  { id: 'n-safe-006', type: 'notice', category: 'Safety', text: 'HEARING PROTECTION', subText: 'REQUIRED', icon: 'Headphones', layout: 'standard' },
  { id: 'n-safe-007', type: 'notice', category: 'Safety', text: 'WEAR YOUR RESPIRATOR', subText: 'IN THIS AREA', icon: 'Wind', layout: 'left-icon' },

  // RESTRICTED AREA
  { id: 'n-rest-001', type: 'notice', category: 'Restricted', text: 'RESTRICTED AREA', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Hand', layout: 'standard' },
  { id: 'n-rest-002', type: 'notice', category: 'Restricted', text: 'SECURITY NOTICE', subText: '24 HOUR SURVEILLANCE', icon: 'Video', layout: 'left-icon' },

  // ==========================================
  // SAFETY FIRST / EMERGENCY (Green/White)
  // ==========================================

  { id: 's-first-001', type: 'safety', category: 'Emergency', text: 'SAFETY FIRST', subText: 'BE CAREFUL', icon: 'ShieldCheck', layout: 'standard' },
  { id: 's-first-002', type: 'safety', category: 'Emergency', text: 'EYE WASH STATION', subText: 'KEEP CLEAR', icon: 'Eye', layout: 'standard' },
  { id: 's-first-003', type: 'safety', category: 'Emergency', text: 'FIRST AID KIT', subText: 'INSIDE', icon: 'Cross', layout: 'left-icon' },
  { id: 's-first-004', type: 'safety', category: 'Emergency', text: 'EMERGENCY EXIT', subText: 'KEEP CLEAR', icon: 'LogOut', layout: 'standard' },
  { id: 's-first-005', type: 'safety', category: 'Emergency', text: 'AED', subText: 'AUTOMATED EXTERNAL DEFIBRILLATOR', icon: 'HeartPulse', layout: 'left-icon' },
  { id: 's-first-006', type: 'safety', category: 'Emergency', text: 'STRETCHER', subText: 'EMERGENCY USE ONLY', icon: 'Activity', layout: 'standard' },
  { id: 's-first-007', type: 'safety', category: 'Emergency', text: 'EMERGENCY SHOWER', subText: 'KEEP AREA CLEAR', icon: 'ShowerHead', layout: 'left-icon' },
  { id: 's-first-008', type: 'safety', category: 'Emergency', text: 'SPILL KIT', subText: 'LOCATED HERE', icon: 'Trash2', layout: 'standard' },

  // ==========================================
  // FIRE SAFETY (Red/White - Fire Equipment)
  // ==========================================

  { id: 'f-ext-001', type: 'fire', category: 'Equipment', text: 'FIRE EXTINGUISHER', subText: 'DO NOT BLOCK', icon: 'Flame', layout: 'visual' },
  { id: 'f-ext-002', type: 'fire', category: 'Equipment', text: 'FIRE ALARM', subText: 'PULL IN CASE OF FIRE', icon: 'Bell', layout: 'standard' },
  { id: 'f-ext-003', type: 'fire', category: 'Equipment', text: 'FIRE HOSE', subText: 'KEEP CLEAR', icon: 'Disc', layout: 'left-icon' },
  { id: 'f-ext-004', type: 'fire', category: 'Equipment', text: 'FIRE HYDRANT', subText: 'NO PARKING', icon: 'Flame', layout: 'standard' },

  // ==========================================
  // TRAFFIC & ROAD SAFETY
  // ==========================================

  { id: 't-stop-001', type: 'danger', category: 'Traffic', text: 'STOP', subText: 'CHECK FOR TRAFFIC', icon: 'Octagon', layout: 'visual' },
  { id: 't-yield-001', type: 'warning', category: 'Traffic', text: 'YIELD', subText: 'TO PEDESTRIANS', icon: 'Triangle', layout: 'visual' },
  { id: 't-speed-001', type: 'notice', category: 'Traffic', text: 'SPEED LIMIT', subText: '5 MPH', icon: 'Activity', layout: 'visual' },
  { id: 't-park-001', type: 'notice', category: 'Traffic', text: 'NO PARKING', subText: 'FIRE LANE', icon: 'Ban', layout: 'standard' },
];

// Generate high-quality bulk templates
function generateBulkTemplates(): typeof manualTemplates {
  const bulkTemplates: Array<{ id: string; type: string; category: string; text: string; subText: string; icon: string; layout: string }> = [];

  // --- 1. VALVE TAGS & IDENTIFICATION ---
  const valveTags = [
    { text: 'MAIN GAS SHUTOFF', subText: 'VALVE', type: 'danger', icon: 'Flame' },
    { text: 'SPRINKLER CONTROL', subText: 'NORMALLY OPEN', type: 'fire', icon: 'ShowerHead' },
    { text: 'STEAM ISOLATION', subText: 'DO NOT OPERATE', type: 'warning', icon: 'CloudFog' },
    { text: 'DOMESTIC WATER', subText: 'SUPPLY VALVE', type: 'notice', icon: 'Droplets' },
    { text: 'COMPRESSED AIR', subText: 'MAIN SHUTOFF', type: 'notice', icon: 'Wind' },
    { text: 'FIRE SUPPRESSION', subText: 'SECTION VALVE', type: 'fire', icon: 'Shield' },
    { text: 'NATURAL GAS', subText: 'SUPPLY LINE', type: 'danger', icon: 'Flame' },
    { text: 'ACID FEED', subText: 'VALVE', type: 'danger', icon: 'FlaskConical' },
    { text: 'CHILLED WATER', subText: 'RETURN', type: 'notice', icon: 'Thermometer' },
    { text: 'HOT WATER', subText: 'SUPPLY', type: 'warning', icon: 'Thermometer' },
    { text: 'EMERGENCY SHUTOFF', subText: 'GAS VALVE', type: 'danger', icon: 'Power' },
    { text: 'LOCKOUT POINT', subText: 'V-101', type: 'danger', icon: 'Lock' },
  ];
  valveTags.forEach((tag, i) => {
    bulkTemplates.push({
      id: `gen-valve-${i}`,
      type: tag.type,
      category: 'Valves',
      text: tag.text,
      subText: tag.subText,
      icon: tag.icon,
      layout: 'standard',
    });
  });

  // --- 2. LOCKOUT / TAGOUT (LOTO) ---
  const lotoMessages = [
    { text: 'LOCKED OUT', subText: 'DO NOT OPERATE', icon: 'Lock' },
    { text: 'DANGER', subText: 'EQUIPMENT LOCKED OUT', icon: 'Ban' },
    { text: 'LOCKED OUT', subText: 'ELECTRICAL HAZARD', icon: 'Zap' },
    { text: 'LOCKED OUT', subText: 'MECHANICAL HAZARD', icon: 'Settings' },
    { text: 'LOCKED OUT', subText: 'MAINTENANCE IN PROGRESS', icon: 'Wrench' },
    { text: 'ENERGY SOURCE', subText: 'LOCKED OUT', icon: 'Power' },
    { text: 'VALVE LOCKED', subText: 'DO NOT OPEN', icon: 'Disc' },
    { text: 'DO NOT START', subText: 'MEN WORKING', icon: 'Users' },
    { text: 'OUT OF SERVICE', subText: 'DO NOT USE', icon: 'XCircle' },
  ];
  lotoMessages.forEach((msg, i) => {
    bulkTemplates.push({
      id: `gen-loto-${i}`,
      type: 'danger',
      category: 'Lockout',
      text: msg.text,
      subText: msg.subText,
      icon: msg.icon,
      layout: i % 2 === 0 ? 'visual' : 'left-icon',
    });
  });

  // --- 3. CHEMICAL STORAGE ---
  const chemicals = [
    { name: 'SULFURIC ACID', type: 'danger', icon: 'FlaskConical' },
    { name: 'HYDROCHLORIC ACID', type: 'danger', icon: 'FlaskConical' },
    { name: 'SODIUM HYDROXIDE', type: 'danger', icon: 'FlaskConical' },
    { name: 'AMMONIA', type: 'warning', icon: 'Wind' },
    { name: 'CHLORINE', type: 'danger', icon: 'Skull' },
    { name: 'DIESEL FUEL', type: 'danger', icon: 'Fuel' },
    { name: 'GASOLINE', type: 'danger', icon: 'Fuel' },
    { name: 'PROPANE', type: 'danger', icon: 'Flame' },
    { name: 'ACETONE', type: 'warning', icon: 'Flame' },
    { name: 'NITROGEN', type: 'notice', icon: 'CloudFog' },
    { name: 'OXYGEN', type: 'warning', icon: 'Flame' },
    { name: 'WASTE OIL', type: 'notice', icon: 'Trash2' },
    { name: 'SOLVENT', type: 'warning', icon: 'FlaskConical' },
  ];
  chemicals.forEach((chem, i) => {
    bulkTemplates.push({
      id: `gen-chem-${i}`,
      type: chem.type,
      category: 'Chemical Storage',
      text: chem.name,
      subText: 'STORAGE AREA',
      icon: chem.icon,
      layout: 'standard',
    });
  });

  // --- 4. LOGISTICS & WAREHOUSE ---
  const logistics = [
    { text: 'FORKLIFT TRAFFIC', subText: 'YIELD TO PEDS', type: 'warning', icon: 'Truck' },
    { text: 'LOADING DOCK', subText: 'KEEP CLEAR', type: 'notice', icon: 'Truck' },
    { text: 'DELIVERIES', subText: 'RING BELL', type: 'notice', icon: 'Bell' },
    { text: 'SHIPPING / RECEIVING', subText: 'OFFICE', type: 'notice', icon: 'Box' },
    { text: 'PEDESTRIAN WALKWAY', subText: 'WATCH FOR TRUCKS', type: 'warning', icon: 'Footprints' },
    { text: 'STACKING LIMIT', subText: '2 PALLETS HIGH', type: 'warning', icon: 'Layers' },
    { text: 'BATTERY CHARGING', subText: 'NO SMOKING', type: 'danger', icon: 'Zap' },
    { text: 'WHEEL CHOCKS', subText: 'REQUIRED', type: 'caution', icon: 'Disc' },
    { text: 'SPEED LIMIT', subText: '5 MPH', type: 'notice', icon: 'Activity' },
    { text: 'WATCH FOR WIRES', subText: 'OVERHEAD', type: 'warning', icon: 'ArrowUp' },
  ];
  logistics.forEach((log, i) => {
    bulkTemplates.push({
      id: `gen-log-${i}`,
      type: log.type,
      category: 'Logistics',
      text: log.text,
      subText: log.subText,
      icon: log.icon,
      layout: 'standard',
    });
  });

  // --- 5. FIRE SAFETY ---
  const fireItems = [
    { text: 'FIRE EXTINGUISHER', subText: 'CO2', icon: 'Flame' },
    { text: 'FIRE EXTINGUISHER', subText: 'WATER', icon: 'Droplets' },
    { text: 'FIRE EXTINGUISHER', subText: 'DRY CHEMICAL', icon: 'Flame' },
    { text: 'FIRE HOSE', subText: 'DO NOT BLOCK', icon: 'Disc' },
    { text: 'SPRINKLER CONTROL', subText: 'VALVE', icon: 'ShowerHead' },
    { text: 'FIRE ALARM', subText: 'PULL STATION', icon: 'Bell' },
    { text: 'FIRE ASSEMBLY', subText: 'POINT', icon: 'Users' },
    { text: 'FIRE LANE', subText: 'NO PARKING', icon: 'Truck' },
  ];
  fireItems.forEach((item, i) => {
    bulkTemplates.push({
      id: `gen-fire-${i}`,
      type: 'fire',
      category: 'Fire Safety',
      text: item.text,
      subText: item.subText,
      icon: item.icon,
      layout: 'standard',
    });
  });

  return bulkTemplates;
}

// Combine manual templates with generated ones
export const defaultTemplates = [...manualTemplates, ...generateBulkTemplates()];
