
import { GridApi } from "ag-grid-community";
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

export const createColumnDefs = (gridApi: GridApi | null, context: Context) => [
  {
    headerName: "Entity Name",
    field: "entity_name",
    cellRenderer: EntitySelector,
    cellRendererParams: {
      context
    },
    minWidth: 200,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Entity ID",
    field: "entity_id",
    cellRenderer: EntitySelector,
    cellRendererParams: {
      context
    },
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Cost Centre",
    field: "cost_centre",
    cellRenderer: CostCentreSelector,
    cellRendererParams: {
      context
    },
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Strategy",
    field: "strategy_name",
    cellRenderer: StrategySelector,
    cellRendererParams: {
      context
    },
    minWidth: 200,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Instrument",
    field: "instrument",
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Counterparty",
    field: "counterparty_name",
    cellRenderer: CounterpartySelector,
    cellRendererParams: {
      context
    },
    minWidth: 200,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Buy Currency",
    field: "buy_currency",
    cellRenderer: CurrencySelector,
    valueGetter: (params: any) => params.data?.buy_currency || '',
    valueSetter: (params: any) => {
      const newValue = params.newValue || '';
      params.data.buy_currency = newValue;
      return true;
    },
    cellRendererParams: {
      context
    },
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Buy Amount",
    field: "buy_amount",
    editable: true,
    minWidth: 150,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      useFormatter: true
    },
    cellStyle: { 
      display: 'flex', 
      alignItems: 'center',
      padding: '8px'
    },
    valueFormatter: (params: any) => {
      if (params.value) {
        return Number(params.value).toLocaleString();
      }
      return '';
    },
    valueParser: (params: any) => {
      return params.newValue ? params.newValue.replace(/,/g, '') : null;
    }
  },
  {
    headerName: "Sell Currency",
    field: "sell_currency",
    cellRenderer: CurrencySelector,
    valueGetter: (params: any) => params.data?.sell_currency || '',
    valueSetter: (params: any) => {
      const newValue = params.newValue || '';
      params.data.sell_currency = newValue;
      return true;
    },
    cellRendererParams: {
      context
    },
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Sell Amount",
    field: "sell_amount",
    editable: true,
    minWidth: 150,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      useFormatter: true
    },
    cellStyle: { 
      display: 'flex', 
      alignItems: 'center',
      padding: '8px'
    },
    valueFormatter: (params: any) => {
      if (params.value) {
        return Number(params.value).toLocaleString();
      }
      return '';
    },
    valueParser: (params: any) => {
      return params.newValue ? params.newValue.replace(/,/g, '') : null;
    }
  },
  {
    headerName: "Trade Date",
    field: "trade_date",
    cellRenderer: DateCell,
    cellRendererParams: {
      context
    },
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Settlement Date",
    field: "settlement_date",
    cellRenderer: DateCell,
    cellRendererParams: {
      context
    },
    minWidth: 150,
    cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    headerName: "Actions",
    width: 180,
    cellRenderer: ActionsRenderer,
    cellRendererParams: {
      onAddRow: () => gridApi?.applyTransaction({ add: [{}] }),
      updateRowData: context.updateRowData
    },
    sortable: false,
    filter: false,
    suppressSizeToFit: true,
    cellStyle: { display: 'flex', alignItems: 'center' }
  }
];
