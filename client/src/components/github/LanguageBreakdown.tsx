import React from 'react';
import { Code2, PieChart } from 'lucide-react';
import { GitHubLanguageBreakdown } from '../../types';

interface LanguageBreakdownProps {
  data: GitHubLanguageBreakdown;
}

export const LanguageBreakdown: React.FC<LanguageBreakdownProps> = ({ data }) => {
  if (!data || !data.languages || data.languages.length === 0) return null;

  return (
    <div className="bg-dark-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white">Top Languages Used</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Calculated directly from public repositories
        </span>
      </div>

      {/* Multi-Segment Color Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-dark-950 border border-slate-800 p-0.5">
        {data.languages.map((lang, idx) => (
          <div
            key={idx}
            style={{
              width: `${Math.max(lang.percentage, 2)}%`,
              backgroundColor: lang.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Language Breakdown Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        {data.languages.map((lang, idx) => (
          <div
            key={idx}
            className="bg-dark-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="font-semibold text-xs text-slate-200">{lang.name}</span>
            </div>
            <p className="text-sm font-bold font-mono text-white pl-4.5">
              {lang.percentage}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
