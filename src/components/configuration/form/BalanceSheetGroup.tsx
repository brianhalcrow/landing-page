import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import CheckboxGroup from "./CheckboxGroup";

interface BalanceSheetGroupProps {
  form: UseFormReturn<FormValues>;
}

const BalanceSheetGroup = ({ form }: BalanceSheetGroupProps) => {
  return (
    <div className="space-y-6">
      <CheckboxGroup
        form={form}
        title="Monetary Exposure"
        titleColor="text-green-800"
        mainField="net_monetary"
        dependentFields={["monetary_assets", "monetary_liabilities"]}
        labels={{
          main: "Net Monetary",
          first: "Monetary Assets",
          second: "Monetary Liabilities"
        }}
      />
    </div>
  );
};

export default BalanceSheetGroup;