
import { AgGridReact } from 'ag-grid-react';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { GridStyles } from '../../grid/components/GridStyles';
import { useRef, useState, Dispatch, SetStateAction } from 'react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { CellEditingStartedEvent } from 'ag-grid-community';
import { toast } from 'sonner';
import { CurrencyEditorState } from './CurrencyCellEditor';
import { validateTrade } from '../validation/tradeValidation';

interface TradeDataGridProps {
  entityId?: string | null;
  entityName?: string | null;
  rowData: HedgeRequestDraftTrade[];
  onRowDataChange: Dispatch<SetStateAction<HedgeRequestDraftTrade[]>>;
}

const TradeDataGrid = ({ entityId, entityName, rowData, onRowDataChange }: TradeDataGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [lastSelectedCurrency, setLastSelectedCurrency] = useState<'buy' | 'sell' | null>(null);
  const [rates] = useState<Map<string, number>>(new Map());

  const updateRow = (index: number, updates: Partial<HedgeRequestDraftTrade>) => {
    onRowDataChange(prevData => {
      const newData = [...prevData];
      const currentRow = { ...newData[index] };
      const updatedRow = { ...currentRow, ...updates };

      // Validate the row after updates
      if ('buy_amount' in updates || 'sell_amount' in updates) {
        const validation = validateTrade(updatedRow as HedgeRequestDraftTrade);
        if (!validation.isValid) {
          // If validation fails, reject the update
          return prevData;
        }
      }

      newData[index] = updatedRow;
      return newData;
    });
  };

  const columnDefs = useTradeColumns();

  const initialEditorState: CurrencyEditorState = {
    lastSelectedCurrency: null,
    buyAmount: null,
    sellAmount: null
  };

  const handleCellEditingStarted = (event: CellEditingStartedEvent) => {
    const field = event.column.getColId();
    
    if (field === 'buy_amount' || field === 'sell_amount') {
      const rowData = event.data as HedgeRequestDraftTrade;
      const validation = validateTrade({
        ...rowData,
        [field]: event.value
      } as HedgeRequestDraftTrade);

      if (!validation.isValid) {
        event.api.stopEditing();
        validation.errors.forEach(error => toast.error(error));
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
          editorState: initialEditorState,
          updateRow
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        onCellEditingStarted={handleCellEditingStarted}
      />
    </div>
  );
};

export default TradeDataGrid;
