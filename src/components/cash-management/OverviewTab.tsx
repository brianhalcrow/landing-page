
import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { createColumnDefs, defaultColDef, autoGroupColumnDef } from './gridConfig';
import { useGridConfig } from './hooks/useGridConfig';
import { supabase } from "@/integrations/supabase/client";
import { BankAccountData } from './types';
import { Skeleton } from "@/components/ui/skeleton";

const OverviewTab = () => {
  const { onGridReady } = useGridConfig();
  const columnDefs = useMemo(() => createColumnDefs(), []);
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('client_bank_account')
          .select('*')
          .order('entity', { ascending: true });

        if (error) {
          throw error;
        }

        setBankAccounts(data || []);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  if (loading) {
    return <Skeleton className="h-[calc(100vh-12rem)] w-full" />;
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div 
        className="flex-grow ag-theme-alpine"
        style={{ 
          height: 'calc(100vh - 12rem)',
          minHeight: '500px',
          width: '100%'
        }}
      >
        <GridStyles />
        <AgGridReact
          rowData={bankAccounts}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
          suppressAggFuncInHeader={true}
          onGridReady={onGridReady}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          rowGroupPanelShow="never"
          groupDisplayType="groupRows"
          rememberGroupStateWhenNewData={true}
          groupMaintainOrder={true}
          suppressGroupDefaultExpand={false}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
