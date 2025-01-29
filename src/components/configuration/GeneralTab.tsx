import { useEffect } from "react";
import ConfigurationForm from "./form/ConfigurationForm";
import ConfigurationGrid from "./ConfigurationGrid";
import { useEntities } from "@/hooks/useEntities";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GeneralTab = () => {
  const { entities, isLoading, refetch } = useEntities();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pre_trade_sfx_config_exposures'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          refetch();
          toast.success('Configuration updated successfully');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="p-6 space-y-8">
      <ConfigurationForm />
      <ConfigurationGrid entities={entities || []} />
    </div>
  );
};

export default GeneralTab;