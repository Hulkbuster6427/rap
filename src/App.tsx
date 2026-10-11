/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { RootLayout } from './components/RootLayout';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { TimelinePage } from './pages/TimelinePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const RouteErrorBoundary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-display font-black text-2xl text-zinc-100">Route Loading Notice</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The requested underground route could not be loaded directly. You can return to the primary dispatch catalog at any time.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal Archive</span>
        </button>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/index.html',
        element: <HomePage />,
      },
      {
        path: '/article/:id',
        element: <ArticlePage />,
      },
      {
        path: '/timeline',
        element: <TimelinePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
