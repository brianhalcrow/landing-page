import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import HedgeRequestGrid from "./grid/HedgeRequestGrid";
import DraftDetailsGrid from "./grid/DraftDetailsGrid";
import { AgGridReact } from 'ag-grid-react';
import { draftDetailsColumnDefs } from "./grid/draftDetailsColumnDefs";

const AdHocTab = () => {
  const { data: hedgeRequests, isLoading } = useQuery({
    queryKey: ['hedge-request-drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select(`
          id,
          entity_id,
          entity_name,
          functional_currency,
          cost_centre,
          exposure_category_l1,
          exposure_category_l2,
          exposure_category_l3,
          strategy,
          instrument,
          status
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hedge request drafts:', error);
        throw error;
      }

      return data;
    }
  });

  const columnNamesData = [
    { field: 'id', headerName: 'ID' },
    { field: 'entity_id', headerName: 'Entity ID' },
    { field: 'entity_name', headerName: 'Entity Name' },
    { field: 'cost_centre', headerName: 'Cost Centre' },
    { field: 'functional_currency', headerName: 'Functional Currency' },
    { field: 'exposure_category_l1', headerName: 'Exposure Category L1' },
    { field: 'exposure_category_l2', headerName: 'Exposure Category L2' },
    { field: 'exposure_category_l3', headerName: 'Exposure Category L3' },
    { field: 'strategy', headerName: 'Strategy' },
    { field: 'instrument', headerName: 'Instrument' },
    { field: 'status', headerName: 'Status' },
    { field: 'created_by', headerName: 'Created By' },
    { field: 'created_at', headerName: 'Created At' },
    { field: 'updated_at', headerName: 'Updated At' }
  ];

  const columnNamesColumnDefs = [
    { 
      field: 'field',
      headerName: 'Database Column',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'headerName',
      headerName: 'Display Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Column Names</h2>
        <div className="w-full h-[300px] ag-theme-alpine">
          <style>
            {`
              .ag-header-center .ag-header-cell-label {
                justify-content: center;
              }
              .ag-cell {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
              }
            `}
          </style>
          <AgGridReact
            rowData={columnNamesData}
            columnDefs={columnNamesColumnDefs}
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
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Draft Details</h2>
        <DraftDetailsGrid hedgeRequests={hedgeRequests || []} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ad-Hoc Hedge Requests</h2>
        <HedgeRequestGrid hedgeRequests={hedgeRequests || []} />
      </div>
    </div>
  );
};

export default AdHocTab;