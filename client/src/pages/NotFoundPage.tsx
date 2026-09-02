import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-dark-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono font-extrabold text-2xl flex items-center justify-center mx-auto">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
          <p className="text-slate-400 text-sm">
            The page or route you are attempting to access does not exist or has moved.
          </p>
        </div>
        <Link to="/" className="inline-block w-full">
          <Button variant="primary" size="lg" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};
