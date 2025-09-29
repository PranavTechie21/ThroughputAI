import { useOutletContext } from 'react-router-dom';
import { ControllerMessage } from '../components/ControllerMessage';
import { PredictionDashboard } from '../components/PredictionDashboard';
import { motion } from 'framer-motion';

interface OutletContextData {
  controllerMessage: any;
  predictions: any;
  itemVariants: any;
}

export function DashboardHomePage() {
  const { controllerMessage, predictions, itemVariants } = useOutletContext<OutletContextData>();
  return (
    <>
      <motion.div variants={itemVariants}><ControllerMessage message={controllerMessage} /></motion.div>
      <motion.div variants={itemVariants}><PredictionDashboard predictions={predictions} /></motion.div>
    </>
  );
}
