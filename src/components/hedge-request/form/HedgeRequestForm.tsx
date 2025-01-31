import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormValues, formSchema } from "./types";
import EntitySelection from "./EntitySelection";
import CategorySelection from "./CategorySelection";

const HedgeRequestForm: React.FC = () => {
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

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  const handleEntitySelection = (field: "entity_id" | "entity_name", value: string) => {
    form.setValue(field, value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-7 gap-4">
          {/* First Row */}
          <EntitySelection
            form={form}
            entities={[]}
            isLoading={false}
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

        {/* Second Row */}
        <div className="grid grid-cols-7 gap-4">
          <CategorySelection
            form={form}
            criteriaData={[]}
            getUniqueValues={() => []}
          />

          <FormField
            control={form.control}
            name="exposure_config"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposure Config</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter exposure config" />
                </FormControl>
              </FormItem>
            )}
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