import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  entity_id: z.string().min(1, "Entity ID is required"),
  entity_name: z.string().min(1, "Entity name is required"),
  exposure_category_level_2: z.string().min(1, "Category level 2 is required"),
  exposure_category_level_3: z.string().min(1, "Category level 3 is required"),
  exposure_category_level_4: z.string().min(1, "Category level 4 is required"),
});

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

  const { data: criteriaData, isLoading } = useQuery({
    queryKey: ["criteria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("criteria")
        .select("*")
        .order("entity_name");

      if (error) throw error;
      return data;
    },
  });

  const getFilteredValues = (field: keyof FormValues) => {
    if (!criteriaData) return [];
    const selectedEntityId = form.getValues("entity_id");
    const selectedEntityName = form.getValues("entity_name");
    
    const filteredData = criteriaData.filter(item => {
      if (selectedEntityId && item.entity_id !== selectedEntityId) return false;
      if (selectedEntityName && item.entity_name !== selectedEntityName) return false;
      return true;
    });

    const uniqueValues = new Set(filteredData.map((item) => item[field]));
    return Array.from(uniqueValues).filter(Boolean);
  };

  const handleEntitySelection = (field: "entity_id" | "entity_name", value: string) => {
    const selectedCriteria = criteriaData?.find(item => 
      field === "entity_id" ? item.entity_id === value : item.entity_name === value
    );

    if (selectedCriteria) {
      form.setValue(field === "entity_id" ? "entity_name" : "entity_id", 
        field === "entity_id" ? selectedCriteria.entity_name : selectedCriteria.entity_id
      );
      
      // Reset category fields when entity changes
      form.setValue("exposure_category_level_2", "");
      form.setValue("exposure_category_level_3", "");
      form.setValue("exposure_category_level_4", "");
    }
  };

  const handleSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    // Validate against criteria table
    const isValidCombination = criteriaData?.some(criteria => 
      criteria.entity_id === values.entity_id &&
      criteria.entity_name === values.entity_name &&
      criteria.exposure_category_level_2 === values.exposure_category_level_2 &&
      criteria.exposure_category_level_3 === values.exposure_category_level_3 &&
      criteria.exposure_category_level_4 === values.exposure_category_level_4
    );

    if (!isValidCombination) {
      toast({
        title: "Invalid combination",
        description: "Please select a valid combination of values from the criteria table.",
        variant: "destructive"
      });
      return;
    }
    // TODO: Handle form submission
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                    {getFilteredValues("entity_name").map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    {getFilteredValues("entity_id").map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!form.getValues("entity_id")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category level 2" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getFilteredValues("exposure_category_level_2").map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
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
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!form.getValues("exposure_category_level_2")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category level 3" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getFilteredValues("exposure_category_level_3").map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
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
                    {getFilteredValues("exposure_category_level_4").map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;