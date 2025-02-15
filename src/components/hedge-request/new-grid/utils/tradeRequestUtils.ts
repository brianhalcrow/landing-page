
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
  buy_amount: number | string | null;
  sell_amount: number | string | null;
  cost_centre: string;
}

export const validateTradeRequest = (data: any): boolean => {
  console.log("Validating trade request data:", data);

  // Handle strategy field mapping
  const strategy = data.strategy_description || data.strategy;
  if (!data.entity_id || !data.entity_name) {
    toast.error("Entity information is required");
    return false;
  }

  if (!strategy) {
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

  // Handle currency fields mapping
  const buyCurrency = data.buy_currency || data.ccy_1;
  const sellCurrency = data.sell_currency || data.ccy_2;
  const buyAmount = data.buy_amount || data.ccy_1_amount;
  const sellAmount = data.sell_amount || data.ccy_2_amount;

  if (!buyCurrency || !sellCurrency) {
    toast.error("Both currencies are required");
    return false;
  }

  if (!buyAmount || buyAmount === "0") {
    toast.error("Buy amount is required and must be greater than 0");
    return false;
  }

  if (!sellAmount || sellAmount === "0") {
    toast.error("Sell amount is required and must be greater than 0");
    return false;
  }

  if (!data.trade_date) {
    toast.error("Trade date is required");
    return false;
  }

  if (!data.settlement_date) {
    toast.error("Settlement date is required");
    return false;
  }

  return true;
};

export const transformTradeRequest = (data: any) => {
  // Handle strategy field mapping
  const strategy = data.strategy_description || data.strategy;
  // Handle currency fields mapping
  const buyCurrency = data.buy_currency || data.ccy_1;
  const sellCurrency = data.sell_currency || data.ccy_2;
  const buyAmount = parseFloat(data.buy_amount || data.ccy_1_amount);
  const sellAmount = parseFloat(data.sell_amount || data.ccy_2_amount);

  return {
    entity_id: data.entity_id,
    entity_name: data.entity_name,
    strategy,
    instrument: data.instrument,
    trade_date: data.trade_date,
    settlement_date: data.settlement_date,
    ccy_1: buyCurrency,
    ccy_2: sellCurrency,
    ccy_1_amount: buyAmount,
    ccy_2_amount: sellAmount,
    cost_centre: data.cost_centre,
    ccy_pair: `${buyCurrency}${sellCurrency}`,
    counterparty: data.counterparty,
    counterparty_name: data.counterparty_name,
    strategy_name: data.strategy_name
  };
};
