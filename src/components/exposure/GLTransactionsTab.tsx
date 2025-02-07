
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const GLTransactionsTab = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['gl-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_gl_transactions')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const columnDefs: ColDef[] = [
    { 
      field: 'entity', 
      headerName: 'Entity',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'entity_id', 
      headerName: 'Entity ID',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'cost_centre', 
      headerName: 'Cost Centre',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'account_number', 
      headerName: 'Account Number',
      flex: 1,
      minWidth: 130,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'account_name', 
      headerName: 'Account Name',
      flex: 1.5,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'transaction_currency', 
      headerName: 'Currency',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'transaction_amount', 
      headerName: 'Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      type: 'numericColumn',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : '';
      }
    },
    { 
      field: 'base_amount', 
      headerName: 'Base Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      type: 'numericColumn',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : '';
      }
    },
    { 
      field: 'document_date', 
      headerName: 'Document Date',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    },
    { 
      field: 'period', 
      headerName: 'Period',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'year', 
      headerName: 'Year',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center'
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={transactions}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default GLTransactionsTab;
