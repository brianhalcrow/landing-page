
import { CellKeyDownEvent, CellValueChangedEvent, ICellEditorParams, EditableCallbackParams, CellClassParams, SuppressKeyboardEventParams, CellEditingStartedEvent } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';

type GridParams = 
  | ICellEditorParams 
  | CellKeyDownEvent 
  | CellValueChangedEvent 
  | EditableCallbackParams 
  | CellClassParams 
  | SuppressKeyboardEventParams
  | CellEditingStartedEvent;

export const shouldAllowAmountEdit = (
  params: GridParams,
  field: 'buy' | 'sell',
  lastSelectedCurrency: 'buy' | 'sell' | null
): boolean => {
  const data = params.data as HedgeRequestDraftTrade;
  
  // Both currencies must be selected
  if (!data.buy_currency || !data.sell_currency) {
    return false;
  }

  // Check if currencies are different
  if (data.buy_currency === data.sell_currency) {
    return false;
  }

  // Check if other amount exists
  const otherAmount = field === 'buy' ? data.sell_amount : data.buy_amount;
  if (otherAmount !== null) {
    return false;
  }

  // Check currency selection order
  if (lastSelectedCurrency) {
    return (
      (lastSelectedCurrency === 'buy' && field === 'sell') ||
      (lastSelectedCurrency === 'sell' && field === 'buy')
    );
  }

  return true;
};

export const getAmountFieldClass = (
  params: GridParams,
  field: 'buy' | 'sell',
  lastSelectedCurrency: 'buy' | 'sell' | null
): string => {
  const isEditable = shouldAllowAmountEdit(params, field, lastSelectedCurrency);
  const data = params.data as HedgeRequestDraftTrade;
  const hasValue = field === 'buy' ? data.buy_amount !== null : data.sell_amount !== null;
  
  let classes = ['transition-all'];
  
  if (data[`${field}_currency`]) {
    classes.push('cursor-pointer');
    
    if (isEditable) {
      classes.push('hover:bg-yellow-100', 'border-yellow-500', 'border-dashed');
    } else {
      classes.push('opacity-70', 'cursor-not-allowed');
      if (hasValue) {
        classes.push('bg-gray-100');
      }
    }
  }
  
  return classes.join(' ');
};
