import { UseFormReturn } from "react-hook-form";
import { FormValues, Criteria } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      } catch (error) {
        console.error("Error in fetchCriteria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCriteria();
  }, [entityId]);

  const getUniqueValues = (field: keyof Criteria) => {
    const values = new Set(criteriaData.map(item => item[field]).filter(Boolean));
    return Array.from(values);
  };

  return (
    <div className="flex gap-4">
      <FormField
        control={form.control}
        name="exposure_category_level_2"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L2</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!entityId || loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select L2" />
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
        name="exposure_category_level_4"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure L4</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!entityId || loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select L4" />
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

      <FormField
        control={form.control}
        name="exposure_config"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel className="h-14">Exposure Config</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!entityId || loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select config" />
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
    </div>
  );
};

export default CategorySelection;