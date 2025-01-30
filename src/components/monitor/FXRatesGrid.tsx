import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface FXRate {
  currency_pair: string;
  spot_rate: number;
  time: string;
  tenor: string;
  bid: number;
  ask: number;
  rate_date: string;
  all_in_bid: number;
  all_in_ask: number;
}

const columnDefs: ColDef<FXRate>[] = [
  { 
    field: 'currency_pair',
    headerName: 'Currency Pair',
    sortable: true,
    filter: true 
  },
  { 
    field: 'spot_rate',
    headerName: 'Spot Rate',
    sortable: true,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: { value: number }) => params.value?.toFixed(6)
  },
  { 
    field: 'time',
    headerName: 'Time',
    sortable: true,
    filter: true
  },
  { 
    field: 'tenor',
    headerName: 'Tenor',
    sortable: true,
    filter: true
  },
  { 
    field: 'bid',
    headerName: 'Bid',
    sortable: true,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: { value: number }) => params.value?.toFixed(3)
  },
  { 
    field: 'ask',
    headerName: 'Ask',
    sortable: true,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: { value: number }) => params.value?.toFixed(3)
  },
  { 
    field: 'rate_date',
    headerName: 'Rate Date',
    sortable: true,
    filter: true,
    valueFormatter: (params: { value: string }) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString();
    }
  },
  { 
    field: 'all_in_bid',
    headerName: 'All-in Bid',
    sortable: true,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: { value: number }) => params.value?.toFixed(8)
  },
  { 
    field: 'all_in_ask',
    headerName: 'All-in Ask',
    sortable: true,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: { value: number }) => params.value?.toFixed(8)
  }
];

const defaultColDef: ColDef<FXRate> = {
  flex: 1,
  minWidth: 100,
  resizable: true,
};

const FXRatesGrid = () => {
  const [rowData, setRowData] = useState<FXRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.sensefx.io/pre_trade_rates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRowData(data);
      } catch (error) {
        console.error('Error fetching FX rates:', error);
        setError('Failed to load FX rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return <div>Loading FX rates...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-96 ag-theme-alpine">
      <AgGridReact<FXRate>
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