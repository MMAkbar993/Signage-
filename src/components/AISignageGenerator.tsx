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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Signage Generator
                </h1>
                <p className="text-slate-600 text-base lg:text-lg">
                  Describe your signage and let AI create professional safety signs for you
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-purple-300 transition-all shadow-sm font-medium text-slate-700"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Input Area - Takes more space */}
          <div className="lg:col-span-8 space-y-6">
            {/* Prompt Input */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-xl shadow-purple-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-900">
                    Describe Your Signage
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Be specific about the type, language, and requirements
                  </p>
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a warning sign for high voltage area with picture and Arabic text"
                className="w-full h-40 px-5 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-slate-700 placeholder-slate-400 transition-all"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${prompt.length > 450 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {prompt.length} / 500 characters
                  </span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt || generating}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 font-semibold text-base"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Signage</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 lg:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Example Prompts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-left px-5 py-4 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-purple-50 hover:to-indigo-50 border-2 border-slate-200 hover:border-purple-300 rounded-xl transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700 pr-2">
                        {example}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar - Settings & Options */}
          <div className="lg:col-span-4 space-y-6">
            {/* Language Selection */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Language</h3>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-700 font-medium"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>



            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Be specific about the hazard or requirement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Mention the language if you need translations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Include location or area details for context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <span>Specify if you need icons or images</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-12 bg-white rounded-2xl border-2 border-slate-200 p-8 lg:p-10 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">How AI Generation Works</h3>
            <p className="text-slate-600">Simple, fast, and intelligent signage creation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Type className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2">1. Describe</div>
              <div className="text-sm text-slate-600">Tell AI what you need in plain language</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2">2. AI Analyzes</div>
              <div className="text-sm text-slate-600">AI understands your requirements</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2">3. Auto-Design</div>
              <div className="text-sm text-slate-600">Generates professional layout & content</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2">4. Export</div>
              <div className="text-sm text-slate-600">Download ready-to-print signage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}