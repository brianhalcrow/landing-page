
import { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
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
      sortable: true
    },
    {
      field: 'entity',
      headerName: 'Entity',
      width: 200,
      sortable: true
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      width: 150,
      editable: true,
      sortable: true
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      width: 100,
      sortable: true
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      width: 150,
      editable: true,
      sortable: true
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
        params.value ? '✓' : '✗'
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
        <DataGrid
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
          }}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </ThemeProvider>
  );
};

export default OverviewTab;
