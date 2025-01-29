import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface RealizedGroupProps {
  form: UseFormReturn<FormValues>;
}

const RealizedGroup = ({ form }: RealizedGroupProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 text-purple-800">Intramonth</h3>
        <div className="space-y-4">
          <CheckboxField form={form} name="ap_realized" label="Accounts Payable" />
          <CheckboxField form={form} name="ar_realized" label="Accounts Receivable" />
          <CheckboxField form={form} name="fx_realized" label="FX Conversions" />
        </div>
      </div>
    </div>
  );
};

export default RealizedGroup;