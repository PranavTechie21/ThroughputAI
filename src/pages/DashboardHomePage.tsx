import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ControllerMessage } from '../components/ControllerMessage';
import { PredictionDashboard } from '../components/PredictionDashboard';
import { motion } from 'framer-motion';

export function DashboardHomePage() {
  const { controllerMessage, predictions, itemVariants } = useOutletContext();
  return (
    <>
      <motion.div variants={itemVariants}><ControllerMessage message={controllerMessage} /></motion.div>
      <motion.div variants={itemVariants}><PredictionDashboard predictions={predictions} /></motion.div>
    </>
  );
}
