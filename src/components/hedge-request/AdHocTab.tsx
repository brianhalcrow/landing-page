import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { gridStyles } from '../configuration/grid/gridStyles';
import EmptyGridMessage from '../configuration/grid/EmptyGridMessage';
import { ColDef } from 'ag-grid-community';

const AdHocTab = () => {
  const gridRef = useRef<AgGridReact>(null);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false,
    suppressSizeToFit: true,
  };

  const columnDefs: ColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 110 },
    { field: 'entity_name', headerName: 'Entity Name', width: 200 },
    { field: 'instrument', headerName: 'Instrument', width: 120 },
    { field: 'strategy', headerName: 'Strategy', width: 120 },
    { field: 'base_currency', headerName: 'Base Currency', width: 120 },
    { field: 'quote_currency', headerName: 'Quote Currency', width: 120 },
    { field: 'currency_pair', headerName: 'Currency Pair', width: 120 },
    { field: 'trade_date', headerName: 'Trade Date', width: 120 },
    { field: 'settlement_date', headerName: 'Settlement Date', width: 120 },
    { field: 'buy_sell', headerName: 'Buy/Sell', width: 100 },
    { field: 'buy_sell_currency_code', headerName: 'Currency Code', width: 120 },
    { field: 'buy_sell_amount', headerName: 'Amount', width: 120, type: 'numericColumn' },
  ];

  const columnState = columnDefs.map(def => ({
    colId: def.field,
    width: def.width,
  }));

  useEffect(() => {
    if (gridRef.current?.columnApi) {
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, []);

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>{gridStyles}</style>
      <AgGridReact
        ref={gridRef}
        rowData={[]} // Empty for now, will be populated when submitting
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
      />
    </div>
  );
};

export default AdHocTab;