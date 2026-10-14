import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { RootLayout } from './components/RootLayout';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { TimelinePage } from './pages/TimelinePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="article/:id" element={<ArticlePage />} />
            <Route path="blog/:id" element={<ArticlePage />} />
            <Route path="dispatch/:id" element={<ArticlePage />} />
            <Route path=":id" element={<ArticlePage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
