import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";

interface CurrencyFieldProps {
  form: UseFormReturn<FormValues>;
}

const CurrencyField = ({ form }: CurrencyFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="functional_currency"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel>Functional Currency</FormLabel>
          <FormControl>
            <Input {...field} placeholder="" readOnly className="bg-gray-50" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CurrencyField;