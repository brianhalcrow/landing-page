
import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => [
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'counterparty',
    headerName: 'Counterparty',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'buy_sell',
    headerName: 'Buy/Sell',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['BUY', 'SELL']
    }
  },
  {
    field: 'amount',
    headerName: 'Amount',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    type: 'numericColumn'
  },
  {
    field: 'currency',
    headerName: 'Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'trade_date',
    headerName: 'Trade Date',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agDateCellEditor'
  },
  {
    field: 'settlement_date',
    headerName: 'Settlement Date',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true,
    cellEditor: 'agDateCellEditor'
  }
];
