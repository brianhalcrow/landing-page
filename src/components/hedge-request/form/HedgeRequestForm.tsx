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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex flex-col gap-8">
          {/* First Row */}
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-4">
            <FormField
              control={form.control}
              name="entity_name"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Entity Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter entity name" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entity_id"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Entity ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter entity ID" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost_centre"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Cost Centre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter cost centre" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter country" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geo_level_1"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Geo Level 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter geo level 1" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geo_level_2"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Geo Level 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter geo level 2" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geo_level_3"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Geo Level 3</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter geo level 3" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="functional_currency"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Functional Currency</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Functional currency" readOnly className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Second Row */}
          <div className="flex flex-row gap-4 flex-nowrap overflow-x-auto px-4">
            <FormField
              control={form.control}
              name="exposure_category_level_2"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Exposure L2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter exposure L2" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exposure_category_level_3"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Exposure L3</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter exposure L3" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exposure_category_level_4"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Exposure L4</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter exposure L4" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exposure_config"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Exposure Config</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter exposure config" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="h-14">Strategy</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter strategy" className="w-full" />
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
                    <Input {...field} placeholder="Enter instrument" className="w-full" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end px-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default HedgeRequestForm;