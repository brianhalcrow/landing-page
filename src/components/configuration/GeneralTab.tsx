import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  entity_id: z.string({
    required_error: "Please select an entity",
  }),
  exposed_currency: z.string().optional(),
  po: z.boolean().default(false),
  ap: z.boolean().default(false),
  ar: z.boolean().default(false),
  other: z.boolean().default(false),
  revenue: z.boolean().default(false),
  costs: z.boolean().default(false),
  net_income: z.boolean().default(false),
  ap_realized: z.boolean().default(false),
  ar_realized: z.boolean().default(false),
  fx_realized: z.boolean().default(false),
  net_monetary: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const GeneralTab = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entity_id: "",
      po: false,
      ap: false,
      ar: false,
      other: false,
      revenue: false,
      costs: false,
      net_income: false,
      ap_realized: false,
      ar_realized: false,
      fx_realized: false,
      net_monetary: false,
    },
  });

  const { data: entities } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_entity")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from("pre_trade_sfx_config_exposures")
        .upsert({
          ...data,
          created_at: new Date().toISOString(),
        }, {
          onConflict: 'entity_id',
        });

      if (error) throw error;
      toast.success("Hedge configuration saved successfully");
    } catch (error) {
      console.error("Error saving hedge configuration:", error);
      toast.error("Failed to save hedge configuration");
    }
  };

  const handleEntityChange = (value: string) => {
    const entity = entities?.find(e => e.entity_id === value || e.entity_name === value);
    if (entity) {
      form.setValue("entity_id", entity.entity_id || "");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Hedge Configuration</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4 items-start">
            <FormField
              control={form.control}
              name="entity_id"
              render={({ field }) => (
                <FormItem className="flex-1 max-w-[400px]">
                  <FormLabel>Entity</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleEntityChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entities?.map((entity) => (
                        <SelectItem 
                          key={entity.entity_id} 
                          value={entity.entity_id || ""}
                        >
                          {entity.entity_name}
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
                <FormItem className="flex-1 max-w-[200px]">
                  <FormLabel>Entity ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleEntityChange(e.target.value);
                      }}
                      className="bg-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Firm Commitments</h3>
              <FormField
                control={form.control}
                name="po"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Purchase Orders</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ap"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Accounts Payable</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Accounts Receivable</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="other"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Highly Probable</h3>
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Revenue</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Costs</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="net_income"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Net Income</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Realized</h3>
              <FormField
                control={form.control}
                name="ap_realized"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">AP Realized</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ar_realized"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">AR Realized</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fx_realized"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">FX Realized</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Balance Sheet</h3>
              <FormField
                control={form.control}
                name="net_monetary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Net Monetary</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit">Save Configuration</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GeneralTab;