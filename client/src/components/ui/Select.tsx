import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            style={{
              colorScheme: 'dark',
              backgroundColor: '#090d16',
              color: '#f8fafc',
            }}
            className={`w-full appearance-none bg-[#090d16] text-white font-medium border rounded-xl pl-4 pr-10 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 disabled:opacity-50 cursor-pointer ${
              error ? 'border-red-500/80 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-700 hover:border-slate-600'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{
                  backgroundColor: '#090d16',
                  color: '#f8fafc',
                  padding: '8px 12px',
                }}
                className="bg-dark-950 text-white py-2 font-medium"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
