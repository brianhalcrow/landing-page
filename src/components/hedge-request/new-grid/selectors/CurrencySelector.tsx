
import { ChevronDown } from "lucide-react";
import { memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CurrencySelectorProps {
  value: string;
  field: string;
  data: any;
  node: any;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const CurrencySelector = memo(({ value, field, data, node, context }: CurrencySelectorProps) => {
  const { data: currencyData, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_currency_list')
        .select('currency')
        .order('priority_order, currency');

      if (error) {
        console.error('Error fetching currencies:', error);
        return [];
      }

      return data.map(row => row.currency);
    }
  });

  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    if (context?.updateRowData) {
      const updates = { [field]: newValue };
      context.updateRowData(node.rowIndex, updates);
      
      // Force grid to refresh the cell value
      if (node.setDataValue) {
        node.setDataValue(field, newValue);
      }
    }
  }, [context, node, field]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative w-full">
      <select
        value={value || ''}
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value=""></option>
        {currencyData?.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
});

CurrencySelector.displayName = 'CurrencySelector';
