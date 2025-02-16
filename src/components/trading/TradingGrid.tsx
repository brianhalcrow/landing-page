
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

  // Create grid cell data with specific content
  const createGridData = () => {
    const data = Array(10).fill(null).map(() => ({
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

    // Set header labels
    data[GRID_CONFIG.headerCells.sell.row].col2 = 'SELL';
    data[GRID_CONFIG.headerCells.buy.row].col5 = 'BUY';
    
    // Set currency pair
    data[GRID_CONFIG.inputCells.currencies.base.row].col2 = tradingState.baseCurrency;
    data[GRID_CONFIG.inputCells.currencies.term.row].col4 = tradingState.termCurrency;
    
    // Set amount
    data[GRID_CONFIG.inputCells.amount.row].col3 = tradingState.amount.toString();
    
    // Set currency labels
    data[GRID_CONFIG.headerCells.buyBase.row].col2 = `Buy ${tradingState.baseCurrency}`;
    data[GRID_CONFIG.headerCells.sellTerm.row].col4 = `Sell ${tradingState.termCurrency}`;
    
    // Set bank data
    tradingState.quotes.forEach((quote, index) => {
      const rowIndex = GRID_CONFIG.bankMatrix.startRow + index;
      if (rowIndex < data.length) {
        data[rowIndex].col0 = quote.bankName;
        data[rowIndex].col1 = quote.buySpot.toFixed(4);
        data[rowIndex].col2 = quote.buyPoints.toFixed(4);
        data[rowIndex].col3 = quote.buyContract.toFixed(4);
        data[rowIndex].col4 = quote.sellSpot.toFixed(4);
        data[rowIndex].col5 = quote.sellPoints.toFixed(4);
      }
    });

    return data;
  };

  // Create column definitions
  const columnDefs: ColDef[] = Array(10).fill(null).map((_, index) => ({
    field: `col${index}`,
    headerName: '',
    width: 100,
    suppressMenu: true,
    sortable: false,
    filter: false,
    headerClass: 'hide-header',
    cellClass: (params: CellClassParams) => {
      const rowIndex = params.rowIndex;
      const colDef = params.colDef.field;
      
      if (rowIndex >= GRID_CONFIG.bankMatrix.startRow) {
        if (colDef === 'col1' || colDef === 'col2' || colDef === 'col3') {
          return 'buy-rate-cell';
        }
        if (colDef === 'col4' || colDef === 'col5') {
          return 'sell-rate-cell';
        }
      }
      
      if (rowIndex === GRID_CONFIG.headerCells.sell.row || 
          rowIndex === GRID_CONFIG.headerCells.buy.row) {
        return 'header-cell';
      }
      
      if (rowIndex === GRID_CONFIG.inputCells.amount.row && 
          colDef === `col${GRID_CONFIG.inputCells.amount.col}`) {
        return 'amount-cell';
      }
      
      return '';
    }
  }));

  return (
    <div className="p-4">
      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: '2000px',
          width: '2000px'
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
              height: 200px !important;
            }
            .ag-cell {
              border-right: 1px solid #ddd !important;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
            }
            .header-cell {
              background-color: #e5e7eb;
              font-weight: bold;
              font-size: 28px;
            }
            .amount-cell {
              background-color: #f3f4f6;
              font-size: 26px;
            }
            .buy-rate-cell {
              color: #059669;
              font-weight: 500;
              font-size: 26px;
            }
            .sell-rate-cell {
              color: #dc2626;
              font-weight: 500;
              font-size: 26px;
            }
          `}
        </style>
        <AgGridReact
          columnDefs={columnDefs.map(col => ({ ...col, width: 200 }))}
          rowData={createGridData()}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          suppressMovableColumns={true}
          suppressColumnMoveAnimation={true}
          suppressRowHoverHighlight={true}
          rowSelection={null}
          headerHeight={0}
          rowHeight={200}
        />
      </div>
    </div>
  );
};

export default TradingGrid;
