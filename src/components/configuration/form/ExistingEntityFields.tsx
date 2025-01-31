import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../types";
import { Tables } from '@/integrations/supabase/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExistingEntityFieldsProps {
  form: UseFormReturn<FormValues>;
  entities: Tables<'config_entity'>[] | undefined;
  isLoadingEntities: boolean;
  onFetchConfig: (entityId: string) => Promise<void>;
}

const ExistingEntityFields = ({ 
  form, 
  entities, 
  isLoadingEntities,
  onFetchConfig 
}: ExistingEntityFieldsProps) => {
  const fetchExistingConfig = async (entityId: string) => {
    try {
      const { data, error } = await supabase
        .from("config_exposures")
        .select()
        .eq("entity_id", entityId)
        .maybeSingle();

      if (error) {
        toast.error('Failed to fetch existing configuration');
        throw error;
      }

      if (data) {
        const selectedEntity = entities?.find(e => e.entity_id === entityId);
        form.reset({
          entity_id: data.entity_id,
          entity_name: data.entity_name,
          functional_currency: data.functional_currency,
          po: data.po || false,
          ap: data.ap || false,
          ar: data.ar || false,
          other: data.other || false,
          revenue: data.revenue || false,
          costs: data.costs || false,
          net_income: data.net_income || false,
          ap_realized: data.ap_realized || false,
          ar_realized: data.ar_realized || false,
          fx_realized: data.fx_realized || false,
          net_monetary: data.net_monetary || false,
          monetary_assets: data.monetary_assets || false,
          monetary_liabilities: data.monetary_liabilities || false,
        });
        toast.success('Configuration loaded successfully');
      } else {
        // If no configuration exists, reset form with basic entity details
        const selectedEntity = entities?.find(e => e.entity_id === entityId);
        if (selectedEntity) {
          form.reset({
            entity_id: selectedEntity.entity_id,
            entity_name: selectedEntity.entity_name,
            functional_currency: selectedEntity.functional_currency || "",
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
          });
          toast.info('No existing configuration found. Creating new configuration.');
        }
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
      toast.error('Failed to fetch configuration');
    }
  };

  const handleEntitySelect = (value: string) => {
    if (value) {
      fetchExistingConfig(value);
      const selectedEntity = entities?.find(e => e.entity_id === value);
      if (selectedEntity) {
        form.setValue("entity_name", selectedEntity.entity_name);
        form.setValue("functional_currency", selectedEntity.functional_currency || "");
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="entity_name"
        render={({ field }) => (
          <FormItem className="w-80">
            <FormLabel>Entity Name</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const selectedEntity = entities?.find(e => e.entity_name === value);
                if (selectedEntity) {
                  handleEntitySelect(selectedEntity.entity_id);
                }
              }}
              value={field.value}
              disabled={isLoadingEntities}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select name" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem 
                    key={entity.entity_id} 
                    value={entity.entity_name}
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
          <FormItem className="w-40">
            <FormLabel>Entity ID</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleEntitySelect(value);
              }}
              value={field.value}
              disabled={isLoadingEntities}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem 
                    key={entity.entity_id} 
                    value={entity.entity_id}
                  >
                    {entity.entity_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );
};

export default ExistingEntityFields;