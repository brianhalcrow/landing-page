import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CurrencySelectorProps {
  value: string;
  setValue: (value: string) => void;
}

export const CurrencySelector = ({ value, setValue }: CurrencySelectorProps) => {
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

  return (
    <Select
      value={value}
      onValueChange={setValue}
    >
      <SelectTrigger className="h-8 w-full border-0 bg-transparent focus:ring-0">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies?.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};