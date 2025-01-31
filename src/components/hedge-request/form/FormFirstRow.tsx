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
    <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-4 py-4">
      <FormField
        control={form.control}
        name="entity_name"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Entity Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter entity name" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Entity ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter entity ID" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="functional_currency"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Functional Currency</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Functional currency" readOnly className="w-full" />
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
              <Input {...field} placeholder="Enter cost centre" className="w-full" />
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
              <Input {...field} placeholder="Enter country" className="w-full" />
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
              <Input {...field} placeholder="Enter geo level 1" className="w-full" />
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
              <Input {...field} placeholder="Enter geo level 2" className="w-full" />
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
              <Input {...field} placeholder="Enter geo level 3" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormFirstRow;