
import { ColDef } from "ag-grid-enterprise";
import { TradeRequest } from "../../types/trade-request.types";
import { createBaseColumns } from "./columns/baseColumns";
import { createCurrencyColumns } from "./columns/currencyColumns";
import { createDateColumns } from "./columns/dateColumns";
import { createStatusColumns } from "./columns/statusColumns";
import { createActionColumn } from "./columns/actionColumn";

export const createColumnDefs = (
  onApprove: (request: TradeRequest) => Promise<void>,
  onReject: (request: TradeRequest) => Promise<void>,
  showApproveButton: boolean,
  showRejectButton: boolean
): ColDef[] => {
  return [
    ...createBaseColumns(),
    ...createCurrencyColumns(),
    ...createDateColumns(),
    ...createStatusColumns(),
    createActionColumn(onApprove, onReject, showApproveButton, showRejectButton)
  ];
};
