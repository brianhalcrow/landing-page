import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { HedgeRequest } from "./types";

interface HedgeRequestsGridProps {
  hedgeRequests: HedgeRequest[];
}

const HedgeRequestsGrid = ({ hedgeRequests }: HedgeRequestsGridProps) => {
  const columns: GridColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 130 },
    { field: 'entity_name', headerName: 'Entity Name', width: 150 },
    { field: 'instrument', headerName: 'Instrument', width: 130 },
    { field: 'strategy', headerName: 'Strategy', width: 130 },
    { field: 'base_currency', headerName: 'Base Currency', width: 130 },
    { field: 'quote_currency', headerName: 'Quote Currency', width: 130 },
    { field: 'currency_pair', headerName: 'Currency Pair', width: 130 },
    { field: 'trade_date', headerName: 'Trade Date', width: 130 },
    { field: 'settlement_date', headerName: 'Settlement Date', width: 150 },
    { field: 'buy_sell', headerName: 'Buy/Sell', width: 100 },
    { field: 'buy_sell_currency_code', headerName: 'Buy/Sell Currency', width: 150 },
    { 
      field: 'buy_sell_amount', 
      headerName: 'Buy/Sell Amount', 
      width: 150,
      type: 'number',
    },
    { field: 'created_by', headerName: 'Created By', width: 150 },
    { field: 'trade_request_id', headerName: 'Trade Request ID', width: 150 },
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