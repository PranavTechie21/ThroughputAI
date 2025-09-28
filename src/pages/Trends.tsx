import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendsSection } from '../components/TrendsSection';

export function TrendsPage() {
  const { mockTrendsMessage } = useOutletContext();
  return <TrendsSection message={mockTrendsMessage} />;
}
