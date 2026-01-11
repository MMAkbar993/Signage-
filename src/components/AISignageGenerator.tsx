import React from 'react';
import { useState } from 'react';
import { Sparkles, Wand2, Image as ImageIcon, Type, Palette, Layout, Zap, ChevronRight, Upload } from 'lucide-react';
import { SignageData } from '../types/signage';

interface AISignageGeneratorProps {
  onGenerate: (config: Partial<SignageData>) => void;
  onClose: () => void;
}

export function AISignageGenerator({ onGenerate, onClose }: AISignageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('english');
  const [includeImage, setIncludeImage] = useState(true);
  const [autoLayout, setAutoLayout] = useState(true);
  const [generating, setGenerating] = useState(false);

  const examplePrompts = [
    'Create a warning sign for high voltage with Arabic text',
    'Make a mandatory PPE sign for construction site',
    'Design a chemical hazard danger sign',
    'Create an emergency exit sign with Urdu translation',
    'Make a confined space entry warning sign',
    'Design a no smoking prohibition sign',
    'Create a fire assembly point emergency sign'
  ];

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'arabic', name: 'Arabic (عربي)', flag: '🇸🇦' },
    { code: 'urdu', name: 'Urdu (اردو)', flag: '🇵🇰' },
    { code: 'hindi', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'bengali', name: 'Bengali (বাংলা)', flag: '🇧🇩' },
    { code: 'tagalog', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'tamil', name: 'Tamil (தமிழ்)', flag: '🇮🇳' }
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setGenerating(true);
    
    // Simulate AI generation with actual signage data
    setTimeout(() => {
      // Parse the prompt to determine signage type and content
      const promptLower = prompt.toLowerCase();
      
      let category: any = 'warning';
      let title = '';
      let hazards: string[] = [];
      let procedures: string[] = [];
      let ppe: any[] = [];
      
      // Detect category from prompt
      if (promptLower.includes('danger') || promptLower.includes('hazard')) {
        category = 'danger';
      } else if (promptLower.includes('warning') || promptLower.includes('caution')) {
        category = 'warning';
      } else if (promptLower.includes('mandatory') || promptLower.includes('must') || promptLower.includes('required')) {
        category = 'mandatory';
      } else if (promptLower.includes('no ') || promptLower.includes('prohibited') || promptLower.includes('not allowed')) {
        category = 'prohibition';
      } else if (promptLower.includes('emergency') || promptLower.includes('exit') || promptLower.includes('fire')) {
        category = 'emergency';
      }
      
      // Generate title based on prompt
      if (promptLower.includes('high voltage') || promptLower.includes('electrical')) {
        title = 'HIGH VOLTAGE AREA';
        hazards = ['High voltage electrical equipment', 'Electrocution hazard', 'Arc flash danger'];
        procedures = ['De-energize equipment before work', 'Use lockout/tagout procedures', 'Maintain safe distance', 'Only authorized electricians'];
        ppe = ['safety-glasses', 'gloves', 'hardhat', 'safety-boots'];
      } else if (promptLower.includes('ppe') || promptLower.includes('construction')) {
        title = 'PPE REQUIRED AREA';
        category = 'mandatory';
        hazards = ['Falling objects', 'Sharp materials', 'Heavy equipment operation'];
        procedures = ['Wear all required PPE', 'Inspect equipment before use', 'Report unsafe conditions'];
        ppe = ['hardhat', 'safety-glasses', 'gloves', 'safety-boots', 'high-visibility'];
      } else if (promptLower.includes('chemical')) {
        title = 'CHEMICAL HAZARD AREA';
        category = 'danger';
        hazards = ['Corrosive chemicals', 'Toxic fumes', 'Skin/eye irritation'];
        procedures = ['Wear appropriate PPE', 'Use fume hood when required', 'Know location of safety shower', 'Report all spills immediately'];
        ppe = ['safety-glasses', 'gloves', 'respirator', 'face-shield', 'apron'];
      } else if (promptLower.includes('confined space')) {
        title = 'CONFINED SPACE ENTRY';
        category = 'danger';
        hazards = ['Oxygen deficiency', 'Toxic atmosphere', 'Engulfment hazard'];
        procedures = ['Obtain entry permit', 'Test atmosphere before entry', 'Use continuous monitoring', 'Maintain communication with attendant'];
        ppe = ['respirator', 'harness', 'hardhat', 'safety-boots'];
      } else if (promptLower.includes('no smoking') || promptLower.includes('smoking')) {
        title = 'NO SMOKING';
        category = 'prohibition';
        hazards = ['Fire hazard', 'Explosion risk', 'Flammable materials present'];
        procedures = ['Use designated smoking areas only', 'Dispose cigarettes properly', 'Report violations'];
        ppe = [];
      } else if (promptLower.includes('emergency exit') || promptLower.includes('exit')) {
        title = 'EMERGENCY EXIT';
        category = 'emergency';
        hazards = [];
        procedures = ['Keep exit clear at all times', 'Do not block door', 'Use in emergency only', 'Know evacuation route'];
        ppe = [];
      } else if (promptLower.includes('fire') && promptLower.includes('assembly')) {
        title = 'FIRE ASSEMBLY POINT';
        category = 'emergency';
        hazards = [];
        procedures = ['Gather here during fire drill', 'Do not re-enter building', 'Wait for all-clear signal', 'Report to supervisor'];
        ppe = [];
      } else {
        // Default generation
        title = 'SAFETY AREA';
        hazards = ['Follow all safety procedures', 'Be aware of surroundings'];
        procedures = ['Read all safety signs', 'Use proper equipment', 'Report hazards immediately'];
        ppe = ['hardhat', 'safety-glasses'];
      }
      
      const generatedData: Partial<SignageData> = {
        title,
        category,
        purpose: `AI Generated: ${prompt}`,
        description: `This signage was automatically generated based on your prompt.`,
        hazards,
        procedures,
        ppe,
        location: 'To be specified',
        permitRequired: category === 'danger' ? 'yes' : 'no',
        permitDetails: category === 'danger' ? 'Work permit required for entry' : '',
      };
      
      onGenerate(generatedData);
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-slate-900 mb-1">AI Signage Generator</h1>
                <p className="text-slate-600">
                  Describe your signage and let AI create it for you
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg">
              <label className="block text-slate-900 mb-3 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                Describe Your Signage
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a warning sign for high voltage area with picture and Arabic text"
                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {prompt.length} / 500 characters
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt || generating}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Signage
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Example Prompts
              </h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 group-hover:text-purple-700">
                        {example}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-900 mb-4">Advanced Options</h3>
              <div className="space-y-4">
                {/* Auto Layout */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-slate-900 text-sm">Auto Layout</div>
                      <div className="text-xs text-slate-500">AI optimizes layout automatically</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLayout}
                      onChange={(e) => setAutoLayout(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Include Image */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-slate-900 text-sm">Include Image/Icon</div>
                      <div className="text-xs text-slate-500">Add relevant safety icons</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeImage}
                      onChange={(e) => setIncludeImage(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Auto Contrast */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-slate-900 text-sm">Auto Contrast Adjustment</div>
                      <div className="text-xs text-slate-500">Optimize for readability</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Auto Text Resizing */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-slate-900 text-sm">Auto Text Resizing</div>
                      <div className="text-xs text-slate-500">Fit text to available space</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* How it Works */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">How AI Generation Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Type className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-slate-900 mb-1">1. Describe</div>
              <div className="text-xs text-slate-500">Tell AI what you need</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-sm text-slate-900 mb-1">2. AI Analyzes</div>
              <div className="text-xs text-slate-500">Understands requirements</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Layout className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm text-slate-900 mb-1">3. Auto-Design</div>
              <div className="text-xs text-slate-500">Generates layout & content</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm text-slate-900 mb-1">4. Export</div>
              <div className="text-xs text-slate-500">Download ready signage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}