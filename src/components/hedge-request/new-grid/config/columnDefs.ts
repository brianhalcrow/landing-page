import { GridApi, ColDef } from "ag-grid-enterprise";
import { EntitySelector } from "../selectors/EntitySelector";
import { StrategySelector } from "../selectors/StrategySelector";
import { CounterpartySelector } from "../selectors/CounterpartySelector";
import { CostCentreSelector } from "../selectors/CostCentreSelector";
import { CurrencySelector } from "../selectors/CurrencySelector";
import { DateCell } from "../components/DateCell";
import { ActionsRenderer } from "../components/ActionsRenderer";

interface Context {
  validConfigs?: any[];
  updateRowData?: (rowIndex: number, updates: any) => void;
}

// Define common cell styles
const commonCellStyle = { display: "flex", alignItems: "center", padding: "8px" };

// Function to generate column definitions dynamically
export const createColumnDefs = (gridApi: GridApi | null, context: Context): ColDef[] => {
  const baseColumnDefs: ColDef[] = [
    { headerName: "Entity Name", field: "entity_name", cellRenderer: EntitySelector },
    { headerName: "Entity ID", field: "entity_id", cellRenderer: EntitySelector },
    { headerName: "Cost Centre", field: "cost_centre", cellRenderer: CostCentreSelector },
    { headerName: "Strategy", field: "strategy_name", cellRenderer: StrategySelector },
    { headerName: "Instrument", field: "instrument" },
    { headerName: "Counterparty", field: "counterparty_name", cellRenderer: CounterpartySelector },
    { 
      headerName: "Buy Currency", 
      field: "buy_currency", 
      cellRenderer: CurrencySelector,
      valueGetter: params => params.data?.buy_currency || "",
      valueSetter: params => {
        params.data.buy_currency = params.newValue || "";
        return true;
      }
    },
    { 
      headerName: "Buy Amount", 
      field: "buy_amount", 
      editable: true, 
      cellEditor: "agTextCellEditor", 
      cellEditorParams: { useFormatter: true },
      valueFormatter: params => params.value ? Number(params.value).toLocaleString() : "",
      valueParser: params => params.newValue ? params.newValue.replace(/,/g, "") : null
    },
    { 
      headerName: "Sell Currency", 
      field: "sell_currency", 
      cellRenderer: CurrencySelector,
      valueGetter: params => params.data?.sell_currency || "",
      valueSetter: params => {
        params.data.sell_currency = params.newValue || "";
        return true;
      }
    },
    { 
      headerName: "Sell Amount", 
      field: "sell_amount", 
      editable: true, 
      cellEditor: "agTextCellEditor", 
      cellEditorParams: { useFormatter: true },
      valueFormatter: params => params.value ? Number(params.value).toLocaleString() : "",
      valueParser: params => params.newValue ? params.newValue.replace(/,/g, "") : null
    },
    { headerName: "Trade Date", field: "trade_date", cellRenderer: DateCell },
    { headerName: "Settlement Date", field: "settlement_date", cellRenderer: DateCell },
    { 
      headerName: "Actions", 
      width: 180, 
      cellRenderer: ActionsRenderer, 
      suppressSizeToFit: true,
      cellRendererParams: { 
        onAddRow: () => gridApi?.applyTransaction({ add: [{}] }),  // ✅ Now `gridApi` is properly passed
        updateRowData: context.updateRowData
      }
    }
  ];

  // Apply default properties to all columns
  return baseColumnDefs.map(col => ({
    ...col,
    minWidth: (col as ColDef).minWidth ?? 150, // ✅ Explicitly casting `col` as `ColDef`
    sortable: col.sortable ?? false,
    filter: col.filter ?? false,
    cellStyle: col.cellStyle ?? commonCellStyle
  }));
};

