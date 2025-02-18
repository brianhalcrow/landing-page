
import { ColDef } from "ag-grid-enterprise";
import { TradeRequest } from "../../../types/trade-request.types";
import { ActionButtons } from "../../ActionButtons";

export const createActionColumn = (
  onApprove: (request: TradeRequest) => Promise<void>,
  onReject: (request: TradeRequest) => Promise<void>,
  showApproveButton: boolean,
  showRejectButton: boolean
): ColDef => ({
  headerName: "Actions",
  field: "actions",
  sortable: false,
  filter: false,
  cellRenderer: ActionButtons,
  cellRendererParams: (params: any) => ({
    request: params.data,
    onApprove,
    onReject,
    showApprove: showApproveButton,
    showReject: showRejectButton
  }),
  minWidth: 200
});
