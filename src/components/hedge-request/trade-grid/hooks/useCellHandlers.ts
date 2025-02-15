
import { CellKeyDownEvent, CellValueChangedEvent } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { toast } from 'sonner';
import { useRef } from 'react';
import { shouldAllowAmountEdit } from '../utils/amountValidation';

export const useCellHandlers = (
  rates?: Map<string, number>,
  setLastSelectedCurrency?: (value: 'buy' | 'sell' | null) => void
) => {
  const lastSelectedCurrency = useRef<'buy' | 'sell' | null>(null);

  const handleCellKeyDown = (e: CellKeyDownEvent) => {
    const data = e.data as HedgeRequestDraftTrade;
    const field = e.column.getColId();
    
    if (field.includes('amount')) {
      const isBuyAmount = field === 'buy_amount';
      if (!shouldAllowAmountEdit(e, isBuyAmount ? 'buy' : 'sell', lastSelectedCurrency.current)) {
        e.event.preventDefault();
        if (!data.buy_currency || !data.sell_currency) {
          toast.error('Please select both currencies before entering amounts');
        } else if (data.buy_currency === data.sell_currency) {
          toast.error('Buy and sell currencies must be different');
        } else {
          toast.error(`Please enter amount in the ${lastSelectedCurrency.current === 'buy' ? 'sell' : 'buy'} field first`);
        }
      }
    }
  };

  const handleCellValueChanged = (e: CellValueChangedEvent<HedgeRequestDraftTrade>) => {
    const field = e.column.getColId();
    const api = e.api;
    const rowIndex = e.rowIndex;

    // Create a new data object without modifying the original yet
    const newData = { ...e.data };

    // Handle currency changes
    if (field === 'buy_currency' || field === 'sell_currency') {
      const newCurrencyType = field === 'buy_currency' ? 'buy' : 'sell';
      
      // Only update if the new value is different
      if (e.newValue !== e.oldValue) {
        lastSelectedCurrency.current = newCurrencyType;
        setLastSelectedCurrency?.(newCurrencyType);

        // Validate currencies are different before clearing amounts
        if (newData.buy_currency && newData.sell_currency && 
            newData.buy_currency === newData.sell_currency) {
          toast.error('Buy and sell currencies must be different');
          // Only clear the currency that was just changed
          if (field === 'buy_currency') {
            newData.buy_currency = null;
          } else {
            newData.sell_currency = null;
          }
          lastSelectedCurrency.current = null;
          setLastSelectedCurrency?.(null);
        } else {
          // Clear amounts only if currencies are valid
          newData.buy_amount = null;
          newData.sell_amount = null;
          
          // Focus the corresponding amount field
          setTimeout(() => {
            const amountField = newCurrencyType === 'buy' ? 'sell_amount' : 'buy_amount';
            api.setFocusedCell(rowIndex, amountField);
          }, 0);
        }
      }
    }

    // Handle amount changes
    if ((field === 'buy_amount' || field === 'sell_amount') && e.newValue !== null) {
      const isBuyAmount = field === 'buy_amount';
      if (shouldAllowAmountEdit(e, isBuyAmount ? 'buy' : 'sell', lastSelectedCurrency.current)) {
        if (isBuyAmount) {
          newData.sell_amount = null;
          lastSelectedCurrency.current = 'buy';
          setLastSelectedCurrency?.('buy');
        } else {
          newData.buy_amount = null;
          lastSelectedCurrency.current = 'sell';
          setLastSelectedCurrency?.('sell');
        }
      }
    }

    // Update the grid data only if there were changes
    if (JSON.stringify(newData) !== JSON.stringify(e.data)) {
      const rowNode = api.getRowNode(rowIndex.toString());
      if (rowNode) {
        rowNode.setData(newData);
      }
    }
  };

  return { 
    handleCellKeyDown, 
    handleCellValueChanged,
    lastSelectedCurrency: lastSelectedCurrency.current 
  };
};
