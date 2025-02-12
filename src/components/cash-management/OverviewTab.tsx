
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { supabase } from "@/integrations/supabase/client";
import type { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { gridStyles } from '../configuration/grid/styles/gridStyles';

interface BankAccount {
  entity_id: string;
  entity: string;
  account_type: string;
  currency_code: string;
  bank_name: string;
  account_number_bank: string;
  account_name_bank: string;
  active: boolean;
}

const OverviewTab = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

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
      enableRowGroup: true,
      flex: 1,
      minWidth: 150
    },
    {
      field: 'account_type',
      headerName: 'Account Type',
      enableRowGroup: true,
      flex: 1,
      minWidth: 150
    },
    {
      field: 'currency_code',
      headerName: 'Currency',
      enableRowGroup: true,
      width: 120
    },
    {
      field: 'bank_name',
      headerName: 'Bank',
      enableRowGroup: true,
      flex: 1,
      minWidth: 150
    },
    {
      field: 'account_number_bank',
      headerName: 'Account Number',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'account_name_bank',
      headerName: 'Account Name',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 100,
      cellRenderer: (params: any) => {
        const isActive = params.value;
        return (
          <div className={`flex items-center justify-center w-full h-full ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? '✓' : '✗'}
          </div>
        );
      }
    }
  ];

  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    menuTabs: ['filterMenuTab'], // Changed from suppressMenu
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  };

  const gridOptions: GridOptions = {
    suppressRowHoverHighlight: false,
    columnHoverHighlight: true,
    suppressCellClick: true, // Changed from suppressCellSelection
    rowHeight: 48,
    headerHeight: 48,
    rowClass: 'grid-row',
    groupDefaultExpanded: 1,
    animateRows: true
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
    <div 
      className="h-[calc(100vh-12rem)] w-full ag-theme-alpine"
      style={{ 
        '--ag-header-background-color': '#f8fafc',
        '--ag-header-foreground-color': '#1e293b',
        '--ag-header-cell-hover-background-color': '#f1f5f9',
        '--ag-row-hover-color': '#f8fafc',
        '--ag-selected-row-background-color': '#e2e8f0',
        '--ag-odd-row-background-color': '#ffffff',
        '--ag-row-border-color': '#e2e8f0',
        '--ag-cell-horizontal-padding': '1rem',
        '--ag-borders': 'none',
        '--ag-row-height': '48px',
        '--ag-header-height': '48px',
        '--ag-header-column-separator-display': 'block',
        '--ag-header-column-separator-height': '50%',
        '--ag-header-column-separator-width': '1px',
        '--ag-header-column-separator-color': '#e2e8f0'
      } as any}
    >
      <style>
        {gridStyles}
      </style>
      <AgGridReact
        rowData={bankAccounts}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
        groupDisplayType="groupRows"
        animateRows={true}
        rowGroupPanelShow="always"
        enableRangeSelection={true}
        suppressAggFuncInHeader={true}
        domLayout="normal"
      />
    </div>
  );
};

export default OverviewTab;
