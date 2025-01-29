import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface BalanceSheetGroupProps {
  form: UseFormReturn<FormValues>;
}

const BalanceSheetGroup = ({ form }: BalanceSheetGroupProps) => {
  return (
    <div className="space-y-4">
      <CheckboxField form={form} name="net_monetary" label="Net Monetary" />
    </div>
  );
};

export default BalanceSheetGroup;