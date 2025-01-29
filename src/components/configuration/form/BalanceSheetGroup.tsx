import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface BalanceSheetGroupProps {
  form: UseFormReturn<FormValues>;
}

const BalanceSheetGroup = ({ form }: BalanceSheetGroupProps) => {
  const handleCheckboxChange = (field: keyof FormValues) => {
    const currentValue = form.getValues(field);
    
    if (field === 'net_monetary') {
      if (currentValue) {
        // If checking net_monetary, check the other two
        form.setValue('monetary_assets', true);
        form.setValue('monetary_liabilities', true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-green-800">Monetary Exposure</h3>
        <div className="space-y-4">
          <CheckboxField 
            form={form} 
            name="monetary_assets" 
            label="Monetary Assets" 
          />
          <CheckboxField 
            form={form} 
            name="monetary_liabilities" 
            label="Monetary Liabilities" 
          />
          <CheckboxField 
            form={form} 
            name="net_monetary" 
            label="Net Monetary" 
            onCheckedChange={() => handleCheckboxChange('net_monetary')}
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetGroup;