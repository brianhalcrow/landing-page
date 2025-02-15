
import { ICellEditorParams } from 'ag-grid-community';
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const CurrencyCellEditor = forwardRef((props: ICellEditorParams, ref) => {
  const [value, setValue] = useState(props.value);
  const selectRef = useRef<HTMLButtonElement>(null);

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
    // Focus the select trigger when the editor is initialized
    if (selectRef.current) {
      selectRef.current.click();
    }
  }, []);

  return (
    <div className="ag-cell-edit-wrapper">
      <Select
        value={value || ''}
        onValueChange={(newValue) => {
          setValue(newValue);
          // Stop editing after selection
          props.stopEditing();
        }}
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
