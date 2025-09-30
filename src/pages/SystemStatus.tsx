import React from 'react';

const SystemStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">System Status</h2>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">All systems are operational.</p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
          <li>Backend ML service: <span className="font-medium">running</span></li>
          <li>API proxy (Node): <span className="font-medium">running</span></li>
          <li>Frontend: <span className="font-medium">running</span></li>
        </ul>
      </div>
    </div>
  );
};

export { SystemStatusPage };
