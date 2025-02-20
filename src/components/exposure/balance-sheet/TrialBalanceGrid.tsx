
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
  const { data, isLoading, error } = useTrialBalanceQuery();

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
          <div className="text-red-500">Error loading trial balance: {error}</div>
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
            suppressLoadingOverlay={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
