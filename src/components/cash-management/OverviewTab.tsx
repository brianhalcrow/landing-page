
import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";

interface BalanceData {
  entity_name: string;
  bank_name: string;
  account_number_bank: string;
  currency_code: string;
  [key: string]: any; // For dynamic date columns
}

const OverviewTab = () => {
  const [rowData, setRowData] = useState<BalanceData[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [gridReady, setGridReady] = useState(false);
  
  // Generate date columns from 01/12/2024 to 31/12/2025
  const columnDefs = useMemo(() => {
    const columns: ColDef[] = [];
    const startDate = new Date(2024, 11, 1); // December is 11 (0-based)
    const endDate = new Date(2025, 11, 31);
    
    // Fixed columns
    const fixedColumns: ColDef[] = [
      { 
        field: 'entity_name',
        headerName: 'Entity',
        pinned: 'left',
        width: 180,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      },
      { 
        field: 'bank_name',
        headerName: 'Bank',
        pinned: 'left',
        width: 150,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      },
      { 
        field: 'account_number_bank',
        headerName: 'Account',
        pinned: 'left',
        width: 150,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      },
      { 
        field: 'currency_code',
        headerName: 'Currency',
        pinned: 'left',
        width: 100,
        headerClass: 'ag-header-left',
        cellClass: 'cell-left'
      }
    ];

    // Create month groups
    const monthGroups: { [key: string]: ColDef[] } = {};
    
    // Generate date columns and organize them by month
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const monthKey = format(d, 'MMMM yyyy');
      
      const dateColumn: ColDef = {
        field: dateStr,
        headerName: format(d, 'dd/MM'),
        width: 100,
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
        headerClass: 'ag-header-center',
        cellClass: 'cell-right'
      };

      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(dateColumn);
    }

    // Convert month groups to column definitions
    const monthColumns = Object.entries(monthGroups).map(([monthKey, dateColumns]) => ({
      headerName: monthKey,
      children: dateColumns
    }));

    return [...fixedColumns, ...monthColumns];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('bank_account_balance')
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Transform the data for the grid
      const transformedData = data?.map(account => {
        const rowData: BalanceData = {
          entity_name: account.entity_name,
          bank_name: account.bank_name,
          account_number_bank: account.account_number_bank,
          currency_code: account.currency_code,
        };

        // Add current balance to the latest date
        if (account.current_balance) {
          const latestDate = account.latest_date;
          if (latestDate) {
            rowData[format(new Date(latestDate), 'yyyy-MM-dd')] = account.current_balance;
          }
        }

        return rowData;
      }) || [];

      setRowData(transformedData);
    };

    fetchData();
  }, []);

  // Handle grid ready event to properly size columns
  const onGridReady = (params: any) => {
    setGridApi(params.api);
    setGridReady(true);
    
    // Delay the initial column sizing to ensure container is stable
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 200);
  };

  // Handle window resize events with debouncing
  useEffect(() => {
    if (!gridApi || !gridReady) return;

    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [gridApi, gridReady]);

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
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false
          }}
          onGridReady={onGridReady}
          domLayout="normal"
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
