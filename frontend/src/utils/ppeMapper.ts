import { PPEType } from '../types/signage';

/**
 * Maps string PPE descriptions from templates to PPEType values
 * Uses fuzzy matching to handle various descriptions
 */
export function mapPPEStringToType(ppeString: string): PPEType | null {
  const normalized = ppeString.toLowerCase().trim();
  
  // Helper function to check if string contains any of the keywords
  const contains = (...keywords: string[]) => 
    keywords.some(keyword => normalized.includes(keyword));
  
  // Welding PPE
  if (contains('welding helmet', 'welding mask', 'arc helmet')) return 'welding-helmet';
  if (contains('welding gloves', 'welder gloves')) return 'welding-gloves';
  if (contains('welding jacket', 'welder jacket', 'fire-resistant clothing', 'fr clothing')) return 'welding-jacket';
  if (contains('welding screen', 'welding curtain')) return 'welding-screen';
  if (contains('welding goggles')) return 'welding-goggles';
  if (contains('welding face shield', 'welding shield')) return 'welding-face-shield';
  if (contains('leather apron', 'welding apron')) return 'leather-apron';
  if (contains('welding respirator', 'welder respirator')) return 'respirator';
  
  // Head Protection
  if (contains('hard hat', 'hardhat', 'helmet', 'head protection', 'safety helmet')) return 'hardhat';
  if (contains('bump cap', 'bump hat')) return 'bump-cap';
  if (contains('fire helmet')) return 'fire-helmet';
  
  // Eye Protection
  if (contains('safety glasses', 'safety goggles', 'eye protection', 'goggles')) return 'safety-goggles';
  if (contains('chemical goggles')) return 'chemical-goggles';
  if (contains('laser safety', 'laser glasses')) return 'laser-safety-glasses';
  if (contains('face shield') && !contains('welding')) {
    if (contains('electrical', 'arc')) return 'face-shield-electrical';
    if (contains('chemical')) return 'face-shield-chemical';
    if (contains('medical')) return 'face-shield-medical';
    return 'safety-goggles';
  }
  
  // Hand Protection
  if (contains('gloves')) {
    if (contains('welding', 'welder')) return 'welding-gloves';
    if (contains('chemical', 'acid')) return 'chemical-gloves';
    if (contains('insulated', 'electrical', 'voltage')) return 'insulated-gloves';
    if (contains('cut-resistant', 'cut resistant')) return 'cut-resistant-gloves';
    if (contains('heat-resistant', 'heat resistant', 'fire')) return 'heat-resistant-gloves';
    if (contains('anti-vibration', 'anti vibration')) return 'anti-vibration-gloves';
    if (contains('nitrile')) return 'nitrile-gloves';
    if (contains('latex')) return 'latex-gloves';
    if (contains('leather')) return 'leather-gloves';
    if (contains('rubber')) return 'rubber-gloves';
    if (contains('cotton')) return 'cotton-gloves';
    if (contains('medical', 'surgical')) return 'medical-gloves';
    if (contains('food', 'food-safe')) return 'food-safe-gloves';
    if (contains('thermal', 'cold')) return 'thermal-gloves';
    if (contains('lead')) return 'lead-gloves';
    return 'gloves';
  }
  
  // Foot Protection
  if (contains('boots', 'footwear', 'shoes')) {
    if (contains('safety boots', 'steel-toe', 'steel toe', 'safety footwear')) return 'steel-toe-boots';
    if (contains('chemical', 'acid-resistant', 'acid resistant')) return 'acid-resistant-boots';
    if (contains('insulated', 'electrical', 'dielectric')) return 'insulated-boots';
    if (contains('fire')) return 'fire-boots';
    if (contains('rubber', 'wellington')) return 'rubber-boots';
    if (contains('anti-static', 'anti static')) return 'anti-static-boots';
    if (contains('cold', 'thermal')) return 'cold-weather-boots';
    return 'safety-boots';
  }
  
  // Respiratory Protection
  if (contains('respirator', 'scba', 'breathing')) {
    if (contains('scba', 'self-contained')) return 'scba';
    if (contains('full face', 'full-face')) return 'full-face-respirator';
    if (contains('half face', 'half-face')) return 'half-face-respirator';
    if (contains('powered air', 'powered-air')) return 'powered-air-respirator';
    if (contains('welding', 'welder')) return 'respirator';
    if (contains('escape', 'emergency escape')) return 'emergency-escape-respirator';
    if (contains('dust mask', 'dust-mask', 'n95', 'p100')) return 'dust-mask';
    if (contains('surgical mask', 'surgical-mask')) return 'surgical-mask';
    return 'respirator';
  }
  
  // Hearing Protection
  if (contains('hearing protection', 'ear protection', 'earplugs', 'ear plugs', 'ear protection')) return 'hearing-protection';
  if (contains('ear muffs', 'ear-muffs')) return 'ear-muffs';
  if (contains('ear plugs', 'earplugs')) return 'ear-plugs';
  if (contains('noise', 'hearing')) return 'hearing-protection';
  
  // Body Protection / Harness
  if (contains('harness', 'fall protection', 'fall arrest')) {
    if (contains('full body', 'full-body', 'body harness')) {
      if (contains('confined', 'confined space')) return 'full-body-harness-confined';
      if (contains('height', 'fall')) return 'safety-harness-height';
      return 'harness';
    }
    if (contains('fall arrest', 'fall-arrest')) return 'fall-arrest-system';
    if (contains('lanyard')) {
      if (contains('double', 'twin')) return 'double-lanyard';
      return 'lanyard';
    }
    if (contains('anchor point', 'anchor-point')) return 'anchor-point';
    if (contains('rope grab', 'rope-grab')) return 'rope-grab';
    if (contains('shock absorber', 'shock-absorber')) return 'shock-absorber';
    if (contains('lifeline')) {
      if (contains('vertical')) return 'vertical-lifeline';
      if (contains('horizontal')) return 'horizontal-lifeline';
      if (contains('self-retracting', 'self retracting')) return 'self-retracting-lifeline';
      return 'lifeline';
    }
    if (contains('positioning belt', 'positioning-belt')) return 'positioning-belt';
    if (contains('harness belt', 'harness-belt')) return 'harness-belt';
    return 'harness';
  }
  
  // High Visibility
  if (contains('high-vis', 'high vis', 'high visibility', 'reflective', 'visibility vest')) return 'high-vis';
  
  // Chemical Protection
  if (contains('chemical suit', 'chemical-suit', 'hazmat suit')) return 'chemical-suit';
  if (contains('chemical apron', 'chemical-apron')) return 'chemical-apron';
  
  // Fire Safety
  if (contains('fire suit', 'fire-suit')) return 'fire-suit';
  if (contains('fire blanket', 'fire-blanket')) return 'fire-blanket';
  if (contains('fire extinguisher', 'extinguisher')) return 'fire-extinguisher';
  if (contains('smoke hood', 'smoke-hood')) return 'smoke-hood';
  
  // Electrical PPE
  if (contains('arc flash', 'arc-flash')) {
    if (contains('suit', 'clothing')) return 'arc-flash-suit';
    if (contains('clothing', 'rated clothing', 'arc-rated')) return 'arc-rated-clothing';
    return 'arc-flash-suit';
  }
  if (contains('voltage detector', 'voltage-detector', 'voltage rated')) return 'voltage-detector';
  if (contains('electrical safety mat', 'safety mat', 'dielectric mat')) return 'electrical-safety-mat';
  
  // Confined Space Equipment
  if (contains('gas monitor', 'gas-monitor', 'atmospheric monitor')) return 'gas-monitor';
  if (contains('multi-gas', 'multi gas', 'gas detector')) return 'multi-gas-detector';
  if (contains('retrieval system', 'retrieval-system', 'retrieval')) return 'retrieval-system';
  if (contains('tripod')) return 'tripod';
  if (contains('ventilation', 'forced air')) return 'ventilation-equipment';
  if (contains('emergency light', 'emergency-light')) return 'emergency-light';
  if (contains('winch')) return 'winch';
  
  // Medical/Healthcare
  if (contains('gown', 'medical gown')) return 'gown';
  if (contains('scrubs')) return 'scrubs';
  if (contains('shoe covers', 'shoe-covers')) return 'shoe-covers';
  if (contains('hair net', 'hair-net', 'hairnet')) {
    if (contains('food', 'food-safe')) return 'food-safe-hairnet';
    return 'hair-net';
  }
  if (contains('beard net', 'beard-net')) return 'beard-net';
  if (contains('white coat')) return 'white-coat';
  
  // Other Protection
  if (contains('apron')) {
    if (contains('chemical')) return 'chemical-apron';
    if (contains('leather')) return 'leather-apron';
    if (contains('plastic')) return 'plastic-apron';
    return 'apron';
  }
  if (contains('knee pads', 'knee-pads')) return 'knee-pads';
  if (contains('back support', 'back-support', 'support belt')) return 'back-support';
  if (contains('metatarsal', 'met guard')) return 'metatarsal-guards';
  
  // Cold/Hot Work
  if (contains('insulated jacket', 'insulated-jacket', 'thermal jacket')) return 'insulated-jacket';
  if (contains('cooling vest', 'cooling-vest')) return 'cooling-vest';
  if (contains('heat shield', 'heat-shield')) return 'heat-shield-face';
  if (contains('aluminized suit', 'aluminized-suit')) return 'aluminized-suit';
  if (contains('balaclava')) return 'balaclava';
  
  // Radiation
  if (contains('lead apron', 'lead-apron')) return 'lead-apron';
  if (contains('lead gloves', 'lead-gloves')) return 'lead-gloves';
  if (contains('dosimeter')) return 'dosimeter';
  if (contains('radiation badge', 'radiation-badge')) return 'radiation-badge';
  
  // Communication
  if (contains('communication device', 'radio', 'communication')) return 'high-vis'; // Default fallback
  
  // Tool/Equipment
  if (contains('tool tether', 'tool-tether', 'tool lanyard')) return 'high-vis'; // Default fallback
  if (contains('personal locks', 'lockout', 'locks and tags')) return 'high-vis'; // Default fallback
  
  // If no match found, return null
  return null;
}

/**
 * Converts an array of PPE string descriptions to PPEType array
 * Filters out null values (unmatched strings)
 */
export function mapPPEStringsToTypes(ppeStrings: string[]): PPEType[] {
  const mapped: PPEType[] = [];
  const seen = new Set<PPEType>();
  
  for (const ppeString of ppeStrings) {
    const ppeType = mapPPEStringToType(ppeString);
    if (ppeType && !seen.has(ppeType)) {
      mapped.push(ppeType);
      seen.add(ppeType);
    }
  }
  
  return mapped;
}
