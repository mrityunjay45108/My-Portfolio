import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { EducationProvider } from './context/EducationContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { GitHubPage } from './pages/GitHubPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CaseStudiesListPage } from './pages/CaseStudiesListPage';
import { CaseStudyDetailPage } from './pages/CaseStudyDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminProjectFormPage } from './pages/admin/AdminProjectFormPage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { AdminGitHubPage } from './pages/admin/AdminGitHubPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminBlogFormPage } from './pages/admin/AdminBlogFormPage';
import { AdminCaseStudiesPage } from './pages/admin/AdminCaseStudiesPage';
import { AdminCaseStudyFormPage } from './pages/admin/AdminCaseStudyFormPage';
import { AdminTechnologiesPage } from './pages/admin/AdminTechnologiesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Scroll to top helper on route transitions
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

// Route Guard for Admin Protected Routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <EducationProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Portfolio & Content Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
              <Route path="/github" element={<GitHubPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/case-studies" element={<CaseStudiesListPage />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin CMS Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute>
                    <AdminProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/new"
                element={
                  <ProtectedRoute>
                    <AdminProjectFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminProjectFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/education"
                element={
                  <ProtectedRoute>
                    <AdminEducationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/github"
                element={
                  <ProtectedRoute>
                    <AdminGitHubPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute>
                    <AdminBlogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/new"
                element={
                  <ProtectedRoute>
                    <AdminBlogFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminBlogFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/case-studies"
                element={
                  <ProtectedRoute>
                    <AdminCaseStudiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/case-studies/new"
                element={
                  <ProtectedRoute>
                    <AdminCaseStudyFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/case-studies/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminCaseStudyFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/technologies"
                element={
                  <ProtectedRoute>
                    <AdminTechnologiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute>
                    <AdminMessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute>
                    <AdminAnalyticsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </EducationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
