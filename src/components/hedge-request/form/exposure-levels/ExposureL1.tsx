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

interface ExposureL1Props {
  form: UseFormReturn<FormValues>;
  criteriaData: Criteria[];
  loading: boolean;
  entityId: string;
}

const ExposureL1 = ({ form, criteriaData, loading, entityId }: ExposureL1Props) => {
  const getUniqueValues = (field: keyof Criteria) => {
    const values = new Set(criteriaData.map(item => item[field]).filter(Boolean));
    return Array.from(values);
  };

  return (
    <FormField
      control={form.control}
      name="exposure_config"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel className="h-14">Exposure L1</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={!entityId || loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select exposure L1" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {getUniqueValues("exposure_category_level_1").map((value) => (
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

export default ExposureL1;