import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface CashflowGroupProps {
  form: UseFormReturn<FormValues>;
}

const CashflowGroup = ({ form }: CashflowGroupProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-blue-800">Highly Probable Transactions</h3>
        <div className="space-y-4">
          <CheckboxField form={form} name="revenue" label="Revenue" />
          <CheckboxField form={form} name="costs" label="Costs" />
          <CheckboxField form={form} name="net_income" label="Net Income" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4 text-blue-800">Firm Commitments</h3>
        <div className="space-y-4">
          <CheckboxField form={form} name="po" label="Purchase Orders" />
          <CheckboxField form={form} name="ap" label="Accounts Payable" />
          <CheckboxField form={form} name="ar" label="Accounts Receivable" />
          <CheckboxField form={form} name="other" label="Other" />
        </div>
      </div>
    </div>
  );
};

export default CashflowGroup;