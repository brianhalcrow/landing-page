
import React, { useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueFormatterParams, CellClassParams } from 'ag-grid-community';
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { GRID_CONFIG, MOCK_BANK_DATA } from './constants';
import { TradingState } from './types';
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

const TradingGrid = () => {
  const [tradingState, setTradingState] = useState<TradingState>({
    baseCurrency: 'EUR',
    termCurrency: 'USD',
    amount: 1000000,
    direction: 'BUY',
    quotes: MOCK_BANK_DATA
  });

  const numberFormatter = (params: ValueFormatterParams) => {
    if (typeof params.value === 'number') {
      return params.value.toFixed(4);
    }
    return params.value;
  };

  const columnDefs: ColDef[] = [
    { 
      field: 'bankName', 
      headerName: 'Bank',
      width: 120,
      suppressMovable: true,
    },
    { 
      field: 'buySpot', 
      headerName: 'Spot',
      width: 100,
      valueFormatter: numberFormatter,
      cellClass: (params: CellClassParams) => {
        return ['rate-cell', 'buy-cell'];
      }
    },
    { 
      field: 'buyPoints', 
      headerName: 'Points',
      width: 100,
      valueFormatter: numberFormatter,
      cellClass: 'points-cell'
    },
    { 
      field: 'buyContract', 
      headerName: 'Contract',
      width: 100,
      valueFormatter: numberFormatter,
      cellClass: 'contract-cell'
    },
    { 
      field: 'sellSpot', 
      headerName: 'Spot',
      width: 100,
      valueFormatter: numberFormatter,
      cellClass: (params: CellClassParams) => {
        return ['rate-cell', 'sell-cell'];
      }
    },
    { 
      field: 'sellPoints', 
      headerName: 'Points',
      width: 100,
      valueFormatter: numberFormatter,
      cellClass: 'points-cell'
    }
  ];

  const onCellClicked = useCallback((event: any) => {
    if (event.colDef.field?.includes('buy') || event.colDef.field?.includes('sell')) {
      console.log('Rate clicked:', event.value);
      // Future implementation: handle trade execution
    }
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4 items-center">
        <div className="space-y-2">
          <div className="font-semibold">Currency Pair</div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{tradingState.baseCurrency}/{tradingState.termCurrency}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">Amount</div>
          <input 
            type="number" 
            value={tradingState.amount}
            onChange={(e) => setTradingState(prev => ({ ...prev, amount: Number(e.target.value) }))}
            className="p-2 border rounded w-40"
          />
        </div>
      </div>

      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: '400px',
          width: '100%'
        }}
      >
        <GridStyles />
        <style>
          {`
            .rate-cell {
              background-color: #f8fafc;
              font-weight: 500;
            }
            .buy-cell {
              color: #059669;
            }
            .sell-cell {
              color: #dc2626;
            }
            .points-cell {
              background-color: #f1f5f9;
            }
            .contract-cell {
              background-color: #e2e8f0;
              font-weight: 600;
            }
          `}
        </style>
        <AgGridReact
          rowData={tradingState.quotes}
          columnDefs={columnDefs}
          suppressMovableColumns={true}
          suppressRowHoverHighlight={false}
          onCellClicked={onCellClicked}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default TradingGrid;
