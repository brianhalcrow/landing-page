import { useMemo } from 'react';
import { getColumnDefs } from './grid/columnDefs';
import HedgeGrid from './grid/HedgeGrid';

const AdHocTab = () => {
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false,
    suppressSizeToFit: true,
    editable: true,
  };

  const initialRowData = useMemo(() => [{
    entity_id: '',
    entity_name: '',
    instrument: '',
    strategy: '',
    base_currency: '',
    quote_currency: '',
    currency_pair: '',
    trade_date: '',
    settlement_date: '',
    buy_sell: '',
    buy_sell_currency_code: '',
    buy_sell_amount: ''
  }], []);

  return (
    <HedgeGrid
      rowData={initialRowData}
      columnDefs={getColumnDefs()}
      defaultColDef={defaultColDef}
    />
  );
};

export default AdHocTab;