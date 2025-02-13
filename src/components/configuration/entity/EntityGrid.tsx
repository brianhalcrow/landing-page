
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { toast } from "sonner";

interface LegalEntity {
  entity_id: string;
  entity_name: string;
  local_currency: string;
  functional_currency: string;
  accounting_rate_method: string;
}

const EntityGrid = () => {
  const { data: entities, isLoading } = useQuery({
    queryKey: ["legal-entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("erp_legal_entity")
        .select("*")
        .order("entity_name");

      if (error) {
        console.error("Error fetching legal entities:", error);
        toast.error("Failed to fetch entities");
        throw error;
      }

      return data || [];
    },
  });

  const columnDefs: ColDef[] = [
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
      field: "local_currency",
      headerName: "Local Currency",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "accounting_rate_method",
      headerName: "Accounting Rate Method",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={entities}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            editable: false, // Make all columns read-only
          }}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default EntityGrid;
