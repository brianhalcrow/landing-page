import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColDef } from "ag-grid-enterprise";
import { useRef, useState } from "react";
import { useGridPreferences } from "../cash-management/hooks/useGridPreferences";
import { format } from "date-fns";

interface TradeRequest {
  request_no: number;
  entity_id: string;
  entity_name: string;
  strategy_id: string;
  strategy_name: string;
  ccy_pair: string;
  ccy_1: string;
  ccy_2: string;
  ccy_1_amount: number;
  ccy_2_amount: number;
  trade_date: string;
  settlement_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const TradeRequestsGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [api, setApi] = useState<any>(null);
  const { saveColumnState, loadColumnState } = useGridPreferences(
    gridRef,
    "trade-requests-grid"
  );

  const { data: tradeRequests, isLoading } = useQuery({
    queryKey: ["trade-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trade_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match TradeRequest type
      return (data as any[]).map((request) => ({
        ...request,
        strategy_id: request.strategy_id || "",
        strategy_name: request.strategy_name || "",
      })) as TradeRequest[];
    },
  });

  const formatAmount = (params: any) => {
    if (params.value === null || params.value === undefined) return "";
    const value = params.value;
    const formattedValue = Math.abs(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return value < 0 ? `-${formattedValue}` : formattedValue;
  };

  const amountCellStyle = (params: any) => {
    if (params.value < 0) {
      return { color: "red" };
    }
    return null;
  };

  const columnDefs: ColDef[] = [
    {
      field: "request_no",
      headerName: "Request No",
      filter: true,
      width: 120,
      suppressSizeToFit: true,
    },
    {
      field: "trade_date",
      headerName: "Trade Date",
      filter: true,
      width: 130,
      suppressSizeToFit: true,
      valueFormatter: (params: any) =>
        params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
    {
      field: "settlement_date",
      headerName: "Settlement Date",
      filter: true,
      width: 130,
      suppressSizeToFit: true,
      valueFormatter: (params: any) =>
        params.value ? format(new Date(params.value), "dd/MM/yyyy") : "",
    },
    {
      field: "ccy_1_amount",
      headerName: "Base Amount",
      filter: true,
      width: 140,
      suppressSizeToFit: true,
      valueFormatter: formatAmount,
      cellStyle: amountCellStyle,
    },
    {
      field: "ccy_2_amount",
      headerName: "Quote Amount",
      filter: true,
      width: 140,
      suppressSizeToFit: true,
      valueFormatter: formatAmount,
      cellStyle: amountCellStyle,
    },
    {
      field: "ccy_1",
      headerName: "Base CCY",
      filter: true,
      width: 100,
      suppressSizeToFit: true,
    },
    {
      field: "ccy_pair",
      headerName: "Currency Pair",
      filter: true,
      width: 120,
      suppressSizeToFit: true,
    },
    {
      field: "ccy_2",
      headerName: "Quote CCY",
      filter: true,
      width: 100,
      suppressSizeToFit: true,
    },
    {
      field: "created_by",
      headerName: "Created By",
      filter: true,
      width: 130,
      suppressSizeToFit: true,
    },
    {
      field: "entity_id",
      headerName: "Entity ID",
      filter: true,
      width: 120,
      suppressSizeToFit: true,
    },
    {
      field: "entity_name",
      headerName: "Entity",
      filter: true,
      width: 200,
      suppressSizeToFit: true,
    },
    {
      field: "strategy_id",
      headerName: "Strategy ID",
      filter: true,
      width: 130,
      suppressSizeToFit: true,
    },
    {
      field: "strategy_name",
      headerName: "Strategy",
      filter: true,
      width: 130,
      suppressSizeToFit: true,
    },
  ];

  const onGridReady = async (params: any) => {
    setApi(params.api);
    await loadColumnState();
  };

  const onColumnMoved = () => {
    if (api) {
      saveColumnState();
    }
  };

  const onColumnResized = () => {
    if (api) {
      saveColumnState();
    }
  };

  if (isLoading) {
    return <div>Loading trade requests...</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
        rowData={tradeRequests}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          floatingFilter: true,
        }}
        pagination={true}
        paginationPageSize={100}
        onGridReady={onGridReady}
        onColumnMoved={onColumnMoved}
        onColumnResized={onColumnResized}
      />
    </div>
  );
};

export default TradeRequestsGrid;
