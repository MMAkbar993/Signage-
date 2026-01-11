import { PPEType } from '../types/signage';
import { 
  HardHat, Glasses, Headphones, HandMetal, Footprints, ShieldCheck, Wind, Eye, Anchor,
  Zap, Activity, Flask, Flame, Shield, AlertTriangle, Heart, Wrench, Snowflake, Sun,
  Radio, Droplet, BookOpen, Phone, Wifi, Gauge, Lightbulb, Lock, Triangle, Cog
} from 'lucide-react';

export function getPPEIcon(ppe: PPEType, className: string = 'w-8 h-8') {
  switch (ppe) {
    // General PPE
    case 'hardhat':
      return <HardHat className={className} />;
    case 'safety-glasses':
      return <Glasses className={className} />;
    case 'hearing-protection':
      return <Headphones className={className} />;
    case 'gloves':
      return <HandMetal className={className} />;
    case 'safety-boots':
      return <Footprints className={className} />;
    case 'high-vis':
      return <ShieldCheck className={className} />;
    case 'respirator':
      return <Wind className={className} />;
    case 'harness':
      return <Anchor className={className} />;

    // Electrical Work PPE
    case 'arc-flash-suit':
      return <Zap className={className} />;
    case 'insulated-gloves':
      return <HandMetal className={className} />;
    case 'voltage-detector':
      return <Gauge className={className} />;
    case 'insulated-boots':
      return <Footprints className={className} />;
    case 'face-shield-electrical':
      return <Shield className={className} />;
    case 'arc-rated-clothing':
      return <ShieldCheck className={className} />;
    case 'electrical-safety-mat':
      return <BookOpen className={className} />;

    // Confined Space PPE
    case 'scba':
      return <Wind className={className} />;
    case 'gas-monitor':
      return <Gauge className={className} />;
    case 'multi-gas-detector':
      return <Gauge className={className} />;
    case 'retrieval-system':
      return <Anchor className={className} />;
    case 'tripod':
      return <Triangle className={className} />;
    case 'lifeline':
      return <Anchor className={className} />;
    case 'ventilation-equipment':
      return <Wind className={className} />;
    case 'emergency-escape-respirator':
      return <Wind className={className} />;
    case 'full-body-harness-confined':
      return <Anchor className={className} />;
    case 'fire-extinguisher':
      return <Flame className={className} />;
    case 'apron':
      return <ShieldCheck className={className} />;
    case 'emergency-light':
      return <Lightbulb className={className} />;
    case 'winch':
      return <Cog className={className} />;

    // Chemical Work PPE
    case 'chemical-suit':
      return <Shield className={className} />;
    case 'chemical-gloves':
      return <HandMetal className={className} />;
    case 'chemical-goggles':
      return <Glasses className={className} />;
    case 'acid-resistant-boots':
      return <Footprints className={className} />;
    case 'face-shield-chemical':
      return <Shield className={className} />;
    case 'chemical-apron':
      return <Shield className={className} />;
    case 'full-face-respirator':
      return <Wind className={className} />;

    // Height Work PPE
    case 'fall-arrest-system':
      return <Anchor className={className} />;
    case 'lanyard':
      return <Anchor className={className} />;
    case 'anchor-point':
      return <Anchor className={className} />;
    case 'rope-grab':
      return <Anchor className={className} />;
    case 'rescue-kit':
      return <AlertTriangle className={className} />;
    case 'positioning-belt':
      return <ShieldCheck className={className} />;
    case 'shock-absorber':
      return <Activity className={className} />;
    case 'safety-harness-height':
      return <Anchor className={className} />;
    case 'harness-belt':
      return <ShieldCheck className={className} />;
    case 'double-lanyard':
      return <Anchor className={className} />;
    case 'vertical-lifeline':
      return <Anchor className={className} />;
    case 'horizontal-lifeline':
      return <Anchor className={className} />;
    case 'self-retracting-lifeline':
      return <Anchor className={className} />;

    // Welding PPE
    case 'welding-helmet':
      return <HardHat className={className} />;
    case 'welding-gloves':
      return <HandMetal className={className} />;
    case 'welding-jacket':
      return <Shield className={className} />;
    case 'welding-screen':
      return <Shield className={className} />;
    case 'leather-apron':
      return <Shield className={className} />;
    case 'welding-respirator':
      return <Wind className={className} />;
    case 'spats':
      return <Footprints className={className} />;
    case 'welding-goggles':
      return <Glasses className={className} />;
    case 'welding-face-shield':
      return <Shield className={className} />;

    // Fire Safety PPE
    case 'fire-suit':
      return <Flame className={className} />;
    case 'fire-helmet':
      return <HardHat className={className} />;
    case 'fire-boots':
      return <Footprints className={className} />;
    case 'fire-gloves':
      return <HandMetal className={className} />;
    case 'fire-extinguisher':
      return <Flame className={className} />;
    case 'fire-blanket':
      return <Shield className={className} />;
    case 'smoke-hood':
      return <Wind className={className} />;

    // Medical/Healthcare PPE
    case 'surgical-mask':
      return <Wind className={className} />;
    case 'medical-gloves':
      return <HandMetal className={className} />;
    case 'face-shield-medical':
      return <Shield className={className} />;
    case 'gown':
      return <ShieldCheck className={className} />;
    case 'scrubs':
      return <ShieldCheck className={className} />;
    case 'shoe-covers':
      return <Footprints className={className} />;
    case 'hair-net':
      return <ShieldCheck className={className} />;

    // Heavy Machinery PPE
    case 'steel-toe-boots':
      return <Footprints className={className} />;
    case 'cut-resistant-gloves':
      return <HandMetal className={className} />;
    case 'bump-cap':
      return <HardHat className={className} />;
    case 'knee-pads':
      return <Shield className={className} />;
    case 'back-support':
      return <ShieldCheck className={className} />;
    case 'anti-vibration-gloves':
      return <HandMetal className={className} />;
    case 'metatarsal-guards':
      return <Shield className={className} />;

    // Food Safety PPE
    case 'food-safe-gloves':
      return <HandMetal className={className} />;
    case 'beard-net':
      return <ShieldCheck className={className} />;
    case 'white-coat':
      return <ShieldCheck className={className} />;
    case 'plastic-apron':
      return <Shield className={className} />;
    case 'food-safe-hairnet':
      return <ShieldCheck className={className} />;

    // Cold Work PPE
    case 'insulated-jacket':
      return <Snowflake className={className} />;
    case 'thermal-gloves':
      return <HandMetal className={className} />;
    case 'cold-weather-boots':
      return <Footprints className={className} />;
    case 'balaclava':
      return <ShieldCheck className={className} />;

    // Hot Work PPE
    case 'heat-resistant-gloves':
      return <HandMetal className={className} />;
    case 'cooling-vest':
      return <ShieldCheck className={className} />;
    case 'heat-shield-face':
      return <Shield className={className} />;
    case 'aluminized-suit':
      return <Shield className={className} />;

    // Radiation PPE
    case 'lead-apron':
      return <Shield className={className} />;
    case 'dosimeter':
      return <Gauge className={className} />;
    case 'radiation-badge':
      return <Gauge className={className} />;
    case 'lead-gloves':
      return <HandMetal className={className} />;

    // Noise Protection
    case 'ear-plugs':
      return <Headphones className={className} />;
    case 'ear-muffs':
      return <Headphones className={className} />;
    case 'noise-canceling-headset':
      return <Headphones className={className} />;

    // Eye Protection
    case 'safety-goggles':
      return <Glasses className={className} />;
    case 'laser-safety-glasses':
      return <Glasses className={className} />;
    case 'tinted-glasses':
      return <Glasses className={className} />;
    case 'prescription-safety-glasses':
      return <Glasses className={className} />;

    // Hand Protection
    case 'nitrile-gloves':
      return <HandMetal className={className} />;
    case 'latex-gloves':
      return <HandMetal className={className} />;
    case 'cotton-gloves':
      return <HandMetal className={className} />;
    case 'leather-gloves':
      return <HandMetal className={className} />;
    case 'rubber-gloves':
      return <HandMetal className={className} />;

    // Foot Protection
    case 'rubber-boots':
      return <Footprints className={className} />;
    case 'anti-static-boots':
      return <Footprints className={className} />;
    case 'wellington-boots':
      return <Footprints className={className} />;

    // Respiratory Protection
    case 'dust-mask':
      return <Wind className={className} />;
    case 'half-face-respirator':
      return <Wind className={className} />;
    case 'powered-air-respirator':
      return <Wind className={className} />;
    case 'oxygen-supply':
      return <Wind className={className} />;

    default:
      return <ShieldCheck className={className} />;
  }
}

export function getPPELabel(ppe: PPEType): string {
  switch (ppe) {
    // General PPE
    case 'hardhat':
      return 'HELMET';
    case 'safety-glasses':
      return 'GOGGLES';
    case 'hearing-protection':
      return 'EAR PROTECTION';
    case 'gloves':
      return 'GLOVES';
    case 'safety-boots':
      return 'BOOTS';
    case 'high-vis':
      return 'HIGH-VIS';
    case 'respirator':
      return 'RESPIRATOR';
    case 'harness':
      return 'HARNESS';

    // Electrical Work PPE
    case 'arc-flash-suit':
      return 'ARC FLASH SUIT';
    case 'insulated-gloves':
      return 'INSULATED GLOVES';
    case 'voltage-detector':
      return 'VOLTAGE DETECTOR';
    case 'insulated-boots':
      return 'INSULATED BOOTS';
    case 'face-shield-electrical':
      return 'FACE SHIELD';
    case 'arc-rated-clothing':
      return 'ARC CLOTHING';
    case 'electrical-safety-mat':
      return 'SAFETY MAT';

    // Confined Space PPE
    case 'scba':
      return 'SCBA';
    case 'gas-monitor':
      return 'GAS MONITOR';
    case 'multi-gas-detector':
      return 'MULTI-GAS DETECTOR';
    case 'retrieval-system':
      return 'RETRIEVAL SYSTEM';
    case 'tripod':
      return 'TRIPOD';
    case 'lifeline':
      return 'LIFELINE';
    case 'ventilation-equipment':
      return 'VENTILATION';
    case 'emergency-escape-respirator':
      return 'ESCAPE RESPIRATOR';
    case 'full-body-harness-confined':
      return 'FULL HARNESS';
    case 'fire-extinguisher':
      return 'EXTINGUISHER';
    case 'apron':
      return 'APRON';
    case 'emergency-light':
      return 'EMERGENCY LIGHT';
    case 'winch':
      return 'WINCH';

    // Chemical Work PPE
    case 'chemical-suit':
      return 'CHEMICAL SUIT';
    case 'chemical-gloves':
      return 'CHEMICAL GLOVES';
    case 'chemical-goggles':
      return 'CHEMICAL GOGGLES';
    case 'acid-resistant-boots':
      return 'ACID BOOTS';
    case 'face-shield-chemical':
      return 'FACE SHIELD';
    case 'chemical-apron':
      return 'CHEMICAL APRON';
    case 'full-face-respirator':
      return 'FULL RESPIRATOR';

    // Height Work PPE
    case 'fall-arrest-system':
      return 'FALL ARREST';
    case 'lanyard':
      return 'LANYARD';
    case 'anchor-point':
      return 'ANCHOR POINT';
    case 'rope-grab':
      return 'ROPE GRAB';
    case 'rescue-kit':
      return 'RESCUE KIT';
    case 'positioning-belt':
      return 'POSITIONING BELT';
    case 'shock-absorber':
      return 'SHOCK ABSORBER';
    case 'safety-harness-height':
      return 'SAFETY HARNESS';
    case 'harness-belt':
      return 'HARNESS BELT';
    case 'double-lanyard':
      return 'DOUBLE LANYARD';
    case 'vertical-lifeline':
      return 'VERTICAL LIFELINE';
    case 'horizontal-lifeline':
      return 'HORIZONTAL LIFELINE';
    case 'self-retracting-lifeline':
      return 'SELF-RETRACTING LIFELINE';

    // Welding PPE
    case 'welding-helmet':
      return 'WELDING HELMET';
    case 'welding-gloves':
      return 'WELDING GLOVES';
    case 'welding-jacket':
      return 'WELDING JACKET';
    case 'welding-screen':
      return 'WELDING SCREEN';
    case 'leather-apron':
      return 'LEATHER APRON';
    case 'welding-respirator':
      return 'WELDING RESPIRATOR';
    case 'spats':
      return 'SPATS';
    case 'welding-goggles':
      return 'WELDING GOGGLES';
    case 'welding-face-shield':
      return 'WELDING FACE SHIELD';

    // Fire Safety PPE
    case 'fire-suit':
      return 'FIRE SUIT';
    case 'fire-helmet':
      return 'FIRE HELMET';
    case 'fire-boots':
      return 'FIRE BOOTS';
    case 'fire-gloves':
      return 'FIRE GLOVES';
    case 'fire-extinguisher':
      return 'EXTINGUISHER';
    case 'fire-blanket':
      return 'FIRE BLANKET';
    case 'smoke-hood':
      return 'SMOKE HOOD';

    // Medical/Healthcare PPE
    case 'surgical-mask':
      return 'SURGICAL MASK';
    case 'medical-gloves':
      return 'MEDICAL GLOVES';
    case 'face-shield-medical':
      return 'FACE SHIELD';
    case 'gown':
      return 'GOWN';
    case 'scrubs':
      return 'SCRUBS';
    case 'shoe-covers':
      return 'SHOE COVERS';
    case 'hair-net':
      return 'HAIR NET';

    // Heavy Machinery PPE
    case 'steel-toe-boots':
      return 'STEEL TOE BOOTS';
    case 'cut-resistant-gloves':
      return 'CUT RESISTANT';
    case 'bump-cap':
      return 'BUMP CAP';
    case 'knee-pads':
      return 'KNEE PADS';
    case 'back-support':
      return 'BACK SUPPORT';
    case 'anti-vibration-gloves':
      return 'ANTI-VIBRATION';
    case 'metatarsal-guards':
      return 'METATARSAL GUARDS';

    // Food Safety PPE
    case 'food-safe-gloves':
      return 'FOOD GLOVES';
    case 'beard-net':
      return 'BEARD NET';
    case 'white-coat':
      return 'WHITE COAT';
    case 'plastic-apron':
      return 'PLASTIC APRON';
    case 'food-safe-hairnet':
      return 'HAIR NET';

    // Cold Work PPE
    case 'insulated-jacket':
      return 'INSULATED JACKET';
    case 'thermal-gloves':
      return 'THERMAL GLOVES';
    case 'cold-weather-boots':
      return 'COLD BOOTS';
    case 'balaclava':
      return 'BALACLAVA';

    // Hot Work PPE
    case 'heat-resistant-gloves':
      return 'HEAT GLOVES';
    case 'cooling-vest':
      return 'COOLING VEST';
    case 'heat-shield-face':
      return 'HEAT SHIELD';
    case 'aluminized-suit':
      return 'ALUMINIZED SUIT';

    // Radiation PPE
    case 'lead-apron':
      return 'LEAD APRON';
    case 'dosimeter':
      return 'DOSIMETER';
    case 'radiation-badge':
      return 'RADIATION BADGE';
    case 'lead-gloves':
      return 'LEAD GLOVES';

    // Noise Protection
    case 'ear-plugs':
      return 'EAR PLUGS';
    case 'ear-muffs':
      return 'EAR MUFFS';
    case 'noise-canceling-headset':
      return 'HEADSET';

    // Eye Protection
    case 'safety-goggles':
      return 'GOGGLES';
    case 'laser-safety-glasses':
      return 'LASER GLASSES';
    case 'tinted-glasses':
      return 'TINTED GLASSES';
    case 'prescription-safety-glasses':
      return 'PRESCRIPTION';

    // Hand Protection
    case 'nitrile-gloves':
      return 'NITRILE GLOVES';
    case 'latex-gloves':
      return 'LATEX GLOVES';
    case 'cotton-gloves':
      return 'COTTON GLOVES';
    case 'leather-gloves':
      return 'LEATHER GLOVES';
    case 'rubber-gloves':
      return 'RUBBER GLOVES';

    // Foot Protection
    case 'rubber-boots':
      return 'RUBBER BOOTS';
    case 'anti-static-boots':
      return 'ANTI-STATIC';
    case 'wellington-boots':
      return 'WELLINGTON';

    // Respiratory Protection
    case 'dust-mask':
      return 'DUST MASK';
    case 'half-face-respirator':
      return 'HALF RESPIRATOR';
    case 'powered-air-respirator':
      return 'POWERED AIR';
    case 'oxygen-supply':
      return 'OXYGEN SUPPLY';

    default:
      return 'PPE';
  }
}