import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Eye, ArrowRight, BookOpen, Tag as TagIcon, Sparkles } from 'lucide-react';
import { BlogPost, BlogCategory, Tag } from '../types';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.track({ path: '/blog', type: 'PAGE_VIEW' });

    const fetchData = async () => {
      try {
        const [postsRes, catsRes, tagsRes] = await Promise.all([
          api.blog.getAll({ category: selectedCategory, tag: selectedTag, search: searchQuery }),
          api.blog.getCategories(),
          api.blog.getTags(),
        ]);

        setPosts(postsRes.posts);
        setCategories(catsRes);
        setTags(tagsRes);
      } catch (err) {
        console.error('Error fetching blog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedTag, searchQuery]);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              Technical Writing & Publications
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineering Blog
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              In-depth articles exploring microservices architecture, RAG pipelines, LLM systems, and scalable backend design.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedTag('');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  !selectedCategory && !selectedTag
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-brand-500/30'
                    : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSelectedTag('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-brand-500/30'
                      : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-500" />}
                className="py-2 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Tag Chips */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <TagIcon className="w-3 h-3" /> Filter by tag:
              </span>
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTag(selectedTag === t.slug ? '' : t.slug);
                    setSelectedCategory('');
                  }}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    selectedTag === t.slug
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-dark-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  #{t.name}
                </button>
              ))}
            </div>
          )}

          {/* Featured Post Card */}
          {featuredPost && !selectedTag && !searchQuery && !selectedCategory && (
            <div className="bg-dark-900/60 hover:bg-dark-900/90 border border-slate-800/80 rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 transition-all shadow-xl group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {featuredPost.featuredImage && (
                  <div className="lg:col-span-6 aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-dark-950">
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className={featuredPost.featuredImage ? 'lg:col-span-6 space-y-4' : 'lg:col-span-12 space-y-4'}>
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" size="sm">
                      Featured Article
                    </Badge>
                    {featuredPost.category && (
                      <Badge variant="cyan" size="sm">
                        {featuredPost.category.name}
                      </Badge>
                    )}
                  </div>

                  <Link to={`/blog/${featuredPost.slug}`} className="block group">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-brand-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readingTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {featuredPost.viewCount} views
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 group/btn"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(selectedTag || searchQuery || selectedCategory ? posts : remainingPosts).map((post) => (
              <article
                key={post.id}
                className="bg-dark-900/50 hover:bg-dark-900 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl overflow-hidden flex flex-col justify-between p-6 transition-all duration-300 group shadow-md"
              >
                <div className="space-y-4">
                  {post.featuredImage && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-dark-950 border border-slate-800">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {post.category && (
                    <Badge variant="cyan" size="sm">
                      {post.category.name}
                    </Badge>
                  )}

                  <Link to={`/blog/${post.slug}`} className="block">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTime} min
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="bg-dark-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No articles found</h3>
              <p className="text-xs text-slate-400">
                Try clearing your search filters to explore all available publications.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
