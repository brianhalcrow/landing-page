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

interface ExposureL3Props {
  form: UseFormReturn<FormValues>;
  criteriaData: Criteria[];
  disabled: boolean;
}

const ExposureL3 = ({ form, criteriaData, disabled }: ExposureL3Props) => {
  const filterByPreviousSelection = (field: keyof Criteria, previousValue: string) => {
    if (!previousValue) return [];
    const filteredData = criteriaData.filter(
      item => item.exposure_category_level_2 === previousValue
    );
    const values = new Set(
      filteredData.map(item => item[field]).filter(Boolean)
    );
    return Array.from(values);
  };

  return (
    <FormField
      control={form.control}
      name="exposure_category_level_3"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel className="h-14">Exposure L3</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select exposure L3" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filterByPreviousSelection(
                "exposure_category_level_3",
                form.watch("exposure_category_level_2")
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

export default ExposureL3;