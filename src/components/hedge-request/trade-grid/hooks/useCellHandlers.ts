
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
    const newData = { ...e.data };
    const field = e.column.getColId();
    const api = e.api;
    const rowIndex = e.rowIndex;

    // Handle currency changes
    if (field === 'buy_currency' || field === 'sell_currency') {
      const newCurrencyType = field === 'buy_currency' ? 'buy' : 'sell';
      lastSelectedCurrency.current = newCurrencyType;
      setLastSelectedCurrency?.(newCurrencyType);
      
      // Clear amounts when currencies change
      newData.buy_amount = null;
      newData.sell_amount = null;

      // Validate currencies are different
      if (newData.buy_currency && newData.sell_currency) {
        if (newData.buy_currency === newData.sell_currency) {
          toast.error('Buy and sell currencies must be different');
          if (field === 'buy_currency') {
            newData.buy_currency = null;
          } else {
            newData.sell_currency = null;
          }
          lastSelectedCurrency.current = null;
          setLastSelectedCurrency?.(null);
        } else {
          // Focus the corresponding amount field based on which currency was selected last
          setTimeout(() => {
            const amountField = lastSelectedCurrency.current === 'buy' ? 'sell_amount' : 'buy_amount';
            const columnToFocus = api.getColumnDef(amountField);
            if (columnToFocus) {
              api.setFocusedCell(rowIndex, amountField);
            }
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

    // Update the grid data
    const rowNode = e.api.getRowNode(e.rowIndex.toString());
    if (rowNode) {
      rowNode.setData(newData);
    }
  };

  return { 
    handleCellKeyDown, 
    handleCellValueChanged,
    lastSelectedCurrency: lastSelectedCurrency.current 
  };
};
