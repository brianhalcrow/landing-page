
import { CellKeyDownEvent, CellValueChangedEvent, ICellEditorParams, EditableCallbackParams, CellClassParams, SuppressKeyboardEventParams } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';

type GridParams = 
  | ICellEditorParams 
  | CellKeyDownEvent 
  | CellValueChangedEvent 
  | EditableCallbackParams 
  | CellClassParams 
  | SuppressKeyboardEventParams;

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
