import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { HedgeRequest } from "./types";

interface HedgeRequestsGridProps {
  hedgeRequests: HedgeRequest[];
}

const HedgeRequestsGrid = ({ hedgeRequests }: HedgeRequestsGridProps) => {
  const columns: GridColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 100 },
    { field: 'entity_name', headerName: 'Entity Name', width: 120 },
    { field: 'instrument', headerName: 'Instrument', width: 100 },
    { field: 'strategy', headerName: 'Strategy', width: 100 },
    { field: 'base_currency', headerName: 'Base', width: 70 },
    { field: 'quote_currency', headerName: 'Quote', width: 70 },
    { field: 'currency_pair', headerName: 'Pair', width: 80 },
    { field: 'trade_date', headerName: 'Trade Date', width: 100 },
    { field: 'settlement_date', headerName: 'Settlement', width: 100 },
    { field: 'buy_sell', headerName: 'B/S', width: 60 },
    { field: 'buy_sell_currency_code', headerName: 'B/S Curr', width: 80 },
    { 
      field: 'buy_sell_amount', 
      headerName: 'Amount', 
      width: 100,
      type: 'number',
    },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    { field: 'trade_request_id', headerName: 'Request ID', width: 120 },
  ];

  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={hedgeRequests}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default HedgeRequestsGrid;