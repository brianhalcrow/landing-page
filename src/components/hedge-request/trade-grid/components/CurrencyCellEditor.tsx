
import { ICellEditorParams } from 'ag-grid-community';
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CurrencyEditorState {
  lastSelectedCurrency: 'buy' | 'sell' | null;
  buyAmount: number | null;
  sellAmount: number | null;
}

export const CurrencyCellEditor = forwardRef((props: ICellEditorParams, ref) => {
  const [value, setValue] = useState(props.value);
  const selectRef = useRef<HTMLButtonElement>(null);
  const isBuyCurrency = props.column.getColId() === 'buy_currency';
  const editorState = (props.api.getGridOption('context')?.editorState || {}) as CurrencyEditorState;
  
  const { data: currencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data: baseCurrencies } = await supabase
        .from('rates')
        .select('base_currency');

      const { data: quoteCurrencies } = await supabase
        .from('rates')
        .select('quote_currency');

      const uniqueCurrencies = new Set([
        ...(baseCurrencies?.map(row => row.base_currency) || []),
        ...(quoteCurrencies?.map(row => row.quote_currency) || [])
      ]);

      return Array.from(uniqueCurrencies).sort();
    }
  });

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
      isCancelBeforeStart() {
        return false;
      },
      isCancelAfterEnd() {
        return false;
      },
    };
  });

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.click();
    }
  }, []);

  const validateCurrencySelection = (newValue: string) => {
    const rowData = props.node.data;
    const updatedData = {
      ...rowData,
      [isBuyCurrency ? 'buy_currency' : 'sell_currency']: newValue
    };
    
    // Get the other currency field's value
    const otherCurrency = isBuyCurrency ? updatedData.sell_currency : updatedData.buy_currency;
    
    // Check if both currencies would be the same
    if (otherCurrency && newValue === otherCurrency) {
      toast.error('Buy and sell currencies must be different');
      // Reset the other currency to null
      props.api.startEditingCell({
        rowIndex: props.rowIndex,
        colKey: isBuyCurrency ? 'sell_currency' : 'buy_currency'
      });
      props.node.setDataValue(isBuyCurrency ? 'sell_currency' : 'buy_currency', null);
      return false;
    }
    
    return true;
  };

  const handleCurrencyChange = (newValue: string) => {
    if (validateCurrencySelection(newValue)) {
      setValue(newValue);
      
      // Update grid state
      const context = props.api.getGridOption('context');
      if (context) {
        context.editorState = {
          ...editorState,
          lastSelectedCurrency: isBuyCurrency ? 'buy' : 'sell',
          buyAmount: isBuyCurrency ? null : editorState.buyAmount,
          sellAmount: isBuyCurrency ? editorState.sellAmount : null
        };
        props.api.setGridOption('context', context);
      }

      // Stop editing after selection
      props.stopEditing();
    }
  };

  return (
    <div className="ag-cell-edit-wrapper">
      <Select
        value={value || ''}
        onValueChange={handleCurrencyChange}
        open={true}
      >
        <SelectTrigger ref={selectRef} className="h-8 w-full border-0 bg-white focus:ring-0">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent
          className="z-[1000] bg-white"
          position="popper"
          sideOffset={5}
        >
          {currencies?.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

CurrencyCellEditor.displayName = 'CurrencyCellEditor';
