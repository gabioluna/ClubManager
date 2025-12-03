
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, X, ChevronDown, Check } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive', isLoading?: boolean }> = ({ 
  children, variant = 'primary', className = '', isLoading, ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-5 py-3 text-base font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
    <input 
      className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0 transition-all ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
    <select 
      className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-0 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

// --- New Components ---

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="peer h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 transition-all cursor-pointer"
        {...props}
      />
    </div>
    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-semibold">{label}</span>
  </label>
);

export const RadioGroup: React.FC<{ 
  label?: string, 
  name: string, 
  options: { label: string, value: string }[], 
  defaultValue?: string 
}> = ({ label, name, options, defaultValue }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
             <input 
               type="radio" 
               name={name} 
               value={opt.value} 
               defaultChecked={defaultValue === opt.value}
               className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
             />
             <span className="text-sm text-gray-600 group-hover:text-gray-900 font-semibold">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const MultiSelect: React.FC<{ 
  label?: string, 
  options: string[], 
  selected: string[], 
  onChange: (selected: string[]) => void 
}> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      
      <div className="relative">
        <div 
          className="w-full min-h-[46px] rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus-within:border-gray-400 focus-within:ring-0 transition-all cursor-pointer flex flex-wrap gap-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 && <span className="text-gray-400 px-2">Seleccionar deportes...</span>}
          
          {selected.map(item => (
            <span key={item} className="inline-flex items-center bg-gray-100 text-gray-800 rounded px-2 py-1 text-xs font-semibold">
              {item}
              <span 
                className="ml-1 cursor-pointer hover:text-gray-900" 
                onClick={(e) => { e.stopPropagation(); toggleOption(item); }}
              >
                <X size={12} />
              </span>
            </span>
          ))}
          
          <div className="ml-auto px-2 text-gray-400">
             <ChevronDown size={16} />
          </div>
        </div>

        {isOpen && (
           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
             {options.map(option => {
               const isSelected = selected.includes(option);
               return (
                 <div 
                    key={option} 
                    className={`px-4 py-2 cursor-pointer flex items-center justify-between text-sm hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-600'}`}
                    onClick={() => toggleOption(option)}
                 >
                    {option}
                    {isSelected && <Check size={14} className="text-gray-900"/>}
                 </div>
               );
             })}
           </div>
        )}
      </div>
    </div>
  );
};

export const Tooltip: React.FC<{ children: React.ReactNode, text: string, show: boolean }> = ({ children, text, show }) => {
  if (!show) return <>{children}</>;
  
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {text}
      </div>
    </div>
  );
};

// --- End New Components ---

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  // Removed hardcoded bg-white to allow overrides via className
  <div className={`rounded-xl border border-gray-200 shadow-sm p-6 ${className.includes('bg-') ? '' : 'bg-white'} ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: 'green' | 'blue' | 'gray' | 'red' | 'yellow' | 'black' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    black: "bg-gray-900 text-white border-gray-800"
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SideSheet: React.FC<SideSheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-normal text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};
