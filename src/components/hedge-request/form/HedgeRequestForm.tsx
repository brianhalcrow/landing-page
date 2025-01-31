import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues, formSchema } from "./types";
import { useEntities } from "@/hooks/useEntities";
import EntitySelection from "./EntitySelection";
import CategorySelection from "./CategorySelection";

const HedgeRequestForm: React.FC = () => {
  const { entities, isLoading } = useEntities();
  
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

  const handleEntitySelect = (field: "entity_id" | "entity_name", value: string) => {
    const selectedEntity = entities?.find(entity => 
      field === "entity_id" ? entity.entity_id === value : entity.entity_name === value
    );

    if (selectedEntity) {
      form.setValue("entity_id", selectedEntity.entity_id);
      form.setValue("entity_name", selectedEntity.entity_name);
      form.setValue("functional_currency", selectedEntity.functional_currency || "");
    }
  };

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-2 py-1">
            <EntitySelection 
              form={form}
              entities={entities}
              isLoading={isLoading}
              onEntitySelect={handleEntitySelect}
            />
          </div>
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-2 py-1">
            <CategorySelection 
              form={form}
              entityId={form.watch("entity_id")}
            />
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Strategy</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instrument"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Instrument</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end px-2">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;