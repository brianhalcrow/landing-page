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
import FirmCommitmentsGroup from "./FirmCommitmentsGroup";
import HighlyProbableGroup from "./HighlyProbableGroup";
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

  const onSubmit = async (values: FormValues) => {
    try {
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
        created_at: new Date().toISOString(),
      };

      if (existingRecord) {
        const { error: updateError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .update(submitData)
          .eq("entity_id", values.entity_id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("pre_trade_sfx_config_exposures")
          .insert(submitData);

        if (insertError) throw insertError;
      }

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
                  <SelectTrigger>
                    <SelectValue placeholder="Select an entity" />
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

        <div className="grid grid-cols-2 gap-6">
          <FirmCommitmentsGroup form={form} />
          <HighlyProbableGroup form={form} />
          <RealizedGroup form={form} />
          <BalanceSheetGroup form={form} />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit">Save Configuration</Button>
        </div>
      </form>
    </Form>
  );
};

export default ConfigurationForm;