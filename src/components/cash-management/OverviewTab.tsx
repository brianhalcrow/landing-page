
import { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider, createTheme } from '@mui/material';
import { BankAccountData } from './types';

const theme = createTheme();

interface GroupedBankAccount extends BankAccountData {
  id: string;
  isGroup?: boolean;
  childCount?: number;
  expanded?: boolean;
}

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<GroupedBankAccount[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (entityId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(entityId)) {
      newExpandedGroups.delete(entityId);
    } else {
      newExpandedGroups.add(entityId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const columns: GridColDef[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.isGroup) {
          return (
            <div style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => toggleGroup(params.row.entity_id)}>
              {expandedGroups.has(params.row.entity_id) ? '▼' : '▶'} {params.value} ({params.row.childCount})
            </div>
          );
        }
        return <div style={{ marginLeft: '20px' }}>{params.value}</div>;
      }
    },
    {
      field: 'entity',
      headerName: 'Entity',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.isGroup) {
          return <strong>{params.value}</strong>;
        }
        return params.value;
      }
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      width: 150,
      editable: true
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      width: 100
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
    const fetchBankAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from('client_bank_account')
          .select('*')
          .order('entity_id', { ascending: true });
        
        if (error) throw error;

        // Group the data by entity
        const groupedData = data.reduce((acc, account) => {
          if (!acc[account.entity_id]) {
            acc[account.entity_id] = {
              accounts: [],
              entity: account.entity,
              entity_id: account.entity_id
            };
          }
          acc[account.entity_id].accounts.push(account);
          return acc;
        }, {} as Record<string, { accounts: BankAccountData[], entity: string, entity_id: string }>);

        // Create rows with group headers and details
        const rows: GroupedBankAccount[] = [];
        Object.values(groupedData).forEach(group => {
          // Add group header
          rows.push({
            ...group.accounts[0],
            id: `group-${group.entity_id}`,
            isGroup: true,
            childCount: group.accounts.length,
          });

          // Add child rows if group is expanded
          if (expandedGroups.has(group.entity_id)) {
            group.accounts.forEach(account => {
              rows.push({
                ...account,
                id: account.account_number_bank
              });
            });
          }
        });

        setBankAccounts(rows);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [expandedGroups]);

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
          slots={{ toolbar: GridToolbar }}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick={false}
          getRowClassName={(params) => params.row.isGroup ? 'group-row' : ''}
          sx={{
            '& .group-row': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              fontWeight: 'bold',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default OverviewTab;
