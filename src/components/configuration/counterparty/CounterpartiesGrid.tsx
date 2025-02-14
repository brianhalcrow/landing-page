
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { toast } from "sonner";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Counterparty {
  counterparty_id: string;
  counterparty_name: string;
  counterparty_type: string;
  country: string;
}

interface EntityCounterparty {
  entity_id: string;
  counterparty_id: string;
  relationship_id: string;
}

const CounterpartiesGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

  // Fetch counterparties with their relationships
  const { data: counterparties, isLoading } = useQuery({
    queryKey: ["counterparties-with-relationships"],
    queryFn: async () => {
      const { data: counterpartiesData, error: counterpartiesError } = await supabase
        .from("counterparty")
        .select("*")
        .order("counterparty_name");

      if (counterpartiesError) throw counterpartiesError;

      const { data: relationships, error: relationshipsError } = await supabase
        .from("entity_counterparty")
        .select("*");

      if (relationshipsError) throw relationshipsError;

      return counterpartiesData.map((counterparty) => ({
        ...counterparty,
        relationships: relationships.filter(
          (rel) => rel.counterparty_id === counterparty.counterparty_id
        ),
      }));
    },
  });

  const baseColumns: ColDef[] = [
    {
      field: "counterparty_id",
      headerName: "Counterparty ID",
      sortable: true,
      filter: true,
      width: 150,
      headerClass: 'header-left header-wrap',
      cellClass: 'cell-left',
    },
    {
      field: "counterparty_name",
      headerName: "Name",
      sortable: true,
      filter: true,
      width: 200,
      headerClass: 'header-left header-wrap',
      cellClass: 'cell-left',
    },
    {
      field: "counterparty_type",
      headerName: "Type",
      sortable: true,
      filter: true,
      width: 150,
      headerClass: 'header-left header-wrap',
      cellClass: 'cell-left',
    },
    {
      field: "country",
      headerName: "Country",
      sortable: true,
      filter: true,
      width: 120,
      headerClass: 'header-left header-wrap',
      cellClass: 'cell-left',
    }
  ];

  const actionsColumn: ColDef = {
    headerName: "Actions",
    width: 100,
    cellRenderer: (params: any) => {
      const isEditing = editingRows[params.data.counterparty_id];
      return (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingRows(prev => ({
                ...prev,
                [params.data.counterparty_id]: !isEditing
              }));
            }}
            className="h-5 w-5 p-0"
          >
            {isEditing ? (
              <Save className="h-3 w-3" />
            ) : (
              <Edit className="h-3 w-3" />
            )}
          </Button>
        </div>
      );
    },
    cellClass: 'actions-cell',
  };

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Counterparty Information',
      headerClass: 'header-center',
      children: baseColumns
    } as ColGroupDef,
    actionsColumn
  ];

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <style>
        {`
          .ag-theme-alpine {
            --ag-header-height: auto !important;
            --ag-header-group-height: auto !important;
            --ag-row-height: 24px !important;
          }

          /* Base cell styles */
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            height: 24px !important;
            padding: 0 16px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          /* Header styles */
          .ag-header-cell {
            padding: 8px 0 !important;
            min-height: 50px !important;
          }

          .ag-header-cell.header-wrap {
            height: auto !important;
            min-height: 50px !important;
          }

          .ag-header-group-cell {
            font-weight: bold !important;
            height: auto !important;
            min-height: 50px !important;
            padding: 8px 0 !important;
          }

          /* Header alignment and wrapping */
          .header-center {
            text-align: center !important;
          }

          .header-center .ag-header-cell-label {
            justify-content: center !important;
            text-align: center !important;
          }

          .header-left {
            text-align: left !important;
          }

          .header-left .ag-header-cell-label {
            justify-content: flex-start !important;
            text-align: left !important;
            padding-left: 16px !important;
          }

          .header-wrap .ag-header-cell-label {
            white-space: normal !important;
            line-height: 1.2 !important;
            padding: 8px 4px !important;
            height: auto !important;
          }

          /* Cell alignment classes */
          .cell-center {
            justify-content: center !important;
          }

          .cell-left {
            justify-content: flex-start !important;
          }

          /* Action cell specific styles */
          .actions-cell {
            padding: 0 !important;
            justify-content: center !important;
          }
        `}
      </style>
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={counterparties}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            editable: false,
            sortable: true,
            filter: true,
          }}
          rowHeight={24}
          headerHeight={50}
          suppressRowTransform={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default CounterpartiesGrid;
