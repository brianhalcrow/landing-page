
import { useMemo } from "react";
import { useTrialBalanceQuery } from "@/integrations/cube/hooks/useTrialBalanceQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { GridStyles } from "@/components/shared/grid/GridStyles";

export const TrialBalanceGrid = () => {
  const { data, isLoading, error, refetch } = useTrialBalanceQuery();

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: "accountCategory",
      headerName: "Account Category",
      filter: "agTextColumnFilter",
      flex: 2,
      sortable: true,
    },
    {
      field: "movementAmount",
      headerName: "Movement Amount",
      filter: "agNumberColumnFilter",
      flex: 1,
      sortable: true,
      type: "numericColumn",
      valueFormatter: (params) => {
        if (params.value == null) return "N/A";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);
      },
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    filter: true,
    floatingFilter: true,
    sortable: true,
  }), []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trial Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-red-500">{error}</div>
            <button 
              onClick={() => refetch()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
            >
              Retry Connection
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trial Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="ag-theme-alpine w-full h-[600px]">
          <GridStyles />
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            animateRows={true}
            rowGroupPanelShow="always"
            sideBar={{
              toolPanels: [
                {
                  id: "columns",
                  labelDefault: "Columns",
                  labelKey: "columns",
                  iconKey: "columns",
                  toolPanel: "agColumnsToolPanel",
                },
                {
                  id: "filters",
                  labelDefault: "Filters",
                  labelKey: "filters",
                  iconKey: "filter",
                  toolPanel: "agFiltersToolPanel",
                },
              ],
              defaultToolPanel: "columns",
            }}
            statusBar={{
              statusPanels: [
                { statusPanel: "agTotalRowCountComponent", align: "left" },
                { statusPanel: "agFilteredRowCountComponent" },
              ],
            }}
            groupDisplayType="multipleColumns"
            loadingOverlayComponent={() => (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            overlayLoadingTemplate="Loading..."
            overlayNoRowsTemplate="No data to display"
          />
        </div>
      </CardContent>
    </Card>
  );
};
