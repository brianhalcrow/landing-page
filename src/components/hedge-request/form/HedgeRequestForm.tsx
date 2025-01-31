import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EntitySelection from "./EntitySelection";
import CategorySelection from "./CategorySelection";
import { FormValues, Entity, Criteria } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./types";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

const HedgeRequestForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
      entity_name: "",
      cost_centre: "",
      country: "",
      geo_level_1: "",
      geo_level_2: "",
      geo_level_3: "",
      functional_currency: "",
      exposure_category_level_2: "",
      exposure_category_level_3: "",
      exposure_category_level_4: "",
      exposure_config: "",
      strategy: "",
      instrument: "",
    },
  });

  const { data: entities, isLoading: isLoadingEntities } = useQuery<Entity[]>({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_exposures")
        .select("entity_id, entity_name, functional_currency")
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
        field === "entity_id" ? selectedEntity.entity_name : selectedEntity.entity_id,
        { shouldValidate: true }
      );
      
      if (selectedEntity.functional_currency) {
        form.setValue("functional_currency", selectedEntity.functional_currency);
      }

      // Reset dependent fields
      form.setValue("exposure_category_level_2", "");
      form.setValue("exposure_category_level_3", "");
      form.setValue("exposure_category_level_4", "");
    }
  };

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    toast.success("Form submitted successfully!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <EntitySelection
            form={form}
            entities={entities}
            isLoading={isLoadingEntities}
            onEntitySelect={handleEntitySelection}
          />
          
          <FormField
            control={form.control}
            name="cost_centre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Centre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter cost centre" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter country" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geo_level_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geo Level 1</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter geo level 1" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geo_level_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geo Level 2</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter geo level 2" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geo_level_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geo Level 3</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter geo level 3" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="functional_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Functional Currency</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Functional currency" readOnly />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <CategorySelection
            form={form}
            criteriaData={criteriaData}
            getUniqueValues={(field) => {
              if (!criteriaData) return [];
              const values = new Set(criteriaData.map(item => item[field]).filter(Boolean));
              return Array.from(values) as string[];
            }}
          />

          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter strategy" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter instrument" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;