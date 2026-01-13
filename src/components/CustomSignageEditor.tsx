import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, Type, Image as ImageIcon, Square, Circle, Download, Trash2, Bold, Italic, 
  AlignLeft, AlignCenter, AlignRight, ZoomIn, ZoomOut, Palette, Layers, X, FileDown,
  Printer, Copy, Undo, Redo, Lock, Unlock, Eye, EyeOff, Triangle, Star, Heart, Hexagon,
  Sparkles, Filter, FlipHorizontal, FlipVertical, Sun, Contrast, Droplet, Move,
  Plus, Minus, Settings, Wand2, ChevronDown, ChevronUp, Grid, Shapes, 
  Pencil, Brush, Eraser, PaintBucket, MousePointer, Save, FolderOpen, Crop,
  RotateCw, Command, Menu, Search, Activity, Zap, Flame, Skull, Shield,
  HardHat, Ban, AlertTriangle, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Hash, AtSign, DollarSign, CheckCircle, XCircle, Info, Maximize2, Minimize2,
  PanelLeftClose, PanelRightClose, PanelLeft, PanelRight, GripVertical,
  Sliders, Pipette, Blend, Magnet, Scissors, Link, Unlink, FileImage,
  Film, Music, Folder, ChevronRight, Play, Pause, SkipBack, SkipForward,
  Volume2, Layout, Database, Cpu, Code, Terminal, Gauge, Target, Flag,
  MapPin, Navigation, Crosshair, Focus, Scan, Maximize, Box, Package,
  Layers2, FolderTree, GitBranch, Binary, Workflow, Zap as Lightning
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

// Types
interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon' | 'line' | 'drawing' | 'sticker';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX?: number;
  scaleY?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  textDecoration?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  zIndex: number;
  locked?: boolean;
  visible?: boolean;
  blendMode?: string;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  filter?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    grayscale?: boolean;
    sepia?: boolean;
    hue?: number;
    invert?: boolean;
  };
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  textShadow?: string;
  textStroke?: string;
  lineHeight?: number;
  letterSpacing?: number;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  strokeDashArray?: string;
}

type Tool = 'select' | 'brush' | 'eraser' | 'text' | 'shape' | 'line' | 'fill' | 'eyedropper' | 'crop' | 'hand';
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

// Constants
const SAFETY_ICONS_LIBRARY = {
  hazards: [
    { emoji: '⚠️', name: 'Warning', keywords: ['warning', 'caution', 'alert'] },
    { emoji: '🔥', name: 'Fire', keywords: ['fire', 'flame', 'hot'] },
    { emoji: '⚡', name: 'Electrical', keywords: ['electric', 'shock', 'voltage'] },
    { emoji: '☣️', name: 'Biohazard', keywords: ['bio', 'toxic', 'hazard'] },
    { emoji: '☢️', name: 'Radiation', keywords: ['radiation', 'radioactive', 'nuclear'] },
    { emoji: '💀', name: 'Toxic', keywords: ['poison', 'toxic', 'deadly'] },
    { emoji: '💥', name: 'Explosive', keywords: ['explosive', 'blast', 'danger'] },
    { emoji: '🧪', name: 'Chemical', keywords: ['chemical', 'corrosive', 'acid'] },
    { emoji: '❄️', name: 'Cold', keywords: ['cold', 'freeze', 'ice'] },
    { emoji: '🔆', name: 'Hot Surface', keywords: ['hot', 'burn', 'heat'] },
  ],
  ppe: [
    { emoji: '🪖', name: 'Hard Hat', keywords: ['helmet', 'hard hat', 'head'] },
    { emoji: '🧤', name: 'Gloves', keywords: ['gloves', 'hands', 'protection'] },
    { emoji: '🥽', name: 'Goggles', keywords: ['goggles', 'eyes', 'safety glasses'] },
    { emoji: '😷', name: 'Mask', keywords: ['mask', 'respirator', 'face'] },
    { emoji: '🥾', name: 'Safety Boots', keywords: ['boots', 'shoes', 'feet'] },
    { emoji: '🦺', name: 'Safety Vest', keywords: ['vest', 'high visibility', 'reflective'] },
    { emoji: '🎧', name: 'Ear Protection', keywords: ['earplugs', 'hearing', 'noise'] },
    { emoji: '🪢', name: 'Safety Harness', keywords: ['harness', 'fall protection', 'safety line'] },
  ],
  prohibition: [
    { emoji: '🚫', name: 'No Entry', keywords: ['no entry', 'prohibited', 'restricted'] },
    { emoji: '⛔', name: 'Stop', keywords: ['stop', 'halt', 'danger'] },
    { emoji: '🚭', name: 'No Smoking', keywords: ['no smoking', 'smoke free'] },
    { emoji: '📵', name: 'No Phone', keywords: ['no phone', 'mobile free', 'silent'] },
    { emoji: '🔇', name: 'No Noise', keywords: ['quiet', 'silence', 'no noise'] },
  ],
  emergency: [
    { emoji: '🚪', name: 'Emergency Exit', keywords: ['exit', 'escape', 'door'] },
    { emoji: '🏥', name: 'First Aid', keywords: ['first aid', 'medical', 'health'] },
    { emoji: '👁️', name: 'Eye Wash', keywords: ['eye wash', 'emergency shower'] },
    { emoji: '🚿', name: 'Safety Shower', keywords: ['shower', 'wash', 'emergency'] },
    { emoji: '🧯', name: 'Fire Extinguisher', keywords: ['extinguisher', 'fire safety'] },
    { emoji: '🚨', name: 'Alarm', keywords: ['alarm', 'siren', 'alert'] },
    { emoji: '📞', name: 'Emergency Phone', keywords: ['phone', 'call', 'emergency'] },
    { emoji: '🚑', name: 'Ambulance', keywords: ['ambulance', 'medical', 'emergency'] },
  ],
  general: [
    { emoji: '⭐', name: 'Star', keywords: ['star', 'favorite', 'important'] },
    { emoji: '✅', name: 'Check', keywords: ['check', 'correct', 'done'] },
    { emoji: '❌', name: 'Cross', keywords: ['cross', 'wrong', 'cancel'] },
    { emoji: '❗', name: 'Exclamation', keywords: ['important', 'attention'] },
    { emoji: '❓', name: 'Question', keywords: ['question', 'help', 'info'] },
    { emoji: 'ℹ️', name: 'Info', keywords: ['information', 'details'] },
    { emoji: '➕', name: 'Plus', keywords: ['add', 'plus', 'more'] },
    { emoji: '➖', name: 'Minus', keywords: ['minus', 'subtract', 'less'] },
    { emoji: '⬆️', name: 'Arrow Up', keywords: ['up', 'arrow', 'direction'] },
    { emoji: '⬇️', name: 'Arrow Down', keywords: ['down', 'arrow', 'direction'] },
    { emoji: '⬅️', name: 'Arrow Left', keywords: ['left', 'arrow', 'direction'] },
    { emoji: '➡️', name: 'Arrow Right', keywords: ['right', 'arrow', 'direction'] },
    { emoji: '🎯', name: 'Target', keywords: ['target', 'goal', 'aim'] },
    { emoji: '🚩', name: 'Flag', keywords: ['flag', 'marker', 'point'] },
    { emoji: '📍', name: 'Location', keywords: ['location', 'pin', 'place'] },
    { emoji: '🔧', name: 'Wrench', keywords: ['wrench', 'tool', 'maintenance'] },
    { emoji: '🔨', name: 'Hammer', keywords: ['hammer', 'tool', 'construction'] },
    { emoji: '⚙️', name: 'Gear', keywords: ['gear', 'settings', 'mechanical'] },
    { emoji: '🔒', name: 'Lock', keywords: ['lock', 'secure', 'locked'] },
    { emoji: '🔓', name: 'Unlock', keywords: ['unlock', 'open', 'unlocked'] },
    { emoji: '💡', name: 'Bulb', keywords: ['idea', 'light', 'bulb'] },
    { emoji: '⚡', name: 'Lightning', keywords: ['lightning', 'fast', 'power'] },
  ]
};

const FONTS = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New',
  'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Arial Black',
  'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'sans-serif'
];

const CANVAS_PRESETS = [
  { name: 'A4 Portrait', width: 794, height: 1123, icon: '📄' },
  { name: 'A4 Landscape', width: 1123, height: 794, icon: '📄' },
  { name: 'A3 Portrait', width: 1123, height: 1587, icon: '📋' },
  { name: 'A3 Landscape', width: 1587, height: 1123, icon: '📋' },
  { name: 'Letter', width: 816, height: 1056, icon: '📝' },
  { name: 'Square 1:1', width: 1080, height: 1080, icon: '⬛' },
  { name: 'Instagram Post', width: 1080, height: 1080, icon: '📱' },
  { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱' },
  { name: 'Facebook Post', width: 1200, height: 630, icon: '💬' },
  { name: 'Twitter Post', width: 1200, height: 675, icon: '🐦' },
  { name: 'Banner', width: 1500, height: 500, icon: '🎌' },
  { name: 'Business Card', width: 400, height: 250, icon: '💳' },
];

const GRADIENTS = [
  { name: 'Sunset', colors: ['#FF6B6B', '#FFD93D', '#6BCF7F'] },
  { name: 'Ocean', colors: ['#4FACFE', '#00F2FE'] },
  { name: 'Purple Dream', colors: ['#C471F5', '#FA71CD'] },
  { name: 'Fire', colors: ['#FF416C', '#FF4B2B'] },
  { name: 'Mint', colors: ['#00B4DB', '#0083B0'] },
  { name: 'Rainbow', colors: ['#FF0080', '#FF8C00', '#40E0D0'] },
  { name: 'Rose Gold', colors: ['#F857A6', '#FF5858'] },
  { name: 'Northern Lights', colors: ['#00C9FF', '#92FE9D'] },
];

const BLEND_MODES: BlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten'];

export function CustomSignageEditor() {
  // Core State
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1080);
  const [canvasHeight, setCanvasHeight] = useState(1080);
  const [canvasBackground, setCanvasBackground] = useState('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // UI State
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeLeftTab, setActiveLeftTab] = useState<'templates' | 'elements' | 'uploads' | 'ai'>('elements');
  const [activeRightTab, setActiveRightTab] = useState<'layers' | 'properties' | 'adjustments'>('layers');
  
  // Tool State
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [fillColor, setFillColor] = useState('#3B82F6');
  const [strokeColor, setStrokeColor] = useState('#1E40AF');
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elementX: number; elementY: number } | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  
  // History
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Search
  const [iconSearch, setIconSearch] = useState('');
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

  // Save to history
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(elements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redo();
        } else if (e.key === 'c') {
          e.preventDefault();
          if (selectedElement) duplicateElement(selectedElement);
        } else if (e.key === 's') {
          e.preventDefault();
          toast.info('Auto-save enabled');
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement && e.target === document.body) {
          e.preventDefault();
          deleteElement(selectedElement);
        }
      }
      // Tool shortcuts
      if (e.target === document.body) {
        switch(e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 'b': setActiveTool('brush'); break;
          case 'e': setActiveTool('eraser'); break;
          case 't': setActiveTool('text'); break;
          case 'h': setActiveTool('hand'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, historyIndex, history]);

  // Element CRUD Operations
  const addElement = (element: CanvasElement) => {
    setElements([...elements, element]);
    setSelectedElement(element.id);
    saveToHistory();
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
    saveToHistory();
    toast.success('Element deleted');
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    const newElement = {
      ...JSON.parse(JSON.stringify(element)),
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length
    };
    addElement(newElement);
    toast.success('Element duplicated');
  };

  // Add specific elements
  const addText = () => {
    addElement({
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Double-click to edit',
      x: 100,
      y: 100,
      width: 300,
      height: 60,
      rotation: 0,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      opacity: 1,
      zIndex: elements.length,
      lineHeight: 1.2,
      letterSpacing: 0,
      visible: true,
      locked: false
    });
    toast.success('Text added');
  };

  const addShape = (shapeType: string) => {
    addElement({
      id: `shape-${Date.now()}`,
      type: 'shape',
      content: shapeType,
      x: canvasWidth / 2 - 75,
      y: canvasHeight / 2 - 75,
      width: 150,
      height: 150,
      rotation: 0,
      backgroundColor: fillColor,
      borderColor: strokeColor,
      borderWidth: strokeWidth,
      opacity: 1,
      zIndex: elements.length,
      visible: true,
      locked: false
    });
    toast.success(`${shapeType} added`);
  };

  const addIcon = (emoji: string, name: string) => {
    addElement({
      id: `icon-${Date.now()}`,
      type: 'icon',
      content: emoji,
      x: canvasWidth / 2 - 40,
      y: canvasHeight / 2 - 40,
      width: 80,
      height: 80,
      rotation: 0,
      fontSize: 64,
      opacity: 1,
      zIndex: elements.length,
      visible: true,
      locked: false,
      borderColor: '#3B82F6',
      borderWidth: 2
    });
    toast.success(`${name} added`);
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      addElement({
        id: `image-${Date.now()}`,
        type: 'image',
        content: event.target?.result as string,
        x: 100,
        y: 100,
        width: 300,
        height: 300,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length,
        filter: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          hue: 0,
          grayscale: false,
          sepia: false,
          invert: false
        },
        visible: true,
        locked: false,
        borderColor: '#3B82F6',
        borderWidth: 2
      });
      toast.success('Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  // Layer operations
  const moveLayer = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    switch (direction) {
      case 'top':
        updateElement(id, { zIndex: Math.max(...elements.map(el => el.zIndex)) + 1 });
        break;
      case 'bottom':
        updateElement(id, { zIndex: Math.min(...elements.map(el => el.zIndex)) - 1 });
        break;
      case 'up':
        updateElement(id, { zIndex: element.zIndex + 1 });
        break;
      case 'down':
        updateElement(id, { zIndex: element.zIndex - 1 });
        break;
    }
    saveToHistory();
  };

  // Alignment
  const alignElement = (id: string, alignment: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const updates: Partial<CanvasElement> = {};
    switch (alignment) {
      case 'left': updates.x = 0; break;
      case 'center': updates.x = (canvasWidth - element.width) / 2; break;
      case 'right': updates.x = canvasWidth - element.width; break;
      case 'top': updates.y = 0; break;
      case 'middle': updates.y = (canvasHeight - element.height) / 2; break;
      case 'bottom': updates.y = canvasHeight - element.height; break;
    }
    updateElement(id, updates);
    saveToHistory();
  };

  // Export functions
  const exportAsPDF = async () => {
    if (!canvasRef.current) return;
    try {
      toast.info('Generating PDF...');
      const canvas = await html2canvas(canvasRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      const pdf = new jsPDF({
        orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [canvasWidth * 0.264583, canvasHeight * 0.264583]
      });
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, canvasWidth * 0.264583, canvasHeight * 0.264583);
      pdf.save(`design-${Date.now()}.pdf`);
      toast.success('✅ PDF downloaded!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const exportAsPNG = async () => {
    if (!canvasRef.current) return;
    try {
      toast.info('Generating PNG...');
      const canvas = await html2canvas(canvasRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('✅ PNG downloaded!');
      }, 'image/png');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const exportAsJPG = async () => {
    if (!canvasRef.current) return;
    try {
      toast.info('Generating JPG...');
      const canvas = await html2canvas(canvasRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design-${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('✅ JPG downloaded!');
      }, 'image/jpeg', 0.95);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  // AI Features (Simulated)
  const aiRemoveBackground = () => {
    if (!selectedElement || elements.find(el => el.id === selectedElement)?.type !== 'image') {
      toast.error('Please select an image first');
      return;
    }
    toast.info('🤖 AI processing...');
    setTimeout(() => {
      updateElement(selectedElement, { backgroundColor: 'transparent' });
      saveToHistory();
      toast.success('✅ Background removed!');
    }, 2000);
  };

  const aiEnhanceImage = () => {
    if (!selectedElement || elements.find(el => el.id === selectedElement)?.type !== 'image') {
      toast.error('Please select an image first');
      return;
    }
    toast.info('🤖 AI enhancing...');
    setTimeout(() => {
      updateElement(selectedElement, {
        filter: { brightness: 110, contrast: 110, saturation: 105, blur: 0, hue: 0 }
      });
      saveToHistory();
      toast.success('✅ Image enhanced!');
    }, 2000);
  };

  const aiGenerateImage = (prompt: string) => {
    toast.info('🤖 AI generating image...');
    setTimeout(() => {
      // Simulated AI generation - in real app would call DALL-E/Stable Diffusion
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      addElement({
        id: `ai-generated-${Date.now()}`,
        type: 'shape',
        content: 'rectangle',
        x: 100,
        y: 100,
        width: 400,
        height: 400,
        rotation: 0,
        backgroundColor: color,
        opacity: 1,
        zIndex: elements.length,
        visible: true,
        locked: false
      });
      toast.success(`✅ AI generated: ${prompt}`);
    }, 3000);
  };

  const selected = elements.find(el => el.id === selectedElement);

  // Handle element dragging
  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    if (element.locked || activeTool !== 'select') return;
    
    // Don't start drag if clicking on resize handle
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    setSelectedElement(element.id);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scale = zoom / 100;
    const canvasX = (e.clientX - rect.left) / scale;
    const canvasY = (e.clientY - rect.top) / scale;
    
    setDragStart({
      x: canvasX,
      y: canvasY,
      elementX: element.x,
      elementY: element.y
    });
  };

  // Handle resize start
  const handleResizeMouseDown = (e: React.MouseEvent, elementId: string, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;
    
    setIsResizing(elementId);
    setResizeHandle(handle);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scale = zoom / 100;
    const canvasX = (e.clientX - rect.left) / scale;
    const canvasY = (e.clientY - rect.top) / scale;
    
    setResizeStart({
      x: canvasX,
      y: canvasY,
      width: element.width,
      height: element.height
    });
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      const canvasX = (e.clientX - rect.left) / scale;
      const canvasY = (e.clientY - rect.top) / scale;

      if (isDragging && dragStart && selectedElement) {
        const element = elements.find(el => el.id === selectedElement);
        if (!element || element.locked) return;
        
        const deltaX = canvasX - dragStart.x;
        const deltaY = canvasY - dragStart.y;
        
        const newX = Math.max(0, Math.min(canvasWidth - element.width, dragStart.elementX + deltaX));
        const newY = Math.max(0, Math.min(canvasHeight - element.height, dragStart.elementY + deltaY));
        
        updateElement(selectedElement, { x: newX, y: newY });
      } else if (isResizing && resizeStart && resizeHandle) {
        const element = elements.find(el => el.id === isResizing);
        if (!element || element.locked) return;
        
        const deltaX = canvasX - resizeStart.x;
        const deltaY = canvasY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = element.x;
        let newY = element.y;
        
        const minSize = 20;
        const maxWidth = canvasWidth - element.x;
        const maxHeight = canvasHeight - element.y;
        
        switch (resizeHandle) {
          case 'se': // Southeast (bottom-right)
            newWidth = Math.max(minSize, Math.min(maxWidth, resizeStart.width + deltaX));
            newHeight = Math.max(minSize, Math.min(maxHeight, resizeStart.height + deltaY));
            break;
          case 'sw': // Southwest (bottom-left)
            newWidth = Math.max(minSize, Math.min(element.x + resizeStart.width, resizeStart.width - deltaX));
            newHeight = Math.max(minSize, Math.min(maxHeight, resizeStart.height + deltaY));
            newX = Math.max(0, element.x + (resizeStart.width - newWidth));
            break;
          case 'ne': // Northeast (top-right)
            newWidth = Math.max(minSize, Math.min(maxWidth, resizeStart.width + deltaX));
            newHeight = Math.max(minSize, Math.min(element.y + resizeStart.height, resizeStart.height - deltaY));
            newY = Math.max(0, element.y + (resizeStart.height - newHeight));
            break;
          case 'nw': // Northwest (top-left)
            newWidth = Math.max(minSize, Math.min(element.x + resizeStart.width, resizeStart.width - deltaX));
            newHeight = Math.max(minSize, Math.min(element.y + resizeStart.height, resizeStart.height - deltaY));
            newX = Math.max(0, element.x + (resizeStart.width - newWidth));
            newY = Math.max(0, element.y + (resizeStart.height - newHeight));
            break;
        }
        
        // For icons, also update fontSize to match the new size
        const updates: Partial<CanvasElement> = { width: newWidth, height: newHeight, x: newX, y: newY };
        if (element.type === 'icon') {
          // Scale fontSize proportionally to the new size
          const sizeRatio = Math.min(newWidth, newHeight) / Math.min(resizeStart.width, resizeStart.height);
          const currentFontSize = element.fontSize || 64;
          updates.fontSize = Math.max(12, Math.min(200, currentFontSize * sizeRatio));
        }
        
        updateElement(isResizing, updates);
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        saveToHistory();
      }
      setIsDragging(false);
      setIsResizing(null);
      setResizeHandle(null);
      setDragStart(null);
      setResizeStart(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeHandle, selectedElement, elements, zoom, canvasWidth, canvasHeight, updateElement, saveToHistory]);

  // Filter icons based on search
  const getFilteredIcons = () => {
    if (!iconSearch) return SAFETY_ICONS_LIBRARY;
    
    const search = iconSearch.toLowerCase();
    const filtered: typeof SAFETY_ICONS_LIBRARY = {
      hazards: [], ppe: [], prohibition: [], emergency: [], general: []
    };
    
    Object.entries(SAFETY_ICONS_LIBRARY).forEach(([category, icons]) => {
      filtered[category as keyof typeof SAFETY_ICONS_LIBRARY] = icons.filter(icon =>
        icon.name.toLowerCase().includes(search) ||
        icon.keywords.some(k => k.includes(search))
      );
    });
    
    return filtered;
  };

  const filteredIcons = getFilteredIcons();

  // Render shape
  const renderShape = (element: CanvasElement) => {
    const style = {
      width: '100%',
      height: '100%',
      backgroundColor: element.backgroundColor,
      border: `${element.borderWidth}px solid ${element.borderColor}`,
      borderRadius: element.borderRadius ? `${element.borderRadius}px` : '0'
    };

    switch (element.content) {
      case 'circle':
        return <div style={{ ...style, borderRadius: '50%' }} />;
      case 'triangle':
        return (
          <div style={{ width: 0, height: 0, borderLeft: `${element.width / 2}px solid transparent`, borderRight: `${element.width / 2}px solid transparent`, borderBottom: `${element.height}px solid ${element.backgroundColor}` }} />
        );
      case 'star':
        return <div style={{ fontSize: element.width, lineHeight: '1' }}>⭐</div>;
      case 'heart':
        return <div style={{ fontSize: element.width, lineHeight: '1' }}>❤️</div>;
      case 'hexagon':
        return <div style={{ ...style, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />;
      default:
        return <div style={style} />;
    }
  };

  // Get filter CSS
  const getFilterCSS = (element: CanvasElement) => {
    if (!element.filter) return '';
    const f = element.filter;
    const filters = [];
    if (f.brightness !== 100) filters.push(`brightness(${f.brightness}%)`);
    if (f.contrast !== 100) filters.push(`contrast(${f.contrast}%)`);
    if (f.saturation !== 100) filters.push(`saturate(${f.saturation}%)`);
    if (f.blur) filters.push(`blur(${f.blur}px)`);
    if (f.hue) filters.push(`hue-rotate(${f.hue}deg)`);
    if (f.grayscale) filters.push('grayscale(100%)');
    if (f.sepia) filters.push('sepia(100%)');
    if (f.invert) filters.push('invert(100%)');
    return filters.join(' ');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Menu Bar - Photoshop Style */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ProDesign Studio</span>
          </div>
          
          {/* Menu Items */}
          <div className="flex items-center gap-1 text-sm">
            <button className="px-3 py-1.5 hover:bg-slate-700 rounded">File</button>
            <button className="px-3 py-1.5 hover:bg-slate-700 rounded">Edit</button>
            <button className="px-3 py-1.5 hover:bg-slate-700 rounded">View</button>
            <button className="px-3 py-1.5 hover:bg-slate-700 rounded">Layer</button>
            <button className="px-3 py-1.5 hover:bg-slate-700 rounded">Filter</button>
            <button className="px-3 py-1.5 hover:bg-slate-700 rounded">AI Tools</button>
          </div>
        </div>

        {/* Center - Canvas Info */}
        <div className="text-xs text-slate-400">
          {canvasWidth} × {canvasHeight}px | {zoom}%
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAIModal(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Tools
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tool Bar - Photoshop Style */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* History */}
          <div className="flex items-center gap-1 border-r border-slate-700 pr-4">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-slate-700 rounded disabled:opacity-30" title="Undo (Ctrl+Z)">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-slate-700 rounded disabled:opacity-30" title="Redo (Ctrl+Y)">
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1">
            {[
              { tool: 'select' as Tool, icon: MousePointer, label: 'Select (V)' },
              { tool: 'text' as Tool, icon: Type, label: 'Text (T)' },
              { tool: 'brush' as Tool, icon: Brush, label: 'Brush (B)' },
              { tool: 'eraser' as Tool, icon: Eraser, label: 'Eraser (E)' },
              { tool: 'fill' as Tool, icon: PaintBucket, label: 'Fill' },
              { tool: 'eyedropper' as Tool, icon: Pipette, label: 'Eyedropper' },
              { tool: 'crop' as Tool, icon: Crop, label: 'Crop' },
              { tool: 'hand' as Tool, icon: Move, label: 'Hand (H)' },
            ].map(({ tool, icon: Icon, label }) => (
              <button
                key={tool}
                onClick={() => setActiveTool(tool)}
                className={`p-2 rounded ${activeTool === tool ? 'bg-blue-600' : 'hover:bg-slate-700'}`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Color Pickers */}
          <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <div className="flex flex-col gap-1">
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-10 h-5 rounded cursor-pointer border border-slate-600"
                title="Fill Color"
              />
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-10 h-5 rounded cursor-pointer border border-slate-600"
                title="Stroke Color"
              />
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1.5 hover:bg-slate-700 rounded">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm w-14 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(400, zoom + 25))} className="p-1.5 hover:bg-slate-700 rounded">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(100)} className="text-xs px-2 py-1 hover:bg-slate-700 rounded">Fit</button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        {leftPanelOpen && (
          <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              {[
                { id: 'templates' as const, icon: Layout, label: 'Templates' },
                { id: 'elements' as const, icon: Shapes, label: 'Elements' },
                { id: 'uploads' as const, icon: Upload, label: 'Uploads' },
                { id: 'ai' as const, icon: Sparkles, label: 'AI' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveLeftTab(id)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs ${
                    activeLeftTab === id ? 'bg-slate-700 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeLeftTab === 'templates' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold mb-3">Canvas Presets</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {CANVAS_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setCanvasWidth(preset.width);
                          setCanvasHeight(preset.height);
                          toast.success(`${preset.name} applied`);
                        }}
                        className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left border border-slate-600 hover:border-blue-500 transition-all"
                      >
                        <div className="text-2xl mb-2">{preset.icon}</div>
                        <div className="text-xs font-medium">{preset.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{preset.width}×{preset.height}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeLeftTab === 'elements' && (
                <div className="space-y-6">
                  {/* Quick Add */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Basic Elements</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={addText} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        <span className="text-sm">Text</span>
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm">Image</span>
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={addImage} className="hidden" />
                    </div>
                  </div>

                  {/* Shapes */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Shapes</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {['rectangle', 'circle', 'triangle', 'star', 'heart', 'hexagon'].map((shape) => (
                        <button
                          key={shape}
                          onClick={() => addShape(shape)}
                          className="aspect-square bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center border border-slate-600 hover:border-blue-500"
                        >
                          {shape === 'rectangle' && <Square className="w-6 h-6" />}
                          {shape === 'circle' && <Circle className="w-6 h-6" />}
                          {shape === 'triangle' && <Triangle className="w-6 h-6" />}
                          {shape === 'star' && <Star className="w-6 h-6" />}
                          {shape === 'heart' && <Heart className="w-6 h-6" />}
                          {shape === 'hexagon' && <Hexagon className="w-6 h-6" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icons Library */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Safety Icons</h3>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          placeholder="Search..."
                          className="pl-8 pr-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm w-40 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    {Object.entries(filteredIcons).map(([category, icons]) => (
                      icons.length > 0 && (
                        <div key={category} className="mb-4">
                          <h4 className="text-xs text-slate-400 uppercase mb-2">{category}</h4>
                          <div className="grid grid-cols-6 gap-2">
                            {icons.map((icon) => (
                              <button
                                key={icon.name}
                                onClick={() => addIcon(icon.emoji, icon.name)}
                                className="aspect-square bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-2xl border border-slate-600 hover:border-blue-500"
                                title={icon.name}
                              >
                                {icon.emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Gradients */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Gradients</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {GRADIENTS.map((gradient) => (
                        <button
                          key={gradient.name}
                          onClick={() => {
                            setCanvasBackground(`linear-gradient(135deg, ${gradient.colors.join(', ')})`);
                            toast.success(`${gradient.name} gradient applied`);
                          }}
                          className="h-16 rounded-lg border-2 border-slate-600 hover:border-blue-500"
                          style={{ background: `linear-gradient(135deg, ${gradient.colors.join(', ')})` }}
                          title={gradient.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'uploads' && (
                <div 
                  className="text-center py-12 border-2 border-dashed border-slate-600 rounded-lg mx-4 hover:border-blue-500 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        addElement({
                          id: `image-${Date.now()}-${Math.random()}`,
                          type: 'image',
                          content: event.target?.result as string,
                          x: 100,
                          y: 100,
                          width: 300,
                          height: 300,
                          rotation: 0,
                          opacity: 1,
                          zIndex: elements.length,
                          filter: {
                            brightness: 100,
                            contrast: 100,
                            saturation: 100,
                            blur: 0,
                            hue: 0,
                            grayscale: false,
                            sepia: false,
                            invert: false
                          },
                          visible: true,
                          locked: false,
                          borderColor: '#3B82F6',
                          borderWidth: 2
                        });
                      };
                      reader.readAsDataURL(file);
                    });
                    if (files.length > 0) {
                      toast.success(`${files.length} image(s) uploaded`);
                    }
                  }}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400 mb-4">Drag & drop images here</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Browse Files
                  </button>
                </div>
              )}

              {activeLeftTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
                    <Sparkles className="w-8 h-8 text-purple-400 mb-2" />
                    <h3 className="text-sm font-semibold mb-2">AI-Powered Tools</h3>
                    <p className="text-xs text-slate-400 mb-4">Transform your designs with artificial intelligence</p>
                  </div>

                  <button
                    onClick={aiRemoveBackground}
                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left border border-slate-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Remove Background</div>
                        <div className="text-xs text-slate-400">AI-powered removal</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={aiEnhanceImage}
                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left border border-slate-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Enhance Image</div>
                        <div className="text-xs text-slate-400">Auto-improve quality</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const prompt = window.prompt('Describe what you want to generate:');
                      if (prompt) aiGenerateImage(prompt);
                    }}
                    className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left border border-slate-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Generate Image</div>
                        <div className="text-xs text-slate-400">Text to image AI</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 bg-white overflow-auto relative">
          <div className="min-h-full flex items-center justify-center p-12">
            <div
              ref={canvasRef}
              className="shadow-2xl relative"
              style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                background: canvasBackground.includes('gradient') ? canvasBackground : 'transparent',
                backgroundColor: canvasBackground.includes('gradient') ? 'transparent' : canvasBackground,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover'
              }}
            >
              {/* Grid overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              )}

              {/* Elements */}
              {elements
                .filter(el => el.visible !== false)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => {
                  const isSelected = selectedElement === element.id;
                  const isIconOrImage = element.type === 'icon' || element.type === 'image';
                  const isDraggableResizable = element.type === 'icon' || element.type === 'image' || element.type === 'text' || element.type === 'shape';
                  // Show border for icons/images when selected, or for shapes when they don't have their own border
                  const showBorder = (isIconOrImage && (isSelected || element.borderWidth)) || (element.type === 'shape' && isSelected && !element.borderWidth);
                  
                  return (
                    <div
                      key={element.id}
                      onClick={(e) => {
                        // Don't select if clicking on resize handle
                        if ((e.target as HTMLElement).closest('.resize-handle')) {
                          return;
                        }
                        setSelectedElement(element.id);
                      }}
                      onMouseDown={(e) => {
                        // Don't start drag if clicking on resize handle
                        if ((e.target as HTMLElement).closest('.resize-handle')) {
                          return;
                        }
                        // For text elements: allow editing on click, dragging on click-and-drag
                        if (element.type === 'text' && isDraggableResizable && activeTool === 'select') {
                          const target = e.target as HTMLElement;
                          // If clicking on the contentEditable div, handle specially
                          if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
                            // Track if user is dragging or just clicking
                            let startX = e.clientX;
                            let startY = e.clientY;
                            let isDraggingText = false;
                            
                            const handleMove = (moveEvent: MouseEvent) => {
                              const deltaX = Math.abs(moveEvent.clientX - startX);
                              const deltaY = Math.abs(moveEvent.clientY - startY);
                              // If mouse moved more than 5px, it's a drag
                              if (deltaX > 5 || deltaY > 5) {
                                isDraggingText = true;
                                // Cancel text selection
                                window.getSelection()?.removeAllRanges();
                                // Create a synthetic event for dragging
                                const syntheticEvent = {
                                  ...e,
                                  clientX: moveEvent.clientX,
                                  clientY: moveEvent.clientY,
                                  preventDefault: () => {},
                                  stopPropagation: () => {}
                                } as React.MouseEvent;
                                handleElementMouseDown(syntheticEvent, element);
                                document.removeEventListener('mousemove', handleMove);
                                document.removeEventListener('mouseup', handleUp);
                              }
                            };
                            
                            const handleUp = () => {
                              document.removeEventListener('mousemove', handleMove);
                              document.removeEventListener('mouseup', handleUp);
                            };
                            
                            document.addEventListener('mousemove', handleMove);
                            document.addEventListener('mouseup', handleUp);
                            return; // Don't start drag immediately - wait to see if it's a drag or click
                          }
                        }
                        // Start drag for draggable elements (including text when clicking on container)
                        if (isDraggableResizable && activeTool === 'select') {
                          handleElementMouseDown(e, element);
                        }
                      }}
                      className={`absolute ${isSelected && activeTool === 'select' && isDraggableResizable ? 'cursor-move' : 'cursor-pointer'} ${element.locked ? 'cursor-not-allowed' : ''}`}
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        transform: `rotate(${element.rotation}deg) scaleX(${element.flipHorizontal ? -1 : 1}) scaleY(${element.flipVertical ? -1 : 1})`,
                        opacity: element.opacity || 1,
                        zIndex: element.zIndex,
                        filter: getFilterCSS(element),
                        mixBlendMode: element.blendMode as any || 'normal',
                        border: showBorder 
                          ? `${element.borderWidth || 2}px solid ${element.borderColor || '#3B82F6'}` 
                          : (element.type === 'shape' && element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || '#000000'}` : 'none'),
                        boxSizing: 'border-box'
                      }}
                    >
                      {element.type === 'text' && (
                        <div
                          contentEditable={!element.locked}
                          suppressContentEditableWarning
                          onBlur={(e) => updateElement(element.id, { content: e.currentTarget.textContent || '' })}
                          onFocus={(e) => {
                            // When text is focused, ensure it's selected
                            setSelectedElement(element.id);
                          }}
                          onMouseDown={(e) => {
                            // Allow text editing - the parent will handle drag detection
                            // If user clicks and doesn't move, text editing happens
                            // If user clicks and drags, parent will handle the drag
                          }}
                          style={{
                            fontSize: `${element.fontSize}px`,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            fontStyle: element.fontStyle,
                            textAlign: element.textAlign as any,
                            textDecoration: element.textDecoration,
                            color: element.color,
                            width: '100%',
                            height: '100%',
                            outline: 'none',
                            lineHeight: element.lineHeight || 1.2,
                            letterSpacing: `${element.letterSpacing || 0}px`,
                            textShadow: element.textShadow,
                            WebkitTextStroke: element.textStroke,
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            pointerEvents: element.locked ? 'none' : 'auto',
                            minHeight: '100%',
                            userSelect: 'text',
                            cursor: 'text'
                          }}
                        >
                          {element.content || '\u00A0'}
                        </div>
                      )}
                      
                      {element.type === 'image' && (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                          backgroundColor: 'transparent'
                        }}>
                          <img 
                            src={element.content} 
                            alt="" 
                            draggable={false} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain', 
                              pointerEvents: 'none',
                              display: 'block'
                            }} 
                          />
                        </div>
                      )}
                      
                      {element.type === 'shape' && renderShape(element)}
                      
                      {element.type === 'icon' && (
                        <div 
                          style={{ 
                            fontSize: element.fontSize || 64, 
                            lineHeight: '1', 
                            textAlign: 'center', 
                            userSelect: 'none',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none'
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                      
                      {/* Resize handles for icons, images, and text when selected */}
                      {isSelected && isDraggableResizable && !element.locked && activeTool === 'select' && (
                        <>
                          {/* Selection border/outline */}
                          <div
                            className="absolute inset-0 pointer-events-none z-40"
                            style={{
                              border: '2px dashed #3B82F6',
                              boxSizing: 'border-box'
                            }}
                          />
                          {/* Corner handles */}
                          <div
                            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nwse-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeMouseDown(e, element.id, 'nw');
                            }}
                            style={{ transform: 'translate(0, 0)' }}
                          />
                          <div
                            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nesw-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeMouseDown(e, element.id, 'ne');
                            }}
                            style={{ transform: 'translate(0, 0)' }}
                          />
                          <div
                            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nesw-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeMouseDown(e, element.id, 'sw');
                            }}
                            style={{ transform: 'translate(0, 0)' }}
                          />
                          <div
                            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nwse-resize z-50"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeMouseDown(e, element.id, 'se');
                            }}
                            style={{ transform: 'translate(0, 0)' }}
                          />
                        </>
                      )}
                    </div>
                  );
                })}

              {/* Empty state */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-slate-600">
                    <Wand2 className="w-20 h-20 mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-semibold">Start Creating</p>
                    <p className="text-sm mt-2">Add elements from the left panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {rightPanelOpen && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              {[
                { id: 'layers' as const, icon: Layers, label: 'Layers' },
                { id: 'properties' as const, icon: Settings, label: 'Properties' },
                { id: 'adjustments' as const, icon: Sliders, label: 'Adjust' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveRightTab(id)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs ${
                    activeRightTab === id ? 'bg-slate-700 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeRightTab === 'layers' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Layers ({elements.length})</h3>
                    <button onClick={() => {
                      setElements([]);
                      saveToHistory();
                    }} className="text-xs text-red-400 hover:text-red-300">
                      Clear All
                    </button>
                  </div>
                  
                  {elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        onClick={() => setSelectedElement(element.id)}
                        className={`p-3 rounded-lg cursor-pointer ${
                          selectedElement === element.id ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                        } border ${selectedElement === element.id ? 'border-blue-400' : 'border-slate-600'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {element.type === 'text' && <Type className="w-4 h-4" />}
                            {element.type === 'image' && <ImageIcon className="w-4 h-4" />}
                            {element.type === 'shape' && <Square className="w-4 h-4" />}
                            {element.type === 'icon' && <Star className="w-4 h-4" />}
                            <span className="text-xs truncate max-w-[120px]">
                              {element.type === 'text' ? element.content.slice(0, 15) : element.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateElement(element.id, { visible: !element.visible });
                              }}
                              className="p-1 hover:bg-slate-500 rounded"
                            >
                              {element.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateElement(element.id, { locked: !element.locked });
                              }}
                              className="p-1 hover:bg-slate-500 rounded"
                            >
                              {element.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => moveLayer(element.id, 'top')} className="flex-1 text-xs py-1 bg-slate-600 hover:bg-slate-500 rounded">Top</button>
                          <button onClick={() => moveLayer(element.id, 'up')} className="flex-1 text-xs py-1 bg-slate-600 hover:bg-slate-500 rounded">Up</button>
                          <button onClick={() => moveLayer(element.id, 'down')} className="flex-1 text-xs py-1 bg-slate-600 hover:bg-slate-500 rounded">Down</button>
                          <button onClick={() => moveLayer(element.id, 'bottom')} className="flex-1 text-xs py-1 bg-slate-600 hover:bg-slate-500 rounded">Bot</button>
                        </div>
                      </div>
                    ))}
                  
                  {elements.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Layers className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No layers yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeRightTab === 'properties' && selected && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button onClick={() => duplicateElement(selected.id)} className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center justify-center gap-2">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button onClick={() => deleteElement(selected.id)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">X</label>
                      <input
                        type="number"
                        value={Math.round(selected.x)}
                        onChange={(e) => updateElement(selected.id, { x: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Y</label>
                      <input
                        type="number"
                        value={Math.round(selected.y)}
                        onChange={(e) => updateElement(selected.id, { y: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Width</label>
                      <input
                        type="number"
                        value={Math.round(selected.width)}
                        onChange={(e) => updateElement(selected.id, { width: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Height</label>
                      <input
                        type="number"
                        value={Math.round(selected.height)}
                        onChange={(e) => updateElement(selected.id, { height: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Rotation: {selected.rotation}°</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selected.rotation}
                      onChange={(e) => updateElement(selected.id, { rotation: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Opacity: {Math.round((selected.opacity || 1) * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selected.opacity || 1}
                      onChange={(e) => updateElement(selected.id, { opacity: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {selected.type === 'text' && (
                    <>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Font</label>
                        <select
                          value={selected.fontFamily}
                          onChange={(e) => updateElement(selected.id, { fontFamily: e.target.value })}
                          className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm"
                        >
                          {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Size: {selected.fontSize}px</label>
                        <input
                          type="range"
                          min="8"
                          max="200"
                          value={selected.fontSize}
                          onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Color</label>
                        <input
                          type="color"
                          value={selected.color}
                          onChange={(e) => updateElement(selected.id, { color: e.target.value })}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateElement(selected.id, { fontWeight: selected.fontWeight === 'bold' ? 'normal' : 'bold' })}
                          className={`flex-1 p-2 rounded ${selected.fontWeight === 'bold' ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                          <Bold className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => updateElement(selected.id, { fontStyle: selected.fontStyle === 'italic' ? 'normal' : 'italic' })}
                          className={`flex-1 p-2 rounded ${selected.fontStyle === 'italic' ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                          <Italic className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </>
                  )}

                  {selected.type === 'shape' && (
                    <>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Fill</label>
                        <input
                          type="color"
                          value={selected.backgroundColor}
                          onChange={(e) => updateElement(selected.id, { backgroundColor: e.target.value })}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Stroke</label>
                        <input
                          type="color"
                          value={selected.borderColor}
                          onChange={(e) => updateElement(selected.id, { borderColor: e.target.value })}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Stroke Width: {selected.borderWidth}px</label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={selected.borderWidth}
                          onChange={(e) => updateElement(selected.id, { borderWidth: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-xs text-slate-400 mb-2">Alignment</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {['left', 'center', 'right', 'top', 'middle', 'bottom'].map(align => (
                        <button
                          key={align}
                          onClick={() => alignElement(selected.id, align)}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs capitalize"
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeRightTab === 'adjustments' && selected && selected.type === 'image' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold mb-3">Image Adjustments</h3>
                  
                  {['brightness', 'contrast', 'saturation'].map(filter => (
                    <div key={filter}>
                      <label className="text-xs text-slate-400 mb-1 block capitalize">
                        {filter}: {selected.filter?.[filter as keyof typeof selected.filter] || 100}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={selected.filter?.[filter as keyof typeof selected.filter] || 100}
                        onChange={(e) => updateElement(selected.id, {
                          filter: { ...selected.filter, [filter]: Number(e.target.value) }
                        })}
                        className="w-full"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Blur: {selected.filter?.blur || 0}px</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={selected.filter?.blur || 0}
                      onChange={(e) => updateElement(selected.id, {
                        filter: { ...selected.filter, blur: Number(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    {['grayscale', 'sepia', 'invert'].map(effect => (
                      <label key={effect} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.filter?.[effect as keyof typeof selected.filter] || false}
                          onChange={(e) => updateElement(selected.id, {
                            filter: { ...selected.filter, [effect]: e.target.checked }
                          })}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{effect}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => updateElement(selected.id, {
                      filter: { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, grayscale: false, sepia: false, invert: false }
                    })}
                    className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {!selected && activeRightTab !== 'layers' && (
                <div className="text-center py-12 text-slate-500">
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Select an element</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Export Design</h3>
              <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { fn: exportAsPDF, icon: FileDown, title: 'PDF Document', desc: 'Best for printing', color: 'red' },
                { fn: exportAsPNG, icon: Download, title: 'PNG Image', desc: 'Transparent background', color: 'blue' },
                { fn: exportAsJPG, icon: ImageIcon, title: 'JPG Image', desc: 'Smaller file size', color: 'green' },
                { fn: () => window.print(), icon: Printer, title: 'Print', desc: 'Direct print', color: 'gray' },
              ].map(({ fn, icon: Icon, title, desc, color }) => (
                <button
                  key={title}
                  onClick={() => { fn(); setShowExportModal(false); }}
                  className={`w-full px-6 py-4 bg-${color}-600 hover:bg-${color}-700 rounded-xl flex items-center gap-4 group transition-all border border-${color}-500`}
                >
                  <div className={`w-14 h-14 bg-${color}-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold">{title}</div>
                    <div className="text-sm text-slate-300">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
