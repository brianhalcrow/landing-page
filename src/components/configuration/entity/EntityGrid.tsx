
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";

const EntityGrid = () => {
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "entity_id",
      headerName: "Entity ID",
      sortable: true,
      filter: true,
      width: 130,
    },
    {
      field: "entity_name",
      headerName: "Entity Name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "functional_currency",
      headerName: "Functional Currency",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      field: "is_active",
      headerName: "Status",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center">
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              params.value
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {params.value ? "Active" : "Inactive"}
          </div>
        </div>
      ),
    },
    {
      field: "updated_at",
      headerName: "Last Updated",
      sortable: true,
      filter: true,
      width: 180,
      cellRenderer: (params: any) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
  ]);

  const { data: entities, isLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .order("entity_name");

      if (error) {
        console.error("Error fetching entities:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={entities}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
        }}
        enableCellTextSelection={true}
        suppressRowClickSelection={true}
        animateRows={true}
      />
    </div>
  );
};

export default EntityGrid;
