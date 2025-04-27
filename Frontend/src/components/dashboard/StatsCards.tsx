
import { Activity, Bell, Check, Clock, Gauge, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalWebsites: number;
    websitesUp: number;
    websitesDown: number;
    websitesDegraded: number;
    activeAlerts: number;
    averageResponseTime: number;
    averageUptime: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Websites Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalWebsites}</div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center">
              <div className="mr-1 h-2 w-2 rounded-full bg-monitor-success" />
              <p className="text-xs">{stats.websitesUp} up</p>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-2 w-2 rounded-full bg-monitor-warning" />
              <p className="text-xs">{stats.websitesDegraded} degraded</p>
            </div>
            <div className="flex items-center">
              <div className="mr-1 h-2 w-2 rounded-full bg-monitor-error" />
              <p className="text-xs">{stats.websitesDown} down</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Average Response</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageResponseTime}ms</div>
          <p className="text-xs text-muted-foreground">
            Across all monitored websites
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageUptime}%</div>
          <p className="text-xs text-muted-foreground">
            Average uptime across all websites
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeAlerts}</div>
          <p className="text-xs text-muted-foreground">
            Unacknowledged alerts requiring attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
