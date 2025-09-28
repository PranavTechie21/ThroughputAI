import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function SystemStatusPage() {
  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">System Status</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Overview of current system status</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Detailed system status information would be displayed here.</p>
      </CardContent>
    </Card>
  );
}
