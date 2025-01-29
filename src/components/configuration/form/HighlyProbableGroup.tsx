import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface HighlyProbableGroupProps {
  form: UseFormReturn<FormValues>;
}

const HighlyProbableGroup = ({ form }: HighlyProbableGroupProps) => {
  return (
    <div className="space-y-4">
      <CheckboxField form={form} name="revenue" label="Revenue" />
      <CheckboxField form={form} name="costs" label="Costs" />
      <CheckboxField form={form} name="net_income" label="Net Income" />
    </div>
  );
};

export default HighlyProbableGroup;