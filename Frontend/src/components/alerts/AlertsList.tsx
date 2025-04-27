
import { Alert } from "@/services/websiteService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertsListProps {
  alerts: Alert[];
}

export function AlertsList({ alerts }: AlertsListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-monitor-error text-white";
      case "warning":
        return "bg-monitor-warning text-black";
      case "info":
        return "bg-monitor-info text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No alerts</h3>
        <p className="text-sm text-muted-foreground">
          All systems are operating normally
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={cn("border-l-4", {
          "border-l-monitor-error": alert.severity === "critical",
          "border-l-monitor-warning": alert.severity === "warning",
          "border-l-monitor-info": alert.severity === "info",
        })}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline">{alert.type}</Badge>
                  <span className="text-sm font-medium">{alert.websiteName}</span>
                </div>
                <p className="text-sm">{alert.message}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTimestamp(alert.timestamp)}</span>
                </div>
              </div>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <CheckCheck className="h-4 w-4" />
                  <span>Acknowledge</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
