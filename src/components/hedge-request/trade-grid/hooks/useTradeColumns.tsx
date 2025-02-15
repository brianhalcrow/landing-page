
import { ColDef } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { CurrencyCellEditor } from '../components/CurrencyCellEditor';

export const useTradeColumns = (): ColDef<HedgeRequestDraftTrade>[] => {
  return [
    {
      field: 'entity_id',
      headerName: 'Entity ID',
      editable: false,
    },
    {
      field: 'entity_name',
      headerName: 'Entity Name',
      editable: false,
    },
    {
      field: 'strategy_name',
      headerName: 'Strategy',
      editable: true,
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      editable: true,
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: true,
      type: 'dateColumn',
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: true,
      type: 'dateColumn',
    },
    {
      field: 'buy_currency',
      headerName: 'Buy Currency',
      editable: true,
      cellEditor: CurrencyCellEditor,
    },
    {
      field: 'sell_currency',
      headerName: 'Sell Currency',
      editable: true,
      cellEditor: CurrencyCellEditor,
    },
    {
      field: 'buy_amount',
      headerName: 'Buy Amount',
      editable: true,
      type: 'numericColumn',
    },
    {
      field: 'sell_amount',
      headerName: 'Sell Amount',
      editable: true,
      type: 'numericColumn',
    },
    {
      field: 'cost_centre',
      headerName: 'Cost Centre',
      editable: true,
    },
    {
      field: 'counterparty_name',
      headerName: 'Counterparty',
      editable: true,
    },
    {
      field: 'spot_rate',
      headerName: 'Spot Rate',
      editable: true,
      type: 'numericColumn',
    },
    {
      field: 'contract_rate',
      headerName: 'Contract Rate',
      editable: true,
      type: 'numericColumn',
    }
  ];
};
