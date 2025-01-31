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
import { Criteria, FormValues } from "../types";

interface ExposureL2Props {
  form: UseFormReturn<FormValues>;
  criteriaData: Criteria[];
  disabled: boolean;
}

const ExposureL2 = ({ form, criteriaData, disabled }: ExposureL2Props) => {
  const filterByPreviousSelection = (field: keyof Criteria, previousValue: string) => {
    if (!previousValue) return [];
    const filteredData = criteriaData.filter(
      item => item.exposure_category_level_1 === previousValue
    );
    const values = new Set(
      filteredData.map(item => item[field]).filter(Boolean)
    );
    return Array.from(values);
  };

  return (
    <FormField
      control={form.control}
      name="exposure_category_level_2"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel className="h-14">Exposure L2</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select exposure L2" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filterByPreviousSelection(
                "exposure_category_level_2",
                form.watch("exposure_config")
              ).map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExposureL2;