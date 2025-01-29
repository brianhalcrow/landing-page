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

      if (checkError) throw checkError;

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
    form.setValue("entity_id", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4 items-start max-w-2xl mx-auto">
          <FormField
            control={form.control}
            name="entity_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Entity ID</FormLabel>
                <Select
                  onValueChange={handleEntityChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select an ID" />
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
              <FormItem className="flex-1">
                <FormLabel>Entity Name</FormLabel>
                <Select
                  onValueChange={handleEntityChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-[200px]">
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

        <div className="max-w-5xl mx-auto">
          <img 
            src="/lovable-uploads/4f983486-df40-4c59-a985-75f537049b5e.png" 
            alt="Hedge Types Flowchart" 
            className="w-full mb-8"
          />
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-green-800 mb-4">Transaction Exposure (Current)</h2>
                <FirmCommitmentsGroup form={form} />
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">Highly Probable Transactions</h2>
                <HighlyProbableGroup form={form} />
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-orange-800 mb-4">Transaction Exposure (Realized)</h2>
                <RealizedGroup form={form} />
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-yellow-800 mb-4">Balance Sheet Exposure</h2>
                <BalanceSheetGroup form={form} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end max-w-5xl mx-auto mt-8">
          <Button type="submit">Save Configuration</Button>
        </div>
      </form>
    </Form>
  );
};

export default ConfigurationForm;