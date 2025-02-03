import { CellKeyDownEvent, CellValueChangedEvent } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';

export const useCellHandlers = (rates?: Map<string, number>) => {
  const handleCellKeyDown = (e: CellKeyDownEvent) => {
    if (e.event.key === 'Tab') {
      const colId = e.column.getColId();
      if (colId === 'buy_currency' || colId === 'sell_currency') {
        e.event.preventDefault();
      }
    }
  };

  const handleCellValueChanged = (e: CellValueChangedEvent<HedgeRequestDraftTrade>) => {
    const { data, colDef, node } = e;
    if (!data || !node || !colDef.field) return;

    // Update spot rate when currencies change
    if (colDef.field === 'buy_currency' || colDef.field === 'sell_currency') {
      if (data.buy_currency && data.sell_currency) {
        const pair = `${data.buy_currency}/${data.sell_currency}`;
        const rate = rates?.get(pair);
        if (rate) {
          data.spot_rate = rate;
          node.setData({ ...data });
        }
      }
    }

    // Calculate amounts based on rate
    if (data.spot_rate) {
      if (colDef.field === 'buy_amount' && data.buy_amount) {
        data.sell_amount = data.buy_amount * data.spot_rate;
        node.setData({ ...data });
      } else if (colDef.field === 'sell_amount' && data.sell_amount) {
        data.buy_amount = data.sell_amount / data.spot_rate;
        node.setData({ ...data });
      }
    }
  };

  return { handleCellKeyDown, handleCellValueChanged };
};