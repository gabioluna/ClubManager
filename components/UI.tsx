import React from 'react';
import { Loader2, X } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive', isLoading?: boolean }> = ({ 
  children, variant = 'primary', className = '', isLoading, ...props 
}) => {
  // Changed font-bold (700) to font-semibold (600)
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
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0 transition-all ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select 
      className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none focus:ring-0 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

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
    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
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
          <h2 className="text-2xl font-light text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};