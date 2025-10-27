import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Activity, Zap, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardData } from "@/types";
import { apiService } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardOverview = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-2/4" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  const { stats, recent_activity } = dashboardData;

  const statsConfig = [
    {
      icon: Key,
      label: t("dashboard.overview.activeTokens"),
      value: stats.active_tokens,
      color: "text-primary",
    },
    {
      icon: Activity,
      label: t("dashboard.overview.totalRequests"),
      value: stats.total_requests,
      color: "text-accent",
    },
    {
      icon: Zap,
      label: t("dashboard.overview.rateLimit"),
      value: stats.rate_limit,
      color: "text-green-500",
    },
    {
      icon: Clock,
      label: t("dashboard.overview.expiringSoon"),
      value: stats.expiring_soon,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
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
            {recent_activity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">Token: {activity.token}</p>
                  <p className="text-sm text-muted-foreground">
                    Allowed APIs: {activity.allowed_apis.join(", ")} • Last
                    used: {activity.last_used_at}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Usage: {activity.total_usage}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
