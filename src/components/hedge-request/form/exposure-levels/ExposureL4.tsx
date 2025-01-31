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
import { useEffect } from "react";

interface ExposureL4Props {
  form: UseFormReturn<FormValues>;
  criteriaData: Criteria[];
  disabled: boolean;
}

const ExposureL4 = ({ form, criteriaData, disabled }: ExposureL4Props) => {
  const filterByPreviousSelection = (field: keyof Criteria, previousValue: string) => {
    if (!previousValue) return [];
    const filteredData = criteriaData.filter(
      item => item.exposure_category_level_3 === previousValue
    );
    const values = new Set(
      filteredData.map(item => item[field]).filter(Boolean)
    );
    return Array.from(values);
  };

  useEffect(() => {
    const exposureL3 = form.watch("exposure_category_level_3");
    if (exposureL3) {
      const options = filterByPreviousSelection(
        "exposure_category_level_4",
        exposureL3
      );
      if (options.length === 1) {
        form.setValue("exposure_category_level_4", options[0]);
      }
    }
  }, [form.watch("exposure_category_level_3"), criteriaData]);

  return (
    <FormField
      control={form.control}
      name="exposure_category_level_4"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel className="h-14">Exposure L4</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select exposure L4" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {filterByPreviousSelection(
                "exposure_category_level_4",
                form.watch("exposure_category_level_3")
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

export default ExposureL4;