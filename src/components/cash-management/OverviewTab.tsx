import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, GridEventListener } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

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
      groupable: true,
      editable: true // Makes this cell editable
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
      editable: true
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
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('client_bank_account')
        .select('*')
        .order('entity_id', { ascending: true });
      if (error) throw error;
      // MUI DataGrid requires a unique id field
      const rowsWithId = data?.map(row => ({
        ...row,
        id: row.account_number_bank // or whatever unique identifier you have
      })) || [];
      setBankAccounts(rowsWithId);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCellEdit: GridEventListener<'cellEditStop'> = async (params, event) => {
    try {
      const { id, field, value } = params;
      
      // Update the database
      const { error } = await supabase
        .from('client_bank_account')
        .update({ [field]: value })
        .eq('account_number_bank', id); // assuming account_number_bank is your unique identifier

      if (error) throw error;

      // Update local state
      setBankAccounts(prev => 
        prev.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        )
      );
    } catch (error) {
      console.error('Error updating record:', error);
      // You might want to add error handling UI here
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 12rem)', width: '100%' }}>
      <DataGrid
        rows={bankAccounts}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
          grouping: {
            groupedColumns: ['entity_id'] // Initial grouping
          }
        }}
        onCellEditStop={handleCellEdit}
        groupingColDef={{
          headerName: 'Bank Accounts By Entity'
        }}
        pageSizeOptions={[25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        experimentalFeatures={{ groupingDisplayMode: 'tree' }}
      />
    </div>
  );
};

export default OverviewTab;
