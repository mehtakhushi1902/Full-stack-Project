import React from 'react';
import { Card, CardContent, CardDescription } from './ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  growth: string;
  theme: 'pink' | 'orange' | 'green' | 'purple';
  icon: React.ComponentType<{ className?: string }>;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  growth,
  theme,
  icon: Icon
}) => {
  const themeClasses = {
    pink: {
      bg: 'bg-metric-pink-bg',
      iconBg: 'bg-metric-pink-accent',
      text: 'text-metric-pink-accent'
    },
    orange: {
      bg: 'bg-metric-orange-bg',
      iconBg: 'bg-metric-orange-accent',
      text: 'text-metric-orange-accent'
    },
    green: {
      bg: 'bg-metric-green-bg',
      iconBg: 'bg-metric-green-icon-bg',
      text: 'text-metric-green-accent'
    },
    purple: {
      bg: 'bg-metric-purple-bg',
      iconBg: 'bg-metric-purple-accent',
      text: 'text-metric-purple-accent'
    }
  };

  const selectedTheme = themeClasses[theme];

  return (
    <Card className={`p-5 ${selectedTheme.bg} border-brand-border/10`}>

      <CardDescription className="flex items-center justify-between">
        <CardContent className={`px-0 flex items-center justify-center w-10 h-10 rounded-full text-white ${selectedTheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </CardContent>
      </CardDescription>

      <CardContent className="mt-4 flex flex-col gap-1.5">
        <span className="text-xl font-bold text-brand-dark tracking-tight md:text-2xl">{value}</span>
        <span className="text-sm font-semibold text-brand-muted">{title}</span>
        <span className="text-xs font-medium text-brand-gray mt-0.5">
          <span className={`font-semibold mr-1 ${selectedTheme.text}`}>{growth}</span>
          from yesterday
        </span>
      </CardContent>
    </Card>
  );
};
