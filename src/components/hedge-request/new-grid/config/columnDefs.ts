
import { ColDef, GridApi } from "ag-grid-community";
import { ValidHedgeConfig } from "../types/hedgeRequest.types";

interface Context {
  validConfigs?: ValidHedgeConfig[];
  updateRowData?: (rowIndex: number, updates: any) => void;
}

export const createColumnDefs = (gridApi: GridApi | null, context: Context) => [
  {
    headerName: "Entity Name",
    field: "entity_name",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: Array.from(new Set(context.validConfigs?.map(c => c.entity_name) || [])),
      cellRenderer: (params: any) => params.value || ''
    },
    minWidth: 200
  },
  {
    headerName: "Entity ID",
    field: "entity_id",
    editable: false,
    minWidth: 150,
    valueGetter: (params: any) => {
      const config = context.validConfigs?.find(c => c.entity_name === params.data?.entity_name);
      return config?.entity_id || '';
    }
  },
  {
    headerName: "Cost Centre",
    field: "cost_centre",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: (params: any) => ({
      values: Array.from(new Set(
        context.validConfigs
          ?.filter(c => c.entity_id === params.data?.entity_id)
          .map(c => c.cost_centre) || []
      )),
      cellRenderer: (params: any) => params.value || ''
    }),
    minWidth: 150,
    valueSetter: (params: any) => {
      const { data, newValue } = params;
      if (context?.updateRowData) {
        context.updateRowData(params.node.rowIndex, { cost_centre: newValue });
      }
      return true;
    }
  },
  {
    headerName: "Strategy",
    field: "strategy_name",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: (params: any) => ({
      values: Array.from(new Set(
        context.validConfigs
          ?.filter(c => c.entity_id === params.data?.entity_id)
          .map(c => c.strategy_name) || []
      )),
      cellRenderer: (params: any) => params.value || ''
    }),
    minWidth: 200
  },
  {
    headerName: "Instrument",
    field: "instrument",
    editable: false,
    minWidth: 150,
    valueGetter: (params: any) => {
      const config = context.validConfigs?.find(
        c => c.entity_id === params.data?.entity_id && 
             c.strategy_name === params.data?.strategy_name
      );
      return config?.instrument || '';
    }
  },
  {
    headerName: "Counterparty",
    field: "counterparty_name",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: (params: any) => ({
      values: Array.from(new Set(
        context.validConfigs
          ?.filter(c => 
            c.entity_id === params.data?.entity_id && 
            c.strategy_name === params.data?.strategy_name
          )
          .map(c => c.counterparty_name) || []
      )),
      cellRenderer: (params: any) => params.value || ''
    }),
    minWidth: 200
  },
  {
    headerName: "Buy Currency",
    field: "buy_currency",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'],
      cellRenderer: (params: any) => params.value || ''
    },
    minWidth: 150
  },
  {
    headerName: "Buy Amount",
    field: "buy_amount",
    editable: true,
    type: 'numericColumn',
    minWidth: 150
  },
  {
    headerName: "Sell Currency",
    field: "sell_currency",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'],
      cellRenderer: (params: any) => params.value || ''
    },
    minWidth: 150
  },
  {
    headerName: "Sell Amount",
    field: "sell_amount",
    editable: true,
    type: 'numericColumn',
    minWidth: 150
  },
  {
    headerName: "Trade Date",
    field: "trade_date",
    editable: true,
    cellEditor: 'agDateCellEditor',
    minWidth: 150
  },
  {
    headerName: "Settlement Date",
    field: "settlement_date",
    editable: true,
    cellEditor: 'agDateCellEditor',
    minWidth: 150
  }
];
