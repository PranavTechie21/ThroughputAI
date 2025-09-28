import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { VisualizationCharts } from '../components/VisualizationCharts';

export function AnalyticsPage() {
  const { predictions } = useOutletContext();
  return <VisualizationCharts predictions={predictions} />;
}
