import { UseFormReturn } from "react-hook-form";
import { FormValues, Criteria } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ExposureL1 from "./exposure-levels/ExposureL1";
import ExposureL2 from "./exposure-levels/ExposureL2";
import ExposureL3 from "./exposure-levels/ExposureL3";
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

  return (
    <>
      <ExposureL1 
        form={form}
        criteriaData={criteriaData}
        loading={loading}
        entityId={entityId}
      />
      <ExposureL2 
        form={form}
        criteriaData={criteriaData}
        disabled={!form.watch("exposure_config")}
      />
      <ExposureL3 
        form={form}
        criteriaData={criteriaData}
        disabled={!form.watch("exposure_category_level_2")}
      />
      <ExposureL4 
        form={form}
        criteriaData={criteriaData}
        disabled={!form.watch("exposure_category_level_3")}
      />
    </>
  );
};

export default CategorySelection;