
import Layout from "@/components/layout/Layout";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { mockMetrics } from "@/services/websiteService";

const Performance = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Performance Monitoring</h1>
        <PerformanceChart 
          data={mockMetrics[0].responseTime}
          title="Response Time"
          description="Average response time across all monitored websites"
        />
      </div>
    </Layout>
  );
};

export default Performance;
