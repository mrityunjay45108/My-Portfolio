import React, { useState } from 'react';
import {
  Brain,
  Code,
  Terminal,
  FileJson,
  Code2,
  FileCode,
  Atom,
  Layers,
  Palette,
  Zap,
  Layout,
  Box,
  Server,
  Cpu,
  Network,
  Database,
  HardDrive,
  CloudLightning,
  Boxes,
  Container,
  Anchor,
  Flame,
  Cloud,
  CloudSun,
  CloudFog,
  Sparkles,
  Bot,
  Wand2,
  MessageSquareCode,
  Radio,
} from 'lucide-react';
import { skillCategories } from '../../data/skills';
import { Badge } from '../ui/Badge';

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const iconMap: Record<string, React.ReactNode> = {
    Brain: <Brain className="w-5 h-5 text-indigo-400" />,
    Sparkles: <Sparkles className="w-5 h-5 text-cyan-400" />,
    Bot: <Bot className="w-5 h-5 text-purple-400" />,
    Wand2: <Wand2 className="w-5 h-5 text-pink-400" />,
    MessageSquareCode: <MessageSquareCode className="w-5 h-5 text-emerald-400" />,
    Radio: <Radio className="w-5 h-5 text-blue-400" />,
    Code: <Code className="w-5 h-5 text-blue-400" />,
    FileJson: <FileJson className="w-5 h-5 text-amber-400" />,
    Terminal: <Terminal className="w-5 h-5 text-emerald-400" />,
    Code2: <Code2 className="w-5 h-5 text-cyan-400" />,
    FileCode: <FileCode className="w-5 h-5 text-slate-400" />,
    Atom: <Atom className="w-5 h-5 text-cyan-400" />,
    Layers: <Layers className="w-5 h-5 text-slate-200" />,
    Palette: <Palette className="w-5 h-5 text-teal-400" />,
    Zap: <Zap className="w-5 h-5 text-yellow-400" />,
    Layout: <Layout className="w-5 h-5 text-slate-300" />,
    Box: <Box className="w-5 h-5 text-blue-400" />,
    Server: <Server className="w-5 h-5 text-emerald-400" />,
    Cpu: <Cpu className="w-5 h-5 text-amber-400" />,
    Network: <Network className="w-5 h-5 text-red-400" />,
    Database: <Database className="w-5 h-5 text-blue-400" />,
    HardDrive: <HardDrive className="w-5 h-5 text-emerald-400" />,
    CloudLightning: <CloudLightning className="w-5 h-5 text-cyan-400" />,
    Boxes: <Boxes className="w-5 h-5 text-teal-400" />,
    Container: <Container className="w-5 h-5 text-blue-400" />,
    Anchor: <Anchor className="w-5 h-5 text-indigo-400" />,
    Flame: <Flame className="w-5 h-5 text-red-400" />,
    Cloud: <Cloud className="w-5 h-5 text-amber-400" />,
    CloudSun: <CloudSun className="w-5 h-5 text-yellow-400" />,
    CloudFog: <CloudFog className="w-5 h-5 text-blue-400" />,
  };

  const categories = ['All', ...skillCategories.map((c) => c.title)];

  const filteredCategories =
    activeTab === 'All'
      ? skillCategories
      : skillCategories.filter((c) => c.title === activeTab);

  return (
    <section id="skills" className="py-20 lg:py-28 relative bg-dark-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Skills & Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Categorized Technologies & Engineering Tools
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Modern tools, frameworks, and architectures I leverage to build robust software systems.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === cat
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 border border-brand-500/30'
                  : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Groups */}
        <div className="space-y-10">
          {filteredCategories.map((group, idx) => (
            <div
              key={idx}
              className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{group.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{group.description}</p>
                </div>
                <Badge variant="brand" size="sm">
                  {group.skills.length} Technologies
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {group.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-dark-950/70 hover:bg-dark-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-[1.02] group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-dark-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {iconMap[skill.iconName] || <Code className="w-5 h-5 text-brand-400" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {skill.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">{skill.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
