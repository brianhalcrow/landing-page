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
import { Criteria, FormValues } from "./types";

interface CategorySelectionProps {
  form: UseFormReturn<FormValues>;
  criteriaData: Criteria[] | undefined;
  getUniqueValues: (field: keyof Criteria) => string[];
}

const CategorySelection = ({ form, criteriaData, getUniqueValues }: CategorySelectionProps) => {
  const entitySelected = !!form.watch("entity_id");

  return (
    <>
      <FormField
        control={form.control}
        name="exposure_category_level_2"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Exposure L2</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!entitySelected}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select exposure L2" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getUniqueValues("exposure_category_level_2").map((value) => (
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

      <FormField
        control={form.control}
        name="exposure_category_level_3"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Exposure L3</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!form.watch("exposure_category_level_2")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select exposure L3" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getUniqueValues("exposure_category_level_3").map((value) => (
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

      <FormField
        control={form.control}
        name="exposure_category_level_4"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Exposure L4</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!form.watch("exposure_category_level_3")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select exposure L4" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getUniqueValues("exposure_category_level_4").map((value) => (
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
    </>
  );
};

export default CategorySelection;