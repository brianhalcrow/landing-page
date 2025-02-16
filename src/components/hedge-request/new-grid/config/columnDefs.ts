
import { GridApi, ColDef } from "ag-grid-enterprise";
import { ActionsRenderer } from "../components/ActionsRenderer";
import { EntitySelector } from "../selectors/EntitySelector";
import { CostCentreSelector } from "../selectors/CostCentreSelector";
import { StrategySelector } from "../selectors/StrategySelector";
import { CounterpartySelector } from "../selectors/CounterpartySelector";
import { CurrencySelector } from "../selectors/CurrencySelector";

interface Context {
  validConfigs?: any[];
  updateRowData?: (rowIndex: number, updates: any) => void;
}

export const createColumnDefs = (gridApi: GridApi | null, context: Context): ColDef[] => {
  const commonCellStyle = { display: "flex", alignItems: "center", padding: "8px" };
  const amountCellStyle = { 
    display: "flex", 
    alignItems: "center", 
    padding: "8px",
    backgroundColor: "transparent"
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
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: params => params.value ? Number(params.value).toLocaleString() : "",
      valueParser: params => params.newValue ? params.newValue.replace(/,/g, "") : null,
      cellStyle: amountCellStyle,
      cellClass: 'ag-cell-no-border',
      cellEditorStyle: {
        border: 'none',
        outline: 'none',
        width: '100%',
        height: '100%',
        padding: '0',
        background: 'transparent'
      }
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
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: params => params.value ? Number(params.value).toLocaleString() : "",
      valueParser: params => params.newValue ? params.newValue.replace(/,/g, "") : null,
      cellStyle: amountCellStyle,
      cellClass: 'ag-cell-no-border',
      cellEditorStyle: {
        border: 'none',
        outline: 'none',
        width: '100%',
        height: '100%',
        padding: '0',
        background: 'transparent'
      }
    },
    {
      headerName: "Trade Date",
      field: "trade_date",
      editable: true,
      cellEditor: 'agDateCellEditor',
      cellEditorPopup: true
    },
    {
      headerName: "Settlement Date",
      field: "settlement_date",
      editable: true,
      cellEditor: 'agDateCellEditor',
      cellEditorPopup: true
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
