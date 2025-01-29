import { UseFormReturn } from "react-hook-form";
import CheckboxField from "./CheckboxField";
import { FormValues } from "../types";

interface FirmCommitmentsGroupProps {
  form: UseFormReturn<FormValues>;
}

const FirmCommitmentsGroup = ({ form }: FirmCommitmentsGroupProps) => {
  return (
    <div className="space-y-4">
      <CheckboxField form={form} name="po" label="Purchase Orders" />
      <CheckboxField form={form} name="ap" label="Accounts Payable" />
      <CheckboxField form={form} name="ar" label="Accounts Receivable" />
      <CheckboxField form={form} name="other" label="Other" />
    </div>
  );
};

export default FirmCommitmentsGroup;