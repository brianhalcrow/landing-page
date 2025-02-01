import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from 'handsontable/registry';
import "handsontable/dist/handsontable.full.min.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { HotTableProps } from '@handsontable/react-wrapper';

// Register all Handsontable modules
registerAllModules();

const EntityConfigurationTab = () => {
  const { data: entities, isLoading } = useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const settings: HotTableProps = {
    data: entities || [],
    colHeaders: ['Entity ID', 'Entity Name', 'Functional Currency', 'Accounting Rate Method', 'Active'],
    columns: [
      { data: 'entity_id', readOnly: true },
      { data: 'entity_name' },
      { data: 'functional_currency' },
      { data: 'accounting_rate_method' },
      { 
        data: 'is_active',
        type: 'checkbox',
        editor: 'checkbox',
        renderer: 'checkbox'
      }
    ],
    licenseKey: 'non-commercial-and-evaluation',
    height: 'auto',
    width: '100%',
    stretchH: 'all' as const
  };

  return (
    <Suspense fallback={
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    }>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Entity Configuration</h2>
        <div className="w-full overflow-x-auto">
          <HotTable {...settings} />
        </div>
      </div>
    </Suspense>
  );
};

export default EntityConfigurationTab;