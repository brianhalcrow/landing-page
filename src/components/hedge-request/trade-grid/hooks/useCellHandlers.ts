
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
    const newData = { ...e.data };

    if (field === 'buy_currency' || field === 'sell_currency') {
      const newCurrencyType = field === 'buy_currency' ? 'buy' : 'sell';
      
      if (e.newValue !== e.oldValue) {
        // Set the last selected currency
        lastSelectedCurrency.current = newCurrencyType;
        setLastSelectedCurrency?.(newCurrencyType);

        // Handle currency validation
        if (newData.buy_currency && newData.sell_currency && 
            newData.buy_currency === newData.sell_currency) {
          toast.error('Buy and sell currencies must be different');
          if (field === 'buy_currency') {
            newData.buy_currency = null;
          } else {
            newData.sell_currency = null;
          }
          lastSelectedCurrency.current = null;
          setLastSelectedCurrency?.(null);
        } else {
          // Clear amounts
          newData.buy_amount = null;
          newData.sell_amount = null;
        }

        // Update the grid data
        const rowNode = api.getRowNode(rowIndex.toString());
        if (rowNode) {
          rowNode.setData(newData);
        }

        // Focus the corresponding amount field
        if (newData.buy_currency && newData.sell_currency) {
          setTimeout(() => {
            const amountField = newCurrencyType === 'buy' ? 'sell_amount' : 'buy_amount';
            api.setFocusedCell(rowIndex, amountField);
          }, 0);
        }
      }
    } else if ((field === 'buy_amount' || field === 'sell_amount') && e.newValue !== null) {
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
        
        const rowNode = api.getRowNode(rowIndex.toString());
        if (rowNode) {
          rowNode.setData(newData);
        }
      }
    }
  };

  return { 
    handleCellKeyDown, 
    handleCellValueChanged,
    lastSelectedCurrency: lastSelectedCurrency.current 
  };
};
