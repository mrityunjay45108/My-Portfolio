import React from 'react';
import { Layout, Server, Brain, Cpu, Database, Cloud, Check } from 'lucide-react';
import { services } from '../../data/services';

export const ServicesSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Layout: <Layout className="w-6 h-6 text-brand-400" />,
    Server: <Server className="w-6 h-6 text-emerald-400" />,
    Brain: <Brain className="w-6 h-6 text-indigo-400" />,
    Cpu: <Cpu className="w-6 h-6 text-amber-400" />,
    Database: <Database className="w-6 h-6 text-blue-400" />,
    Cloud: <Cloud className="w-6 h-6 text-cyan-400" />,
  };

  return (
    <section id="services" className="py-20 lg:py-28 relative bg-dark-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Offerings & Specializations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional Engineering Services
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            End-to-end technical capabilities available for startups, scaleups, and enterprise initiatives.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-dark-900/50 hover:bg-dark-900 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-md group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {iconMap[srv.icon] || <Layout className="w-6 h-6 text-brand-400" />}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Service Features */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {srv.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span>{feat}</span>
                    </div>
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
