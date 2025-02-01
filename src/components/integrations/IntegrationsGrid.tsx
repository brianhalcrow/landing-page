import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IntegrationsGrid = () => {
  const { data: connections, isLoading } = useQuery({
    queryKey: ["table-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("table_connections")
        .select("*");

      if (error) {
        console.error("Error fetching connections:", error);
        toast.error("Failed to fetch connections");
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {connections?.map((connection) => (
        <div key={connection.table_name} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{connection.table_name}</h3>
          <p>Status: {connection.status}</p>
          <p>Type: {connection.type}</p>
          <p>Size: {connection.size}</p>
          <p>Records: {connection.record_count}</p>
        </div>
      ))}
    </div>
  );
};

export default IntegrationsGrid;