import { CellKeyDownEvent, CellValueChangedEvent } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { toast } from 'sonner';
import { useRef } from 'react';

export const useCellHandlers = (rates?: Map<string, number>) => {
  const lastSelectedCurrency = useRef<'buy' | 'sell' | null>(null);

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

      // Prevent entering amount if it's not the correct field based on selection order
      if (lastSelectedCurrency.current && 
          ((lastSelectedCurrency.current === 'sell' && isBuyAmount) || 
           (lastSelectedCurrency.current === 'buy' && !isBuyAmount))) {
        e.event.preventDefault();
        toast.error(`Please enter amount in the ${lastSelectedCurrency.current === 'buy' ? 'sell' : 'buy'} field first`);
        return;
      }

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
      // Update the last selected currency
      lastSelectedCurrency.current = field === 'buy_currency' ? 'buy' : 'sell';
      
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
          lastSelectedCurrency.current = null;
        } else {
          // Focus the corresponding amount field based on which currency was selected last
          setTimeout(() => {
            const amountField = lastSelectedCurrency.current === 'buy' ? 'buy_amount' : 'sell_amount';
            const columnToFocus = api.getColumnDef(amountField);
            if (columnToFocus) {
              api.setFocusedCell(rowIndex, amountField);
            }
          }, 0);
        }
      }
    }

    // Handle amount changes
    if (field === 'buy_amount' && e.newValue !== null) {
      newData.sell_amount = null; // Clear sell amount when buy amount is entered
      if (lastSelectedCurrency.current === 'sell') {
        lastSelectedCurrency.current = 'buy'; // Update selection order if needed
      }
    } else if (field === 'sell_amount' && e.newValue !== null) {
      newData.buy_amount = null; // Clear buy amount when sell amount is entered
      if (lastSelectedCurrency.current === 'buy') {
        lastSelectedCurrency.current = 'sell'; // Update selection order if needed
      }
    }

    // Update the grid data
    const rowNode = e.api.getRowNode(e.rowIndex.toString());
    if (rowNode) {
      rowNode.setData(newData);
    }
  };

  return { handleCellKeyDown, handleCellValueChanged };
};
