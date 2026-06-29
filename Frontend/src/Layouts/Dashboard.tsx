
import React, { useEffect } from 'react';
import {
    DollarSign,
    ClipboardList,
    Package,
    UserPlus,
    Download
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { DashboardWidget } from '../components/DashboardWidget';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { useThemeStore } from '../Theme/theme';

export const Dashboard: React.FC = () => {

    const theme = useThemeStore((state) => state.theme);

    interface themeType {
        title: string,
        value: string,
        growth: string,
        theme: 'pink' | 'orange' | 'green' | 'purple',
        icon: React.ComponentType<{ className?: string }>
    }

    const metricData: themeType[] = [
        {
            title: "Total Sales",
            value: "$1k",
            growth: "+8%",
            theme: "pink",
            icon: DollarSign
        },
        {
            title: "Total Order",
            value: "100",
            growth: "+5%",
            theme: "orange",
            icon: ClipboardList
        },
        {
            title: "Product Sold",
            value: "5",
            growth: "+1.2%",
            theme: "green",
            icon: Package
        },
        {
            title: "New Customers",
            value: "8",
            growth: "+0.5%",
            theme: "purple",
            icon: UserPlus
        },
    ]

    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );
    }, [theme]);

    return (
        <div className="flex flex-col gap-6 max-w-dashboard mx-auto">

            <Card className="[box-shadow:none] grid grid-cols-1 xl:grid-cols-12 gap-6">
                <CardContent className="lg:col-span-8">
                    <CardHeader className='flex items-center justify-between pb-2'>
                        <CardTitle>Today's Sales</CardTitle>
                        <CardDescription className="mt-1 font-medium">Sales Summary</CardDescription>
                        <Button variant="outline" className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-3">
                            <Download className="w-4 h-4 text-brand-gray" />
                            <span>Export</span>
                        </Button>
                    </CardHeader>

                    <CardDescription>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {metricData.map((data) => {
                                return <MetricCard
                                    title={data.title}
                                    value={data.value}
                                    growth={data.growth}
                                    theme={data.theme}
                                    icon={data.icon}
                                />
                            })}
                        </CardContent>
                    </CardDescription>
                </CardContent>

                <CardContent className="[box-shadow:none] lg:col-span-4 flex">
                    <DashboardWidget type="visitor-insights" className="flex-1" />
                </CardContent>

            </Card>

            <Card className="[box-shadow:none] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <CardContent className="lg:col-span-1 flex">
                    <DashboardWidget type="weekly-revenue" className="flex-1" />
                </CardContent>
                <CardContent className="lg:col-span-1 flex">
                    <DashboardWidget type="customer-satisfaction" className="flex-1" />
                </CardContent>
                <CardContent className="lg:col-span-1 flex">
                    <DashboardWidget type="target-vs-reality" className="flex-1" />
                </CardContent>
                <CardContent className="lg:col-span-1 flex">
                    <DashboardWidget type="top-products" className="flex-1" />
                </CardContent>
                <CardContent className="lg:col-span-1 flex">
                    <DashboardWidget type="sales-map" className="flex-1" />
                </CardContent>
                <CardContent className="lg:col-span-1 flex">
                    <DashboardWidget type="volume-vs-service" className="flex-1" />
                </CardContent>
            </Card>

        </div>
    );
};
