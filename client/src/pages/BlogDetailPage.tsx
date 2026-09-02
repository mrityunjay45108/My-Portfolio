import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BlogPost } from '../types';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { useToast } from '../context/ToastContext';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { success } = useToast();

  useEffect(() => {
    if (!slug) return;

    api.analytics.track({
      path: `/blog/${slug}`,
      type: 'BLOG_VIEW',
      resourceId: slug,
    });

    const fetchPost = async () => {
      try {
        const data = await api.blog.getBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error('Article not found:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Article link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The article you requested could not be found or has been unpublished.</p>
          <Button variant="primary" onClick={() => navigate('/blog')}>
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back button & Action */}
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-dark-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Article Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {post.category && (
                <Badge variant="cyan" size="md">
                  {post.category.name}
                </Badge>
              )}
              {post.status !== 'PUBLISHED' && (
                <Badge variant="amber" size="md">
                  {post.status} PREVIEW
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {post.excerpt}
            </p>

            {/* Author & Meta bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  MK
                </div>
                <div>
                  <p className="font-semibold text-slate-200 font-sans">{post.author?.name || 'Mrityunjay Kumar'}</p>
                  <p className="text-[11px] text-slate-500">Author & AI Engineer</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {post.readingTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {post.viewCount} views
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-800 bg-dark-900 shadow-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Markdown Content with Syntax Highlighting */}
          <div className="py-4">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                Article Tags:
              </span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t: any, idx: number) => {
                  const name = typeof t === 'string' ? t : t.tag?.name || t.name || '';
                  return (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-xl bg-dark-900 border border-slate-800 text-cyan-300"
                    >
                      #{name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Previous & Next Post Navigation */}
          {(post.prevPost || post.nextPost) && (
            <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.prevPost ? (
                <Link
                  to={`/blog/${post.prevPost.slug}`}
                  className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center gap-3 transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-brand-400" />
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-mono text-slate-500">Previous Article</p>
                    <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{post.prevPost.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {post.nextPost && (
                <Link
                  to={`/blog/${post.nextPost.slug}`}
                  className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-3 text-right transition-colors group"
                >
                  <div className="overflow-hidden w-full">
                    <p className="text-[11px] font-mono text-slate-500">Next Article</p>
                    <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{post.nextPost.title}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-brand-400 flex-shrink-0" />
                </Link>
              )}
            </div>
          )}

          {/* Author Card & Call to Action */}
          <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                MK
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">Written by {post.author?.name || 'Mrityunjay Kumar'}</h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Full Stack Developer & AI Engineer specializing in scalable architectures and Generative AI.
                </p>
              </div>
            </div>

            <Link to="/#contact" className="flex-shrink-0">
              <Button variant="primary" size="md">
                Get In Touch
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};
