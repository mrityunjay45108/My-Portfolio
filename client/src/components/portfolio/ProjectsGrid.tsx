import React, { useState } from 'react';
import { Search, Filter, FolderGit2 } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { Input } from '../ui/Input';

export interface ProjectsGridProps {
  projects: Project[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Full Stack', 'AI / GenAI', 'Backend & Cloud'];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === 'All' || project.category === activeCategory;

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 lg:py-28 relative bg-dark-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Project Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Complete Engineering Project Catalog
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Explore web applications, microservices backends, and AI pipelines built with production standards.
          </p>
        </div>

        {/* Controls: Search and Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-brand-500/30'
                    : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="w-full md:w-72">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              className="py-2 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto text-slate-500">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No projects found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-brand-400 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
