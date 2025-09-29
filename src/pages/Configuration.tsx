import { InputDataPanel } from '../components/InputDataPanel';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';

interface OutletContextData {
  handlePrediction: (result: any) => void;
}

export function ConfigurationPage() {
  const { handlePrediction } = useOutletContext<OutletContextData>();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Train Configuration & Prediction
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Configure train parameters and generate AI-powered predictions for scheduling optimization.
        </p>
      </div>
      <InputDataPanel onPredict={handlePrediction} />
    </motion.div>
  );
}
