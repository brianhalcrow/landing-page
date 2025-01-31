import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../../types";

interface CountryFieldProps {
  form: UseFormReturn<FormValues>;
}

const CountryField = ({ form }: CountryFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Input {...field} placeholder="" readOnly className="bg-gray-50" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CountryField;