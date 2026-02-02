export const templates = [
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
  { id: 'd-mach-009', type: 'danger', category: 'Machinery', text: 'ROTATING BLADES', subText: 'KEEP HANDS CLEAR', icon: 'Fan', layout: 'standard' },

  // WARNING - HAZARDS
  { id: 'w-haz-001', type: 'warning', category: 'Hazards', text: 'MAGNETIC FIELD', subText: 'CAN BE HARMFUL TO PACEMAKER WEARERS', icon: 'Magnet', layout: 'left-icon' },
  { id: 'w-haz-002', type: 'warning', category: 'Hazards', text: 'LOUD NOISE HAZARD', subText: 'EAR PROTECTION REQUIRED', icon: 'Ear', layout: 'standard' },
  { id: 'w-haz-003', type: 'warning', category: 'Hazards', text: 'FALL HAZARD', subText: 'WATCH YOUR STEP', icon: 'ArrowDown', layout: 'standard' },
  { id: 'w-haz-004', type: 'warning', category: 'Hazards', text: 'CRUSH HAZARD', subText: 'KEEP CLEAR', icon: 'Minimize2', layout: 'visual' },
  { id: 'w-haz-005', type: 'warning', category: 'Hazards', text: 'HOT SURFACE', subText: 'DO NOT TOUCH', icon: 'Flame', layout: 'standard' },
  { id: 'w-haz-006', type: 'warning', category: 'Hazards', text: 'LASER HAZARD', subText: 'AVOID DIRECT EYE EXPOSURE', icon: 'Sun', layout: 'standard' },
  { id: 'w-haz-007', type: 'warning', category: 'Hazards', text: 'EXPLOSIVE MATERIAL', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Bomb', layout: 'standard' },
  { id: 'w-haz-008', type: 'warning', category: 'Hazards', text: 'ASBESTOS', subText: 'CANCER AND LUNG DISEASE HAZARD', icon: 'Skull', layout: 'standard' },
  
  // WARNING - WELDING
  { id: 'w-weld-001', type: 'warning', category: 'Welding', text: 'WELDING ARC', subText: 'WEAR PROPER EYE PROTECTION', icon: 'Glasses', layout: 'left-icon' },
  { id: 'w-weld-002', type: 'warning', category: 'Welding', text: 'WELDING IN PROGRESS', subText: 'DO NOT WATCH ARC', icon: 'EyeOff', layout: 'standard' },

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
  { id: 'w-elec-003', type: 'warning', category: 'Electrical', text: 'BATTERY CHARGING AREA', subText: 'NO SMOKING', icon: 'BatteryCharging', layout: 'standard' },

  // MACHINERY / PHYSICAL
  { id: 'w-mach-001', type: 'warning', category: 'Machinery', text: 'PINCH POINT', subText: 'KEEP HANDS CLEAR', icon: 'AlertTriangle', layout: 'standard' },
  { id: 'w-mach-002', type: 'warning', category: 'Machinery', text: 'THIS MACHINE STARTS AUTOMATICALLY', subText: 'STAY CLEAR', icon: 'Settings', layout: 'standard' },
  { id: 'w-mach-003', type: 'warning', category: 'Machinery', text: 'WATCH YOUR HANDS', subText: 'KEEP OUT OF MACHINERY', icon: 'Hand', layout: 'left-icon' },
  { id: 'w-mach-004', type: 'warning', category: 'Machinery', text: 'CHOCK WHEELS', subText: 'BEFORE LOADING AND UNLOADING', icon: 'Truck', layout: 'standard' },

  // PERSONAL SAFETY
  { id: 'w-pers-001', type: 'warning', category: 'Personal Safety', text: 'WATCH YOUR HEAD', subText: 'LOW CLEARANCE', icon: 'ArrowUp', layout: 'standard' },
  { id: 'w-pers-002', type: 'warning', category: 'Personal Safety', text: 'WATCH YOUR STEP', subText: 'UNEVEN SURFACE', icon: 'Footprints', layout: 'left-icon' },
  { id: 'w-pers-003', type: 'warning', category: 'Personal Safety', text: 'SLIPPERY WHEN WET', subText: 'USE CAUTION', icon: 'Droplets', layout: 'standard' },
  { id: 'w-pers-004', type: 'warning', category: 'Personal Safety', text: 'HIGH NOISE AREA', subText: 'WEAR EAR PROTECTION', icon: 'Ear', layout: 'standard' },
  { id: 'w-pers-005', type: 'warning', category: 'Personal Safety', text: 'EAR PROTECTION REQUIRED', subText: 'WHILE EQUIPMENT IS OPERATING', icon: 'Ear', layout: 'left-icon' },
  { id: 'w-pers-006', type: 'warning', category: 'Personal Safety', text: 'NO SMOKING', subText: 'MATCHES, OR OPEN LIGHTS', icon: 'Cigarette', layout: 'standard' },

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
  { id: 'c-phys-006', type: 'caution', category: 'Physical', text: 'FALLING ICE', subText: 'WATCH OVERHEAD', icon: 'CloudSnow', layout: 'standard' },
  { id: 'c-phys-007', type: 'caution', category: 'Physical', text: 'HOT SURFACE', subText: 'DO NOT TOUCH', icon: 'Flame', layout: 'left-icon' },
  { id: 'c-phys-008', type: 'caution', category: 'Physical', text: 'MICROWAVE OVEN IN USE', subText: 'DO NOT OPERATE', icon: 'Zap', layout: 'standard' },

  // PPE & INSTRUCTIONS
  { id: 'c-ppe-001', type: 'caution', category: 'PPE', text: 'EAR PROTECTION AREA', subText: 'REQUIRED BEYOND THIS POINT', icon: 'Ear', layout: 'standard' },
  { id: 'c-ppe-002', type: 'caution', category: 'PPE', text: 'EYE PROTECTION REQUIRED', subText: 'SAFETY GLASSES MUST BE WORN', icon: 'Glasses', layout: 'left-icon' },
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
  { id: 'n-rule-005', type: 'notice', category: 'Rules', text: 'ALL VISITORS MUST REGISTER', subText: 'AT OFFICE', icon: 'Clipboard', layout: 'standard' },
  { id: 'n-rule-006', type: 'notice', category: 'Rules', text: 'CAMERAS NOT ALLOWED', subText: 'NO PHOTOGRAPHY', icon: 'CameraOff', layout: 'left-icon' },
  { id: 'n-rule-007', type: 'notice', category: 'Rules', text: 'NO CELL PHONES', subText: 'TURN OFF', icon: 'SmartphoneOff', layout: 'standard' },
  { id: 'n-rule-008', type: 'notice', category: 'Rules', text: 'NO SOLICITING', subText: 'VIOLATORS PROSECUTED', icon: 'Ban', layout: 'standard' },
  { id: 'n-rule-009', type: 'notice', category: 'Rules', text: 'PRIVATE PROPERTY', subText: 'NO TRESPASSING', icon: 'Hand', layout: 'standard' },
  { id: 'n-rule-010', type: 'notice', category: 'Rules', text: 'NO DUMPING', subText: 'VIOLATORS WILL BE PROSECUTED', icon: 'Trash2', layout: 'standard' },
  { id: 'n-rule-011', type: 'notice', category: 'Rules', text: 'KEEP GATE CLOSED', subText: 'AT ALL TIMES', icon: 'DoorClosed', layout: 'standard' },
  { id: 'n-rule-012', type: 'notice', category: 'Rules', text: 'NO EXIT', subText: 'DO NOT ENTER', icon: 'Ban', layout: 'standard' },
  { id: 'n-rule-013', type: 'notice', category: 'Rules', text: 'AUTHORIZED PERSONNEL ONLY', subText: 'RESTRICTED AREA', icon: 'Shield', layout: 'standard' },
  { id: 'n-rule-014', type: 'notice', category: 'Rules', text: 'HAIR COVERING REQUIRED', subText: 'IN THIS AREA', icon: 'UserCheck', layout: 'left-icon' },
  { id: 'n-rule-015', type: 'notice', category: 'Rules', text: 'BEARDS MUST BE COVERED', subText: 'IN THIS AREA', icon: 'UserCheck', layout: 'left-icon' },

  // NOTICE - SAFETY & HYGIENE
  { id: 'n-safe-001', type: 'notice', category: 'Safety', text: 'WASH HANDS', subText: 'BEFORE RETURNING TO WORK', icon: 'Droplets', layout: 'left-icon' },
  { id: 'n-safe-002', type: 'notice', category: 'Safety', text: 'SANITIZE HANDS', subText: 'STATION HERE', icon: 'Droplets', layout: 'standard' },
  { id: 'n-safe-003', type: 'notice', category: 'Safety', text: 'KEEP AREA CLEAN', subText: 'CLEAN UP SPILLS', icon: 'Sparkles', layout: 'standard' },
  { id: 'n-safe-004', type: 'notice', category: 'Safety', text: 'SAFETY GLASSES REQUIRED', subText: 'IN THIS AREA', icon: 'Glasses', layout: 'left-icon' },
  { id: 'n-safe-005', type: 'notice', category: 'Safety', text: 'HARD HAT AREA', subText: 'WEAR PPE', icon: 'HardHat', layout: 'left-icon' },
  { id: 'n-safe-006', type: 'notice', category: 'Safety', text: 'HEARING PROTECTION', subText: 'REQUIRED', icon: 'Ear', layout: 'standard' },
  { id: 'n-safe-007', type: 'notice', category: 'Safety', text: 'WEAR YOUR RESPIRATOR', subText: 'IN THIS AREA', icon: 'Wind', layout: 'left-icon' },

  // RESTRICTED AREA (Red/White headers usually, but listed as NOTICE in some contexts, keeping standard NOTICE format)
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
  // TRAFFIC & ROAD SAFETY (White/Orange/Yellow)
  // ==========================================
  
  { id: 't-road-001', type: 'warning', category: 'Traffic', text: 'STOP', subText: 'CHECK FOR TRAFFIC', icon: 'Octagon', layout: 'visual' },
  { id: 't-road-002', type: 'warning', category: 'Traffic', text: 'YIELD', subText: 'TO PEDESTRIANS', icon: 'Triangle', layout: 'visual' },
  { id: 't-road-003', type: 'warning', category: 'Traffic', text: 'SPEED LIMIT', subText: '10 MPH', icon: 'Circle', layout: 'standard' },
  { id: 't-road-004', type: 'warning', category: 'Traffic', text: 'ONE WAY', subText: 'DO NOT ENTER', icon: 'ArrowRight', layout: 'left-icon' },
  { id: 't-road-005', type: 'warning', category: 'Traffic', text: 'NO PARKING', subText: 'FIRE LANE', icon: 'Ban', layout: 'standard' },
  { id: 't-road-006', type: 'warning', category: 'Traffic', text: 'RESERVED PARKING', subText: 'HANDICAPPED ONLY', icon: 'Users', layout: 'standard' },
  { id: 't-road-007', type: 'warning', category: 'Traffic', text: 'LOADING ZONE', subText: '30 MINUTE LIMIT', icon: 'Truck', layout: 'standard' },
  { id: 't-road-008', type: 'warning', category: 'Traffic', text: 'PEDESTRIAN CROSSING', subText: 'YIELD TO PEDS', icon: 'Footprints', layout: 'visual' },
  { id: 't-road-009', type: 'warning', category: 'Traffic', text: 'SLOW', subText: 'CHILDREN PLAYING', icon: 'Users', layout: 'standard' },
  { id: 't-road-010', type: 'warning', category: 'Traffic', text: 'DEAD END', subText: 'NO OUTLET', icon: 'Ban', layout: 'standard' },

  // ==========================================
  // CONSTRUCTION & SITE SAFETY
  // ==========================================

  { id: 'c-site-001', type: 'caution', category: 'Construction', text: 'CONSTRUCTION SITE', subText: 'UNAUTHORIZED ENTRY PROHIBITED', icon: 'HardHat', layout: 'standard' },
  { id: 'c-site-002', type: 'caution', category: 'Construction', text: 'MEN WORKING', subText: 'ABOVE', icon: 'ArrowUp', layout: 'visual' },
  { id: 'c-site-003', type: 'caution', category: 'Construction', text: 'SCAFFOLDING', subText: 'DO NOT CLIMB', icon: 'ArrowUp', layout: 'standard' },
  { id: 'c-site-004', type: 'caution', category: 'Construction', text: 'EXCAVATION', subText: 'DEEP HOLE', icon: 'ArrowDown', layout: 'standard' },
  { id: 'c-site-005', type: 'caution', category: 'Construction', text: 'HEAVY EQUIPMENT', subText: 'STAY BACK 50 FEET', icon: 'Truck', layout: 'left-icon' },
  { id: 'c-site-006', type: 'caution', category: 'Construction', text: 'DEMOLITION IN PROGRESS', subText: 'KEEP CLEAR', icon: 'Hammer', layout: 'standard' },
  { id: 'c-site-007', type: 'caution', category: 'Construction', text: 'WELDING AREA', subText: 'WATCH FOR SPARKS', icon: 'Flame', layout: 'standard' },
  { id: 'c-site-008', type: 'caution', category: 'Construction', text: 'CRANE OPERATING', subText: 'LOOK UP', icon: 'ArrowUp', layout: 'standard' },

  // ==========================================
  // WAREHOUSE & LOGISTICS
  // ==========================================

  { id: 'w-log-001', type: 'warning', category: 'Warehouse', text: 'FORKLIFT TRAFFIC', subText: 'LOOK BOTH WAYS', icon: 'Truck', layout: 'visual' },
  { id: 'w-log-002', type: 'warning', category: 'Warehouse', text: 'BATTERY CHARGING', subText: 'ACID HAZARD', icon: 'BatteryCharging', layout: 'standard' },
  { id: 'w-log-003', type: 'warning', category: 'Warehouse', text: 'LOADING DOCK', subText: 'FALL HAZARD', icon: 'Truck', layout: 'standard' },
  { id: 'w-log-004', type: 'warning', category: 'Warehouse', text: 'STACKING HEIGHT', subText: 'MAX 3 PALLETS', icon: 'ArrowUp', layout: 'standard' },
  { id: 'w-log-005', type: 'warning', category: 'Warehouse', text: 'AUTOMATED GUIDED VEHICLE', subText: 'STAND CLEAR', icon: 'Bot', layout: 'left-icon' },
  { id: 'w-log-006', type: 'warning', category: 'Warehouse', text: 'CHOCK WHEELS', subText: 'BEFORE UNLOADING', icon: 'Disc', layout: 'standard' },
  
  // ==========================================
  // OFFICE & FACILITY
  // ==========================================

  { id: 'n-fac-001', type: 'notice', category: 'Facility', text: 'RESTROOM', subText: 'MEN', icon: 'User', layout: 'visual' },
  { id: 'n-fac-002', type: 'notice', category: 'Facility', text: 'RESTROOM', subText: 'WOMEN', icon: 'User', layout: 'visual' },
  { id: 'n-fac-003', type: 'notice', category: 'Facility', text: 'CONFERENCE ROOM', subText: 'IN USE', icon: 'Users', layout: 'standard' },
  { id: 'n-fac-004', type: 'notice', category: 'Facility', text: 'WI-FI ZONE', subText: 'PASSWORD AT RECEPTION', icon: 'Wifi', layout: 'standard' },
  { id: 'n-fac-005', type: 'notice', category: 'Facility', text: 'RECEPTION', subText: 'PLEASE CHECK IN', icon: 'User', layout: 'standard' },
  { id: 'n-fac-006', type: 'notice', category: 'Facility', text: 'SERVER ROOM', subText: 'AUTHORIZED ACCESS ONLY', icon: 'Server', layout: 'left-icon' },
  { id: 'n-fac-007', type: 'notice', category: 'Facility', text: 'JANITOR CLOSET', subText: 'CHEMICAL STORAGE', icon: 'SprayCan', layout: 'standard' },
  { id: 'n-fac-008', type: 'notice', category: 'Facility', text: 'RECYCLING ONLY', subText: 'NO TRASH', icon: 'Recycle', layout: 'visual' },
  { id: 'n-fac-009', type: 'notice', category: 'Facility', text: 'TRASH ONLY', subText: 'NO RECYCLING', icon: 'Trash2', layout: 'visual' },
  { id: 'n-fac-010', type: 'notice', category: 'Facility', text: 'QUIET ZONE', subText: 'PLEASE WHISPER', icon: 'BellOff', layout: 'standard' },

  // ==========================================
  // SECURITY & SURVEILLANCE
  // ==========================================

  { id: 'n-sec-001', type: 'notice', category: 'Security', text: 'CCTV IN OPERATION', subText: '24/7 RECORDING', icon: 'Video', layout: 'visual' },
  { id: 'n-sec-002', type: 'notice', category: 'Security', text: 'SECURITY CHECKPOINT', subText: 'PREPARE ID', icon: 'Shield', layout: 'standard' },
  { id: 'n-sec-003', type: 'notice', category: 'Security', text: 'ALL BAGS SEARCHED', subText: 'CONDITION OF ENTRY', icon: 'Search', layout: 'standard' },
  { id: 'n-sec-004', type: 'notice', category: 'Security', text: 'NO PHOTOGRAPHY', subText: 'STRICTLY ENFORCED', icon: 'CameraOff', layout: 'visual' },
  { id: 'n-sec-005', type: 'notice', category: 'Security', text: 'ID BADGE REQUIRED', subText: 'AT ALL TIMES', icon: 'BadgeAlert', layout: 'left-icon' },
  { id: 'n-sec-006', type: 'notice', category: 'Security', text: 'ALARMED DOOR', subText: 'EMERGENCY USE ONLY', icon: 'Bell', layout: 'standard' },

  // ==========================================
  // ENVIRONMENTAL
  // ==========================================

  { id: 'n-env-001', type: 'notice', category: 'Environmental', text: 'SPILL CONTROL STATION', subText: 'MATERIALS INSIDE', icon: 'Droplets', layout: 'standard' },
  { id: 'n-env-002', type: 'notice', category: 'Environmental', text: 'STORM DRAIN', subText: 'NO DUMPING', icon: 'CloudRain', layout: 'standard' },
  { id: 'n-env-003', type: 'notice', category: 'Environmental', text: 'HAZARDOUS WASTE', subText: 'SATELLITE ACCUMULATION AREA', icon: 'Skull', layout: 'standard' },
  { id: 'n-env-004', type: 'notice', category: 'Environmental', text: 'IDLE FREE ZONE', subText: 'TURN OFF ENGINE', icon: 'Wind', layout: 'visual' },

  // ==========================================
  // MEDICAL & LAB (Blue/Red/Yellow)
  // ==========================================

  { id: 'm-lab-001', type: 'danger', category: 'Medical', text: 'QUARANTINE AREA', subText: 'AUTHORIZED PERSONNEL ONLY', icon: 'Biohazard', layout: 'standard' },
  { id: 'm-lab-002', type: 'warning', category: 'Medical', text: 'X-RAY IN USE', subText: 'DO NOT ENTER', icon: 'Radiation', layout: 'standard' },
  { id: 'm-lab-003', type: 'notice', category: 'Medical', text: 'SANITIZE HANDS', subText: 'BEFORE ENTERING', icon: 'Droplets', layout: 'standard' },
  { id: 'm-lab-004', type: 'danger', category: 'Medical', text: 'INFECTIOUS WASTE', subText: 'HANDLE WITH CARE', icon: 'Biohazard', layout: 'visual' },
  { id: 'm-lab-005', type: 'notice', category: 'Medical', text: 'QUIET ZONE', subText: 'HOSPITAL AREA', icon: 'BellOff', layout: 'standard' },
  { id: 'm-lab-006', type: 'warning', category: 'Medical', text: 'LASER IN USE', subText: 'EYE PROTECTION REQUIRED', icon: 'Eye', layout: 'standard' },
  { id: 'm-lab-007', type: 'notice', category: 'Medical', text: 'VISITORS', subText: 'CHECK IN AT DESK', icon: 'Users', layout: 'standard' },

  // ==========================================
  // OFFICE & FACILITY (Blue/White)
  // ==========================================

  { id: 'o-fac-001', type: 'notice', category: 'Office', text: 'MEETING IN PROGRESS', subText: 'DO NOT DISTURB', icon: 'Users', layout: 'standard' },
  { id: 'o-fac-002', type: 'notice', category: 'Office', text: 'CONFERENCE ROOM', subText: 'RESERVED', icon: 'Users', layout: 'standard' },
  { id: 'o-fac-003', type: 'notice', category: 'Office', text: 'RESTROOM', subText: 'MENS / WOMENS', icon: 'User', layout: 'standard' },
  { id: 'o-fac-004', type: 'notice', category: 'Office', text: 'KITCHEN AREA', subText: 'CLEAN UP AFTER YOURSELF', icon: 'Coffee', layout: 'standard' },
  { id: 'o-fac-005', type: 'notice', category: 'Office', text: 'SERVER ROOM', subText: 'KEEP DOOR CLOSED', icon: 'Server', layout: 'standard' },
  { id: 'o-fac-006', type: 'notice', category: 'Office', text: 'RECYCLING ONLY', subText: 'NO TRASH', icon: 'Recycle', layout: 'standard' },
  { id: 'o-fac-007', type: 'notice', category: 'Office', text: 'WIFI ZONE', subText: 'GUEST ACCESS AVAILABLE', icon: 'Wifi', layout: 'standard' },
  { id: 'o-fac-008', type: 'notice', category: 'Office', text: 'DELIVERIES', subText: 'USE REAR ENTRANCE', icon: 'Truck', layout: 'left-icon' },
  { id: 'f-ext-005', type: 'fire', category: 'Equipment', text: 'SPRINKLER CONTROL VALVE', subText: 'DO NOT CLOSE', icon: 'Settings', layout: 'standard' },

  // ==========================================
  // INSPECTION TAGS (Custom format support)
  // ==========================================
  
  { id: 'i-insp-001', type: 'notice', category: 'Inspection', text: 'INSPECTION RECORD', subText: 'DATE / BY', icon: 'ClipboardList', layout: 'standard' },
  { id: 'i-insp-002', type: 'notice', category: 'Inspection', text: 'EQUIPMENT INSPECTION', subText: 'DO NOT REMOVE', icon: 'ClipboardCheck', layout: 'visual' },

  // ==========================================
  // EXPANDED CHEMICAL & HAZMAT (Danger/Warning)
  // ==========================================
  { id: 'd-chem-001', type: 'danger', category: 'Chemical', text: 'HYDROCHLORIC ACID', subText: 'CORROSIVE', icon: 'FlaskConical', layout: 'standard' },
  { id: 'd-chem-002', type: 'danger', category: 'Chemical', text: 'SULFURIC ACID', subText: 'CORROSIVE', icon: 'FlaskConical', layout: 'standard' },
  { id: 'd-chem-003', type: 'danger', category: 'Chemical', text: 'NITRIC ACID', subText: 'CORROSIVE / OXIDIZER', icon: 'FlaskConical', layout: 'standard' },
  { id: 'd-chem-004', type: 'danger', category: 'Chemical', text: 'AMMONIA', subText: 'TOXIC GAS', icon: 'Skull', layout: 'standard' },
  { id: 'd-chem-005', type: 'danger', category: 'Chemical', text: 'CHLORINE', subText: 'TOXIC GAS', icon: 'Skull', layout: 'visual' },
  { id: 'd-chem-006', type: 'danger', category: 'Chemical', text: 'ACETONE', subText: 'EXTREMELY FLAMMABLE', icon: 'Flame', layout: 'standard' },
  { id: 'd-chem-007', type: 'danger', category: 'Chemical', text: 'GASOLINE', subText: 'FLAMMABLE LIQUID', icon: 'Fuel', layout: 'visual' },
  { id: 'd-chem-008', type: 'danger', category: 'Chemical', text: 'HYDROGEN', subText: 'FLAMMABLE GAS', icon: 'Flame', layout: 'left-icon' },
  { id: 'd-chem-009', type: 'danger', category: 'Chemical', text: 'ASBESTOS', subText: 'CANCER AND LUNG DISEASE HAZARD', icon: 'Biohazard', layout: 'standard' },
  { id: 'd-chem-010', type: 'danger', category: 'Chemical', text: 'LEAD WORK AREA', subText: 'POISON - NO EATING OR DRINKING', icon: 'Skull', layout: 'standard' },
  { id: 'd-chem-011', type: 'danger', category: 'Chemical', text: 'BENZENE', subText: 'CANCER HAZARD', icon: 'Skull', layout: 'standard' },
  { id: 'd-chem-012', type: 'danger', category: 'Chemical', text: 'FORMALDEHYDE', subText: 'IRRITANT AND CANCER HAZARD', icon: 'Skull', layout: 'standard' },
  { id: 'd-chem-013', type: 'danger', category: 'Chemical', text: 'COMPRESSED AIR', subText: 'DO NOT USE FOR CLEANING', icon: 'Wind', layout: 'standard' },
  { id: 'd-chem-014', type: 'danger', category: 'Chemical', text: 'LIQUID NITROGEN', subText: 'CRYOGENIC BURN HAZARD', icon: 'Thermometer', layout: 'visual' },
  { id: 'd-chem-015', type: 'danger', category: 'Chemical', text: 'SODIUM HYDROXIDE', subText: 'CAUSES SEVERE BURNS', icon: 'FlaskConical', layout: 'standard' },

  // ==========================================
  // EXPANDED CONSTRUCTION & SITE (Caution/Danger)
  // ==========================================
  { id: 'c-exp-001', type: 'caution', category: 'Construction', text: 'BLASTING AREA', subText: 'TURN OFF 2-WAY RADIOS', icon: 'Radio', layout: 'standard' },
  { id: 'c-exp-002', type: 'caution', category: 'Construction', text: 'ROAD CLOSED', subText: 'CONSTRUCTION AHEAD', icon: 'Ban', layout: 'visual' },
  { id: 'c-exp-003', type: 'caution', category: 'Construction', text: 'DETOUR', subText: 'FOLLOW ARROW', icon: 'ArrowRight', layout: 'left-icon' },
  { id: 'c-exp-004', type: 'caution', category: 'Construction', text: 'UNEVEN GROUND', subText: 'WATCH YOUR STEP', icon: 'Footprints', layout: 'standard' },
  { id: 'c-exp-005', type: 'caution', category: 'Construction', text: 'SURVEY CREW AHEAD', subText: 'PREPARE TO STOP', icon: 'Users', layout: 'standard' },
  { id: 'c-exp-006', type: 'caution', category: 'Construction', text: 'TRUCKS ENTERING HIGHWAY', subText: 'USE CAUTION', icon: 'Truck', layout: 'visual' },
  { id: 'c-exp-007', type: 'caution', category: 'Construction', text: 'UTILITY WORK AHEAD', subText: 'EXPECT DELAYS', icon: 'Hammer', layout: 'standard' },
  { id: 'c-exp-008', type: 'caution', category: 'Construction', text: 'BRIDGE WORK', subText: 'HEADROOM REDUCED', icon: 'ArrowUp', layout: 'standard' },
  { id: 'c-exp-009', type: 'caution', category: 'Construction', text: 'FLAGGER AHEAD', subText: 'BE PREPARED TO STOP', icon: 'User', layout: 'standard' },
  { id: 'c-exp-010', type: 'caution', category: 'Construction', text: 'LOOSE GRAVEL', subText: 'MOTORCYCLES USE CAUTION', icon: 'AlertTriangle', layout: 'standard' },
  { id: 'd-const-001', type: 'danger', category: 'Construction', text: 'HOLE', subText: 'DO NOT REMOVE COVER', icon: 'ArrowDown', layout: 'visual' },
  { id: 'd-const-002', type: 'danger', category: 'Construction', text: 'DEEP EXCAVATION', subText: 'STAY BACK', icon: 'ArrowDown', layout: 'standard' },
  { id: 'd-const-003', type: 'danger', category: 'Construction', text: 'OVERHEAD POWER LINES', subText: 'LOOK UP AND LIVE', icon: 'Zap', layout: 'visual' },
  { id: 'd-const-004', type: 'danger', category: 'Construction', text: 'FALLING OBJECTS', subText: 'HARD HAT REQUIRED', icon: 'ArrowDown', layout: 'standard' },

  // ==========================================
  // EXPANDED PPE & MANDATORY (Caution/Notice)
  // ==========================================
  { id: 'c-ppe-exp-001', type: 'caution', category: 'PPE', text: 'FACE SHIELD REQUIRED', subText: 'WHEN GRINDING', icon: 'Shield', layout: 'visual' },
  { id: 'c-ppe-exp-002', type: 'caution', category: 'PPE', text: 'DUST MASK REQUIRED', subText: 'IN THIS AREA', icon: 'Wind', layout: 'standard' },
  { id: 'c-ppe-exp-003', type: 'caution', category: 'PPE', text: 'RESPIRATOR REQUIRED', subText: 'BEYOND THIS POINT', icon: 'Wind', layout: 'left-icon' },
  { id: 'c-ppe-exp-004', type: 'caution', category: 'PPE', text: 'SAFETY HARNESS REQUIRED', subText: 'WHEN WORKING ABOVE 6 FEET', icon: 'Anchor', layout: 'standard' },
  { id: 'c-ppe-exp-005', type: 'caution', category: 'PPE', text: 'WELDING HELMET REQUIRED', subText: 'PROTECT YOUR EYES', icon: 'Shield', layout: 'standard' },
  { id: 'c-ppe-exp-006', type: 'caution', category: 'PPE', text: 'HIGH VISIBILITY VEST', subText: 'MUST BE WORN', icon: 'User', layout: 'visual' },
  { id: 'c-ppe-exp-007', type: 'caution', category: 'PPE', text: 'GLOVES REQUIRED', subText: 'HAND PROTECTION MUST BE WORN', icon: 'Hand', layout: 'standard' },
  { id: 'c-ppe-exp-008', type: 'caution', category: 'PPE', text: 'HAIR NET REQUIRED', subText: 'ALL HAIR MUST BE COVERED', icon: 'UserCheck', layout: 'standard' },
  { id: 'c-ppe-exp-009', type: 'caution', category: 'PPE', text: 'LAB COAT REQUIRED', subText: 'IN THIS LAB', icon: 'User', layout: 'standard' },
  { id: 'c-ppe-exp-010', type: 'caution', category: 'PPE', text: 'ANTISTATIC FOOTWEAR', subText: 'REQUIRED IN THIS AREA', icon: 'Footprints', layout: 'standard' },

  // ==========================================
  // PROHIBITION & RULES (Notice/Danger)
  // ==========================================
  { id: 'n-pro-001', type: 'notice', category: 'Rules', text: 'NO WEAPONS', subText: 'ALLOWED ON PREMISES', icon: 'Ban', layout: 'visual' },
  { id: 'n-pro-002', type: 'notice', category: 'Rules', text: 'NO ALCOHOL OR DRUGS', subText: 'ZERO TOLERANCE POLICY', icon: 'Ban', layout: 'standard' },
  { id: 'n-pro-003', type: 'notice', category: 'Rules', text: 'NO PETS', subText: 'SERVICE ANIMALS ONLY', icon: 'Ban', layout: 'standard' },
  { id: 'n-pro-004', type: 'notice', category: 'Rules', text: 'NO SKATEBOARDING', subText: 'ON PROPERTY', icon: 'Ban', layout: 'standard' },
  { id: 'n-pro-005', type: 'notice', category: 'Rules', text: 'NO LOITERING', subText: 'POLICE ENFORCED', icon: 'Users', layout: 'standard' },
  { id: 'n-pro-006', type: 'notice', category: 'Rules', text: 'NO EATING OR DRINKING', subText: 'IN LAB AREA', icon: 'Coffee', layout: 'visual' },
  { id: 'n-pro-007', type: 'notice', category: 'Rules', text: 'NO RUNNING', subText: 'WALK SLOWLY', icon: 'Footprints', layout: 'standard' },
  { id: 'n-pro-008', type: 'notice', category: 'Rules', text: 'NO GLASS CONTAINERS', subText: 'POOL AREA', icon: 'Ban', layout: 'standard' },
  { id: 'n-pro-009', type: 'notice', category: 'Rules', text: 'CLEAN UP SPILLS', subText: 'IMMEDIATELY', icon: 'Sparkles', layout: 'standard' },
  { id: 'n-pro-010', type: 'notice', category: 'Rules', text: 'REPORT ALL ACCIDENTS', subText: 'TO SUPERVISOR', icon: 'ClipboardList', layout: 'standard' }
];
