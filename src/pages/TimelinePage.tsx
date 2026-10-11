import React, { useEffect } from 'react';
import { TimelineView } from '../components/TimelineView';

export const TimelinePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Underground Evolution Timeline — Subculture // Rec';
    return () => {
      document.title = 'Subculture // The Underground Dispatch';
    };
  }, []);

  return <TimelineView />;
};
