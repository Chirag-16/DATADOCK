import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface StatusCardProps {
  website: {
    id: string;
    name: string;
    url: string;
    status: 'online' | 'offline' | 'degraded';
    uptime: number;
    responseTime: number;
    lastChecked: string;
  };
}

export default function StatusCard({ website }: StatusCardProps) {
  const navigate = useNavigate();
  
  const statusConfig = {
    online: {
      color: 'bg-monitor-success',
      text: 'Online',
      progressColor: 'bg-monitor-success',
    },
    offline: {
      color: 'bg-monitor-error',
      text: 'Offline',
      progressColor: 'bg-monitor-error',
    },
    degraded: {
      color: 'bg-monitor-warning',
      text: 'Degraded',
      progressColor: 'bg-monitor-warning',
    },
  };

  const { color, text, progressColor } = statusConfig[website.status];
  
  const getResponseClass = (time: number) => {
    if (time < 200) return 'text-monitor-success';
    if (time < 500) return 'text-monitor-info';
    if (time < 1000) return 'text-monitor-warning';
    return 'text-monitor-error';
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/websites/${website.id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          <a href={website.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {website.name}
          </a>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse-slow", color)} />
          <Badge variant="outline">{text}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-xs text-muted-foreground truncate">
            {website.url}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" /> 
              <span className="text-xs text-muted-foreground">Response Time:</span>
              <span className={cn("text-xs font-medium", getResponseClass(website.responseTime))}>
                {website.responseTime}ms
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Uptime:</span>
              <span className="text-xs font-medium">
                {website.uptime}%
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Uptime</span>
              <span>{website.uptime}%</span>
            </div>
            <Progress value={website.uptime} className={cn("h-1", progressColor)} />
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Last checked: {website.lastChecked}</span>
            {website.status === 'online' ? (
              <div className="flex items-center gap-1 text-monitor-success">
                <ArrowUp className="h-3 w-3" />
                <span>Up</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-monitor-error">
                <ArrowDown className="h-3 w-3" />
                <span>Down</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
