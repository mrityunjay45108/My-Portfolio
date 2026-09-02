import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  X,
  Send,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Globe,
  Mail,
  FileCode2,
  BookOpen,
} from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons';
import { api } from '../../services/api';

interface ChatSource {
  title: string;
  url: string;
  type: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  responseType?: string;
  metadata?: any;
  timestamp: string;
}

const STORAGE_SESSION_KEY = 'mrityunjay_ai_session_id';

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID
  const sessionId = React.useMemo(() => {
    let id = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!id) {
      id = 'session_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(STORAGE_SESSION_KEY, id);
    }
    return id;
  }, []);

  // Fetch suggested questions on mount
  useEffect(() => {
    api.ai.getSuggestedQuestions().then((questions) => {
      if (questions && questions.length > 0) {
        setSuggestedQuestions(questions);
      }
    });
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await api.ai.chat(query, conversationId || undefined, sessionId);

      if (res.conversationId) {
        setConversationId(res.conversationId);
      }

      const assistantMessage: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: res.answer,
        sources: res.sources,
        responseType: res.responseType,
        metadata: res.metadata,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_' + (Date.now() + 1),
          role: 'assistant',
          content: "I'm temporarily experiencing an issue. You can explore Mrityunjay's Projects, Skills, and About sections directly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setConversationId('');
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSourceIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Globe className="w-3 h-3 text-cyan-400" />;
      case 'case-study':
        return <FileCode2 className="w-3 h-3 text-brand-400" />;
      case 'blog':
        return <BookOpen className="w-3 h-3 text-amber-400" />;
      case 'github':
        return <GithubIcon size={12} className="text-slate-300" />;
      case 'contact':
        return <Mail className="w-3 h-3 text-emerald-400" />;
      default:
        return <Zap className="w-3 h-3 text-cyan-400" />;
    }
  };

  // Basic markdown renderer for bold, lists, links, and code
  const formatMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formatted = line;

      // Bold **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Inline code `code`
      formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-dark-950 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[11px] border border-slate-800">$1</code>');
      // Links [text](url)
      formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline font-medium">$1</a>');

      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li
            key={idx}
            className="ml-3 list-disc list-outside text-slate-300 my-0.5"
            dangerouslySetInnerHTML={{ __html: formatted.replace(/^[*|-]\s+/, '') }}
          />
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p
          key={idx}
          className="my-0.5 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-brand-500/30 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="hidden sm:inline font-bold tracking-wide">Ask Mrityunjay's AI</span>
            <span className="sm:hidden font-bold">Ask AI</span>
          </button>
        )}
      </div>

      {/* Slide-in Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[640px] h-[85vh] sm:h-[600px] flex flex-col bg-dark-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Widget Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-dark-950/90 via-slate-900/90 to-dark-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100">Mrityunjay's AI Assistant</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    RAG Grounded
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Online • Ask anything about projects & skills</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {/* Welcome Message Card */}
            {messages.length === 0 && (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Welcome to the Developer AI Cockpit</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hi! I'm trained on Mrityunjay's verified projects, microservices architectures, GitHub repositories, and AI systems.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Ask me any technical question or tap a suggested topic below:
                  </p>
                </div>

                {/* Suggested Questions Chips */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                    Suggested Questions:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-left px-3.5 py-2.5 rounded-xl bg-dark-950/60 hover:bg-brand-600/10 border border-slate-800/80 hover:border-brand-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 relative group ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-xs shadow-md shadow-brand-600/20'
                      : 'bg-dark-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="space-y-1">{formatMarkdown(msg.content)}</div>

                  {/* Structured Rich Project Card (if project responseType) */}
                  {msg.responseType === 'project' && msg.metadata && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="p-3 rounded-xl bg-dark-900 border border-cyan-500/30 space-y-2">
                        {msg.metadata.image && (
                          <div className="w-full h-24 rounded-lg overflow-hidden bg-dark-950 border border-slate-800">
                            <img
                              src={msg.metadata.image}
                              alt={msg.metadata.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{msg.metadata.title}</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                            {msg.metadata.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Link
                            to={`/projects/${msg.metadata.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                          >
                            <span>View Project</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          {msg.metadata.githubUrl && (
                            <a
                              href={msg.metadata.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                            >
                              <GithubIcon size={13} className="text-slate-300" />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Source Citations Badges */}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1.5">
                      <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                        Verified Sources:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => {
                          const isInternal = src.url.startsWith('/');
                          return isInternal ? (
                            <Link
                              key={sIdx}
                              to={src.url}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-dark-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
                            >
                              {renderSourceIcon(src.type)}
                              <span>{src.title}</span>
                            </Link>
                          ) : (
                            <a
                              key={sIdx}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-dark-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
                            >
                              {renderSourceIcon(src.type)}
                              <span>{src.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Copy Button */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-dark-900/80"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-500 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Thinking / Loading Animation */}
            {loading && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-dark-950 border border-slate-800 max-w-[120px]">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-dark-950 border-t border-slate-800 space-y-2">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                maxLength={500}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, skills, contact..."
                className="w-full bg-dark-900 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-2xl pl-4 pr-12 py-3 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="absolute right-2 p-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white transition-all cursor-pointer"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
              <span>Powered by Portfolio Knowledge RAG</span>
              <span>{input.length}/500</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
