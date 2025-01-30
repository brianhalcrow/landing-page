import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormValues, formSchema, Entity, Criteria } from "./types";
import EntitySelection from "./EntitySelection";
import CategorySelection from "./CategorySelection";

const HedgeRequestForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
      entity_name: "",
      exposure_category_level_2: "",
      exposure_category_level_3: "",
      exposure_category_level_4: "",
    },
  });

  const { data: entities, isLoading: isLoadingEntities } = useQuery<Entity[]>({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_exposures")
        .select("entity_id, entity_name")
        .order("entity_name");

      if (error) throw error;
      return data;
    },
  });

  const { data: criteriaData } = useQuery<Criteria[]>({
    queryKey: ["criteria", form.watch("entity_id")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criteria")
        .select("*")
        .eq("entity_id", form.watch("entity_id"))
        .order("exposure_category_level_2");

      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("entity_id"),
  });

  const handleEntitySelection = (field: "entity_id" | "entity_name", value: string) => {
    const selectedEntity = entities?.find(item => 
      field === "entity_id" ? item.entity_id === value : item.entity_name === value
    );

    if (selectedEntity) {
      form.setValue(
        field === "entity_id" ? "entity_name" : "entity_id",
        field === "entity_id" ? selectedEntity.entity_name : selectedEntity.entity_id
      );
      
      form.setValue("exposure_category_level_2", "");
      form.setValue("exposure_category_level_3", "");
      form.setValue("exposure_category_level_4", "");
    }
  };

  const getUniqueValues = (field: keyof FormValues): string[] => {
    if (!criteriaData) return [];

    if (field === "exposure_category_level_3") {
      const level2Value = form.watch("exposure_category_level_2");
      const filteredData = criteriaData.filter(item => 
        item.exposure_category_level_2 === level2Value
      );
      return Array.from(new Set(filteredData.map(item => item[field] || ""))).filter(Boolean);
    }

    if (field === "exposure_category_level_4") {
      const level2Value = form.watch("exposure_category_level_2");
      const level3Value = form.watch("exposure_category_level_3");
      return Array.from(new Set(
        criteriaData
          .filter(item => 
            item.exposure_category_level_2 === level2Value &&
            item.exposure_category_level_3 === level3Value
          )
          .map(item => item[field] || "")
      )).filter(Boolean);
    }

    if (field === "exposure_category_level_2") {
      return Array.from(new Set(
        criteriaData.map(item => item[field] || "")
      )).filter(Boolean);
    }

    return [];
  };

  const handleSubmit = (values: FormValues) => {
    const isValidCombination = criteriaData?.some(criteria => 
      criteria.entity_id === values.entity_id &&
      criteria.exposure_category_level_2 === values.exposure_category_level_2 &&
      criteria.exposure_category_level_3 === values.exposure_category_level_3 &&
      criteria.exposure_category_level_4 === values.exposure_category_level_4
    );

    if (!isValidCombination) {
      toast.error("Invalid combination. Please select valid options from the criteria table.");
      return;
    }

    console.log("Form submitted:", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EntitySelection
          form={form}
          entities={entities}
          isLoading={isLoadingEntities}
          onEntitySelect={handleEntitySelection}
        />
        <CategorySelection
          form={form}
          criteriaData={criteriaData}
          getUniqueValues={getUniqueValues}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;