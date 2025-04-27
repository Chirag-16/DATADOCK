import Layout from "@/components/layout/Layout";
import { AlertsList } from "@/components/alerts/AlertsList";
import { Alert } from "@/types"; // Correct import path for the Alert interface
import { useEffect, useState } from "react";
import axios from "axios";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/alerts"); // Replace with your actual API endpoint
        setAlerts(response.data);
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>

        {loading ? (
          <p>Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p>No alerts found.</p>
        ) : (
          <AlertsList alerts={alerts} />
        )}
      </div>
    </Layout>
  );
};

export default Alerts;
