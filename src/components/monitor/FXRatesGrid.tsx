import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface FXRate {
  rate_date: string;
  base_currency: string;
  quote_currency: string;
  closing_rate: number;
  currency_pair: string;
  timestamp: string;
  pl_month: string;
  bs_month: string;
}

const columnDefs = [
  { field: 'currency_pair', headerName: 'Currency Pair', sortable: true, filter: true },
  { field: 'base_currency', headerName: 'Base Currency', sortable: true, filter: true },
  { field: 'quote_currency', headerName: 'Quote Currency', sortable: true, filter: true },
  { 
    field: 'closing_rate', 
    headerName: 'Rate', 
    sortable: true, 
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: any) => params.value?.toFixed(4)
  },
  { 
    field: 'rate_date', 
    headerName: 'Date', 
    sortable: true, 
    filter: true,
    valueFormatter: (params: any) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString();
    }
  },
  { field: 'pl_month', headerName: 'P&L Month', sortable: true, filter: true },
  { field: 'bs_month', headerName: 'B/S Month', sortable: true, filter: true },
];

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  resizable: true,
};

const FXRatesGrid = () => {
  const [rowData, setRowData] = useState<FXRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.sensefx.io/pre_trade_rates');
        const data = await response.json();
        setRowData(data);
      } catch (error) {
        console.error('Error fetching FX rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return <div>Loading FX rates...</div>;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={15}
      />
    </div>
  );
};

export default FXRatesGrid;