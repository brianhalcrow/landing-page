
import { GridApi, ColDef } from "ag-grid-enterprise";
import { ActionsRenderer } from "../components/ActionsRenderer";
import { EntitySelector } from "../selectors/EntitySelector";
import { CostCentreSelector } from "../selectors/CostCentreSelector";
import { StrategySelector } from "../selectors/StrategySelector";
import { CounterpartySelector } from "../selectors/CounterpartySelector";
import { CurrencySelector } from "../selectors/CurrencySelector";
import { DateCell } from "../components/DateCell";
import { HedgeRequestRow } from "../types/hedgeRequest.types";

interface Context {
  validConfigs?: any[];
  updateRowData?: (rowIndex: number, updates: any) => void;
  onRemoveRow?: (row: HedgeRequestRow) => void;
}

export const createColumnDefs = (gridApi: GridApi | null, context: Context): ColDef[] => {
  const commonCellStyle = { 
    display: "flex", 
    alignItems: "center", 
    padding: "8px",
    justifyContent: "flex-end"  // Changed to right-align all cells
  };

  const amountColumnConfig: Partial<ColDef> = {
    type: 'numericColumn',
    editable: true,
    valueFormatter: (params) => {
      if (params.value === null || params.value === undefined) return '';
      return Number(params.value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    cellStyle: commonCellStyle
  };

  const baseColumnDefs: ColDef[] = [
    {
      headerName: "Entity Name",
      field: "entity_name",
      cellRenderer: EntitySelector,
      cellRendererParams: {
        context
      },
      editable: false,
      flex: 1,
      minWidth: 150,
      cellStyle: commonCellStyle
    },
    { 
      headerName: "Entity ID", 
      field: "entity_id",
      editable: false,
      minWidth: 100,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Cost Centre",
      field: "cost_centre",
      cellRenderer: CostCentreSelector,
      cellRendererParams: {
        context
      },
      editable: false,
      minWidth: 120,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Strategy",
      field: "strategy_name",
      cellRenderer: StrategySelector,
      cellRendererParams: {
        context
      },
      editable: false,
      flex: 1,
      minWidth: 150,
      cellStyle: commonCellStyle
    },
    { 
      headerName: "Instrument", 
      field: "instrument",
      editable: false,
      minWidth: 120,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Counterparty",
      field: "counterparty_name",
      cellRenderer: CounterpartySelector,
      cellRendererParams: {
        context
      },
      editable: false,
      flex: 1,
      minWidth: 150,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Buy Currency",
      field: "buy_currency",
      cellRenderer: CurrencySelector,
      cellRendererParams: {
        context
      },
      editable: false,
      minWidth: 120,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Buy Amount",
      field: "buy_amount",
      ...amountColumnConfig,
      minWidth: 120
    },
    {
      headerName: "Sell Currency",
      field: "sell_currency",
      cellRenderer: CurrencySelector,
      cellRendererParams: {
        context
      },
      editable: false,
      minWidth: 120,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Sell Amount",
      field: "sell_amount",
      ...amountColumnConfig,
      minWidth: 120
    },
    {
      headerName: "Trade Date",
      field: "trade_date",
      cellRenderer: DateCell,
      cellRendererParams: {
        context
      },
      editable: false,
      minWidth: 150,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Settlement Date",
      field: "settlement_date",
      cellRenderer: DateCell,
      cellRendererParams: {
        context
      },
      editable: false,
      minWidth: 150,
      cellStyle: commonCellStyle
    },
    {
      headerName: "Actions",
      minWidth: 150,
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onRemoveRow: context.onRemoveRow,
        updateRowData: context.updateRowData,
        onAddRow: () => {
          if (gridApi) {
            gridApi.applyTransaction({ add: [{ rowId: crypto.randomUUID() }] });
          }
        }
      }
    }
  ];

  return baseColumnDefs;
};
