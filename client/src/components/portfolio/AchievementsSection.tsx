import React from 'react';
import { Award, Code2, Trophy, Flame, Crown, CheckCircle } from 'lucide-react';
import { achievements } from '../../data/achievements';
import { Badge } from '../ui/Badge';

export const AchievementsSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 className="w-6 h-6 text-brand-400" />,
    Award: <Award className="w-6 h-6 text-cyan-400" />,
    Trophy: <Trophy className="w-6 h-6 text-amber-400" />,
    Flame: <Flame className="w-6 h-6 text-red-400" />,
    Crown: <Crown className="w-6 h-6 text-purple-400" />,
  };

  return (
    <section id="achievements" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Honors & Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified Achievements & Recognition
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Algorithmic milestones, competitive programming, standardized qualifications, and athletics.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-dark-900/50 hover:bg-dark-900/90 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-md group hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[ach.icon] || <Award className="w-6 h-6 text-brand-400" />}
                  </div>
                  <Badge variant="cyan" size="sm">
                    {ach.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                    {ach.title}
                  </h3>
                  {ach.organization && (
                    <p className="text-xs font-semibold text-brand-400 font-mono mt-0.5">
                      {ach.organization} {ach.date && `• ${ach.date}`}
                    </p>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
