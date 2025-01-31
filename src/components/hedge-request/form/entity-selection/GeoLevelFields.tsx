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

interface GeoLevelFieldsProps {
  form: UseFormReturn<FormValues>;
}

const GeoLevelFields = ({ form }: GeoLevelFieldsProps) => {
  return (
    <div className="flex gap-4">
      <FormField
        control={form.control}
        name="geo_level_1"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Geo Level 1</FormLabel>
            <FormControl>
              <Input {...field} placeholder="" readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geo_level_2"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Geo Level 2</FormLabel>
            <FormControl>
              <Input {...field} placeholder="" readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geo_level_3"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Geo Level 3</FormLabel>
            <FormControl>
              <Input {...field} placeholder="" readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GeoLevelFields;