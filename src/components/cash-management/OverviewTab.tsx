
import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";

interface BalanceData {
  account_id: string;
  account_name: string;
  currency: string;
  [key: string]: any; // For dynamic date columns
}

const OverviewTab = () => {
  const [rowData, setRowData] = useState<BalanceData[]>([]);
  
  // Generate date columns from 01/12/2024 to 31/12/2025
  const dateColumns = useMemo(() => {
    const columns: ColDef[] = [];
    const startDate = new Date(2024, 11, 1); // December is 11 (0-based)
    const endDate = new Date(2025, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const monthStr = format(d, 'MMMM yyyy');
      
      columns.push({
        field: dateStr,
        headerName: format(d, 'dd/MM/yyyy'),
        width: 120,
        type: 'numericColumn',
        valueFormatter: (params: ValueFormatterParams) => {
          if (params.value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(params.value);
          }
          return '';
        },
        headerClass: 'ag-header-left',
        cellClass: 'cell-left',
        // Group by month
        columnGroupShow: 'closed',
        children: undefined
      });
    }

    // Group columns by month
    const groupedColumns: { [key: string]: ColDef[] } = {};
    columns.forEach(col => {
      const date = new Date(col.field!);
      const monthKey = format(date, 'MMMM yyyy');
      if (!groupedColumns[monthKey]) {
        groupedColumns[monthKey] = [];
      }
      groupedColumns[monthKey].push(col);
    });

    // Create column groups
    const finalColumns: ColDef[] = [
      { 
        field: 'account_name',
        headerName: 'Account',
        pinned: 'left',
        width: 200,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      },
      { 
        field: 'currency',
        headerName: 'Currency',
        pinned: 'left',
        width: 100,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      }
    ];

    Object.entries(groupedColumns).forEach(([monthKey, cols]) => {
      finalColumns.push({
        headerName: monthKey,
        children: cols,
        marryChildren: true
      });
    });

    return finalColumns;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('cash_management')
        .select(`
          *,
          cash_management_balances (
            balance_date,
            balance
          )
        `);

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Transform the data for the grid
      const transformedData = data?.map(account => {
        const rowData: BalanceData = {
          account_id: account.account_id,
          account_name: account.account_name,
          currency: account.currency
        };

        // Add balance values to corresponding date columns
        account.cash_management_balances?.forEach((balance: any) => {
          rowData[balance.balance_date] = balance.balance;
        });

        return rowData;
      }) || [];

      setRowData(transformedData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={rowData}
        columnDefs={dateColumns}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        groupDisplayType="groupRows"
      />
    </div>
  );
};

export default OverviewTab;
