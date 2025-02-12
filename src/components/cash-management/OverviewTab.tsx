
import { useState, useEffect } from 'react';
import { 
  DataGridPro, 
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider, createTheme } from '@mui/material';
import { BankAccountData } from './types';

const theme = createTheme();

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);

  const columns: GridColDef[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      width: 120,
      groupable: true
    },
    {
      field: 'entity',
      headerName: 'Entity',
      width: 200,
      groupable: true
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      width: 150,
      editable: true,
      groupable: true
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      width: 100,
      groupable: true
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      width: 150,
      editable: true,
      groupable: true
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      width: 180,
      editable: true
    },
    {
      field: 'account_name_bank',
      headerName: 'Account Name',
      width: 200,
      editable: true
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 100,
      type: 'boolean',
      editable: true,
      renderCell: (params: GridRenderCellParams) => 
        params.value ? '✓' : '✗',
      valueGetter: (params: GridValueGetterParams) => {
        return params.value === true;
      }
    }
  ];

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('client_bank_account')
          .select('*')
          .order('entity_id', { ascending: true });
        
        if (error) throw error;
        
        const rowsWithId = data?.map(row => ({
          ...row,
          id: row.account_number_bank
        })) || [];
        
        setBankAccounts(rowsWithId);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 'calc(100vh - 12rem)', width: '100%' }}>
        <DataGridPro
          rows={bankAccounts}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
            sorting: {
              sortModel: [{ field: 'entity_id', sort: 'asc' }],
            },
            rowGrouping: {
              model: ['entity']
            }
          }}
          slots={{ toolbar: GridToolbar }}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick={false}
          groupingColDef={{
            headerName: 'Entity Groups'
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default OverviewTab;
