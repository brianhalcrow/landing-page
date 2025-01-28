import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const ConnectionsTab = () => {
  const { data: connections, isLoading } = useQuery({
    queryKey: ["table-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("table_connections")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const columnDefs = [
    { field: "table_name", headerName: "Table Name", flex: 1 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "size", headerName: "Size", width: 100 },
    { 
      field: "record_count", 
      headerName: "Records", 
      width: 120,
      type: 'numericColumn'
    },
    { 
      field: "last_update", 
      headerName: "Last Update",
      width: 180,
      valueFormatter: (params: any) => {
        return params.value ? format(new Date(params.value), 'PPpp') : '';
      }
    },
    { 
      field: "next_update", 
      headerName: "Next Update",
      width: 180,
      valueFormatter: (params: any) => {
        return params.value ? format(new Date(params.value), 'PPpp') : '';
      }
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[600px] w-full ag-theme-alpine">
      <AgGridReact
        rowData={connections}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default ConnectionsTab;