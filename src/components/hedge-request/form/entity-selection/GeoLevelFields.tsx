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
    <>
      <FormField
        control={form.control}
        name="geo_level_1"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Geo L1</FormLabel>
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
            <FormLabel>Geo L2</FormLabel>
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
            <FormLabel>Geo L3</FormLabel>
            <FormControl>
              <Input {...field} placeholder="" readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default GeoLevelFields;