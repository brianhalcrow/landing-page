
import { CellKeyDownEvent, CellValueChangedEvent } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { toast } from 'sonner';

export const useCellHandlers = (rates?: Map<string, number>) => {
  const handleCellKeyDown = (e: CellKeyDownEvent) => {
    const data = e.data as HedgeRequestDraftTrade;
    const field = e.column.getColId();
    
    // Check if both currencies are selected when entering amounts
    if (field.includes('amount')) {
      if (!data.buy_currency || !data.sell_currency) {
        e.event.preventDefault();
        toast.error('Please select both currencies before entering amounts');
        return;
      }

      // Check if trying to enter amount in wrong field based on currency selection order
      const isBuyAmount = field === 'buy_amount';
      const otherAmount = isBuyAmount ? data.sell_amount : data.buy_amount;

      if (otherAmount !== null) {
        e.event.preventDefault();
        toast.error('Please clear the other amount field first');
        return;
      }
    }
  };

  const handleCellValueChanged = (e: CellValueChangedEvent<HedgeRequestDraftTrade>) => {
    const newData = { ...e.data };
    const field = e.column.getColId();
    const api = e.api;
    const rowIndex = e.rowIndex;

    // Handle currency changes
    if (field === 'buy_currency' || field === 'sell_currency') {
      // Clear amounts when currencies change
      newData.buy_amount = null;
      newData.sell_amount = null;

      // Validate that both currencies are selected and different
      if (newData.buy_currency && newData.sell_currency) {
        if (newData.buy_currency === newData.sell_currency) {
          toast.error('Buy and sell currencies must be different');
          if (field === 'buy_currency') {
            newData.buy_currency = null;
          } else {
            newData.sell_currency = null;
          }
        }
      }

      // Focus the corresponding amount field if both currencies are selected
      if (newData.buy_currency && newData.sell_currency) {
        setTimeout(() => {
          const amountField = field === 'buy_currency' ? 'buy_amount' : 'sell_amount';
          const columnToFocus = api.getColumnDef(amountField);
          if (columnToFocus) {
            api.setFocusedCell(rowIndex, amountField);
          }
        }, 0);
      }
    }

    // Handle amount changes
    if (field === 'buy_amount' && e.newValue !== null) {
      newData.sell_amount = null; // Clear sell amount when buy amount is entered
    } else if (field === 'sell_amount' && e.newValue !== null) {
      newData.buy_amount = null; // Clear buy amount when sell amount is entered
    }

    // Update the grid data
    const rowNode = e.api.getRowNode(e.rowIndex.toString());
    if (rowNode) {
      rowNode.setData(newData);
    }
  };

  return { handleCellKeyDown, handleCellValueChanged };
};
