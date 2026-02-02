import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Download, Type, Layout, Palette, Triangle, AlertOctagon, Info, AlertTriangle, FileText, Flame, Filter,
  Zap, Skull, Ban, CigaretteOff, Eye, Headphones, HardHat, Truck, Hand, Biohazard, Radiation, Waves, 
  ArrowDown, ArrowUp, Wind, Thermometer, Droplets, Settings, DoorClosed, DoorOpen, Snowflake, Footprints, 
  Magnet, CloudFog, Paintbrush, User, Video, ClipboardList, PhoneOff, Coffee, Trash2, HelpCircle, 
  Users, XCircle, ShieldCheck, Brain, LogOut, Cross, HeartPulse, Move, Power, PlusSquare, CheckCircle, 
  Bell, Fuel, Sun, Anchor, Circle, Scissors, ChevronDown, ChevronRight, Search, Bot, Shield,
  Octagon, Hammer, Server, Recycle, Wifi, BellOff, Clock, ArrowRight, ShowerHead, Activity, Disc, BadgeAlert,
  Undo, Redo, ZoomIn, ZoomOut, RotateCcw, FileType, MousePointer2, Image as ImageIcon, Box, Layers,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Save,
  List, LayoutTemplate, Smile, X, PenTool, QrCode, Circle as CircleIcon, Crop, Grid, MousePointer, PaintBucket,
  AlertCircle, Radio, Construction, ArrowLeft, Cigarette, Phone, CameraOff, Camera, Car, Wrench, Lock
} from 'lucide-react';
import { Resizable } from 're-resizable';
// @ts-ignore
import Draggable from 'react-draggable';
// @ts-ignore
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { jsPDF } from "jspdf";
import * as htmlToImage from 'html-to-image';
// @ts-ignore
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Icon Map
const iconMap: Record<string, any> = {
  AlertOctagon, Zap, Skull, Ban, CigaretteOff, Eye, Headphones, HardHat, Truck, Hand, Biohazard, 
  Radiation, Waves, ArrowDown, ArrowUp, Wind, Thermometer, Droplets, Settings, DoorClosed, DoorOpen, 
  Snowflake, Footprints, Magnet, CloudFog, Paintbrush, User, Video, ClipboardList, PhoneOff, 
  Coffee, Trash2, HelpCircle, Users, XCircle, ShieldCheck, Brain, LogOut, Cross, HeartPulse, Move, 
  Power, PlusSquare, CheckCircle, Bell, Fuel, Sun, Anchor, Circle, Scissors, Triangle, Flame, Bot, Shield,
  Octagon, Hammer, Server, Recycle, Wifi, BellOff, Clock, ArrowRight, ShowerHead, Activity, Disc, BadgeAlert,
  AlertCircle, Radio, Construction, ArrowLeft, Cigarette, Phone, CameraOff, Camera, Car, Wrench, Lock, AlertTriangle
};

const fontOptions = [
  { name: 'Oswald (Industrial)', family: '"Oswald", sans-serif' },
  { name: 'Roboto Condensed', family: '"Roboto Condensed", sans-serif' },
  { name: 'Bebas Neue', family: '"Bebas Neue", sans-serif' },
  { name: 'Anton (Impact)', family: '"Anton", sans-serif' },
  { name: 'Arial Black', family: '"Arial Black", sans-serif' },
  { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
];

// Icon Picker Data
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

// Type Definitions
interface SignData {
  type: string;
  headerText: string;
  mainText: string;
  subText: string;
  mainTextColor: string;
  headerColor: string;
  headerBgColor: string;
  headerOvalColor: string;
  headerTextColor: string;
  headerBorderColor: string;
  icon: string;
  layout: string;
  mainTextSize: number;
  subTextSize: number;
  borderWidth: number;
  showShadow: boolean;
  fontFamily: string;
  mainTextBold: boolean;
  mainTextItalic: boolean;
  mainTextUnderline: boolean;
  subTextBold: boolean;
  subTextItalic: boolean;
  subTextUnderline: boolean;
  headerHeight: number;
  iconColor: string;
  headerTextSize: number;
}

interface Template {
  id: string | number;
  type: string;
  category: string;
  text: string;
  subText: string;
  icon?: string;
  layout?: string;
  templateName?: string;
  tags?: string[];
  timestamp?: number;
}

interface ExtraElement {
  id: string;
  type: 'image' | 'icon' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  src?: string;
  iconName?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shapeType?: string;
  opacity?: number;
}

interface HistorySnapshot {
  signData: SignData;
  signSize: { width: number; height: number };
  signPosition: { x: number; y: number };
  extraElements: ExtraElement[];
}

// Tour Function
const startTour = () => {
  try {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: [
        { element: '#app-title', popover: { title: 'Welcome to Safety Sign Pro', description: 'Create professional safety signs in minutes. Let us take you on a quick tour.', side: "bottom", align: 'start' } },
        { element: '#sidebar-library', popover: { title: 'Template Library', description: 'Choose from thousands of pre-made safety sign templates or access your saved designs here.', side: "right", align: 'start' } },
        { element: '#add-elements-section', popover: { title: 'Add Elements', description: 'Enhance your sign with icons, shapes, QR codes, or upload your own images.', side: "right", align: 'start' } },
        { element: '#main-canvas', popover: { title: 'Design Canvas', description: 'This is your workspace. Click on elements to edit text, colors, and layout.', side: "left", align: 'start' } },
        { element: '#undo-redo-controls', popover: { title: 'Undo / Redo', description: 'Made a mistake? Easily undo or redo your changes.', side: "bottom", align: 'start' } },
        { element: '#view-controls', popover: { title: 'View Controls', description: 'Zoom in/out and toggle the grid for precise alignment.', side: "bottom", align: 'start' } },
        { element: '#save-download-controls', popover: { title: 'Save & Download', description: 'Save your template for later or download it as a high-quality PNG or PDF.', side: "bottom", align: 'end' } },
      ]
    });
    driverObj.drive();
  } catch (error) {
    console.error("Error starting tour:", error);
  }
};

// --- Helper Components ---

interface AccordionItemProps {
  title: string;
  icon?: any;
  children?: any;
  defaultOpen?: boolean;
  className?: string;
  contentClassName?: string;
  key?: any;
}

const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false, className = "", contentClassName = "p-4" }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`border-b border-slate-700/50 ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-slate-300 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-blue-400" />}
          <span className="font-semibold text-sm uppercase tracking-wide">{title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className={`bg-slate-900/50 ${contentClassName}`}>{children}</div>}
    </div>
  );
};

interface NestedAccordionProps {
  title: string;
  count?: number;
  children?: any;
  key?: any;
}

const NestedAccordion = ({ title, count, children }: NestedAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-l border-slate-800 ml-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 pl-4 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors text-xs font-bold uppercase"
      >
        <span>{title}</span>
        <div className="flex items-center gap-2">
          {count !== undefined && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{count}</span>}
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

// Icon Picker Component
interface IconPickerProps {
  onSelect: (iconId: string) => void;
}

const IconPicker = ({ onSelect }: IconPickerProps) => {
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

// Ruler Component
interface RulerProps {
  length: number;
  isHorizontal: boolean;
  zoom: number;
}

const Ruler = ({ length, isHorizontal, zoom }: RulerProps) => {
  const step = 100;
  const ticks: number[] = [];
  
  for (let i = 0; i <= length; i += step) {
    ticks.push(i);
  }

  return (
    <div 
      className={`absolute bg-slate-100/90 border-slate-300 z-40 backdrop-blur-sm pointer-events-none select-none ${isHorizontal ? 'h-6 border-b top-0 left-0' : 'w-6 border-r top-0 left-0'}`}
      style={{
        width: isHorizontal ? '100%' : '24px',
        height: isHorizontal ? '24px' : '100%',
        position: 'absolute',
        left: 0,
        top: 0
      }}
    >
      {ticks.map(tick => (
        <div 
          key={tick} 
          className="absolute text-[9px] text-slate-500 font-mono flex items-start justify-start"
          style={{
            left: isHorizontal ? tick * zoom : 0,
            top: isHorizontal ? 0 : tick * zoom,
            borderLeft: isHorizontal ? '1px solid #94a3b8' : 'none',
            borderTop: !isHorizontal ? '1px solid #94a3b8' : 'none',
            height: isHorizontal ? '12px' : '1px',
            width: isHorizontal ? '1px' : '12px',
          }}
        >
          <span className="absolute pl-1 -mt-0.5 leading-none">{tick}</span>
        </div>
      ))}
    </div>
  );
};

// Element Wrapper Component
const ElementWrapper = ({ 
  element, 
  isSelected, 
  onSelect, 
  onChange, 
  zoom, 
  children 
}: any) => {
  const { id, x, y, width, height } = element;
  
  const [localState, setLocalState] = useState({ x, y, width, height });
  const isInteracting = useRef(false);
  const startRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!isInteracting.current) {
      setLocalState({ x, y, width, height });
    }
  }, [x, y, width, height]);

  const handleResizeStart = () => {
    isInteracting.current = true;
    startRef.current = {
      x: localState.x,
      y: localState.y,
      width: localState.width,
      height: localState.height
    };
  };

  const handleResize = (e: any, direction: string, ref: any, d: { width: number; height: number }) => {
    const start = startRef.current;
    let newX = start.x;
    let newY = start.y;
    
    if (direction.includes('left')) {
      newX = start.x - d.width;
    }
    if (direction.includes('top')) {
      newY = start.y - d.height;
    }

    const newWidth = start.width + d.width;
    const newHeight = start.height + d.height;

    const newState = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    };

    setLocalState(newState);
    onChange(id, newState, true);
  };

  const handleResizeStop = (e: any, direction: string, ref: any, d: { width: number; height: number }) => {
    const start = startRef.current;
    let newX = start.x;
    let newY = start.y;
    
    if (direction.includes('left')) {
      newX = start.x - d.width;
    }
    if (direction.includes('top')) {
      newY = start.y - d.height;
    }

    const finalState = {
      width: start.width + d.width,
      height: start.height + d.height,
      x: newX,
      y: newY
    };

    setLocalState(finalState);
    isInteracting.current = false;
    onChange(id, finalState, false);
  };

  const handleDragStart = (e: any) => {
    e.stopPropagation();
    onSelect(id);
    isInteracting.current = true;
  };

  const handleDrag = (e: any, d: { x: number; y: number }) => {
    const newState = { ...localState, x: d.x, y: d.y };
    setLocalState(newState);
    onChange(id, { x: d.x, y: d.y }, true);
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    isInteracting.current = false;
    onChange(id, { x: d.x, y: d.y }, false);
  };

  return (
    <Draggable
      position={{ x: localState.x, y: localState.y }}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      cancel=".resize-handle"
      scale={zoom}
    >
      <div 
        className={`absolute top-0 left-0 group/element ${isSelected ? 'z-50' : 'z-10'}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id, e);
        }}
      >
        <Resizable
          size={{ width: localState.width, height: localState.height }}
          scale={zoom}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          onResize={handleResize as any}
          enable={{ 
            top: true, right: true, bottom: true, left: true, 
            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true 
          }}
          className={`${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border border-blue-400' : 'hover:ring-1 hover:ring-blue-300 ring-offset-1 border border-transparent'}`}
          handleClasses={{
            bottomRight: 'resize-handle',
            bottomLeft: 'resize-handle',
            topRight: 'resize-handle',
            topLeft: 'resize-handle',
            top: 'resize-handle',
            bottom: 'resize-handle',
            left: 'resize-handle',
            right: 'resize-handle'
          }}
          handleStyles={{
            bottomRight: { cursor: 'se-resize', width: '20px', height: '20px', right: '-10px', bottom: '-10px' },
            bottomLeft: { cursor: 'sw-resize', width: '20px', height: '20px', left: '-10px', bottom: '-10px' },
            topRight: { cursor: 'ne-resize', width: '20px', height: '20px', right: '-10px', top: '-10px' },
            topLeft: { cursor: 'nw-resize', width: '20px', height: '20px', left: '-10px', top: '-10px' },
            top: { cursor: 'n-resize', height: '10px', top: '-5px' },
            bottom: { cursor: 's-resize', height: '10px', bottom: '-5px' },
            left: { cursor: 'w-resize', width: '10px', left: '-5px' },
            right: { cursor: 'e-resize', width: '10px', right: '-5px' }
          }}
        >
          {isSelected && (
            <>
              <div className="resize-handle absolute -left-1.5 -top-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute left-1/2 -top-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-x-1/2"></div>
              <div className="resize-handle absolute -right-1.5 -top-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute -right-1.5 top-1/2 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-y-1/2"></div>
              <div className="resize-handle absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute left-1/2 -bottom-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-x-1/2"></div>
              <div className="resize-handle absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto"></div>
              <div className="resize-handle absolute -left-1.5 top-1/2 w-3 h-3 bg-white border border-blue-500 z-50 pointer-events-auto -translate-y-1/2"></div>
            </>
          )}

          <div 
            className="w-full h-full overflow-hidden relative"
            style={{ opacity: element.opacity !== undefined ? element.opacity : 1 }}
          >
            {children}
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
};

// --- Main Sign Component ---

interface SafetySignProps {
  type: string;
  headerText: string;
  mainText: string;
  subText: string;
  mainTextColor: string;
  icon: string;
  layout: string;
  headerBgColor: string;
  headerOvalColor: string;
  headerTextColor: string;
  headerBorderColor: string;
  mainTextSize: number;
  subTextSize: number;
  borderWidth: number;
  showShadow: boolean;
  fontFamily: string;
  mainTextBold: boolean;
  mainTextItalic: boolean;
  mainTextUnderline: boolean;
  subTextBold: boolean;
  subTextItalic: boolean;
  subTextUnderline: boolean;
  headerHeight: number;
  headerTextSize: number;
  iconColor: string;
}

const SafetySign = ({ 
  type, headerText, mainText, subText, mainTextColor, icon, layout, 
  headerBgColor, headerOvalColor, headerTextColor, headerBorderColor, 
  mainTextSize, subTextSize, borderWidth, showShadow, fontFamily,
  mainTextBold, mainTextItalic, mainTextUnderline,
  subTextBold, subTextItalic, subTextUnderline, headerHeight,
  headerTextSize, iconColor
}) => {
  const renderHeader = () => {
    const hStyle = { height: `${headerHeight || 25}%` };
    const fSize = headerTextSize ? `${headerTextSize}px` : 'clamp(2rem, 8cqw, 6rem)';

    switch (type) {
      case 'danger':
        return (
          <div className={`w-full flex items-center justify-center relative overflow-hidden shrink-0`}
               style={{ ...hStyle, backgroundColor: headerBgColor || '#000000', borderBottomWidth: `${borderWidth * 0.6}px`, borderBottomColor: 'black' }}>
            <div className="w-[95%] h-[85%] rounded-[100%] absolute flex items-center justify-center border-[3px]"
                 style={{ 
                   backgroundColor: headerOvalColor || '#DC2626',
                   borderColor: headerBorderColor || '#FFFFFF' 
                 }}>
               <h1 className="font-black tracking-wider uppercase z-10 relative mt-2"
                   style={{ color: headerTextColor || '#FFFFFF', fontFamily, fontSize: fSize }}>
                {headerText || 'DANGER'}
              </h1>
            </div>
          </div>
        );
      case 'warning':
        return (
          <div className={`bg-orange-500 w-full flex items-center justify-center gap-4 shrink-0`}
               style={{ ...hStyle, borderBottomWidth: `${borderWidth * 0.6}px`, borderBottomColor: 'black' }}>
            <AlertTriangle className="h-2/3 w-auto text-black fill-black stroke-orange-500" />
            <h1 className="font-black tracking-wider text-black uppercase" style={{ fontFamily, fontSize: fSize }}>
              {headerText || 'WARNING'}
            </h1>
          </div>
        );
      case 'caution':
        return (
          <div className={`bg-yellow-400 w-full flex items-center justify-center gap-4 shrink-0`}
               style={{ ...hStyle, borderBottomWidth: `${borderWidth * 0.6}px`, borderBottomColor: 'black' }}>
             <AlertTriangle className="h-2/3 w-auto text-black fill-black stroke-yellow-400" />
            <h1 className="font-black tracking-wider text-black uppercase" style={{ fontFamily, fontSize: fSize }}>
              {headerText || 'CAUTION'}
            </h1>
          </div>
        );
      case 'notice':
        return (
          <div className={`bg-blue-600 w-full flex items-center justify-center shrink-0`}
               style={{ ...hStyle, borderBottomWidth: `${borderWidth * 0.6}px`, borderBottomColor: 'black' }}>
            <h1 className="font-black tracking-wider text-white uppercase" style={{ fontFamily, fontSize: fSize }}>
              {headerText || 'NOTICE'}
            </h1>
          </div>
        );
      case 'safety':
        return (
          <div className={`bg-green-600 w-full flex items-center justify-center shrink-0`}
               style={{ ...hStyle, borderBottomWidth: `${borderWidth * 0.6}px`, borderBottomColor: 'black' }}>
            <h1 className="font-black tracking-wider text-white uppercase" style={{ fontFamily, fontSize: fSize }}>
              {headerText || 'SAFETY FIRST'}
            </h1>
          </div>
        );
      case 'fire':
        return (
          <div className={`bg-red-600 w-full flex items-center justify-center gap-4 shrink-0`}
               style={{ ...hStyle, borderBottomWidth: `${borderWidth * 0.6}px`, borderBottomColor: 'black' }}>
             <Flame className="h-2/3 w-auto text-white fill-white" />
            <h1 className="font-black tracking-wider text-white uppercase" style={{ fontFamily, fontSize: fSize }}>
              {headerText || 'FIRE'}
            </h1>
          </div>
        );
      default:
        return null;
    }
  };

  const IconComponent = iconMap[icon] || AlertTriangle;
  const iColor = iconColor || 'black';

  return (
    <div 
      className={`w-full h-full bg-white flex flex-col overflow-hidden ${showShadow ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'shadow-2xl'}`} 
      style={{ borderWidth: `${borderWidth}px`, borderColor: 'black' }}
    >
      {renderHeader()}
      <div className="flex-1 flex p-4 bg-white relative overflow-hidden">
        {layout === 'standard' && (
          <div className="w-full flex flex-col items-center justify-center text-center">
             {icon && icon !== 'None' && (
               <div className="mb-4">
                  <IconComponent size={80} color={iColor} />
               </div>
             )}
            <h2 className="mb-2 uppercase leading-none break-words w-full" 
                style={{ 
                  color: mainTextColor, 
                  fontSize: `${mainTextSize}px`, 
                  fontFamily,
                  fontWeight: mainTextBold ? 'bold' : 'normal',
                  fontStyle: mainTextItalic ? 'italic' : 'normal',
                  textDecoration: mainTextUnderline ? 'underline' : 'none'
                }}>
              {mainText}
            </h2>
            {subText && (
              <p className="uppercase mt-2"
                 style={{ 
                   fontSize: `${subTextSize}px`, 
                   fontFamily,
                   fontWeight: subTextBold ? 'bold' : 'normal',
                   fontStyle: subTextItalic ? 'italic' : 'normal',
                   textDecoration: subTextUnderline ? 'underline' : 'none'
                 }}>
                {subText}
              </p>
            )}
          </div>
        )}
        {layout === 'left-icon' && (
          <div className="w-full flex items-center gap-6">
            <div className="w-1/3 flex items-center justify-center h-full border-r-0 border-black p-2">
               <IconComponent size={140} color={iColor} strokeWidth={1.5} />
            </div>
            <div className="w-2/3 flex flex-col justify-center text-left pl-4">
              <h2 className="mb-2 uppercase leading-tight" 
                  style={{ 
                    color: mainTextColor, 
                    fontSize: `${mainTextSize}px`, 
                    fontFamily,
                    fontWeight: mainTextBold ? 'bold' : 'normal',
                    fontStyle: mainTextItalic ? 'italic' : 'normal',
                    textDecoration: mainTextUnderline ? 'underline' : 'none'
                  }}>
                {mainText}
              </h2>
              {subText && (
                <p className="uppercase"
                   style={{ 
                     fontSize: `${subTextSize}px`, 
                     fontFamily,
                     fontWeight: subTextBold ? 'bold' : 'normal',
                     fontStyle: subTextItalic ? 'italic' : 'normal',
                     textDecoration: subTextUnderline ? 'underline' : 'none'
                   }}>
                  {subText}
                </p>
              )}
            </div>
          </div>
        )}
        {layout === 'visual' && (
          <div className="w-full flex flex-col items-center justify-center text-center">
            <div className="flex-1 flex items-center justify-center">
               <IconComponent size={160} color={iColor} strokeWidth={1.5} />
            </div>
            <div className="pb-4">
              <h2 className="uppercase leading-none" 
                  style={{ 
                    color: mainTextColor, 
                    fontSize: `${mainTextSize}px`, 
                    fontFamily,
                    fontWeight: mainTextBold ? 'bold' : 'normal',
                    fontStyle: mainTextItalic ? 'italic' : 'normal',
                    textDecoration: mainTextUnderline ? 'underline' : 'none'
                  }}>
                {mainText}
              </h2>
              {subText && (
                <p className="uppercase mt-2"
                   style={{ 
                     fontSize: `${subTextSize}px`, 
                     fontFamily,
                     fontWeight: subTextBold ? 'bold' : 'normal',
                     fontStyle: subTextItalic ? 'italic' : 'normal',
                     textDecoration: subTextUnderline ? 'underline' : 'none'
                   }}>
                  {subText}
                </p>
              )}
            </div>
          </div>
        )}
        {layout === 'top-icon' && (
          <div className="w-full flex flex-col items-center justify-center text-center gap-4">
             <IconComponent size={100} color={iColor} />
            <div>
              <h2 className="uppercase leading-none" 
                  style={{ 
                    color: mainTextColor, 
                    fontSize: `${mainTextSize}px`, 
                    fontFamily,
                    fontWeight: mainTextBold ? 'bold' : 'normal',
                    fontStyle: mainTextItalic ? 'italic' : 'normal',
                    textDecoration: mainTextUnderline ? 'underline' : 'none'
                  }}>
                {mainText}
              </h2>
              {subText && (
                <p className="uppercase mt-2"
                   style={{ 
                     fontSize: `${subTextSize}px`, 
                     fontFamily,
                     fontWeight: subTextBold ? 'bold' : 'normal',
                     fontStyle: subTextItalic ? 'italic' : 'normal',
                     textDecoration: subTextUnderline ? 'underline' : 'none'
                   }}>
                  {subText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

interface CustomSignageEditorProps {
  initialData?: any;
  onDataLoaded?: () => void;
}

const CustomSignageEditor = ({ initialData, onDataLoaded }: CustomSignageEditorProps) => {
  const [signData, setSignData] = useState({
    type: 'danger',
    headerText: '',
    mainText: 'KEEP OUT',
    subText: 'HAZARDOUS AREA',
    mainTextColor: '#000000',
    headerColor: '',
    headerBgColor: '#000000',
    headerOvalColor: '#DC2626',
    headerTextColor: '#FFFFFF',
    headerBorderColor: '#FFFFFF',
    icon: 'AlertOctagon',
    layout: 'standard',
    mainTextSize: 150,
    subTextSize: 75,
    borderWidth: 12,
    showShadow: true,
    fontFamily: '"Oswald", sans-serif',
    mainTextBold: true,
    mainTextItalic: false,
    mainTextUnderline: false,
    subTextBold: true,
    subTextItalic: false,
    subTextUnderline: false,
    headerHeight: 25,
    iconColor: '#000000',
    headerTextSize: 0
  });
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedTemplates, setGroupedTemplates] = useState<Record<string, Record<string, any[]>>>({});
  
  const [signSize, setSignSize] = useState({ width: 1123, height: 794 });
  const [signPosition, setSignPosition] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(0.6);
  const [paperFormat, setPaperFormat] = useState('a4');
  const [showGrid, setShowGrid] = useState(true);

  const [extraElements, setExtraElements] = useState<any[]>([]);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const fileInputRef = useRef<any>(null);
  const printRef = useRef<any>(null);
  const mainRef = useRef<any>(null);

  const centerSign = useCallback(() => {
    if (!mainRef.current) return;
    const container = mainRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const padding = 60;
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - padding;
    
    const scaleX = availableWidth / signSize.width;
    const scaleY = availableHeight / signSize.height;
    const newZoom = Math.min(scaleX, scaleY, 1.2);
    
    setZoom(Math.max(newZoom, 0.1));
    
    const x = (containerWidth - signSize.width * newZoom) / 2;
    const y = (containerHeight - signSize.height * newZoom) / 2;
    
    setSignPosition({ x: Math.max(0, x), y: Math.max(0, y) });
  }, [signSize]);

  useEffect(() => {
    setTimeout(centerSign, 100);
  }, [signSize, centerSign]);

  const [printOptions] = useState({ bleed: false, cropMarks: false });
  const [showRuler, setShowRuler] = useState(false);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveOptions, setSaveOptions] = useState({ name: '', tags: '' });

  const [qrText, setQrText] = useState('');
  const [snapToGrid] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [iconSearchResults, setIconSearchResults] = useState<string[]>([]);
  
  const [mainIconSearch, setMainIconSearch] = useState('');

  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoing = useRef(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(4);
  const canvasRef = useRef<any>(null);

  // Handle initial data from props
  useEffect(() => {
    if (initialData) {
      if (initialData.signData) setSignData(initialData.signData);
      if (initialData.signSize) setSignSize(initialData.signSize);
      if (initialData.extraElements) setExtraElements(initialData.extraElements);
      if (onDataLoaded) onDataLoaded();
    }
  }, [initialData, onDataLoaded]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
        if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) return;
        handleDeleteElement();
      }
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedElementIds.length > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        
        setExtraElements(prev => prev.map(el => {
          if (selectedElementIds.includes(el.id)) {
            let dx = 0, dy = 0;
            if (e.key === 'ArrowUp') dy = -step;
            if (e.key === 'ArrowDown') dy = step;
            if (e.key === 'ArrowLeft') dx = -step;
            if (e.key === 'ArrowRight') dx = step;
            return { ...el, x: el.x + dx, y: el.y + dy };
          }
          return el;
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementIds]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      const initialState = {
        signData: JSON.parse(JSON.stringify(signData)),
        signSize: {...signSize},
        signPosition: {...signPosition},
        extraElements: []
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  const saveToHistory = useCallback(() => {
    if (isUndoing.current) return;

    const snapshot = {
      signData: JSON.parse(JSON.stringify(signData)),
      signSize: {...signSize},
      signPosition: {...signPosition},
      extraElements: JSON.parse(JSON.stringify(extraElements))
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(snapshot);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [signData, signSize, signPosition, extraElements, historyIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToHistory();
    }, 500);
    return () => clearTimeout(timer);
  }, [signData, signSize, signPosition, extraElements, saveToHistory]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoing.current = true;
      const prev = history[historyIndex - 1];
      setSignData(prev.signData);
      setSignSize(prev.signSize);
      setSignPosition(prev.signPosition);
      setExtraElements(prev.extraElements || []);
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => isUndoing.current = false, 100);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoing.current = true;
      const next = history[historyIndex + 1];
      setSignData(next.signData);
      setSignSize(next.signSize);
      setSignPosition(next.signPosition);
      setExtraElements(next.extraElements || []);
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => isUndoing.current = false, 100);
    }
  };

  // Fetch templates - using local API or static data
  useEffect(() => {
    // Try to fetch from API, otherwise use empty array
    fetch('/api/safety-templates')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTemplates(data);
          
          const grouped = data.reduce((acc: Record<string, Record<string, any[]>>, tmpl: any) => {
            if (!acc[tmpl.type]) acc[tmpl.type] = {};
            if (!acc[tmpl.type][tmpl.category]) acc[tmpl.type][tmpl.category] = [];
            acc[tmpl.type][tmpl.category].push(tmpl);
            return acc;
          }, {});
          setGroupedTemplates(grouped);
        }
      })
      .catch(err => console.log("Using default templates"));
  }, []);

  const loadTemplate = (tmpl: any) => {
    setSignData({
      ...signData,
      type: tmpl.type,
      mainText: tmpl.text,
      subText: tmpl.subText,
      headerText: '',
      icon: tmpl.icon || 'AlertTriangle',
      layout: tmpl.layout || 'standard'
    });
  };

  const handleSaveTemplate = () => {
    setSaveOptions({
      name: signData.mainText || 'My Safety Sign',
      tags: ''
    });
    setShowSaveModal(true);
  };

  const confirmSaveTemplate = async () => {
    try {
      const templateData = {
        templateName: saveOptions.name,
        tags: saveOptions.tags.split(',').map(t => t.trim()).filter(t => t),
        type: signData.type,
        category: 'Custom',
        text: signData.mainText,
        subText: signData.subText,
        icon: signData.icon,
        layout: signData.layout,
        timestamp: Date.now()
      };

      // Save to localStorage as fallback
      const savedTemplates = JSON.parse(localStorage.getItem('customSafetyTemplates') || '[]');
      const newTemplate = { ...templateData, id: `custom-${Date.now()}` };
      savedTemplates.push(newTemplate);
      localStorage.setItem('customSafetyTemplates', JSON.stringify(savedTemplates));
      
      setTemplates(prev => [...prev, newTemplate]);
      setShowSaveModal(false);
    } catch (err) {
      console.error("Failed to save template", err);
      alert('Failed to save template');
    }
  };

  const handleElementSelect = (id: string, e?: any) => {
    if (id === 'main-sign') {
      setSelectedElementId('main-sign');
      setSelectedElementIds(['main-sign']);
      return;
    }

    const isShift = e && e.shiftKey;

    if (isShift) {
      if (selectedElementIds.includes(id)) {
        const newIds = selectedElementIds.filter(sid => sid !== id);
        setSelectedElementIds(newIds);
        setSelectedElementId(newIds.length > 0 ? newIds[newIds.length - 1] : null);
      } else {
        const newIds = [...selectedElementIds, id];
        setSelectedElementIds(newIds);
        setSelectedElementId(id);
      }
    } else {
      if (!selectedElementIds.includes(id)) {
        setSelectedElementIds([id]);
        setSelectedElementId(id);
      } else {
        setSelectedElementId(id);
      }
    }
  };

  const handleAlign = (alignment: string) => {
    if (selectedElementIds.length === 0) return;
    
    setExtraElements(prev => {
      const elements = prev.filter(el => selectedElementIds.includes(el.id));
      if (elements.length === 0) return prev;
      
      let targetLeft = 0;
      let targetTop = 0;
      let targetRight = signSize.width;
      let targetBottom = signSize.height;
      let targetCenterX = signSize.width / 2;
      let targetCenterY = signSize.height / 2;

      if (elements.length > 1) {
        const minX = Math.min(...elements.map(e => e.x));
        const maxX = Math.max(...elements.map(e => e.x + e.width));
        const minY = Math.min(...elements.map(e => e.y));
        const maxY = Math.max(...elements.map(e => e.y + e.height));
        
        targetLeft = minX;
        targetTop = minY;
        targetRight = maxX;
        targetBottom = maxY;
        targetCenterX = minX + (maxX - minX) / 2;
        targetCenterY = minY + (maxY - minY) / 2;
      }

      return prev.map(el => {
        if (!selectedElementIds.includes(el.id)) return el;

        let newX = el.x;
        let newY = el.y;

        switch (alignment) {
          case 'left': newX = targetLeft; break;
          case 'center': newX = targetCenterX - el.width / 2; break;
          case 'right': newX = targetRight - el.width; break;
          case 'top': newY = targetTop; break;
          case 'middle': newY = targetCenterY - el.height / 2; break;
          case 'bottom': newY = targetBottom - el.height; break;
        }

        return { ...el, x: newX, y: newY };
      });
    });
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          let w = 200;
          let h = 200;
          if (aspectRatio > 1) h = w / aspectRatio;
          else w = h * aspectRatio;

          const newElement = {
            id: `img-${Date.now()}`,
            type: 'image',
            src: event.target?.result as string,
            x: 50,
            y: 50,
            width: w,
            height: h
          };
          setExtraElements([...extraElements, newElement]);
          setSelectedElementId(newElement.id);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIcon = (iconName: string) => {
    const newElement = {
      id: `icon-${Date.now()}`,
      type: 'icon',
      iconName: iconName,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      color: '#000000'
    };
    setExtraElements([...extraElements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleElementChange = (id: string, newProps: any, isResizing?: boolean) => {
    if (id === 'main-sign') {
      if (newProps.width) setSignSize({ width: newProps.width, height: newProps.height! });
      if (newProps.x !== undefined) setSignPosition({ x: newProps.x, y: newProps.y! });
    } else {
      setExtraElements(prev => {
        const oldEl = prev.find(e => e.id === id);
        
        if (snapToGrid && !isResizing && (newProps.x !== undefined || newProps.y !== undefined)) {
          const SNAP = 20;
          if (newProps.x !== undefined) newProps.x = Math.round(newProps.x / SNAP) * SNAP;
          if (newProps.y !== undefined) newProps.y = Math.round(newProps.y / SNAP) * SNAP;
        }
        
        if (!isResizing && selectedElementIds.includes(id) && (newProps.x !== undefined || newProps.y !== undefined) && oldEl) {
          const dx = newProps.x !== undefined ? newProps.x - oldEl.x : 0;
          const dy = newProps.y !== undefined ? newProps.y - oldEl.y! : 0;

          return prev.map(el => {
            if (selectedElementIds.includes(el.id)) {
              if (el.id === id) return { ...el, ...newProps };
              return { 
                ...el, 
                x: el.x + dx, 
                y: el.y + dy 
              };
            }
            return el;
          });
        }

        return prev.map(el => el.id === id ? { ...el, ...newProps } : el);
      });
    }
  };

  const handleDownloadPNG = async () => {
    const node = printRef.current; 
    if (node) {
      try {
        const bleedPx = printOptions.bleed ? 40 : 0;
        const cropPx = printOptions.cropMarks ? 60 : 0;
        const totalWidth = signSize.width + bleedPx + cropPx;
        const totalHeight = signSize.height + bleedPx + cropPx;

        const dataUrl = await htmlToImage.toPng(node, {
          pixelRatio: 4, 
          width: totalWidth,
          height: totalHeight,
          style: {
            transform: 'none',
            display: 'flex', 
            opacity: '1'
          }
        });
        const link = document.createElement('a');
        link.download = `safety-sign-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("PNG export failed:", err);
        alert("Failed to export PNG. Please try again.");
      }
    }
  };

  const handleDownloadPDF = async () => {
    const node = printRef.current; 
    if (node) {
      try {
        const bleedPx = printOptions.bleed ? 40 : 0;
        const cropPx = printOptions.cropMarks ? 60 : 0;
        const totalWidth = signSize.width + bleedPx + cropPx;
        const totalHeight = signSize.height + bleedPx + cropPx;

        const dataUrl = await htmlToImage.toPng(node, { 
          pixelRatio: 4, 
          width: totalWidth,
          height: totalHeight,
          style: {
            transform: 'none', 
            display: 'flex',   
            opacity: '1'         
          }
        });

        const isLandscape = totalWidth > totalHeight;
        let pdf;

        if (paperFormat !== 'custom' && ['a3', 'a4', 'a5'].includes(paperFormat)) {
          if (printOptions.bleed || printOptions.cropMarks) {
            const orientation = isLandscape ? 'l' : 'p';
            pdf = new jsPDF({
              orientation,
              unit: 'px',
              format: [totalWidth, totalHeight]
            });
            pdf.addImage(dataUrl, 'PNG', 0, 0, totalWidth, totalHeight);
          } else {
            pdf = new jsPDF({
              orientation: 'l', 
              unit: 'mm', 
              format: paperFormat as 'a3' | 'a4' | 'a5'
            });
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
          }
        } else {
          const orientation = isLandscape ? 'l' : 'p';
          pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [totalWidth, totalHeight]
          });
          pdf.addImage(dataUrl, 'PNG', 0, 0, totalWidth, totalHeight);
        }

        pdf.save(`safety-sign-${paperFormat}-${Date.now()}.pdf`);
      } catch (err) {
        console.error("PDF export failed:", err);
        alert("Failed to export PDF. Please try again.");
      }
    }
  };

  const getFilteredTemplates = () => {
    const saved = templates.filter(t => 
      (t.id && t.id.toString().startsWith('custom-')) || t.category === 'My Saved Designs'
    );
    
    const standard = templates.filter(t => 
      !((t.id && t.id.toString().startsWith('custom-')) || t.category === 'My Saved Designs')
    );

    if (!searchTerm) {
      const groupedStandard = standard.reduce((acc: Record<string, Record<string, any[]>>, tmpl: any) => {
        if (!acc[tmpl.type]) acc[tmpl.type] = {};
        if (!acc[tmpl.type][tmpl.category]) acc[tmpl.type][tmpl.category] = [];
        acc[tmpl.type][tmpl.category].push(tmpl);
        return acc;
      }, {});
      
      return { saved, grouped: groupedStandard };
    }

    const lowerSearch = searchTerm.toLowerCase();
    
    const filteredSaved = saved.filter(t => 
      t.text.toLowerCase().includes(lowerSearch) || 
      t.subText.toLowerCase().includes(lowerSearch) ||
      (t.templateName && t.templateName.toLowerCase().includes(lowerSearch)) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
    );

    const filteredGrouped: Record<string, Record<string, any[]>> = {};
    const standardFiltered = standard.filter(t => 
      t.text.toLowerCase().includes(lowerSearch) || 
      t.subText.toLowerCase().includes(lowerSearch)
    );

    standardFiltered.forEach(tmpl => {
      if (!filteredGrouped[tmpl.type]) filteredGrouped[tmpl.type] = {};
      if (!filteredGrouped[tmpl.type][tmpl.category]) filteredGrouped[tmpl.type][tmpl.category] = [];
      filteredGrouped[tmpl.type][tmpl.category].push(tmpl);
    });

    return { saved: filteredSaved, grouped: filteredGrouped };
  };

  const handleDeleteElement = () => {
    if (selectedElementId && selectedElementId !== 'main-sign') {
      setExtraElements(prev => prev.filter(el => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  const handleIconSearch = async () => {
    if (!iconSearchTerm) return;
    try {
      const res = await fetch(`https://api.iconify.design/search?query=${iconSearchTerm}&limit=20`);
      const data = await res.json();
      setIconSearchResults(data.icons || []);
    } catch (e) { console.error(e); }
  };

  const addIconFromUrl = (iconName: string) => {
    const url = `https://api.iconify.design/${iconName}.svg`;
    fetch(url).then(r => r.blob()).then(blob => {
      const reader = new FileReader();
      reader.onload = () => {
        const newElement = {
          id: `icon-web-${Date.now()}`,
          type: 'image',
          src: reader.result as string,
          x: 100, y: 100, width: 100, height: 100,
          opacity: 1
        };
        setExtraElements([...extraElements, newElement]);
        setSelectedElementId(newElement.id);
      };
      reader.readAsDataURL(blob);
    });
  };

  const addShape = (shapeType: string) => {
    const newElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType: shapeType, 
      backgroundColor: '#ff0000',
      borderColor: '#000000',
      borderWidth: 0,
      x: 150, y: 150, width: 100, height: 100,
      opacity: 1
    };
    setExtraElements([...extraElements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addQrCode = async (text: string) => {
    if (!text) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const newElement = {
          id: `qr-${Date.now()}`,
          type: 'image',
          src: reader.result as string,
          x: 50, y: 50, width: 100, height: 100,
          opacity: 1
        };
        setExtraElements([...extraElements, newElement]);
        setSelectedElementId(newElement.id);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("QR Fetch Error", e);
    }
  };

  const handleLayerReorder = (direction: string) => {
    if (!selectedElementId) return;
    const index = extraElements.findIndex(el => el.id === selectedElementId);
    if (index === -1) return;

    const newElements = [...extraElements];
    if (direction === 'up' && index < newElements.length - 1) {
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    } else if (direction === 'down' && index > 0) {
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
    }
    setExtraElements(newElements);
  };

  const handleDeleteTemplate = async (e: any, tmpl: any) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${tmpl.templateName || tmpl.text}"?`)) return;

    // Remove from localStorage
    const savedTemplates = JSON.parse(localStorage.getItem('customSafetyTemplates') || '[]');
    const filtered = savedTemplates.filter((t: any) => t.id !== tmpl.id);
    localStorage.setItem('customSafetyTemplates', JSON.stringify(filtered));
    
    setTemplates(prev => prev.filter(t => t.id !== tmpl.id));
  };

  const { saved: savedTemplates, grouped: displayTemplates } = getFilteredTemplates();
  
  const selectedElement = extraElements.find(el => el.id === selectedElementId);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden flex-col">
      
      {/* --- Top Toolbar --- */}
      <header className="h-14 bg-black border-b border-slate-800 flex items-center justify-between px-4 z-30 shadow-md" id="app-header">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg mr-4" id="app-title">
            <AlertOctagon className="text-yellow-400" />
            SAFETY SIGN PRO
          </div>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          
          <div id="undo-redo-controls" className="flex items-center">
            <button 
              onClick={handleUndo} 
              disabled={historyIndex <= 0}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-800 rounded transition-colors"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-800 rounded transition-colors"
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>
          
          {selectedElementId && selectedElementId !== 'main-sign' && (
            <>
              <div className="h-6 w-px bg-slate-700 mx-2"></div>
              <button 
                onClick={handleDeleteElement}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors flex items-center gap-2"
                title="Delete Selected"
              >
                <Trash2 size={16} />
                <span className="text-xs font-bold uppercase">Delete</span>
              </button>
            </>
          )}

          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          
          {/* Drawing Tools */}
          <div id="drawing-tools" className="flex items-center">
            <button 
              onClick={() => setIsDrawing(!isDrawing)} 
              className={`p-2 rounded transition-colors ${isDrawing ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title={isDrawing ? "Exit Drawing Mode" : "Freehand Draw"}
            >
              <PenTool size={18} />
            </button>
            
            <button 
              onClick={() => alert("Crop Tool: Select an image to crop.")}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Crop Image"
            >
              <Crop size={18} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-700 mx-2"></div>

          <div id="view-controls" className="flex items-center">
            <div className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1">
              <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="text-slate-400 hover:text-white p-1">
                <ZoomOut size={16} />
              </button>
              <span className="text-xs text-slate-300 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="text-slate-400 hover:text-white p-1">
                <ZoomIn size={16} />
              </button>
            </div>
            <button 
              onClick={() => setZoom(1)} 
              className="text-xs text-slate-500 hover:text-white underline ml-2"
            >
              Reset
            </button>

            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <button 
              onClick={() => setShowGrid(!showGrid)} 
              className={`p-1.5 rounded ${showGrid ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-white'}`}
              title="Toggle Grid"
            >
              <LayoutTemplate size={16} />
            </button>

            <button 
              onClick={() => setShowRuler(!showRuler)}
              className={`p-1.5 rounded ml-2 ${showRuler ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:text-white'}`}
              title="Toggle Rulers"
            >
              <div className="font-mono text-xs font-bold">R</div>
            </button>
          </div>

          {selectedElementIds.length > 0 && (
            <>
              <div className="h-6 w-px bg-slate-700 mx-2"></div>
              <div className="flex items-center gap-1 bg-slate-800 rounded px-2 py-1">
                <button onClick={() => handleAlign('left')} title="Align Left" className="text-slate-400 hover:text-white p-1"><AlignLeft size={16}/></button>
                <button onClick={() => handleAlign('center')} title="Align Center" className="text-slate-400 hover:text-white p-1"><AlignCenter size={16}/></button>
                <button onClick={() => handleAlign('right')} title="Align Right" className="text-slate-400 hover:text-white p-1"><AlignRight size={16}/></button>
                <div className="w-px h-4 bg-slate-600 mx-1"></div>
                <button onClick={() => handleAlign('top')} title="Align Top" className="text-slate-400 hover:text-white p-1"><AlignVerticalJustifyCenter size={16} className="rotate-90"/></button>
                <button onClick={() => handleAlign('middle')} title="Align Middle" className="text-slate-400 hover:text-white p-1"><AlignVerticalJustifyCenter size={16}/></button>
                <button onClick={() => handleAlign('bottom')} title="Align Bottom" className="text-slate-400 hover:text-white p-1"><AlignVerticalJustifyCenter size={16} className="-rotate-90"/></button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3" id="save-download-controls">
          <button
            onClick={startTour}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded text-sm font-medium border border-slate-700 transition-colors mr-2"
            title="Start Tour"
          >
            <HelpCircle size={16} /> Tour
          </button>

          <button 
            onClick={handleSaveTemplate}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm font-medium border border-slate-700 transition-colors mr-2"
          >
            <Save size={14} /> Save Template
          </button>
          <button 
            onClick={handleDownloadPNG}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm font-medium border border-slate-700 transition-colors"
          >
            <Download size={14} /> PNG
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
          >
            <FileType size={14} /> PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- Left Sidebar (Library & Assets) --- */}
        <aside className="w-[300px] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl z-20">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Saved Library Section */}
            <div id="sidebar-library">
              <AccordionItem title="Saved Library" icon={Save} defaultOpen={true}>
                <div className="p-2 space-y-2">
                  {templates.filter(t => t.category === 'My Saved Designs' || t.category === 'Custom').length === 0 && (
                    <div className="text-xs text-slate-500 text-center italic py-4">
                      No saved designs yet. <br/> Create one and click "Save Template"!
                    </div>
                  )}
                  {templates.filter(t => t.category === 'My Saved Designs' || t.category === 'Custom').map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => loadTemplate(tmpl)}
                      className="w-full text-left text-xs p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded transition-all group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        tmpl.type === 'danger' ? 'bg-red-500' : 
                        tmpl.type === 'warning' ? 'bg-orange-500' : 
                        tmpl.type === 'caution' ? 'bg-yellow-400' : 
                        tmpl.type === 'safety' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="pl-3">
                        <div className="font-bold text-white mb-0.5">{tmpl.text}</div>
                        <div className="text-slate-400 text-[10px]">{tmpl.subText}</div>
                        <div className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
                          <span className="uppercase">{tmpl.type}</span> • {tmpl.layout}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionItem>
            </div>

            {/* Quick Templates Section */}
            <AccordionItem title="Template Library" icon={FileText} defaultOpen={false} contentClassName="p-0">
              <div className="p-4 relative">
                <Search className="absolute left-7 top-6.5 text-slate-500 w-4 h-4 z-10" />
                <input 
                  type="text" 
                  placeholder="Search templates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 text-white pl-9 pr-3 py-2 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none placeholder-slate-500 border border-slate-700"
                />
              </div>
              
              <div className="pb-2">
                {savedTemplates && savedTemplates.length > 0 && (
                  <div className="mb-2 border-b border-slate-800 pb-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase px-4 mb-1 mt-2 tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      My Saved Designs
                    </div>
                    <div className="pl-4 pr-2 py-1 space-y-1">
                      {savedTemplates.map(tmpl => (
                        <button
                          key={tmpl.id}
                          onClick={() => loadTemplate(tmpl)}
                          className="w-full text-left text-xs p-2 hover:bg-blue-600/20 hover:text-blue-300 rounded transition-colors flex items-start gap-2 group/btn border border-transparent hover:border-blue-500/30 relative pr-6"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                            tmpl.type === 'danger' ? 'bg-red-500' : 
                            tmpl.type === 'warning' ? 'bg-orange-500' : 
                            tmpl.type === 'caution' ? 'bg-yellow-400' : 
                            tmpl.type === 'safety' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="font-bold text-slate-300 group-hover/btn:text-white leading-tight">{tmpl.templateName || tmpl.text}</div>
                            <div className="text-slate-500 group-hover/btn:text-slate-400 text-[10px] mt-0.5 leading-tight">{tmpl.subText}</div>
                          </div>
                          
                          <div
                            onClick={(e) => handleDeleteTemplate(e, tmpl)}
                            className="opacity-0 group-hover/btn:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-all absolute right-1 top-1.5 z-10 cursor-pointer"
                            title="Delete Template"
                          >
                            <Trash2 size={12} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(displayTemplates).map(type => (
                  <div key={type} className="mb-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase px-4 mb-1 mt-2 tracking-wider flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        type === 'danger' ? 'bg-red-500' : 
                        type === 'warning' ? 'bg-orange-500' : 
                        type === 'caution' ? 'bg-yellow-400' : 
                        type === 'safety' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      {type} Signs
                    </div>
                    {Object.keys(displayTemplates[type]).map(category => (
                      <NestedAccordion 
                        key={category} 
                        title={category} 
                        count={displayTemplates[type][category].length}
                      >
                        <div className="pl-4 pr-2 py-1 space-y-1">
                          {displayTemplates[type][category].map(tmpl => (
                            <button
                              key={tmpl.id}
                              onClick={() => loadTemplate(tmpl)}
                              className="w-full text-left text-xs p-2 hover:bg-blue-600/20 hover:text-blue-300 rounded transition-colors flex items-start gap-2 group/btn border border-transparent hover:border-blue-500/30"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                                tmpl.type === 'danger' ? 'bg-red-500' : 
                                tmpl.type === 'warning' ? 'bg-orange-500' : 
                                tmpl.type === 'caution' ? 'bg-yellow-400' : 
                                tmpl.type === 'safety' ? 'bg-green-500' : 'bg-blue-500'
                              }`}></div>
                              <div>
                                <div className="font-bold text-slate-300 group-hover/btn:text-white leading-tight">{tmpl.text}</div>
                                <div className="text-slate-500 group-hover/btn:text-slate-400 text-[10px] mt-0.5 leading-tight">{tmpl.subText}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </NestedAccordion>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionItem>

            {/* Custom Elements (Images / Icons) */}
            <div id="add-elements-section">
              <AccordionItem title="Add Elements" icon={Layers} defaultOpen={true}>
                <div className="space-y-4">
                  
                  {/* Web Icons Search */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Web Icons (Iconify)</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={iconSearchTerm}
                        onChange={(e) => setIconSearchTerm(e.target.value)}
                        placeholder="Search icons..."
                        className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-xs text-white outline-none focus:border-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleIconSearch()}
                      />
                      <button 
                        onClick={handleIconSearch}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-white"
                      >
                        <Search size={14} />
                      </button>
                    </div>
                    {iconSearchResults.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                        {iconSearchResults.map(icon => (
                          <button 
                            key={icon} 
                            onClick={() => addIconFromUrl(icon)}
                            className="p-1 hover:bg-slate-700 rounded flex items-center justify-center bg-white/5 aspect-square"
                            title={icon}
                          >
                            <img src={`https://api.iconify.design/${icon}.svg`} className="w-6 h-6 invert" alt={icon} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shapes */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Add Shapes</label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button onClick={() => addShape('rect')} className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white flex flex-col items-center gap-1">
                        <Box size={20} /> <span className="text-[10px]">Rectangle</span>
                      </button>
                      <button onClick={() => addShape('circle')} className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white flex flex-col items-center gap-1">
                        <CircleIcon size={20} /> <span className="text-[10px]">Circle</span>
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">QR Code Generator</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter URL or Text" 
                        value={qrText}
                        onChange={(e) => setQrText(e.target.value)}
                        className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-xs text-white outline-none focus:border-blue-500"
                      />
                      <button onClick={() => addQrCode(qrText)} className="p-2 bg-blue-600 rounded text-white hover:bg-blue-500">
                        <QrCode size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Upload Image */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Upload Image</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-slate-800 border border-slate-700 border-dashed rounded text-slate-400 hover:text-white hover:border-blue-500 transition-colors"
                    >
                      <ImageIcon size={18} />
                      <span>Upload Picture</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>

                  {/* Icons */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Safety Icons</label>
                    <IconPicker onSelect={handleAddIcon} />
                  </div>

                </div>
              </AccordionItem>
            </div>

            {/* Layers / Elements List */}
            <AccordionItem title="Layers & Elements" icon={List} defaultOpen={true}>
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {extraElements.length === 0 && (
                  <div className="text-xs text-slate-500 text-center italic py-2">No custom elements added</div>
                )}
                {/* Main Sign Layer */}
                <div 
                  onClick={(e) => handleElementSelect('main-sign', e)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedElementIds.includes('main-sign') ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  <LayoutTemplate size={14} />
                  <span className="text-xs font-medium truncate flex-1">Main Safety Sign</span>
                </div>

                {/* Extra Elements Layers (Reversed to show top on top) */}
                {[...extraElements].reverse().map((el) => (
                  <div 
                    key={el.id}
                    onClick={(e) => handleElementSelect(el.id, e)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors group ${selectedElementIds.includes(el.id) ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {el.type === 'image' ? <ImageIcon size={14} /> : <Smile size={14} />}
                    <span className="text-xs font-medium truncate flex-1">
                      {el.type === 'image' ? 'Uploaded Image' : el.iconName}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteElement(); }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded ${selectedElementIds.includes(el.id) ? 'hover:bg-blue-700 text-blue-200' : 'hover:bg-slate-600 text-slate-400'}`}
                      title="Delete"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </AccordionItem>
          </div>
        </aside>

        {/* --- Main Preview Area --- */}
        <main 
          id="main-canvas"
          ref={mainRef}
          className="flex-1 bg-gray-200 block relative overflow-hidden"
          onClick={() => {
            setSelectedElementId(null);
          }}
        >
          {/* Drawing Toolbar */}
          {isDrawing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-[200] flex items-center gap-3">
              {/* Color Picker */}
              <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                <input 
                  type="color" 
                  value={brushColor}
                  onChange={(e) => {
                    setBrushColor(e.target.value);
                    setIsEraser(false);
                    canvasRef.current?.eraseMode(false);
                  }}
                  className="w-8 h-8 rounded cursor-pointer border-none"
                />
              </div>

              {/* Size Slider */}
              <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Size</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={brushRadius}
                  onChange={(e) => setBrushRadius(parseInt(e.target.value))}
                  className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-slate-500 w-4">{brushRadius}</span>
              </div>

              {/* Eraser */}
              <button 
                onClick={() => {
                  const newState = !isEraser;
                  setIsEraser(newState);
                  canvasRef.current?.eraseMode(newState);
                }}
                className={`p-2 rounded ${isEraser ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Eraser"
              >
                <div className="w-5 h-5 border-2 border-current rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-1/2 bg-current opacity-30"></div>
                </div>
              </button>

              {/* Undo/Redo/Clear */}
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <button onClick={() => canvasRef.current?.undo()} className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Undo Stroke"><Undo size={16}/></button>
                <button onClick={() => canvasRef.current?.redo()} className="p-2 text-slate-500 hover:bg-slate-100 rounded" title="Redo Stroke"><Redo size={16}/></button>
                <button 
                  onClick={() => {
                    if(confirm('Clear all drawings?')) canvasRef.current?.clearCanvas();
                  }} 
                  className="p-2 text-red-500 hover:bg-red-50 rounded" 
                  title="Clear All"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          )}

          {/* Rulers (Optional Overlay) */}
          {showRuler && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
              <Ruler length={Math.max(2000, signSize.width + 500)} isHorizontal={true} zoom={zoom} />
              <Ruler length={Math.max(2000, signSize.height + 500)} isHorizontal={false} zoom={zoom} />
            </div>
          )}

          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: '0 0',
              position: 'absolute',
              left: signPosition.x,
              top: signPosition.y,
              transition: 'transform 0.1s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
            className="shadow-2xl"
          >
            <div style={{
              position: 'relative',
              width: signSize.width,
              height: signSize.height
            }}>
              {/* Main Sign as Background */}
              <div 
                onClick={(e) => handleElementSelect('main-sign', e)}
                className={`w-full h-full absolute top-0 left-0 z-0 cursor-pointer transition-shadow ${selectedElementIds.includes('main-sign') ? 'ring-4 ring-blue-500' : ''}`}
              >
                <SafetySign {...signData} />
              </div>

              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none z-50 opacity-20" 
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} 
                />
              )}

              {/* Extra Elements */}
              {extraElements.map(el => {
                const IconComp = el.type === 'icon' && el.iconName ? iconMap[el.iconName] : null;
                
                return (
                  <ElementWrapper
                    key={el.id}
                    element={el}
                    isSelected={selectedElementIds.includes(el.id)}
                    onSelect={handleElementSelect}
                    onChange={handleElementChange}
                    zoom={zoom}
                  >
                    {el.type === 'image' && (
                      <div className="w-full h-full relative" style={{ opacity: el.opacity !== undefined ? el.opacity : 1 }}>
                        <img src={el.src} alt="uploaded" className="w-full h-full object-contain pointer-events-none" />
                      </div>
                    )}
                    {el.type === 'icon' && IconComp && (
                      <div className="w-full h-full relative" style={{ opacity: el.opacity !== undefined ? el.opacity : 1 }}>
                        <IconComp className="w-full h-full pointer-events-none" style={{ color: el.color }} />
                      </div>
                    )}
                    {el.type === 'shape' && (
                      <div className="w-full h-full pointer-events-none" style={{
                        backgroundColor: el.backgroundColor || 'red',
                        borderRadius: el.shapeType === 'circle' ? '50%' : '0%',
                        opacity: el.opacity !== undefined ? el.opacity : 1
                      }} />
                    )}
                  </ElementWrapper>
                );
              })}

              {/* Freehand Drawing Layer */}
              <div 
                className="absolute inset-0 z-[100]" 
                style={{ pointerEvents: isDrawing ? 'auto' : 'none' }}
              >
                <ReactSketchCanvas
                  ref={canvasRef}
                  strokeWidth={brushRadius}
                  strokeColor={brushColor} 
                  canvasColor="transparent"
                  eraserWidth={brushRadius * 2}
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 text-gray-400 text-xs font-mono bg-white/80 px-2 py-1 rounded backdrop-blur-sm z-50 border border-gray-300 shadow-sm flex items-center gap-2">
            <MousePointer2 size={12} /> 
            <span>POS: {Math.round(signPosition.x)},{Math.round(signPosition.y)}</span>
            <span className="text-gray-300">|</span>
            <span>SIZE: {signSize.width}x{signSize.height}</span>
            <span className="text-gray-300">|</span>
            <span>ZOOM: {Math.round(zoom * 100)}%</span>
          </div>
        </main>

        {/* --- Right Sidebar (Properties & Config) --- */}
        <aside className="w-[320px] bg-slate-900 text-slate-300 flex flex-col border-l border-slate-800 shadow-2xl z-20">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Selected Element Properties */}
            {selectedElementId && selectedElementId !== 'main-sign' && (() => {
              const selectedEl = extraElements.find(el => el.id === selectedElementId);
              if (!selectedEl) return null;
              return (
                <AccordionItem title="Element Properties" icon={LayoutTemplate} defaultOpen={true}>
                  <div className="space-y-4">
                    {/* Opacity */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Opacity</label>
                        <span className="text-xs text-slate-400">{Math.round((selectedEl.opacity !== undefined ? selectedEl.opacity : 1) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={(selectedEl.opacity !== undefined ? selectedEl.opacity : 1) * 100}
                        onChange={(e) => handleElementChange(selectedElementId, { opacity: parseInt(e.target.value) / 100 })}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    {/* Layer Reorder */}
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Layer Order</label>
                      <div className="flex gap-2">
                        <button onClick={() => handleLayerReorder('up')} className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white flex items-center justify-center gap-1" title="Bring Forward">
                          <ArrowUp size={16} /> Forward
                        </button>
                        <button onClick={() => handleLayerReorder('down')} className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white flex items-center justify-center gap-1" title="Send Backward">
                          <ArrowDown size={16} /> Backward
                        </button>
                      </div>
                    </div>
                    
                    {/* Shape Color (If Shape) */}
                    {selectedEl.type === 'shape' && (
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Shape Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={selectedEl.backgroundColor || '#ff0000'}
                            onChange={(e) => handleElementChange(selectedElementId, { backgroundColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border-none"
                          />
                          <span className="text-xs text-slate-400 self-center">{selectedEl.backgroundColor}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Icon Color (If Icon) */}
                    {selectedEl.type === 'icon' && (
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Icon Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={selectedEl.color || '#000000'}
                            onChange={(e) => handleElementChange(selectedElementId, { color: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border-none"
                          />
                          <span className="text-xs text-slate-400 self-center">{selectedEl.color || '#000000'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionItem>
              );
            })()}

            {/* Dimensions Section */}
            <AccordionItem title="Dimensions & Paper Size" icon={Move} defaultOpen={false}>
              <div className="space-y-4">
                {/* Paper Presets */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Standard Paper Sizes (Landscape)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'A3', width: 1587, height: 1122, physical: '420mm x 297mm' },
                      { label: 'A4', width: 1123, height: 794, physical: '297mm x 210mm' },
                      { label: 'A5', width: 794, height: 561, physical: '210mm x 148mm' },
                    ].map((size) => (
                      <button
                        key={size.label}
                        onClick={() => {
                          const newWidth = size.width;
                          const newHeight = size.height;
                          const oldWidth = signSize.width;
                          
                          const scale = newWidth / oldWidth;

                          setSignSize({ width: newWidth, height: newHeight }); 
                          setPaperFormat(size.label.toLowerCase());

                          setSignData(prev => ({
                            ...prev,
                            mainTextSize: Math.round(prev.mainTextSize * scale),
                            subTextSize: Math.round(prev.subTextSize * scale),
                            borderWidth: Math.round(prev.borderWidth * scale) || 1
                          }));

                          setExtraElements(prev => prev.map(el => ({
                            ...el,
                            x: el.x * scale,
                            y: el.y * scale,
                            width: el.width * scale,
                            height: el.height * scale
                          })));
                        }}
                        className={`p-2 border rounded text-xs transition-colors ${
                          paperFormat === size.label.toLowerCase() 
                            ? 'bg-blue-600/20 border-blue-500 text-white' 
                            : 'bg-slate-800 border-slate-700 hover:bg-blue-600/20 hover:border-blue-500 text-slate-300'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                  {paperFormat !== 'custom' && (
                    <div className="mt-2 p-2 bg-slate-800/50 rounded border border-slate-700 text-center">
                      <span className="text-xs text-slate-400 block mb-0.5">Physical Output Size:</span>
                      <span className="text-sm font-bold text-blue-400">
                        {paperFormat === 'a3' && '420mm x 297mm'}
                        {paperFormat === 'a4' && '297mm x 210mm'}
                        {paperFormat === 'a5' && '210mm x 148mm'}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        * Canvas resized to {paperFormat.toUpperCase()} pixel dimensions
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-800 my-2"></div>

                {/* Manual Input */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Width (px)</label>
                    <input
                      type="number"
                      value={signSize.width}
                      disabled={paperFormat !== 'custom'}
                      onChange={(e) => {
                        setSignSize({ ...signSize, width: parseInt(e.target.value) || 100 });
                        setPaperFormat('custom');
                      }}
                      className={`w-full p-2 border border-slate-700 rounded text-white outline-none ${
                        paperFormat !== 'custom' ? 'bg-slate-900 text-slate-500' : 'bg-slate-800 focus:ring-1 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Height (px)</label>
                    <input
                      type="number"
                      value={signSize.height}
                      disabled={paperFormat !== 'custom'}
                      onChange={(e) => {
                        setSignSize({ ...signSize, height: parseInt(e.target.value) || 100 });
                        setPaperFormat('custom');
                      }}
                      className={`w-full p-2 border border-slate-700 rounded text-white outline-none ${
                        paperFormat !== 'custom' ? 'bg-slate-900 text-slate-500' : 'bg-slate-800 focus:ring-1 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-500 italic text-center">
                  * Drag sign corners to resize freely
                </div>
              </div>
            </AccordionItem>

            {/* Sign Configuration */}
            <AccordionItem title="Sign Configuration" icon={Settings} defaultOpen={true}>
              {/* Header Height */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Header Height</label>
                  <span className="text-xs text-slate-400">{signData.headerHeight || 25}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={signData.headerHeight || 25}
                  onChange={(e) => setSignData({ ...signData, headerHeight: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Sign Type */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Header Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['danger', 'warning', 'caution', 'notice', 'safety', 'fire'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSignData({ ...signData, type: t })}
                      className={`p-2 rounded border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 ${
                        signData.type === t 
                          ? 'border-blue-500 bg-slate-800 ring-1 ring-blue-500/50' 
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-full h-3 rounded-sm ${
                        t === 'danger' ? 'bg-[#DC2626]' :
                        t === 'warning' ? 'bg-[#F97316]' :
                        t === 'caution' ? 'bg-[#FACC15]' :
                        t === 'notice' ? 'bg-[#2563EB]' :
                        t === 'safety' ? 'bg-[#16A34A]' :
                        'bg-[#DC2626]'
                      }`}></div>
                      <span className={signData.type === t ? 'text-white' : ''}>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Layout Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'standard', label: 'Standard' },
                    { id: 'left-icon', label: 'Left Icon' },
                    { id: 'visual', label: 'Visual' },
                    { id: 'top-icon', label: 'Top Icon' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSignData({ ...signData, layout: l.id })}
                      className={`p-2 rounded border text-xs font-medium transition-all ${
                        signData.layout === l.id 
                          ? 'bg-slate-100 text-slate-900 border-white' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Safety Icon</label>
                
                {/* Icon Search */}
                <div className="mb-2 relative">
                  <Search className="absolute left-2 top-2 text-slate-500 w-3 h-3" />
                  <input 
                    type="text" 
                    placeholder="Search icons..." 
                    value={mainIconSearch}
                    onChange={(e) => setMainIconSearch(e.target.value)}
                    className="w-full bg-slate-800 text-white pl-7 pr-2 py-1.5 rounded text-xs border border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Icon Grid */}
                <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1 bg-slate-800/30 rounded border border-slate-800">
                  <button
                    onClick={() => setSignData({ ...signData, icon: 'None' })}
                    className={`aspect-square rounded flex items-center justify-center transition-colors border ${
                      signData.icon === 'None' 
                        ? 'bg-blue-600 border-blue-500 text-white' 
                        : 'bg-slate-800 border-transparent hover:bg-slate-700 text-slate-400'
                    }`}
                    title="No Icon"
                  >
                    <Ban size={18} />
                  </button>
                  {Object.keys(iconMap)
                    .filter(name => name.toLowerCase().includes(mainIconSearch.toLowerCase()))
                    .sort()
                    .map((iconName) => {
                      const IconC = iconMap[iconName];
                      return (
                        <button
                          key={iconName}
                          onClick={() => setSignData({ ...signData, icon: iconName })}
                          className={`aspect-square rounded flex items-center justify-center transition-colors border ${
                            signData.icon === iconName 
                              ? 'bg-blue-600 border-blue-500 text-white' 
                              : 'bg-slate-800 border-transparent hover:bg-slate-700 text-slate-400'
                          }`}
                          title={iconName}
                        >
                          <IconC size={18} />
                        </button>
                      );
                    })}
                </div>
              </div>
            </AccordionItem>

            <AccordionItem title="Text Content & Sizing" icon={Type}>
              <div className="space-y-4">
                {/* Font Family Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Font Style</label>
                  <select
                    value={signData.fontFamily}
                    onChange={(e) => setSignData({ ...signData, fontFamily: e.target.value })}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    {fontOptions.map(font => (
                      <option key={font.name} value={font.family}>{font.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Main Headline</label>
                    <div className="flex gap-1 bg-slate-800 rounded p-1 border border-slate-700">
                      <button 
                        onClick={() => setSignData({...signData, mainTextBold: !signData.mainTextBold})}
                        className={`p-1 rounded ${signData.mainTextBold ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Bold"
                      >
                        <Bold size={12} />
                      </button>
                      <button 
                        onClick={() => setSignData({...signData, mainTextItalic: !signData.mainTextItalic})}
                        className={`p-1 rounded ${signData.mainTextItalic ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Italic"
                      >
                        <Italic size={12} />
                      </button>
                      <button 
                        onClick={() => setSignData({...signData, mainTextUnderline: !signData.mainTextUnderline})}
                        className={`p-1 rounded ${signData.mainTextUnderline ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Underline"
                      >
                        <Underline size={12} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={signData.mainText}
                    onChange={(e) => setSignData({...signData, mainText: e.target.value})}
                    className={`w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none mb-2 ${signData.mainTextBold ? 'font-bold' : ''} ${signData.mainTextItalic ? 'italic' : ''} ${signData.mainTextUnderline ? 'underline' : ''}`}
                  />
                  <input 
                    type="range" 
                    min="20" 
                    max="200" 
                    value={signData.mainTextSize} 
                    onChange={(e) => setSignData({...signData, mainTextSize: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Sub Headline</label>
                    <div className="flex gap-1 bg-slate-800 rounded p-1 border border-slate-700">
                      <button 
                        onClick={() => setSignData({...signData, subTextBold: !signData.subTextBold})}
                        className={`p-1 rounded ${signData.subTextBold ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Bold"
                      >
                        <Bold size={12} />
                      </button>
                      <button 
                        onClick={() => setSignData({...signData, subTextItalic: !signData.subTextItalic})}
                        className={`p-1 rounded ${signData.subTextItalic ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Italic"
                      >
                        <Italic size={12} />
                      </button>
                      <button 
                        onClick={() => setSignData({...signData, subTextUnderline: !signData.subTextUnderline})}
                        className={`p-1 rounded ${signData.subTextUnderline ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Underline"
                      >
                        <Underline size={12} />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={signData.subText}
                    onChange={(e) => setSignData({...signData, subText: e.target.value})}
                    className={`w-full p-2 bg-slate-800 border border-slate-700 rounded text-white focus:ring-1 focus:ring-blue-500 outline-none mb-2 ${signData.subTextBold ? 'font-bold' : ''} ${signData.subTextItalic ? 'italic' : ''} ${signData.subTextUnderline ? 'underline' : ''}`}
                  />
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={signData.subTextSize} 
                    onChange={(e) => setSignData({...signData, subTextSize: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Custom Header Text</label>
                  <input
                    type="text"
                    value={signData.headerText}
                    onChange={(e) => setSignData({...signData, headerText: e.target.value})}
                    placeholder="Default"
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white focus:ring-1 focus:ring-blue-500 outline-none placeholder-slate-600 mb-2"
                  />
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Header Size</label>
                    <span className="text-xs text-slate-400">{signData.headerTextSize || 'Auto'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    value={signData.headerTextSize || 0} 
                    onChange={(e) => setSignData({...signData, headerTextSize: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </AccordionItem>

            <AccordionItem title="Visual Impact" icon={Zap}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Border Width</label>
                    <span className="text-xs text-slate-500">{signData.borderWidth}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={signData.borderWidth} 
                    onChange={(e) => setSignData({...signData, borderWidth: parseInt(e.target.value)})}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase">Drop Shadow</label>
                  <button 
                    onClick={() => setSignData({...signData, showShadow: !signData.showShadow})}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${signData.showShadow ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${signData.showShadow ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem title="Color Customization" icon={Palette} defaultOpen={true}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-400">Text Color</label>
                  <input 
                    type="color" 
                    value={signData.mainTextColor}
                    onChange={(e) => setSignData({...signData, mainTextColor: e.target.value})}
                    className="h-8 w-14 bg-transparent border-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-400">Icon Color</label>
                  <input 
                    type="color" 
                    value={signData.iconColor || '#000000'}
                    onChange={(e) => setSignData({...signData, iconColor: e.target.value})}
                    className="h-8 w-14 bg-transparent border-0 cursor-pointer"
                  />
                </div>
                {signData.type === 'danger' && (
                  <>
                    <div className="h-px bg-slate-700 my-2"></div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-400">Header Background</label>
                      <input 
                        type="color" 
                        value={signData.headerBgColor}
                        onChange={(e) => setSignData({...signData, headerBgColor: e.target.value})}
                        className="h-8 w-14 bg-transparent border-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-400">Oval Color</label>
                      <input 
                        type="color" 
                        value={signData.headerOvalColor}
                        onChange={(e) => setSignData({...signData, headerOvalColor: e.target.value})}
                        className="h-8 w-14 bg-transparent border-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-400">Header Text</label>
                      <input 
                        type="color" 
                        value={signData.headerTextColor}
                        onChange={(e) => setSignData({...signData, headerTextColor: e.target.value})}
                        className="h-8 w-14 bg-transparent border-0 cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            </AccordionItem>
          </div>
        </aside>

      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-[400px] shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Save className="text-blue-500" /> Save Template
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Template Name / Version</label>
                <input 
                  type="text" 
                  value={saveOptions.name}
                  onChange={(e) => setSaveOptions({...saveOptions, name: e.target.value})}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Fire Exit v2"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={saveOptions.tags}
                  onChange={(e) => setSaveOptions({...saveOptions, tags: e.target.value})}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. fire, safety, v2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSaveTemplate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                >
                  Save to Library
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Container for PDF Export */}
      <div ref={printRef} style={{
        position: 'fixed', 
        top: 0, 
        left: 0,
        zIndex: -50,
        opacity: 0,
        pointerEvents: 'none',
        width: signSize.width + (printOptions.bleed ? 40 : 0) + (printOptions.cropMarks ? 60 : 0),
        height: signSize.height + (printOptions.bleed ? 40 : 0) + (printOptions.cropMarks ? 60 : 0),
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'relative', 
          width: signSize.width + (printOptions.bleed ? 24 : 0),
          height: signSize.height + (printOptions.bleed ? 24 : 0),
          backgroundColor: 'white',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Crop Marks */}
          {printOptions.cropMarks && (
            <>
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-black -translate-x-full -translate-y-full"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-black translate-x-full -translate-y-full"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-black -translate-x-full translate-y-full"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-black translate-x-full translate-y-full"></div>
            </>
          )}

          <div style={{
            width: signSize.width,
            height: signSize.height,
            position: 'relative',
            overflow: printOptions.bleed ? 'visible' : 'hidden'
          }}>
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
              <SafetySign {...signData} />
            </div>

            {extraElements.map(el => {
              const IconComp = el.type === 'icon' && el.iconName ? iconMap[el.iconName] : null;
              
              return (
                <div key={el.id} style={{
                  position: 'absolute',
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  zIndex: 1,
                  opacity: el.opacity !== undefined ? el.opacity : 1
                }}>
                  {el.type === 'image' && (
                    <img src={el.src} alt="print-element" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                  {el.type === 'icon' && IconComp && (
                    <IconComp style={{ width: '100%', height: '100%', color: el.color }} />
                  )}
                  {el.type === 'shape' && (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: el.backgroundColor || 'red',
                      borderRadius: el.shapeType === 'circle' ? '50%' : '0%'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export { CustomSignageEditor };
