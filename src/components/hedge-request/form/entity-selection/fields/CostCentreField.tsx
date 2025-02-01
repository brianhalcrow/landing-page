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
import { FormValues } from "../../types";
import { ManagementStructure } from "../types";
import { useEffect } from "react";

interface CostCentreFieldProps {
  form: UseFormReturn<FormValues>;
  managementStructures: ManagementStructure[];
  onCostCentreSelect: (costCentre: string) => void;
}

const CostCentreField = ({ 
  form, 
  managementStructures,
  onCostCentreSelect 
}: CostCentreFieldProps) => {
  useEffect(() => {
    const currentCostCentre = form.getValues('cost_centre');
    if (managementStructures.length === 1) {
      const costCentre = managementStructures[0].cost_centre;
      if (!currentCostCentre) {
        form.setValue('cost_centre', costCentre);
        onCostCentreSelect(costCentre);
      }
    }
  }, [managementStructures, form, onCostCentreSelect]);

  return (
    <FormField
      control={form.control}
      name="cost_centre"
      rules={{ 
        required: managementStructures.length > 1 ? "Cost Centre is required" : false 
      }}
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel>Cost Centre</FormLabel>
          {managementStructures.length > 1 ? (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onCostCentreSelect(value);
              }}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Cost Centre" />
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
          ) : (
            <FormControl>
              <Input {...field} placeholder="" readOnly className="bg-gray-50" />
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CostCentreField;