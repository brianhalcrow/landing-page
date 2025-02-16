
import { GridApi, ColDef } from "ag-grid-enterprise";
import { ActionsRenderer } from "../components/ActionsRenderer";

interface Context {
  validConfigs?: any[];
  updateRowData?: (rowIndex: number, updates: any) => void;
}

export const createColumnDefs = (gridApi: GridApi | null, context: Context): ColDef[] => {
  const commonCellStyle = { display: "flex", alignItems: "center", padding: "8px" };

  const baseColumnDefs: ColDef[] = [
    {
      headerName: "Entity Name",
      field: "entity_name",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: Array.from(new Set(context.validConfigs?.map(config => config.entity_name) || [])),
      },
      editable: true
    },
    { 
      headerName: "Entity ID", 
      field: "entity_id",
      editable: false
    },
    {
      headerName: "Cost Centre",
      field: "cost_centre",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params: any) => ({
        values: Array.from(new Set(context.validConfigs
          ?.filter(config => config.entity_id === params.data.entity_id)
          .map(config => config.cost_centre) || [])),
      }),
      editable: true
    },
    {
      headerName: "Strategy",
      field: "strategy_name",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params: any) => ({
        values: Array.from(new Set(context.validConfigs
          ?.filter(config => config.entity_id === params.data.entity_id)
          .map(config => config.strategy_name) || [])),
      }),
      editable: true
    },
    { 
      headerName: "Instrument", 
      field: "instrument",
      editable: false
    },
    {
      headerName: "Counterparty",
      field: "counterparty_name",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params: any) => ({
        values: Array.from(new Set(context.validConfigs
          ?.filter(config => 
            config.entity_id === params.data.entity_id &&
            config.strategy_name === params.data.strategy_name
          )
          .map(config => config.counterparty_name) || [])),
      }),
      editable: true
    },
    {
      headerName: "Buy Currency",
      field: "buy_currency",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SGD']
      },
      editable: true
    },
    {
      headerName: "Buy Amount",
      field: "buy_amount",
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: params => params.value ? Number(params.value).toLocaleString() : "",
      valueParser: params => params.newValue ? params.newValue.replace(/,/g, "") : null
    },
    {
      headerName: "Sell Currency",
      field: "sell_currency",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SGD']
      },
      editable: true
    },
    {
      headerName: "Sell Amount",
      field: "sell_amount",
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: params => params.value ? Number(params.value).toLocaleString() : "",
      valueParser: params => params.newValue ? params.newValue.replace(/,/g, "") : null
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
