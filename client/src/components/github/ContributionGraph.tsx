import React, { useState } from 'react';
import { Flame, Trophy, Calendar, Sparkles } from 'lucide-react';
import { GitHubContributionData, GitHubContributionDay } from '../../types';

interface ContributionGraphProps {
  data: GitHubContributionData;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ContributionGraph: React.FC<ContributionGraphProps> = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState<GitHubContributionDay | null>(null);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-emerald-400 border-emerald-300 shadow-xs shadow-emerald-500/50';
      case 3:
        return 'bg-emerald-500/80 border-emerald-500';
      case 2:
        return 'bg-emerald-600/60 border-emerald-600/70';
      case 1:
        return 'bg-emerald-800/40 border-emerald-700/50';
      default:
        return 'bg-dark-950/80 border-slate-800/80';
    }
  };

  return (
    <div className="bg-dark-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              GitHub Contribution Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Annual public contributions, code commits, and open-source activity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="bg-dark-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-slate-400">Total:</span>
            <span className="font-bold text-white">{data.totalContributions}</span>
          </div>

          <div className="bg-dark-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Current Streak:</span>
            <span className="font-bold text-amber-300">{data.currentStreak} days</span>
          </div>

          <div className="bg-dark-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-400">Best Streak:</span>
            <span className="font-bold text-yellow-300">{data.longestStreak} days</span>
          </div>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[720px] space-y-2">
          {/* Month Labels Bar */}
          <div className="flex text-[10px] font-mono text-slate-500 pl-8 pr-2 justify-between">
            {MONTHS.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>

          {/* Grid Container */}
          <div className="flex gap-1 items-start">
            {/* Weekday indicators */}
            <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-600 pr-2 pt-0.5 select-none">
              <span>Mon</span>
              <span className="opacity-0">Tue</span>
              <span>Wed</span>
              <span className="opacity-0">Thu</span>
              <span>Fri</span>
              <span className="opacity-0">Sat</span>
              <span>Sun</span>
            </div>

            {/* 52 Week Columns */}
            <div className="flex gap-1 flex-1">
              {data.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.days.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-3 h-3 rounded-[3px] border transition-transform duration-150 cursor-pointer hover:scale-130 hover:z-10 ${getLevelColor(
                        day.level
                      )}`}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${day.count} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Tooltip / Status & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400">
        <div className="min-h-[1.25rem]">
          {hoveredDay ? (
            <span className="text-slate-200">
              <strong className="text-emerald-400 font-semibold">{hoveredDay.count}</strong> contribution{hoveredDay.count !== 1 ? 's' : ''} on{' '}
              <span className="text-slate-300 font-semibold">{hoveredDay.date}</span>
            </span>
          ) : (
            <span className="text-slate-500">Hover over any square to view daily commit breakdown</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-dark-950 border border-slate-800" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800/40 border border-emerald-700/50" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600/60 border border-emerald-600/70" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/80 border border-emerald-500" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
