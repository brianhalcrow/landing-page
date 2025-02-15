
import { toast } from "sonner";
import { parse, format } from "date-fns";

interface TradeRequestInput {
  entity_id: string;
  entity_name: string;
  strategy_name: string;  // Updated to use strategy_name consistently
  instrument: string;
  trade_date: string | null;
  settlement_date: string;
  buy_currency: string;
  sell_currency: string;
  buy_amount: number | string | null;
  sell_amount: number | string | null;
  cost_centre: string;
}

export const validateTradeRequest = (data: any): boolean => {
  console.log("Starting validation for trade request data:", data);
  
  if (!data.entity_id || !data.entity_name) {
    console.log("Validation failed: Missing entity information", { entity_id: data.entity_id, entity_name: data.entity_name });
    toast.error("Entity information is required");
    return false;
  }

  if (!data.strategy_name) {  // Updated to check strategy_name
    console.log("Validation failed: Missing strategy");
    toast.error("Strategy is required");
    return false;
  }

  if (!data.instrument) {
    console.log("Validation failed: Missing instrument");
    toast.error("Instrument is required");
    return false;
  }

  if (!data.cost_centre) {
    console.log("Validation failed: Missing cost centre");
    toast.error("Cost Centre is required");
    return false;
  }

  // Handle currency fields mapping
  const buyCurrency = data.buy_currency || data.ccy_1;
  const sellCurrency = data.sell_currency || data.ccy_2;
  const buyAmount = data.buy_amount || data.ccy_1_amount;
  const sellAmount = data.sell_amount || data.ccy_2_amount;

  console.log("Currency validation values:", {
    buyCurrency,
    sellCurrency,
    buyAmount,
    sellAmount
  });

  // Both currencies are required
  if (!buyCurrency || !sellCurrency) {
    console.log("Validation failed: Missing currencies", { buyCurrency, sellCurrency });
    toast.error("Both buy and sell currencies are required");
    return false;
  }

  // Either buy amount or sell amount must be present, but not both null
  const hasBuyAmount = buyAmount && buyAmount !== "0";
  const hasSellAmount = sellAmount && sellAmount !== "0";

  console.log("Amount validation:", {
    hasBuyAmount,
    hasSellAmount,
    buyAmount,
    sellAmount
  });

  if (!hasBuyAmount && !hasSellAmount) {
    console.log("Validation failed: No valid amount specified");
    toast.error("Either buy amount or sell amount must be specified");
    return false;
  }

  if (!data.settlement_date) {
    console.log("Validation failed: Missing settlement date");
    toast.error("Settlement date is required");
    return false;
  }

  console.log("Validation passed successfully");
  return true;
};

const parseDateToYYYYMMDD = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  try {
    // Parse the DD/MM/YYYY format to a Date object
    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    // Format to YYYY-MM-DD
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const transformTradeRequest = (data: any) => {
  return {
    entity_id: data.entity_id,
    entity_name: data.entity_name,
    strategy_name: data.strategy_name,  // Using strategy_name consistently
    instrument: data.instrument,
    trade_date: data.trade_date ? parseDateToYYYYMMDD(data.trade_date) : null,
    settlement_date: parseDateToYYYYMMDD(data.settlement_date),
    ccy_1: data.buy_currency,
    ccy_2: data.sell_currency,
    ccy_1_amount: data.buy_amount ? parseFloat(data.buy_amount) : null,
    ccy_2_amount: data.sell_amount ? parseFloat(data.sell_amount) : null,
    cost_centre: data.cost_centre,
    ccy_pair: `${data.buy_currency}${data.sell_currency}`,
    counterparty_name: data.counterparty_name
  };
};
