import { useOutletContext } from 'react-router-dom';
import { VisualizationCharts } from '../components/VisualizationCharts';

interface OutletContextData {
  predictions: any;
}

export function AnalyticsPage() {
  const { predictions } = useOutletContext<OutletContextData>();
  return <VisualizationCharts predictions={predictions} />;
}
