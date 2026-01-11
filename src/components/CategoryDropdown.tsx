import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { SignageCategory } from '../types/signage';

interface CategoryOption {
  value: SignageCategory;
  label: string;
  color: string;
}

interface CategoryDropdownProps {
  value: SignageCategory;
  options: CategoryOption[];
  onChange: (value: SignageCategory, color: string) => void;
}

export function CategoryDropdown({ value, options, onChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: CategoryOption) => {
    onChange(option.value, option.color);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer text-left flex items-center justify-between hover:border-slate-400 transition-all"
      >
        <div className="flex items-center gap-3">
          {/* Color indicator */}
          <div 
            className="w-6 h-6 rounded border-2 border-white shadow-md flex-shrink-0"
            style={{ backgroundColor: selectedOption?.color }}
          />
          <span className="text-slate-900">{selectedOption?.label}</span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {/* Color indicator with larger size in dropdown */}
                <div 
                  className="w-8 h-8 rounded border-2 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: option.color }}
                />
                
                {/* Label */}
                <span className={`flex-1 text-left ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-900'}`}>
                  {option.label}
                </span>

                {/* Check icon for selected */}
                {isSelected && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
