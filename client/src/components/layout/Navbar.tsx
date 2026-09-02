import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, FileText, Lock } from 'lucide-react';
import { personalInfo } from '../../data/personal';
import { useAuth } from '../../context/AuthContext';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isHomePage) {
        const sections = ['home', 'about', 'skills', 'featured-projects', 'projects', 'github-activity', 'experience', 'education', 'achievements', 'services', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    if (!isHomePage) {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home', isHash: true },
    { name: 'About', id: 'about', isHash: true },
    { name: 'Skills', id: 'skills', isHash: true },
    { name: 'Projects', id: 'projects', isHash: true },
    { name: 'GitHub', path: '/github', isHash: false },
    { name: 'Blog', path: '/blog', isHash: false },
    { name: 'Case Studies', path: '/case-studies', isHash: false },
    { name: 'Experience', id: 'experience', isHash: true },
    { name: 'Education', id: 'education', isHash: true },
    { name: 'Achievements', id: 'achievements', isHash: true },
    { name: 'Contact', id: 'contact', isHash: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-950/85 backdrop-blur-md border-b border-slate-800/70 shadow-lg shadow-black/20 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Personal Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              MK
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-100 group-hover:text-white transition-colors tracking-tight">
                {personalInfo.name}
              </span>
              <span className="text-[11px] font-mono text-brand-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Full Stack & AI Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              if (link.isHash) {
                const isActive = isHomePage && activeSection === link.id;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.id!)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'text-white bg-slate-800/80 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              }
              const isActive = location.pathname.startsWith(link.path!);
              return (
                <Link
                  key={link.name}
                  to={link.path!}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-white bg-slate-800/80 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              to="/github"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="GitHub Developer Activity"
              title="GitHub Activity & Repositories"
            >
              <GithubIcon size={16} />
            </Link>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={16} />
            </a>

            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-brand-400" />
              Resume
            </a>

            <Link
              to={isAuthenticated ? "/admin" : "/admin/login"}
              className="p-2 text-slate-500 hover:text-brand-400 rounded-lg hover:bg-white/5 transition-colors ml-1"
              title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
              aria-label="Admin portal"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-lg"
            >
              <FileText className="w-3 h-3 text-brand-400" />
              CV
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-dark-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl p-6 transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              if (link.isHash) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.id!)}
                    className="text-left px-4 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    {link.name}
                  </button>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path!}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/github"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                  aria-label="GitHub Activity"
                >
                  <GithubIcon size={16} />
                </Link>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={16} />
                </a>
                <Link
                  to={isAuthenticated ? "/admin" : "/admin/login"}
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-brand-400 rounded-xl bg-slate-900 border border-slate-800"
                  aria-label="Admin Portal"
                >
                  <Lock className="w-4 h-4" />
                </Link>
              </div>

              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl shadow-lg shadow-brand-500/20"
              >
                <FileText className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
