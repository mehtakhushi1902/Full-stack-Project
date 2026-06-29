import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { useThemeStore } from '../Theme/theme';

// Types
export type WidgetType =
  | 'visitor-insights'
  | 'weekly-revenue'
  | 'customer-satisfaction'
  | 'target-vs-reality'
  | 'top-products'
  | 'sales-map'
  | 'volume-vs-service';

export interface DashboardWidgetProps {
  type: WidgetType;
  title?: string;
  subtitle?: string;
  data?: any;
  className?: string;
}


const defaultVisitorData = [
  { month: 'Jan', loyal: 180, newCust: 120, unique: 210 },
  { month: 'Feb', loyal: 220, newCust: 150, unique: 240 },
  { month: 'Mar', loyal: 200, newCust: 140, unique: 220 },
  { month: 'Apr', loyal: 270, newCust: 190, unique: 310 },
  { month: 'May', loyal: 250, newCust: 180, unique: 280 },
  { month: 'Jun', loyal: 310, newCust: 220, unique: 360 },
  { month: 'Jul', loyal: 340, newCust: 250, unique: 410 },
  { month: 'Sep', loyal: 320, newCust: 240, unique: 380 },
  { month: 'Oct', loyal: 380, newCust: 280, unique: 440 },
  { month: 'Nov', loyal: 360, newCust: 260, unique: 420 },
  { month: 'Dec', loyal: 420, newCust: 320, unique: 490 },
];

const defaultRevenueData = [
  { day: 'Mon', online: 15000, offline: 12000 },
  { day: 'Tue', online: 21000, offline: 16000 },
  { day: 'Wed', online: 18000, offline: 14000 },
  { day: 'Thu', online: 24000, offline: 19000 },
  { day: 'Fri', online: 29000, offline: 21000 },
  { day: 'Sat', online: 32000, offline: 24000 },
  { day: 'Sun', online: 26000, offline: 18000 },
];

const defaultSatisfactionData = [
  { week: 'Wk 1', lastMonth: 504, thisMonth: 704 },
  { week: 'Wk 2', lastMonth: 800, thisMonth: 1100 },
  { week: 'Wk 3', lastMonth: 700, thisMonth: 1300 },
  { week: 'Wk 4', lastMonth: 1000, thisMonth: 1400 },
];

const defaultComparisonData = [
  { month: 'Jan', reality: 60, target: 80 },
  { month: 'Feb', reality: 70, target: 90 },
  { month: 'Mar', reality: 110, target: 100 },
  { month: 'Apr', reality: 95, target: 110 },
  { month: 'May', reality: 130, target: 120 },
  { month: 'Jun', reality: 140, target: 130 },
  { month: 'Jul', reality: 160, target: 150 },
];

const defaultProductsData = [
  { id: '01', name: 'Home Decor Range', popularity: 45, sales: 45, color: 'blue' as const },
  { id: '02', name: 'Disney Princess Dress', popularity: 29, sales: 29, color: 'green' as const },
  { id: '03', name: 'Woodu Wooden Chair', popularity: 18, sales: 18, color: 'purple' as const },
  { id: '04', name: 'Oneplus Nord CE 5G', popularity: 25, sales: 25, color: 'orange' as const },
];

const defaultHotspotsData = [
  { id: 'usa', name: 'United States', sales: '$45,200', percent: 40, x: '22%', y: '35%', color: '#FF8F0D' },
  { id: 'brazil', name: 'Brazil', sales: '$16,950', percent: 15, x: '35%', y: '68%', color: '#00E096' },
  { id: 'congo', name: 'Congo', sales: '$11,300', percent: 10, x: '52%', y: '60%', color: '#FA5A7D' },
  { id: 'russia', name: 'Russia', sales: '$16,950', percent: 15, x: '65%', y: '22%', color: '#BF5AF2' },
  { id: 'china', name: 'China', sales: '$22,600', percent: 20, x: '75%', y: '38%', color: '#5D5FEF' },
];

const defaultServiceData = [
  { month: 'Jan', volume: 120, serviceLevel: 40 },
  { month: 'Feb', volume: 140, serviceLevel: 50 },
  { month: 'Mar', volume: 110, serviceLevel: 45 },
  { month: 'Apr', volume: 150, serviceLevel: 60 },
  { month: 'May', volume: 180, serviceLevel: 55 },
  { month: 'Jun', volume: 170, serviceLevel: 65 },
  { month: 'Jul', volume: 190, serviceLevel: 70 },
];

const productThemeClasses = {
  blue: {
    bar: 'bg-brand-purple',
    barBg: 'bg-chart-blue-bg',
    badge: 'text-brand-purple bg-chart-blue-bg border-brand-purple/30',
  },
  green: {
    bar: 'bg-chart-green',
    barBg: 'bg-metric-green-bg',
    badge: 'text-chart-green bg-metric-green-bg border-chart-green/30',
  },
  purple: {
    bar: 'bg-metric-purple-accent',
    barBg: 'bg-metric-purple-bg',
    badge: 'text-metric-purple-accent bg-metric-purple-bg border-metric-purple-accent/30',
  },
  orange: {
    bar: 'bg-metric-orange-accent',
    barBg: 'bg-metric-orange-bg',
    badge: 'text-metric-orange-accent bg-metric-orange-bg border-metric-orange-accent/30',
  },
};

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  type,
  title,
  subtitle,
  data,
  className = ""
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  switch (type) {
    case 'visitor-insights': {
      const chartData = data || defaultVisitorData;
      return (
        <Card className={className}>
          <CardHeader>
            <div>
              <CardTitle>{title || 'Visitor Insights'}</CardTitle>
              <CardDescription>{subtitle || 'Growth trends across visitor profiles'}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold mt-2 sm:mt-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-metric-purple-accent" />
                <span className="text-brand-muted">Loyal Customer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-metric-pink-accent" />
                <span className="text-brand-muted">New Customer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-metric-orange-accent" />
                <span className="text-brand-muted">Unique Visitor</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dx={-5}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
                            <p className="font-bold mb-1.5 text-slate-400">{payload[0].payload.month}</p>
                            <div className="flex flex-col gap-1">
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-metric-purple-accent" />
                                Loyal: <span className="font-bold">{payload[0].value}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-metric-pink-accent" />
                                New: <span className="font-bold">{payload[1].value}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-metric-orange-accent" />
                                Unique: <span className="font-bold">{payload[2].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="loyal"
                    stroke="#BF5AF2"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newCust"
                    stroke="#FA5A7D"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="unique"
                    stroke="#FFB44C"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

        </Card>
      );
    }

    case 'weekly-revenue': {
      const chartData = data || defaultRevenueData;
      return (
        <Card className={className}>
          <CardHeader>
            <div>
              <CardTitle>{title || 'Weekly Revenue'}</CardTitle>
              <CardDescription>{subtitle || 'Performance stats by distribution channels'}</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                <span className="text-brand-muted">Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-chart-green" />
                <span className="text-brand-muted">Offline</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    dx={-5}
                  />
                  <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
                            <p className="font-bold mb-1.5 text-slate-400">{payload[0].payload.day}</p>
                            <div className="flex flex-col gap-1">
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-purple" />
                                Online: <span className="font-bold">${payload[0].value?.toLocaleString()}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-chart-green" />
                                Offline: <span className="font-bold">${payload[1].value?.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="online" fill="#5D5FEF" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="offline" fill="#00E096" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    case 'customer-satisfaction': {
      const chartData = data || defaultSatisfactionData;
      return (
        <Card className={className}>
          <CardHeader>
            <div>
              <CardTitle>{title || 'Customer Satisfaction'}</CardTitle>
              <CardDescription>{subtitle || 'Rating score trends comparing month-over-month'}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-6 mb-4 border-b border-brand-border/50 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-purple" />
                <div>
                  <p className="text-xs font-semibold text-brand-gray">This Month</p>
                  <p className="text-lg font-bold text-brand-dark">$4,504</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-chart-green" />
                <div>
                  <p className="text-xs font-semibold text-brand-gray">Last Month</p>
                  <p className="text-lg font-bold text-brand-dark">$3,004</p>
                </div>
              </div>
            </div>

            <div className="h-48 md:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorThisMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5D5FEF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5D5FEF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E096" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00E096" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dx={-5}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
                            <p className="font-bold mb-1.5 text-slate-400">{payload[0].payload.week}</p>
                            <div className="flex flex-col gap-1">
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-purple" />
                                This Month: <span className="font-bold">${payload[0].value}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-chart-green" />
                                Last Month: <span className="font-bold">${payload[1].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="thisMonth"
                    stroke="#5D5FEF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorThisMonth)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lastMonth"
                    stroke="#00E096"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLastMonth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    case 'target-vs-reality': {
      const chartData = data || defaultComparisonData;
      return (
        <Card className={className}>
          <CardHeader>
            <div>
              <CardTitle>{title || 'Target vs Reality'}</CardTitle>
              <CardDescription>{subtitle || 'Performance stats against periodic targets'}</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                <span className="text-brand-muted">Reality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-metric-orange-accent" />
                <span className="text-brand-muted">Target</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dx={-5}
                  />
                  <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
                            <p className="font-bold mb-1.5 text-slate-400">{payload[0].payload.month}</p>
                            <div className="flex flex-col gap-1">
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-purple" />
                                Reality: <span className="font-bold">{payload[0].value}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-metric-orange-accent" />
                                Target: <span className="font-bold">{payload[1].value}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="reality" fill="#5D5FEF" radius={[3, 3, 0, 0]} barSize={10} />
                  <Bar dataKey="target" fill="#FFB44C" radius={[3, 3, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    case 'top-products': {
      const tableData = data || defaultProductsData;
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle>{title || 'Top Products'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border text-xs font-semibold text-brand-light-gray uppercase tracking-wider">
                    <th className="pb-4 w-12">#</th>
                    <th className="pb-4 min-w-product-name">Name</th>
                    <th className="pb-4 min-w-product-popularity">Popularity</th>
                    <th className="pb-4 text-center w-24">Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-sm text-brand-muted">
                  {tableData.map((product: any) => {
                    const theme = productThemeClasses[product.color as keyof typeof productThemeClasses] || productThemeClasses.blue;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-semibold text-brand-gray">{product.id}</td>
                        <td className="py-4 font-semibold text-brand-dark">{product.name}</td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-4">
                            <div className={`relative w-full h-2 rounded-full ${theme.barBg} overflow-hidden`}>
                              <div
                                className={`absolute top-0 left-0 h-full rounded-full ${theme.bar}`}
                                style={{ width: `${product.popularity}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${theme.badge}`}>
                            {product.sales}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      );
    }

    case 'sales-map': {
      const hotspots = data || defaultHotspotsData;
      return (
        <Card className={className}>
          <CardHeader>
            <div>
              <CardTitle>{title || 'Sales Mapping by Country'}</CardTitle>
              <CardDescription>{subtitle || 'Global revenue hubs and performance markers'}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="relative my-8 h-48 md:h-56 bg-slate-50/40 rounded-xl border border-brand-border/30 overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full opacity-20 pointer-events-none stroke-gray-300"
                fill="none"
                strokeWidth="0.5"
              >
                <line x1="0" y1="100" x2="800" y2="100" strokeDasharray="5,5" />
                <line x1="0" y1="200" x2="800" y2="200" strokeDasharray="5,5" />
                <line x1="0" y1="300" x2="800" y2="300" strokeDasharray="5,5" />
                <line x1="200" y1="0" x2="200" y2="400" strokeDasharray="5,5" />
                <line x1="400" y1="0" x2="400" y2="400" strokeDasharray="5,5" />
                <line x1="600" y1="0" x2="600" y2="400" strokeDasharray="5,5" />

                <path d="M100 80 L180 100 L210 140 L160 200 L120 180 L80 120 Z" fill="currentColor" className="text-gray-200" />
                <path d="M220 220 L270 240 L280 320 L240 370 L210 280 Z" fill="currentColor" className="text-gray-200" />
                <path d="M370 180 L440 180 L480 230 L450 330 L390 280 L360 210 Z" fill="currentColor" className="text-gray-200" />
                <path d="M380 60 L600 50 L750 100 L680 200 L500 220 L400 150 Z" fill="currentColor" className="text-gray-200" />
                <path d="M660 300 L730 290 L740 340 L680 350 Z" fill="currentColor" className="text-gray-200" />
              </svg>

              {hotspots.map((country: any) => {
                const isHovered = hoveredCountry === country.id;
                return (
                  <div
                    key={country.id}
                    className="absolute"
                    style={{ left: country.x, top: country.y }}
                    onMouseEnter={() => setHoveredCountry(country.id)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    <span
                      className="absolute -left-3 -top-3 w-8 h-8 rounded-full animate-ping opacity-35"
                      style={{ backgroundColor: country.color, animationDuration: '2s' }}
                    />
                    <button
                      className="relative z-10 w-3 h-3 rounded-full shadow-lg border border-white focus:outline-none transition-transform duration-200 hover:scale-125 cursor-pointer"
                      style={{ backgroundColor: country.color }}
                      aria-label={`Sales marker for ${country.name}`}
                    />

                    <div
                      className={`absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-2xs rounded-lg px-2.5 py-1.5 shadow-xl transition-all duration-300 pointer-events-none whitespace-nowrap z-20 ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: country.color }} />
                        {country.name}
                      </div>
                      <div className="text-slate-300 mt-0.5">Sales: {country.sales} ({country.percent}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-2 border-t border-brand-border pt-4">
              {hotspots.map((country: any) => (
                <div
                  key={country.id}
                  className="flex flex-col items-center text-center cursor-pointer group"
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: country.color }} />
                    <span className="text-2xs-plus font-bold text-brand-dark group-hover:text-brand-purple transition-colors truncate max-w-country-code md:max-w-none">
                      {country.id.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-2xs font-semibold text-brand-gray mt-0.5">{country.percent}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    case 'volume-vs-service': {
      const chartData = data || defaultServiceData;
      return (
        <Card className={className}>
          <CardHeader>
            <div>
              <CardTitle>{title || 'Volume vs Service Level'}</CardTitle>
              <CardDescription>{subtitle || 'Operations ratio comparing efficiency and load'}</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                <span className="text-brand-muted">Volume</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-chart-green" />
                <span className="text-brand-muted">Service Level</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#96A5B8', fontSize: 11, fontWeight: 600 }}
                    dx={-5}
                  />
                  <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
                            <p className="font-bold mb-1.5 text-slate-400">{payload[0].payload.month}</p>
                            <div className="flex flex-col gap-1">
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-purple" />
                                Volume: <span className="font-bold">{payload[0].value}</span>
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-chart-green" />
                                Service Level: <span className="font-bold">{payload[1].value}</span>
                              </p>
                              <p className="border-t border-slate-700/60 pt-1 mt-1 text-slate-400 flex justify-between font-medium">
                                Total: <span className="font-bold text-white">{(Number(payload[0].value) + Number(payload[1].value))}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="volume" stackId="a" fill="#5D5FEF" radius={[0, 0, 0, 0]} barSize={14} />
                  <Bar dataKey="serviceLevel" stackId="a" fill="#00E096" radius={[3, 3, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    default:
      return null;
  }
};
