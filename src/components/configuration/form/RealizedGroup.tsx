import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface RealizedGroupProps {
  form: UseFormReturn<FormValues>;
}

const RealizedGroup = ({ form }: RealizedGroupProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Realized</h3>
      <CheckboxField form={form} name="ap_realized" label="AP Realized" />
      <CheckboxField form={form} name="ar_realized" label="AR Realized" />
      <CheckboxField form={form} name="fx_realized" label="FX Realized" />
    </div>
  );
};

export default RealizedGroup;