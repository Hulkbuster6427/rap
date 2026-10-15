import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-500">
        <Compass className="w-8 h-8" />
      </div>
      <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
        404 · Uncharted Route
      </div>
      <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
        The archive coordinate you entered does not point to an active essay, monograph, or timeline index.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-colors"
        title="Browse All 10 Underground Hip-Hop Dispatches"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Browse All 10 Underground Hip-Hop Dispatches</span>
      </Link>
    </div>
  );
};
