
import { AgGridReact } from 'ag-grid-react';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { GridStyles } from '../../grid/components/GridStyles';
import { useRef, useState, Dispatch, SetStateAction } from 'react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { useCellHandlers } from '../hooks/useCellHandlers';
import { CellEditingStartedEvent } from 'ag-grid-community';
import { toast } from 'sonner';
import { shouldAllowAmountEdit } from '../utils/amountValidation';
import { CurrencyEditorState } from '../components/CurrencyCellEditor';

interface TradeDataGridProps {
  entityId?: string | null;
  entityName?: string | null;
  rowData: HedgeRequestDraftTrade[];
  onRowDataChange: Dispatch<SetStateAction<HedgeRequestDraftTrade[]>>;
}

const TradeDataGrid = ({ entityId, entityName, rowData, onRowDataChange }: TradeDataGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [lastSelectedCurrency, setLastSelectedCurrency] = useState<'buy' | 'sell' | null>(null);

  const updateRow = (index: number, updates: Partial<HedgeRequestDraftTrade>) => {
    onRowDataChange(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
  };

  const { handleCellKeyDown, handleCellValueChanged } = useCellHandlers(updateRow, setLastSelectedCurrency);
  const columnDefs = useTradeColumns(updateRow, lastSelectedCurrency);

  const initialEditorState: CurrencyEditorState = {
    lastSelectedCurrency: null,
    buyAmount: null,
    sellAmount: null
  };

  const handleCellEditingStarted = (event: CellEditingStartedEvent) => {
    const field = event.column.getColId();
    
    if (field.includes('amount')) {
      const isBuyAmount = field === 'buy_amount';
      if (!shouldAllowAmountEdit(event, isBuyAmount ? 'buy' : 'sell', lastSelectedCurrency)) {
        event.api.stopEditing();
        
        const data = event.data as HedgeRequestDraftTrade;
        if (!data.buy_currency || !data.sell_currency) {
          toast.error('Please select both currencies before entering amounts');
        } else if (data.buy_currency === data.sell_currency) {
          toast.error('Buy and sell currencies must be different');
        } else if (isBuyAmount ? data.sell_amount !== null : data.buy_amount !== null) {
          toast.error('Only one amount can be entered at a time');
        } else {
          toast.error(`Please enter amount in the ${lastSelectedCurrency === 'buy' ? 'sell' : 'buy'} field first`);
        }
      }
    }
  };

  return (
    <div className="w-full h-[300px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        context={{
          editorState: initialEditorState
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        onCellKeyDown={handleCellKeyDown}
        onCellValueChanged={handleCellValueChanged}
        onCellEditingStarted={handleCellEditingStarted}
        tabToNextCell={(params) => {
          const nextColumn = params.nextCellPosition?.column.getColId();
          if (nextColumn?.includes('amount')) {
            const rowData = params.previousCellPosition.rowIndex !== null 
              ? gridRef.current?.api.getDisplayedRowAtIndex(params.previousCellPosition.rowIndex)?.data
              : null;
            
            if (rowData) {
              const isBuyAmount = nextColumn === 'buy_amount';
              if (!shouldAllowAmountEdit({ data: rowData } as any, isBuyAmount ? 'buy' : 'sell', lastSelectedCurrency)) {
                return params.previousCellPosition;
              }
            }
          }
          return params.nextCellPosition;
        }}
      />
    </div>
  );
};

export default TradeDataGrid;
