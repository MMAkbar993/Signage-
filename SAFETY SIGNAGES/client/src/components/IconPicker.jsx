import React from 'react';
import { 
  AlertTriangle, AlertOctagon, AlertCircle, Ban, 
  Zap, Flame, Skull, Radio, Biohazard,
  Construction, HardHat, Footprints, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Cigarette, CigaretteOff, Phone, PhoneOff,
  Camera, CameraOff, Wifi, WifiOff,
  Droplets, Wind, Snowflake, Sun,
  Truck, Car, Bike, Plane,
  Hammer, Wrench, Shield, ShieldAlert,
  Lock, Unlock, Key, Eye, EyeOff
} from 'lucide-react';

const ICONS = [
  { name: 'Warning', icon: AlertTriangle, id: 'AlertTriangle' },
  { name: 'Danger', icon: AlertOctagon, id: 'AlertOctagon' },
  { name: 'Notice', icon: AlertCircle, id: 'AlertCircle' },
  { name: 'Prohibited', icon: Ban, id: 'Ban' },
  { name: 'Electric', icon: Zap, id: 'Zap' },
  { name: 'Fire', icon: Flame, id: 'Flame' },
  { name: 'Toxic', icon: Skull, id: 'Skull' },
  { name: 'Radioactive', icon: Radio, id: 'Radio' },
  { name: 'Biohazard', icon: Biohazard, id: 'Biohazard' },
  { name: 'Construction', icon: Construction, id: 'Construction' },
  { name: 'PPE', icon: HardHat, id: 'HardHat' },
  { name: 'Walk', icon: Footprints, id: 'Footprints' },
  { name: 'Up', icon: ArrowUp, id: 'ArrowUp' },
  { name: 'Down', icon: ArrowDown, id: 'ArrowDown' },
  { name: 'Left', icon: ArrowLeft, id: 'ArrowLeft' },
  { name: 'Right', icon: ArrowRight, id: 'ArrowRight' },
  { name: 'No Smoking', icon: CigaretteOff, id: 'CigaretteOff' },
  { name: 'Smoking', icon: Cigarette, id: 'Cigarette' },
  { name: 'No Phone', icon: PhoneOff, id: 'PhoneOff' },
  { name: 'Phone', icon: Phone, id: 'Phone' },
  { name: 'No Camera', icon: CameraOff, id: 'CameraOff' },
  { name: 'Camera', icon: Camera, id: 'Camera' },
  { name: 'Water', icon: Droplets, id: 'Droplets' },
  { name: 'Wind', icon: Wind, id: 'Wind' },
  { name: 'Ice', icon: Snowflake, id: 'Snowflake' },
  { name: 'Heat', icon: Sun, id: 'Sun' },
  { name: 'Truck', icon: Truck, id: 'Truck' },
  { name: 'Car', icon: Car, id: 'Car' },
  { name: 'Tools', icon: Hammer, id: 'Hammer' },
  { name: 'Repair', icon: Wrench, id: 'Wrench' },
  { name: 'Safety', icon: Shield, id: 'Shield' },
  { name: 'Security', icon: Lock, id: 'Lock' }
];

const IconPicker = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {ICONS.map((item) => (
        <button
          key={item.name}
          onClick={() => onSelect(item.id)}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded flex flex-col items-center justify-center gap-1 transition-colors border border-transparent hover:border-blue-500"
          title={item.name}
        >
          <item.icon size={24} className="text-white" />
        </button>
      ))}
    </div>
  );
};

export default IconPicker;
