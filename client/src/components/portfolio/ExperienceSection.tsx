import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { experiences } from '../../data/experience';
import { Badge } from '../ui/Badge';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Career Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience & Engineering Roles
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Hands-on software development roles, engineering internships, and research initiatives.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto pl-6 sm:pl-8 border-l border-slate-800 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-dark-950 border-2 border-brand-500 group-hover:bg-brand-500 group-hover:scale-125 transition-all shadow-md shadow-brand-500/30" />

              {/* Experience Card */}
              <div className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{exp.role}</h3>
                    <p className="text-sm font-semibold text-brand-400 mt-0.5">{exp.company}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 bg-dark-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {exp.duration}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {exp.type}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 font-mono pt-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exp.location}</span>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-2.5 pt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {exp.description.map((desc, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-6 mt-4 border-t border-slate-800/80">
                  {exp.technologies.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
