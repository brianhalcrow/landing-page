
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
    minWidth: 200,
    valueSetter: (params: any) => {
      const { data, newValue } = params;
      const config = context.validConfigs?.find(c => c.entity_name === newValue);
      if (config && context?.updateRowData) {
        context.updateRowData(params.node.rowIndex, {
          entity_name: newValue,
          entity_id: config.entity_id,
          // Clear dependent fields
          strategy_name: '',
          instrument: '',
          counterparty_name: '',
          cost_centre: ''
        });
      }
      return true;
    }
  },
  {
    headerName: "Entity ID",
    field: "entity_id",
    editable: false,
    minWidth: 150
  },
  {
    headerName: "Cost Centre",
    field: "cost_centre",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: (params: any) => {
      if (!params.data?.entity_id) return { values: [] };
      const costCentres = Array.from(new Set(
        context.validConfigs
          ?.filter(c => c.entity_id === params.data.entity_id)
          .map(c => c.cost_centre)
      ));
      return {
        values: costCentres,
        cellRenderer: (params: any) => params.value || ''
      };
    },
    minWidth: 150
  },
  {
    headerName: "Strategy",
    field: "strategy_name",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: (params: any) => {
      if (!params.data?.entity_id) return { values: [] };
      const strategies = Array.from(new Set(
        context.validConfigs
          ?.filter(c => c.entity_id === params.data.entity_id)
          .map(c => c.strategy_name)
      ));
      return {
        values: strategies,
        cellRenderer: (params: any) => params.value || ''
      };
    },
    minWidth: 200,
    valueSetter: (params: any) => {
      const { data, newValue } = params;
      const config = context.validConfigs?.find(
        c => c.entity_id === data.entity_id && c.strategy_name === newValue
      );
      if (config && context?.updateRowData) {
        context.updateRowData(params.node.rowIndex, {
          strategy_name: newValue,
          instrument: config.instrument,
          counterparty_name: '' // Clear counterparty when strategy changes
        });
      }
      return true;
    }
  },
  {
    headerName: "Instrument",
    field: "instrument",
    editable: false,
    minWidth: 150
  },
  {
    headerName: "Counterparty",
    field: "counterparty_name",
    editable: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: (params: any) => {
      if (!params.data?.entity_id || !params.data?.strategy_name) return { values: [] };
      const counterparties = Array.from(new Set(
        context.validConfigs
          ?.filter(c => 
            c.entity_id === params.data.entity_id && 
            c.strategy_name === params.data.strategy_name
          )
          .map(c => c.counterparty_name)
      ));
      return {
        values: counterparties,
        cellRenderer: (params: any) => params.value || ''
      };
    },
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
