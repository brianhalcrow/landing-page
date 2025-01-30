import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Define the form schema outside the component
const formSchema = z.object({
  entity_id: z.string().min(1, "Entity ID is required"),
  entity_name: z.string().min(1, "Entity name is required"),
  exposure_category_level_2: z.string().min(1, "Category level 2 is required"),
  exposure_category_level_3: z.string().min(1, "Category level 3 is required"),
  exposure_category_level_4: z.string().min(1, "Category level 4 is required"),
});

// Define strict types for the data structures
type Entity = {
  entity_id: string;
  entity_name: string;
};

type Criteria = {
  entity_id: string;
  exposure_category_level_2: string;
  exposure_category_level_3: string;
  exposure_category_level_4: string;
  [key: string]: any; // for other potential fields
};

type FormValues = z.infer<typeof formSchema>;

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

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("config_exposures")
        .select("*")
        .order("entity_name");

      if (error) {
        console.error("Error fetching entities:", error);
        throw error;
      }
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

      if (error) {
        console.error("Error fetching criteria:", error);
        throw error;
      }
      return data;
    },
    enabled: !!form.watch("entity_id"),
  });

  const handleEntitySelection = (field: "entity_id" | "entity_name", value: string) => {
    const selectedEntity = entities?.find(item => 
      field === "entity_id" ? item.entity_id === value : item.entity_name === value
    );

    if (selectedEntity) {
      form.setValue(field === "entity_id" ? "entity_name" : "entity_id", 
        field === "entity_id" ? selectedEntity.entity_name : selectedEntity.entity_id
      );
      
      // Reset category fields when entity changes
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

      if (level2Value === "Balance Sheet") {
        return Array.from(new Set(filteredData
          .map(item => item.exposure_category_level_3)))
          .filter(value => value === "Monetary" || value === "Settlement");
      }

      return Array.from(new Set(filteredData.map(item => item[field] || "")));
    }

    if (field === "exposure_category_level_4") {
      const level2Value = form.watch("exposure_category_level_2");
      const level3Value = form.watch("exposure_category_level_3");
      return Array.from(new Set(criteriaData
        .filter(item => 
          item.exposure_category_level_2 === level2Value &&
          item.exposure_category_level_3 === level3Value
        )
        .map(item => item[field] || "")
      ));
    }

    if (field === "exposure_category_level_2") {
      return Array.from(new Set(criteriaData.map(item => item[field] || "")));
    }

    return Array.from(new Set(criteriaData.map(item => item[field] || ""))).filter(Boolean);
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
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="entity_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity Name</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleEntitySelection("entity_name", value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity name" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {entities?.map((entity) => (
                      <SelectItem key={entity.entity_id} value={entity.entity_name}>
                        {entity.entity_name}
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
            name="entity_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity ID</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleEntitySelection("entity_id", value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity ID" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {entities?.map((entity) => (
                      <SelectItem key={entity.entity_id} value={entity.entity_id}>
                        {entity.entity_id}
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

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;