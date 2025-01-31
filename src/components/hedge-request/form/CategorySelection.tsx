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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CategorySelectionProps {
  form: UseFormReturn<FormValues>;
  entityId: string;
}

const CategorySelection = ({ form, entityId }: CategorySelectionProps) => {
  const [criteriaData, setCriteriaData] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCriteria = async () => {
      if (!entityId) {
        setCriteriaData([]);
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching criteria for entity:", entityId);
        const { data, error } = await supabase
          .from("criteria")
          .select("*")
          .eq("entity_id", entityId);

        if (error) {
          console.error("Error fetching criteria:", error);
          throw error;
        }

        console.log("Fetched criteria data:", data);
        setCriteriaData(data || []);

        // Reset form fields when entity changes
        form.setValue("exposure_config", "");
        form.setValue("exposure_category_level_2", "");
        form.setValue("exposure_category_level_3", "");
        form.setValue("exposure_category_level_4", "");
      } catch (error) {
        console.error("Error in fetchCriteria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, [entityId, form]);

  const getUniqueValues = (field: keyof Criteria) => {
    const values = new Set(criteriaData.map(item => item[field]).filter(Boolean));
    return Array.from(values);
  };

  const filterCriteriaByPreviousSelection = (
    field: keyof Criteria,
    previousField: keyof Criteria,
    previousValue: string
  ) => {
    if (!previousValue) return [];
    
    const filteredData = criteriaData.filter(
      item => item[previousField] === previousValue
    );
    const values = new Set(
      filteredData.map(item => item[field]).filter(Boolean)
    );
    return Array.from(values);
  };

  return (
    <>
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
                {getUniqueValues("exposure_config").map((value) => (
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
        name="exposure_category_level_2"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L2</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!form.watch("exposure_config")}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select exposure L2" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filterCriteriaByPreviousSelection(
                  "exposure_category_level_2",
                  "exposure_config",
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

      <FormField
        control={form.control}
        name="exposure_category_level_3"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L3</FormLabel>
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
                {filterCriteriaByPreviousSelection(
                  "exposure_category_level_3",
                  "exposure_category_level_2",
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

      <FormField
        control={form.control}
        name="exposure_category_level_4"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L4</FormLabel>
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
                {filterCriteriaByPreviousSelection(
                  "exposure_category_level_4",
                  "exposure_category_level_3",
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
    </>
  );
};

export default CategorySelection;