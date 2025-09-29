import { useOutletContext } from 'react-router-dom';
import { TrendsSection } from '../components/TrendsSection';

interface OutletContextData {
  mockTrendsMessage: any;
}

export function TrendsPage() {
  const { mockTrendsMessage } = useOutletContext<OutletContextData>();
  return <TrendsSection message={mockTrendsMessage} />;
}
