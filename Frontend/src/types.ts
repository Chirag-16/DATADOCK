//types.ts
export interface Website {
    id: string;
    name: string;
    url: string;
    status: 'online' | 'offline' | 'degraded';
    uptime: number;
    responseTime: number;
    lastChecked: string;
  }

  export interface Alert {
    id: string;
    websiteId: string;
    websiteName: string;
    type: 'downtime' | 'performance' | 'error' | 'certificate';
    message: string;
    severity: 'critical' | 'warning' | 'info';
    timestamp: string;
    acknowledged: boolean;
  }