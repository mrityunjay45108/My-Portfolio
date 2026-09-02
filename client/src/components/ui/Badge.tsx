import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'cyan' | 'emerald' | 'purple' | 'amber' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
  }[size];

  const variantStyles = {
    brand: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  }[variant];

  return (
    <span className={`inline-flex items-center rounded-lg font-mono tracking-tight ${sizeStyles} ${variantStyles} ${className}`}>
      {icon}
      {children}
    </span>
  );
};
