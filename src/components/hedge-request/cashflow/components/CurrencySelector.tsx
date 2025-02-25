
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";

interface CurrencySelectorProps {
  exposedCurrency: string;
  onCurrencyChange: (value: string) => void;
  currencies: string[] | undefined;
}

export const CurrencySelector = ({
  exposedCurrency,
  onCurrencyChange,
  currencies
}: CurrencySelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Exposed Currency</label>
      <Select value={exposedCurrency} onValueChange={onCurrencyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies?.map(currency => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
