
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface TrendsSectionProps {
  message: {
    title: string;
    description: string;
  };
}

export const TrendsSection: React.FC<TrendsSectionProps> = ({ message }) => {
  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">{message.title}</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">{message.description.split('.')[0]}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{message.description.split('.').slice(1).join('.').trim()}</p>
      </CardContent>
    </Card>
  );
};
