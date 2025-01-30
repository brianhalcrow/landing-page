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
import { FormValues, Criteria } from "./types";

interface CategorySelectionProps {
  form: UseFormReturn<FormValues>;
  criteriaData: Criteria[] | undefined;
  getUniqueValues: (field: keyof FormValues) => string[];
}

const CategorySelection = ({ form, criteriaData, getUniqueValues }: CategorySelectionProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="exposure_category_level_2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category Level 2</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("exposure_category_level_3", "");
                form.setValue("exposure_category_level_4", "");
              }}
              value={field.value}
              disabled={!form.getValues("entity_id")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category level 2" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getUniqueValues("exposure_category_level_2").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
        name="exposure_category_level_3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category Level 3</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("exposure_category_level_4", "");
              }}
              value={field.value}
              disabled={!form.getValues("exposure_category_level_2")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category level 3" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getUniqueValues("exposure_category_level_3").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
        name="exposure_category_level_4"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category Level 4</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!form.getValues("exposure_category_level_3")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category level 4" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getUniqueValues("exposure_category_level_4").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CategorySelection;