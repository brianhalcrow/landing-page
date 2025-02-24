
import { TradeRequest } from "../../types/trade-request.types";

export const useTradeRows = () => {
  const getRowId = (params: { data: TradeRequest }) => 
    params.data.request_no.toString();

  const isRowSelectable = (params: { data: TradeRequest }) => {
    if (params.data.instrument?.toLowerCase() === 'swap') {
      return params.data.swap_leg === 1;
    }
    return true;
  };

  return {
    getRowId,
    isRowSelectable
  };
};
