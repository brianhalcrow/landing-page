import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";
import { ManagementStructure } from "./types";

interface ManagementFieldsProps {
  form: UseFormReturn<FormValues>;
  managementStructures: ManagementStructure[];
  onCostCentreSelect: (costCentre: string) => void;
}

const ManagementFields = ({ 
  form, 
  managementStructures,
  onCostCentreSelect 
}: ManagementFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="cost_centre"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Cost Centre</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onCostCentreSelect(value);
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {managementStructures.map((structure) => (
                  <SelectItem 
                    key={structure.cost_centre} 
                    value={structure.cost_centre}
                  >
                    {structure.cost_centre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </>
  );
};

export default ManagementFields;