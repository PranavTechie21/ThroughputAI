import React from 'react';
import { InputDataPanel } from '../components/InputDataPanel';
import { useOutletContext } from 'react-router-dom';

export function ConfigurationPage() {
  const { handlePrediction } = useOutletContext();
  return <InputDataPanel onPredict={handlePrediction} />;
}
