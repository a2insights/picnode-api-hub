export interface DashboardStats {
  active_tokens: number;
  total_requests: string;
  rate_limit: string;
  expiring_soon: number;
}

export interface RecentActivity {
  allowed_apis: string[];
  total_usage: string;
  last_used_at: string;
  token: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_activity: RecentActivity[];
}
