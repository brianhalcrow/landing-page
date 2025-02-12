
import { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { supabase } from "@/integrations/supabase/client";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { toast } from 'sonner';
import { gridStyles, gridOptions } from './config/gridConfig';
import { createColumnDefs, defaultColDef } from './config/columnDefs';
import { useGridPreferences } from './hooks/useGridPreferences';
import type { BankAccount } from './types/bankAccount';

const GRID_ID = 'cash-management-overview';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const gridRef = useRef<AgGridReact>(null);
  const { saveColumnState, loadColumnState } = useGridPreferences(gridRef, GRID_ID);

  const onFirstDataRendered = useCallback(() => {
    loadColumnState();
  }, [loadColumnState]);

  const onColumnResized = useCallback(() => {
    saveColumnState();
  }, [saveColumnState]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('erp_bank_account')  // Updated table name here
          .select('*')
          .order('entity_id', { ascending: true });

        if (error) throw error;
        setBankAccounts(data || []);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
        toast.error('Failed to load bank accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span>Loading bank accounts...</span>
      </div>
    );
  }

  return (
    <div 
      className="h-[calc(100vh-12rem)] w-full ag-theme-alpine"
      style={gridStyles}
    >
      <AgGridReact
        ref={gridRef}
        rowData={bankAccounts}
        columnDefs={createColumnDefs()}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
        groupDisplayType="groupRows"
        animateRows={true}
        rowGroupPanelShow="always"
        enableRangeSelection={true}
        suppressAggFuncInHeader={true}
        domLayout="normal"
        onFirstDataRendered={onFirstDataRendered}
        onColumnResized={onColumnResized}
      />
    </div>
  );
};

export default OverviewTab;
