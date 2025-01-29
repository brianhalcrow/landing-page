import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";
import { FormMessage } from "@/components/ui/form";

interface CashflowGroupProps {
  form: UseFormReturn<FormValues>;
}

const CashflowGroup = ({ form }: CashflowGroupProps) => {
  const handleCheckboxChange = (field: keyof FormValues) => {
    const currentValue = form.getValues(field);
    
    if (field === 'net_income') {
      if (currentValue) {
        // If checking net_income, check revenue and costs
        form.setValue('revenue', true);
        form.setValue('costs', true);
      } else {
        // Only allow unchecking net_income if either revenue or costs is false
        const revenue = form.getValues('revenue');
        const costs = form.getValues('costs');
        if (!revenue || !costs) {
          form.setValue('revenue', false);
          form.setValue('costs', false);
        } else {
          // If both are true, prevent unchecking net_income
          form.setValue('net_income', true);
        }
      }
    } else {
      // If unchecking either revenue or costs
      if (!currentValue) {
        // Uncheck net_income if either revenue or costs is unchecked
        form.setValue('net_income', false);
      } else {
        // If both revenue and costs are checked, check net_income
        const otherField = field === 'revenue' ? 'costs' : 'revenue';
        const otherValue = form.getValues(otherField);
        if (otherValue) {
          form.setValue('net_income', true);
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-blue-800">Highly Probable Transactions</h3>
        <div className="space-y-4">
          <CheckboxField 
            form={form} 
            name="revenue" 
            label="Revenue" 
            onCheckedChange={() => handleCheckboxChange('revenue')}
            className="items-center"
          />
          <CheckboxField 
            form={form} 
            name="costs" 
            label="Costs" 
            onCheckedChange={() => handleCheckboxChange('costs')}
            className="items-center"
          />
          <CheckboxField 
            form={form} 
            name="net_income" 
            label="Net Income" 
            onCheckedChange={() => handleCheckboxChange('net_income')}
            className="items-center"
          />
          <FormMessage>{form.formState.errors.net_income?.message}</FormMessage>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4 text-blue-800">Firm Commitments</h3>
        <div className="space-y-4">
          <CheckboxField 
            form={form} 
            name="po" 
            label="Purchase Orders" 
            className="items-center"
          />
          <CheckboxField 
            form={form} 
            name="ap" 
            label="Accounts Payable" 
            className="items-center"
          />
          <CheckboxField 
            form={form} 
            name="ar" 
            label="Accounts Receivable" 
            className="items-center"
          />
          <CheckboxField 
            form={form} 
            name="other" 
            label="Other" 
            className="items-center"
          />
        </div>
      </div>
    </div>
  );
};

export default CashflowGroup;