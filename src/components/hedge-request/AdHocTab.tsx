import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect, useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { gridStyles } from '../configuration/grid/gridStyles';
import EmptyGridMessage from '../configuration/grid/EmptyGridMessage';
import { ColDef, ValueGetterParams, ValueSetterParams } from 'ag-grid-community';
import { useToast } from "@/hooks/use-toast";

const AdHocTab = () => {
  const gridRef = useRef<AgGridReact>(null);
  const { toast } = useToast();

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false,
    suppressSizeToFit: true,
    editable: true,
  };

  const validateDate = (params: ValueSetterParams) => {
    const value = params.newValue;
    if (!value) return false;
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      toast({
        title: "Invalid Date",
        description: "Please enter a valid date in YYYY-MM-DD format",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateAmount = (params: ValueSetterParams) => {
    const value = Number(params.newValue);
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be a positive number",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateBuySell = (params: ValueSetterParams) => {
    const value = params.newValue?.toUpperCase();
    if (!['BUY', 'SELL'].includes(value)) {
      toast({
        title: "Invalid Buy/Sell",
        description: "Value must be either BUY or SELL",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const columnDefs: ColDef[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      width: 110,
      editable: true,
      cellEditor: 'agTextCellEditor',
      cellEditorParams: {
        required: true,
      }
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      width: 200,
      editable: true,
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument', 
      width: 120,
      editable: true,
    },
    { 
      field: 'strategy', 
      headerName: 'Strategy', 
      width: 120,
      editable: true,
    },
    { 
      field: 'base_currency', 
      headerName: 'Base Currency', 
      width: 120,
      editable: true,
    },
    { 
      field: 'quote_currency', 
      headerName: 'Quote Currency', 
      width: 120,
      editable: true,
    },
    { 
      field: 'currency_pair', 
      headerName: 'Currency Pair', 
      width: 120,
      editable: false,
      valueGetter: (params: ValueGetterParams) => {
        const base = params.data?.base_currency;
        const quote = params.data?.quote_currency;
        return base && quote ? `${base}/${quote}` : '';
      }
    },
    { 
      field: 'trade_date', 
      headerName: 'Trade Date', 
      width: 120,
      editable: true,
      valueSetter: validateDate,
    },
    { 
      field: 'settlement_date', 
      headerName: 'Settlement Date', 
      width: 120,
      editable: true,
      valueSetter: (params: ValueSetterParams) => {
        if (!validateDate(params)) return false;
        
        const tradeDate = new Date(params.data.trade_date);
        const settlementDate = new Date(params.newValue);
        
        if (settlementDate <= tradeDate) {
          toast({
            title: "Invalid Settlement Date",
            description: "Settlement date must be after trade date",
            variant: "destructive"
          });
          return false;
        }
        return true;
      }
    },
    { 
      field: 'buy_sell', 
      headerName: 'Buy/Sell', 
      width: 100,
      editable: true,
      valueSetter: validateBuySell,
    },
    { 
      field: 'buy_sell_currency_code', 
      headerName: 'Currency Code', 
      width: 120,
      editable: true,
    },
    { 
      field: 'buy_sell_amount', 
      headerName: 'Amount', 
      width: 120,
      type: 'numericColumn',
      editable: true,
      valueSetter: validateAmount,
    },
  ];

  const columnState = columnDefs.map(def => ({
    colId: def.field,
    width: def.width,
  }));

  // Initialize with one empty row
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
    buy_sell_amount: '',
  }], []);

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
        rowData={initialRowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="single"
        suppressRowClickSelection={false}
      />
    </div>
  );
};

export default AdHocTab;
