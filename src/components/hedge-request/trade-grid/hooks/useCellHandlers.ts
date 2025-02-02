import { CellKeyDownEvent, CellValueChangedEvent } from 'ag-grid-community';

export const useCellHandlers = (rates?: Map<string, number>) => {
  const calculateAmounts = (
    rowNode: any,
    colId: string,
    value: number,
    rate?: number
  ) => {
    if (!rate) return;

    try {
      if (colId === 'buy_amount') {
        const sellAmount = value * rate;
        rowNode.setDataValue('sell_amount', sellAmount);
      } else {
        const buyAmount = value / rate;
        rowNode.setDataValue('buy_amount', buyAmount);
      }
    } catch (error) {
      console.error('Error calculating amounts:', error);
    }
  };

  const handleCellKeyDown = (event: CellKeyDownEvent) => {
    try {
      const column = event.column;
      const colId = column.getColId();
      
      if (colId !== 'buy_amount' && colId !== 'sell_amount') return;

      const rowNode = event.node;
      if (!rowNode || !rowNode.data) return;

      const { buy_currency, sell_currency } = rowNode.data;
      if (!buy_currency || !sell_currency) return;

      const currencyPair = `${buy_currency}/${sell_currency}`;
      const rate = rates?.get(currencyPair);
      if (!rate) return;

      const currentValue = event.value?.toString() || '0';
      const newChar = (event.event as KeyboardEvent).key;
      
      if (!/^\d$/.test(newChar)) return;

      let newValueStr;
      if (currentValue === '0') {
        newValueStr = newChar;
      } else {
        newValueStr = currentValue + newChar;
      }

      const newValue = parseFloat(newValueStr);
      if (isNaN(newValue)) return;

      event.node.setDataValue(colId, newValue);
      calculateAmounts(rowNode, colId, newValue, rate);
    } catch (error) {
      console.error('Error in handleCellKeyDown:', error);
    }
  };

  const handleCellValueChanged = (event: CellValueChangedEvent) => {
    try {
      console.log('Cell value changed:', event);
      
      const column = event.column;
      if (!column) {
        console.error('No column found in event');
        return;
      }
      
      const colId = column.getColId();
      if (!colId) {
        console.error('No column ID found');
        return;
      }

      const rowNode = event.node;
      if (!rowNode || !rowNode.data) {
        console.error('No row node or data found');
        return;
      }

      if (colId === 'buy_currency' || colId === 'sell_currency') {
        const { buy_currency, sell_currency } = rowNode.data;
        
        if (buy_currency && sell_currency) {
          const currencyPair = `${buy_currency}/${sell_currency}`;
          console.log('Setting currency pair:', currencyPair);
          
          if (rates?.has(currencyPair)) {
            const rate = rates.get(currencyPair);
            console.log(`Setting rate for ${currencyPair}:`, rate);
            rowNode.setDataValue('rate', rate);

            const { buy_amount, sell_amount } = rowNode.data;
            if (rate && buy_amount) {
              rowNode.setDataValue('sell_amount', buy_amount * rate);
            } else if (rate && sell_amount) {
              rowNode.setDataValue('buy_amount', sell_amount / rate);
            }
          }
        }
      }

      if (colId === 'buy_amount' || colId === 'sell_amount') {
        const { buy_currency, sell_currency } = rowNode.data;
        if (buy_currency && sell_currency) {
          const currencyPair = `${buy_currency}/${sell_currency}`;
          const rate = rates?.get(currencyPair);

          if (rate) {
            const newValue = event.newValue;
            if (newValue !== undefined && newValue !== null) {
              calculateAmounts(rowNode, colId, newValue, rate);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in handleCellValueChanged:', error);
    }
  };

  return {
    handleCellKeyDown,
    handleCellValueChanged
  };
};