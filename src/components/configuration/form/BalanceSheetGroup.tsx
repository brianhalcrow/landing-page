import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";
import { FormMessage } from "@/components/ui/form";

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
      // If unchecking net_monetary, leave the other checkboxes as they are
    } else {
      // If unchecking either monetary_assets or monetary_liabilities
      if (!currentValue) {
        // Uncheck net_monetary if either monetary_assets or monetary_liabilities is unchecked
        form.setValue('net_monetary', false);
      } else {
        // If both monetary_assets and monetary_liabilities are checked, check net_monetary
        const otherField = field === 'monetary_assets' ? 'monetary_liabilities' : 'monetary_assets';
        const otherValue = form.getValues(otherField);
        if (otherValue) {
          form.setValue('net_monetary', true);
        }
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
            onCheckedChange={() => handleCheckboxChange('monetary_assets')}
          />
          <CheckboxField 
            form={form} 
            name="monetary_liabilities" 
            label="Monetary Liabilities" 
            onCheckedChange={() => handleCheckboxChange('monetary_liabilities')}
          />
          <CheckboxField 
            form={form} 
            name="net_monetary" 
            label="Net Monetary" 
            onCheckedChange={() => handleCheckboxChange('net_monetary')}
          />
          <FormMessage>{form.formState.errors.net_monetary?.message}</FormMessage>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetGroup;