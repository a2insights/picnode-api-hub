import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Activity, Zap, Clock } from 'lucide-react';

export const DashboardOverview = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Key,
      label: t('dashboard.overview.activeTokens'),
      value: '3',
      change: '+2 this month',
      color: 'text-primary',
    },
    {
      icon: Activity,
      label: t('dashboard.overview.totalRequests'),
      value: '45.2K',
      change: '+12% from last month',
      color: 'text-accent',
    },
    {
      icon: Zap,
      label: t('dashboard.overview.rateLimit'),
      value: '60/min',
      change: 'Current plan',
      color: 'text-green-500',
    },
    {
      icon: Clock,
      label: t('dashboard.overview.expiringSoon'),
      value: '1',
      change: 'Expires in 5 days',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">Token API Request</p>
                  <p className="text-sm text-muted-foreground">Flags API • 2 hours ago</p>
                </div>
                <div className="text-sm text-muted-foreground">+127 requests</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
