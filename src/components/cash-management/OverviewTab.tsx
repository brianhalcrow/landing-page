
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { supabase } from "@/integrations/supabase/client";
import type { BankAccountData } from './types';
import type { ColDef } from 'ag-grid-community';
import { 
  ClientSideRowModelModule,
  RowGroupingModule,
  EnterpriseCoreModule
} from '@ag-grid-enterprise/all-modules';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);

  const modules = [
    ClientSideRowModelModule,
    RowGroupingModule,
    EnterpriseCoreModule
  ];

  const columnDefs: ColDef[] = [
    { 
      field: 'entity_id',
      headerName: 'Entity ID',
      enableRowGroup: true,
      rowGroup: true,
      hide: true
    },
    {
      field: 'entity',
      headerName: 'Entity',
      enableRowGroup: true
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      enableRowGroup: true
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      enableRowGroup: true
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      enableRowGroup: true
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number'
    },
    {
      field: 'account_name_bank',
      headerName: 'Account Name'
    },
    {
      field: 'active',
      headerName: 'Active',
      cellRenderer: (params: any) => params.value ? '✓' : '✗'
    }
  ];

  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true
  };

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('client_bank_account')
          .select('*')
          .order('entity_id', { ascending: true });
        
        if (error) throw error;
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
    return (
      <div className="flex items-center justify-center p-4">
        <span>Loading bank accounts...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] w-full ag-theme-alpine">
      <AgGridReact
        modules={modules}
        rowData={bankAccounts}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        groupDisplayType="groupRows"
        animateRows={true}
        rowGroupPanelShow="always"
        enableRangeSelection={true}
        suppressAggFuncInHeader={true}
      />
    </div>
  );
};

export default OverviewTab;
