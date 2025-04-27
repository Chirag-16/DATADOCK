
export interface Website {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

export interface PerformanceMetric {
  timestamp: string;
  value: number;
}

export interface WebsiteMetrics {
  id: string;
  name: string;
  responseTime: PerformanceMetric[];
  loadTime: PerformanceMetric[];
  ttfb: PerformanceMetric[];
  uptimeHistory: { timestamp: string; status: boolean }[];
}

// Mock data for development
export const mockWebsites: Website[] = [
  {
    id: '1',
    name: 'Example Website',
    url: 'https://example.com',
    status: 'online',
    uptime: 99.98,
    responseTime: 124,
    lastChecked: '2 min ago',
  },

  
];

const generatePerformanceData = (): PerformanceMetric[] => {
  const data: PerformanceMetric[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    // Random value between 80 and 500
    const value = Math.floor(Math.random() * 420) + 80;
    data.push({ timestamp, value });
  }
  
  return data;
};

const generateUptimeHistory = () => {
  const data: { timestamp: string; status: boolean }[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    // 95% chance of being online
    const status = Math.random() > 0.05;
    data.push({ timestamp, status });
  }
  
  return data;
};

export const mockMetrics: WebsiteMetrics[] = mockWebsites.map(website => ({
  id: website.id,
  name: website.name,
  responseTime: generatePerformanceData(),
  loadTime: generatePerformanceData(),
  ttfb: generatePerformanceData(),
  uptimeHistory: generateUptimeHistory(),
}));

// Mock alerts data
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

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    websiteId: '3',
    websiteName: 'Test API',
    type: 'downtime',
    message: 'Website is down - Connection refused',
    severity: 'critical',
    timestamp: '2025-04-04T07:12:00Z',
    acknowledged: false,
  },
  {
    id: 'a2',
    websiteId: '2',
    websiteName: 'Demo App',
    type: 'performance',
    message: 'High response time detected (>500ms)',
    severity: 'warning',
    timestamp: '2025-04-04T06:45:00Z',
    acknowledged: false,
  },
  {
    id: 'a3',
    websiteId: '1',
    websiteName: 'Example Website',
    type: 'error',
    message: 'JavaScript error detected: TypeError',
    severity: 'warning',
    timestamp: '2025-04-04T05:30:00Z',
    acknowledged: true,
  },
  {
    id: 'a4',
    websiteId: '5',
    websiteName: 'Dev Server',
    type: 'certificate',
    message: 'SSL Certificate expires in 10 days',
    severity: 'info',
    timestamp: '2025-04-04T04:15:00Z',
    acknowledged: false,
  },
];

// Summary stats for the dashboard
export const mockStats = {
  totalWebsites: mockWebsites.length,
  websitesUp: mockWebsites.filter(w => w.status === 'online').length,
  websitesDown: mockWebsites.filter(w => w.status === 'offline').length,
  websitesDegraded: mockWebsites.filter(w => w.status === 'degraded').length,
  activeAlerts: mockAlerts.filter(a => !a.acknowledged).length,
  averageResponseTime: Math.round(
    mockWebsites.reduce((sum, website) => sum + website.responseTime, 0) / mockWebsites.length
  ),
  averageUptime: parseFloat(
    (mockWebsites.reduce((sum, website) => sum + website.uptime, 0) / mockWebsites.length).toFixed(2)
  ),
};
