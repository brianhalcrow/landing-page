import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface BalanceSheetGroupProps {
  form: UseFormReturn<FormValues>;
}

const BalanceSheetGroup = ({ form }: BalanceSheetGroupProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-green-800">Monetary Exposure</h3>
        <div className="space-y-4">
          <CheckboxField form={form} name="monetary_assets" label="Monetary Assets" />
          <CheckboxField form={form} name="monetary_liabilities" label="Monetary Liabilities" />
          <CheckboxField form={form} name="net_monetary" label="Net Monetary" />
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetGroup;