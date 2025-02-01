import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DataSources = () => {
  const { data: connections } = useQuery({
    queryKey: ["table-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("table_connections")
        .select("*");

      if (error) {
        console.error("Error fetching connections:", error);
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="h-full">
      <TabsContainer 
        tabs={tabsConfig["data-sources"]} 
        defaultTab="connections" 
      />
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {connections?.map((connection) => (
            <div 
              key={connection.table_name}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {connection.table_name}
              </h2>
              <p className="text-gray-600 mb-2">
                Status: {connection.status}
              </p>
              <p className="text-sm text-gray-600">
                Type: {connection.type}
              </p>
              <p className="text-sm text-gray-600">
                Size: {connection.size}
              </p>
              <p className="text-sm text-gray-600">
                Records: {connection.record_count}
              </p>
              <p className="text-sm text-gray-600">
                Last Update: {new Date(connection.last_update).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSources;