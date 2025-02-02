import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgGridReact } from 'ag-grid-react';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import RealtimeSubscription from "./RealtimeSubscription";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface HedgeRequestOverview {
  id: number;
  entity_name: string;
  entity_id: string;
  functional_currency: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy_description: string;
  instrument: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const OverviewTab = () => {
  const [rowData, setRowData] = useState<HedgeRequestOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  const columnDefs = [
    { 
      field: 'entity_name', 
      headerName: 'Entity Name',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'functional_currency', 
      headerName: 'Currency',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l1', 
      headerName: 'Category L1',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l2', 
      headerName: 'Category L2',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'exposure_category_l3', 
      headerName: 'Category L3',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'strategy_description', 
      headerName: 'Strategy',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'instrument', 
      headerName: 'Instrument',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
    },
    { 
      field: 'created_at', 
      headerName: 'Created',
      flex: 1,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleString();
      }
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const fetchHedgeRequests = useCallback(async () => {
    try {
      console.log("🔄 Fetching hedge requests...");
      setIsLoading(true);

      const { data, error } = await supabase
        .from("hedge_request_draft")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error("❌ Error fetching data:", error);
        throw error;
      }

      console.log("✅ Fetched hedge requests:", data);
      setRowData(data || []);
    } catch (error) {
      console.error("❌ Error in fetchHedgeRequests:", error);
      if (isMounted) {
        toast.error("Failed to fetch hedge request data");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    console.log("🏁 OverviewTab mounted");
    fetchHedgeRequests();

    return () => {
      console.log("🔚 OverviewTab unmounted");
    };
  }, [fetchHedgeRequests]);

  return (
    <div className="space-y-4">
      <RealtimeSubscription onDataChange={fetchHedgeRequests} />
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <span>Loading hedge requests...</span>
        </div>
      ) : (
        <div className="ag-theme-alpine h-[600px] w-full">
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
            animateRows={true}
            suppressColumnVirtualisation={true}
            enableCellTextSelection={true}
          />
        </div>
      )}
    </div>
  );
};

export default OverviewTab;