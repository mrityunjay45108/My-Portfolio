import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  FileCode2,
  Layers,
  Mail,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  GitBranch,
  GraduationCap,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, actionButton }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'AI Assistant', path: '/admin/ai', icon: Bot },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Education', path: '/admin/education', icon: GraduationCap },
    { label: 'GitHub Activity', path: '/admin/github', icon: GitBranch },
    { label: 'Blog CMS', path: '/admin/blog', icon: BookOpen },
    { label: 'Case Studies', path: '/admin/case-studies', icon: FileCode2 },
    { label: 'Technologies', path: '/admin/technologies', icon: Layers },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-dark-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-mono font-bold text-xs">
            MK
          </div>
          <span className="font-semibold text-sm">Portfolio CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-dark-800"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800/80 hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-brand-500/20">
                MK
              </div>
              <div>
                <h1 className="font-bold text-sm text-slate-100 leading-tight">Admin Console</h1>
                <p className="text-xs text-brand-400 font-mono">Mrityunjay Kumar</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-800/60">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                  Public Website
                </span>
                <span className="text-[10px] font-mono bg-dark-950 px-2 py-0.5 rounded text-slate-500">Live</span>
              </Link>
            </div>
          </nav>

          {/* User profile & Logout */}
          <div className="p-4 border-t border-slate-800/80 bg-dark-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {title && (
          <header className="px-6 py-5 border-b border-slate-800 bg-dark-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{title}</h2>
            </div>
            {actionButton && <div className="flex items-center gap-3">{actionButton}</div>}
          </header>
        )}
        <div className="p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};
