import { GridApi, ColDef } from "ag-grid-enterprise";
import { ActionsRenderer } from "../components/ActionsRenderer";
import { EntitySelector } from "../selectors/EntitySelector";
import { CostCentreSelector } from "../selectors/CostCentreSelector";
import { StrategySelector } from "../selectors/StrategySelector";
import { CounterpartySelector } from "../selectors/CounterpartySelector";
import { CurrencySelector } from "../selectors/CurrencySelector";
import { DateCell } from "../components/DateCell";
import { AmountEditor } from "../components/AmountEditor";

interface Context {
  validConfigs?: any[];
  updateRowData?: (rowIndex: number, updates: any) => void;
}

export const createColumnDefs = (gridApi: GridApi | null, context: Context): ColDef[] => {
  const commonCellStyle = { 
    display: "flex", 
    alignItems: "center", 
    padding: "8px",
    justifyContent: "flex-start" 
  };

  const amountCellStyle = { 
    display: "flex", 
    alignItems: "center", 
    padding: "8px",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none !important",
    outline: "none !important",
    boxShadow: "none !important",
    textAlign: "center"
  };

  const amountColumnConfig: Partial<ColDef> = {
    editable: true,
    cellEditor: AmountEditor,
    valueParser: (params) => {
      if (!params.newValue) return null;
      const parsed = parseFloat(params.newValue.toString().replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? null : parsed;
    },
    valueFormatter: (params) => {
      if (params.value === null || params.value === undefined) return '';
      return Number(params.value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    cellStyle: amountCellStyle,
    cellClass: ['ag-cell-no-border', 'no-outline-cell', 'amount-cell'],
    suppressKeyboardEvent: (params) => {
      const { event } = params;
      return event.key === 'Enter' || event.key === 'Tab';
    },
    valueSetter: (params) => {
      const newValue = params.newValue;
      if (newValue === params.oldValue) return false;
      params.data[params.colDef.field as string] = newValue;
      return true;
    }
  };

  const baseColumnDefs: ColDef[] = [
    {
      headerName: "Entity Name",
      field: "entity_name",
      cellRenderer: EntitySelector,
      cellRendererParams: {
        context
      },
      editable: false
    },
    { 
      headerName: "Entity ID", 
      field: "entity_id",
      editable: false
    },
    {
      headerName: "Cost Centre",
      field: "cost_centre",
      cellRenderer: CostCentreSelector,
      cellRendererParams: {
        context
      },
      editable: false
    },
    {
      headerName: "Strategy",
      field: "strategy_name",
      cellRenderer: StrategySelector,
      cellRendererParams: {
        context
      },
      editable: false
    },
    { 
      headerName: "Instrument", 
      field: "instrument",
      editable: false
    },
    {
      headerName: "Counterparty",
      field: "counterparty_name",
      cellRenderer: CounterpartySelector,
      cellRendererParams: {
        context
      },
      editable: false
    },
    {
      headerName: "Buy Currency",
      field: "buy_currency",
      cellRenderer: CurrencySelector,
      cellRendererParams: {
        context
      },
      editable: false
    },
    {
      headerName: "Buy Amount",
      field: "buy_amount",
      ...amountColumnConfig
    },
    {
      headerName: "Sell Currency",
      field: "sell_currency",
      cellRenderer: CurrencySelector,
      cellRendererParams: {
        context
      },
      editable: false
    },
    {
      headerName: "Sell Amount",
      field: "sell_amount",
      ...amountColumnConfig
    },
    {
      headerName: "Trade Date",
      field: "trade_date",
      cellRenderer: DateCell,
      cellRendererParams: {
        context
      },
      editable: false
    },
    {
      headerName: "Settlement Date",
      field: "settlement_date",
      cellRenderer: DateCell,
      cellRendererParams: {
        context
      },
      editable: false
    },
    {
      headerName: "Actions",
      width: 100,
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onAddRow: () => gridApi?.applyTransaction({ add: [{}] }),
        updateRowData: context.updateRowData
      }
    }
  ];

  return baseColumnDefs.map(col => ({
    ...col,
    minWidth: col.minWidth ?? 150,
    cellStyle: col.cellStyle ?? commonCellStyle
  }));
};
