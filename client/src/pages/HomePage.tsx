import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/portfolio/HeroSection';
import { AboutSection } from '../components/portfolio/AboutSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { FeaturedProjects } from '../components/portfolio/FeaturedProjects';
import { ProjectsGrid } from '../components/portfolio/ProjectsGrid';
import { GitHubTeaserSection } from '../components/portfolio/GitHubTeaserSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { EducationSection } from '../components/portfolio/EducationSection';
import { AchievementsSection } from '../components/portfolio/AchievementsSection';
import { ServicesSection } from '../components/portfolio/ServicesSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { Project } from '../types';
import { api } from '../services/api';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Record pageview
    api.analytics.track({ path: '/', type: 'PAGE_VIEW' });

    const fetchProjects = async () => {
      try {
        const data = await api.projects.getAll();
        setProjects(data);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <FeaturedProjects projects={featuredProjects} />
        <ProjectsGrid projects={projects} />
        <GitHubTeaserSection />
        <ExperienceSection />
        <EducationSection />
        <AchievementsSection />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};
