import React from 'react';
import { GraduationCap, Award, Calendar, MapPin, BookOpen } from 'lucide-react';
import { educations } from '../../data/education';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-20 lg:py-28 relative bg-dark-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Academic Background
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & Qualifications
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Formal engineering foundations, computer science training, and analytical coursework.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-md group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-dark-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {edu.duration}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-sm font-semibold text-brand-400 mt-1">{edu.institution}</p>
                  {edu.university && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{edu.university}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{edu.location}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Highlights & Coursework:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    {edu.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
