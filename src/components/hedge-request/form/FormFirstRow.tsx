import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./types";

interface FormFirstRowProps {
  form: UseFormReturn<FormValues>;
}

const FormFirstRow = ({ form }: FormFirstRowProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="functional_currency"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Functional Currency</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Functional currency" readOnly className="w-full bg-gray-50" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cost_centre"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Cost Centre</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Cost centre" readOnly className="w-full bg-gray-50" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Country</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Country" readOnly className="w-full bg-gray-50" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geo_level_1"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Geo Level 1</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Geo level 1" readOnly className="w-full bg-gray-50" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geo_level_2"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Geo Level 2</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Geo level 2" readOnly className="w-full bg-gray-50" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geo_level_3"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Geo Level 3</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Geo level 3" readOnly className="w-full bg-gray-50" />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default FormFirstRow;