import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import CheckboxGroup from "./CheckboxGroup";
import CheckboxField from "./CheckboxField";

interface CashflowGroupProps {
  form: UseFormReturn<FormValues>;
}

const CashflowGroup = ({ form }: CashflowGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <CheckboxGroup
        form={form}
        title="Highly Probable Transactions"
        titleColor="text-blue-800"
        mainField="net_income"
        dependentFields={["revenue", "costs"]}
        labels={{
          main: "Net Income",
          first: "Revenue",
          second: "Costs"
        }}
      />
      <div>
        <h3 className="text-lg font-medium mb-4 text-blue-800">Firm Commitments</h3>
        <div className="space-y-3">
          <CheckboxField 
            form={form} 
            name="po" 
            label="Purchase Orders"
          />
          <CheckboxField 
            form={form} 
            name="ap" 
            label="Accounts Payable"
          />
          <CheckboxField 
            form={form} 
            name="ar" 
            label="Accounts Receivable"
          />
          <CheckboxField 
            form={form} 
            name="other" 
            label="Other"
          />
        </div>
      </div>
    </div>
  );
};

export default CashflowGroup;