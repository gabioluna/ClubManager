import React, { useState, useRef, useEffect } from 'react';
import { Loader2, X, ChevronDown, Check } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive', isLoading?: boolean }> = ({ 
  children, variant = 'primary', className = '', isLoading, ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  const variants = {
    primary: "bg-[#1B3530] text-[#C7F269] hover:bg-[#112320] shadow-md hover:shadow-lg",
    secondary: "bg-white text-[#1B3530] border border-gray-200 hover:bg-[#F8F8F8] hover:border-gray-300 shadow-sm",
    ghost: "text-[#1B3530] hover:bg-[#F8F8F8]",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ElementType }> = ({ label, icon: Icon, className = '', ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-base font-medium text-[#112320]">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon size={18} />
        </div>
      )}
      <input 
        className={`w-full rounded-2xl border border-gray-200 bg-white py-3 text-base placeholder:text-gray-400 focus:border-[#1B3530] focus:outline-none focus:ring-1 focus:ring-[#1B3530] transition-all ${Icon ? 'pl-11 pr-4' : 'px-4'} ${className}`}
        {...props}
      />
    </div>
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-base font-medium text-[#112320]">{label}</label>}
    <div className="relative">
        <select 
        className={`w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#1B3530] focus:outline-none focus:ring-1 focus:ring-[#1B3530] transition-all appearance-none ${className}`}
        {...props}
        >
        {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
        </div>
    </div>
  </div>
);

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="peer h-5 w-5 rounded border-gray-300 text-[#1B3530] focus:ring-[#1B3530] focus:ring-offset-0 transition-all cursor-pointer accent-[#1B3530]"
        {...props}
      />
    </div>
    <span className="text-base text-[#112320] group-hover:text-black transition-colors font-medium">{label}</span>
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
      {label && <label className="text-base font-medium text-[#112320]">{label}</label>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
             <input 
               type="radio" 
               name={name} 
               value={opt.value} 
               defaultChecked={defaultValue === opt.value}
               className="h-4 w-4 border-gray-300 text-[#1B3530] focus:ring-[#1B3530] cursor-pointer accent-[#1B3530]"
             />
             <span className="text-base text-gray-600 group-hover:text-[#112320] font-medium">{opt.label}</span>
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
      {label && <label className="text-base font-medium text-[#112320]">{label}</label>}
      
      <div className="relative">
        <div 
          className="w-full min-h-[46px] rounded-2xl border border-gray-200 bg-white px-3 py-3 text-base focus-within:border-[#1B3530] focus-within:ring-1 focus-within:ring-[#1B3530] transition-all cursor-pointer flex flex-wrap gap-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 && <span className="text-gray-400 px-1">Seleccionar...</span>}
          
          {selected.map(item => (
            <span key={item} className="inline-flex items-center bg-[#C7F269]/30 text-[#1B3530] rounded-lg px-2 py-1 text-sm font-semibold">
              {item}
              <span 
                className="ml-1 cursor-pointer hover:text-black" 
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
           <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl max-h-60 overflow-y-auto z-50">
             {options.map(option => {
               const isSelected = selected.includes(option);
               return (
                 <div 
                    key={option} 
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between text-base hover:bg-[#F8F8F8] transition-colors ${isSelected ? 'bg-[#F8F8F8] font-semibold text-[#1B3530]' : 'text-gray-600'}`}
                    onClick={() => toggleOption(option)}
                 >
                    {option}
                    {isSelected && <Check size={14} className="text-[#1B3530]"/>}
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
      <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1B3530] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
        {text}
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  const paddingClass = className.includes('p-') || className.includes('px-') || className.includes('py-') ? '' : 'p-6';
  return (
    <div className={`rounded-3xl border border-gray-200 ${paddingClass} ${className.includes('bg-') ? '' : 'bg-white'} ${className} shadow-sm`}>
      {children}
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, color?: 'green' | 'blue' | 'gray' | 'red' | 'yellow' | 'black' | 'lime' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    black: "bg-[#1B3530] text-white border-[#112320]",
    lime: "bg-[#C7F269] text-[#1B3530] border-[#C7F269]"
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${colors[color]}`}>
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
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div 
        className="fixed inset-0 bg-[#112320]/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-lg h-full bg-white p-8 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#112320]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#1B3530] transition-colors p-2 hover:bg-[#F8F8F8] rounded-full">
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div 
        className="fixed inset-0 bg-[#112320]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#112320]">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-[#1B3530] transition-colors p-1 hover:bg-[#F8F8F8] rounded-full">
               <X size={20} />
            </button>
         </div>
         <div>
            {children}
         </div>
      </div>
    </div>
  );
};