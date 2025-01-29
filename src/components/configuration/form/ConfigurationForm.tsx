import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
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
import { Button } from "@/components/ui/button";
import { formSchema, FormValues } from "../types";
import CashflowGroup from "./CashflowGroup";
import RealizedGroup from "./RealizedGroup";
import BalanceSheetGroup from "./BalanceSheetGroup";

const ConfigurationForm = () => {
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
      monetary_assets: false,
      monetary_liabilities: false,
    },
  });

  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ["entities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pre_trade_sfx_config_entity")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!values.entity_id) {
        toast.error("Please select an entity");
        return;
      }

      const selectedEntity = entities?.find(e => e.entity_id === values.entity_id);
      if (!selectedEntity) {
        toast.error("Selected entity not found");
        return;
      }

      const { data: existingRecord, error: checkError } = await supabase
        .from("pre_trade_sfx_config_exposures")
        .select()
        .eq("entity_id", values.entity_id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      const submitData = {
        entity_id: values.entity_id,
        entity_name: selectedEntity.entity_name || '',
        po: values.po,
        ap: values.ap,
        ar: values.ar,
        other: values.other,
        revenue: values.revenue,
        costs: values.costs,
        net_income: values.net_income,
        ap_realized: values.ap_realized,
        ar_realized: values.ar_realized,
        fx_realized: values.fx_realized,
        net_monetary: values.net_monetary,
        monetary_assets: values.monetary_assets,
        monetary_liabilities: values.monetary_liabilities,
        created_at: new Date().toISOString(),
      };

      if (existingRecord) {
        const { error: updateError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .update(submitData)
          .eq("entity_id", values.entity_id);

        if (updateError) throw updateError;
        toast.success("Hedge configuration updated successfully");
      } else {
        const { error: insertError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .insert(submitData);

        if (insertError) throw insertError;
        toast.success("Hedge configuration saved successfully");
      }
    } catch (error) {
      console.error("Error saving hedge configuration:", error);
      toast.error("Failed to save hedge configuration");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name="entity_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity ID</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingEntities}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities?.map((entity) => (
                      <SelectItem 
                        key={entity.entity_id} 
                        value={entity.entity_id || ""}
                      >
                        {entity.entity_id}
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
                <FormLabel>Entity Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingEntities}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select name" />
                  </SelectTrigger>
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
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-2 border rounded-lg p-6 bg-blue-50">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">Cashflow</h2>
            <CashflowGroup form={form} />
          </div>

          <div className="border rounded-lg p-6 bg-green-50">
            <h2 className="text-xl font-semibold mb-4 text-green-900">Balance Sheet</h2>
            <BalanceSheetGroup form={form} />
          </div>

          <div className="border rounded-lg p-6 bg-purple-50">
            <h2 className="text-xl font-semibold mb-4 text-purple-900">Settlement</h2>
            <RealizedGroup form={form} />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit">Save Configuration</Button>
        </div>
      </form>
    </Form>
  );
};

export default ConfigurationForm;