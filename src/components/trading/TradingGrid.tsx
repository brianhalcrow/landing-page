
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

  // Create 10 columns with no headers
  const columnDefs: ColDef[] = Array(10).fill(null).map((_, index) => ({
    field: `col${index}`,
    headerName: '',
    width: 100,
    suppressMenu: true,
    sortable: false,
    filter: false,
    headerClass: 'hide-header'
  }));

  // Create 10x10 grid data
  const rowData = Array(10).fill(null).map(() => ({
    col0: '',
    col1: '',
    col2: '',
    col3: '',
    col4: '',
    col5: '',
    col6: '',
    col7: '',
    col8: '',
    col9: ''
  }));

  return (
    <div className="p-4">
      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: '1000px',
          width: '1000px'
        }}
      >
        <GridStyles />
        <style>
          {`
            .hide-header {
              display: none;
            }
            .ag-root-wrapper {
              border: none !important;
            }
            .ag-row {
              border: 1px solid #ddd !important;
            }
            .ag-cell {
              border-right: 1px solid #ddd !important;
            }
          `}
        </style>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          suppressMovableColumns={true}
          suppressColumnMoveAnimation={true}
          suppressRowHoverHighlight={true}
          rowSelection={null}
          headerHeight={0}
        />
      </div>
    </div>
  );
};

export default TradingGrid;
