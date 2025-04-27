import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import StatusCard from "@/components/website/StatusCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddWebsiteDialog } from "@/components/website/AddWebsiteDialog";
import { Website } from "@/types"; // Ensure the Website interface is defined in src/types.ts

const Websites = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/websites`);
        const data: Website[] = await response.json();
        setWebsites(data);
      } catch (error) {
        console.error("Failed to fetch websites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Websites</h1>
          <Button onClick={() => setOpenDialog(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Website
          </Button>
        </div>

        {loading ? (
          <div>Loading websites...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <StatusCard key={website.id} website={website} />
            ))}
          </div>
        )}

        <AddWebsiteDialog open={openDialog} setOpen={setOpenDialog} />
      </div>
    </Layout>
  );
};

export default Websites;

