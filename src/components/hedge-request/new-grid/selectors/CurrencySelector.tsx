
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

interface CurrencySelectorProps {
  value: string;
  field: string;
  data: any;
  node: any;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const CurrencySelector = ({ value, field, data, node, context }: CurrencySelectorProps) => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'SGD'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    if (context?.updateRowData) {
      console.log(`Updating ${field} to ${newValue} for row ${node.rowIndex}`);
      context.updateRowData(node.rowIndex, { [field]: newValue });
    }
  };

  // Ensure the value is properly initialized in the data
  useEffect(() => {
    if (value && context?.updateRowData) {
      context.updateRowData(node.rowIndex, { [field]: value });
    }
  }, []);

  return (
    <div className="relative w-full">
      <select
        value={value || ''}
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value=""></option>
        {currencies.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
