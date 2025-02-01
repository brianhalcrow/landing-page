import { Grid, Paper, Typography } from "@mui/material";
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
        <Grid container spacing={3}>
          {connections?.map((connection) => (
            <Grid item xs={12} sm={6} md={4} key={connection.table_name}>
              <Paper 
                elevation={2} 
                className="p-4 hover:shadow-lg transition-shadow"
              >
                <Typography variant="h6" component="h2">
                  {connection.table_name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Status: {connection.status}
                </Typography>
                <Typography variant="body2">
                  Type: {connection.type}
                </Typography>
                <Typography variant="body2">
                  Size: {connection.size}
                </Typography>
                <Typography variant="body2">
                  Records: {connection.record_count}
                </Typography>
                <Typography variant="body2">
                  Last Update: {new Date(connection.last_update).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default DataSources;