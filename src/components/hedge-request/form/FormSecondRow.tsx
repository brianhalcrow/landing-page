import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./types";

interface FormSecondRowProps {
  form: UseFormReturn<FormValues>;
}

const FormSecondRow = ({ form }: FormSecondRowProps) => {
  return (
    <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-4 py-4">
      <FormField
        control={form.control}
        name="exposure_config"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure Config</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter exposure config" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="strategy"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Strategy</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter strategy" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="instrument"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Instrument</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter instrument" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exposure_category_level_2"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L2</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter exposure L2" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exposure_category_level_3"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L3</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter exposure L3" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exposure_category_level_4"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L4</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter exposure L4" className="w-full" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormSecondRow;