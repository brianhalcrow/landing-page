import { UseFormReturn } from "react-hook-form";
import { FormValues, Criteria } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ExposureL4 from "./exposure-levels/ExposureL4";

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

  return (
    <ExposureL4 
      form={form}
      criteriaData={criteriaData}
      disabled={false}
    />
  );
};

export default CategorySelection;