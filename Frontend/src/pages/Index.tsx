import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import StatsCards from "@/components/dashboard/StatsCards";
import StatusCard from "@/components/website/StatusCard";
import { AlertsList } from "@/components/alerts/AlertsList";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel except metrics
        const [statsRes, websitesRes, alertsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/stats`),
          axios.get(`${import.meta.env.VITE_API_URL}/websites`),
          axios.get(`${import.meta.env.VITE_API_URL}/alerts`),
        ]);
        
        setStats(statsRes.data);
        setWebsites(websitesRes.data);
        setAlerts(alertsRes.data.filter(alert => !alert.acknowledged));
        
        // For metrics, we'll use the first website's metrics as the overall performance chart
        if (websitesRes.data.length > 0) {
          try {
            const metricsRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/websites/${websitesRes.data[0].id}/metrics`
            );
            // Ensure the data is in the correct format
            if (metricsRes.data && metricsRes.data.responseTime) {
              setMetrics(metricsRes.data.responseTime);
            } else {
              console.warn("Metrics data not in expected format:", metricsRes.data);
              setMetrics([]);
            }
          } catch (metricsError) {
            console.error("Error fetching metrics:", metricsError);
            setMetrics([]);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling to refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-4">Loading dashboard data...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-4">Dashboard</h1>
          {stats && <StatsCards stats={stats} />}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Monitored Websites</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map(website => (
              <StatusCard 
                key={website.id} 
                website={website} 
                onClick={() => navigate(`/websites/${website.id}`)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Performance</h2>
          </div>
          {metrics.length > 0 ? (
            <PerformanceChart 
              data={metrics}
              title="Response Time"
              description="Average response time across all monitored websites"
            />
          ) : (
            <div className="p-4 text-gray-500">
              No performance data available
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Active Alerts</h2>
            <span className="text-sm text-gray-500">
              {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <AlertsList alerts={alerts} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;