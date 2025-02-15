
import { toast } from "sonner";

interface TradeRequestInput {
  entity_id: string;
  entity_name: string;
  strategy_description: string;
  instrument: string;
  trade_date: Date | null;
  settlement_date: Date | null;
  buy_currency: string;
  sell_currency: string;
  buy_amount: number | null;
  sell_amount: number | null;
  cost_centre: string;
}

export const validateTradeRequest = (data: TradeRequestInput): boolean => {
  if (!data.entity_id || !data.entity_name) {
    toast.error("Entity information is required");
    return false;
  }

  if (!data.strategy_description) {
    toast.error("Strategy is required");
    return false;
  }

  if (!data.instrument) {
    toast.error("Instrument is required");
    return false;
  }

  if (!data.cost_centre) {
    toast.error("Cost Centre is required");
    return false;
  }

  if (!data.buy_currency || !data.sell_currency) {
    toast.error("Both currencies are required");
    return false;
  }

  if (!data.buy_amount || !data.sell_amount) {
    toast.error("Currency amounts are required");
    return false;
  }

  if (!data.trade_date || !data.settlement_date) {
    toast.error("Trade and settlement dates are required");
    return false;
  }

  return true;
};

export const transformTradeRequest = (data: TradeRequestInput) => {
  return {
    entity_id: data.entity_id,
    entity_name: data.entity_name,
    strategy: data.strategy_description,
    instrument: data.instrument,
    trade_date: data.trade_date,
    settlement_date: data.settlement_date,
    ccy_1: data.buy_currency,
    ccy_2: data.sell_currency,
    ccy_1_amount: data.buy_amount,
    ccy_2_amount: data.sell_amount,
    cost_centre: data.cost_centre,
    ccy_pair: `${data.buy_currency}${data.sell_currency}`,
  };
};
