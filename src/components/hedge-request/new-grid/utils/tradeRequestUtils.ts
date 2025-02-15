
import { toast } from "sonner";
import { parse, format } from "date-fns";

interface TradeRequestInput {
  entity_id: string;
  entity_name: string;
  strategy_name: string;
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
  
  // Basic required fields
  if (!data.entity_id || !data.entity_name) {
    console.log("Validation failed: Missing entity information", { entity_id: data.entity_id, entity_name: data.entity_name });
    toast.error("Entity information is required");
    return false;
  }

  if (!data.strategy_name) {
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

  // For swaps, validate that at least one side (buy or sell) is complete
  const hasBuySide = buyCurrency && buyAmount && buyAmount !== "0";
  const hasSellSide = sellCurrency && sellAmount && sellAmount !== "0";

  console.log("Side validation:", {
    hasBuySide,
    hasSellSide,
    instrument: data.instrument
  });

  if (!hasBuySide && !hasSellSide) {
    console.log("Validation failed: No complete side specified");
    toast.error("Please specify at least one complete side (currency and amount)");
    return false;
  }

  if (buyCurrency && sellCurrency && buyCurrency === sellCurrency) {
    console.log("Validation failed: Same currency on both sides");
    toast.error("Buy and sell currencies must be different");
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
    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const transformTradeRequest = (data: any) => {
  // If it's a swap, we need to create both legs
  if (data.instrument === 'Swap') {
    // Create an array to hold both legs
    const swapLegs = [
      // First leg (leg 1)
      {
        entity_id: data.entity_id,
        entity_name: data.entity_name,
        strategy_name: data.strategy_name,
        instrument: data.instrument,
        trade_date: data.trade_date ? parseDateToYYYYMMDD(data.trade_date) : null,
        settlement_date: parseDateToYYYYMMDD(data.settlement_date),
        ccy_1: data.buy_currency,
        ccy_2: data.sell_currency,
        ccy_1_amount: data.buy_amount ? parseFloat(data.buy_amount) : null,
        ccy_2_amount: data.sell_amount ? parseFloat(data.sell_amount) : null,
        cost_centre: data.cost_centre,
        ccy_pair: data.buy_currency && data.sell_currency ? `${data.buy_currency}${data.sell_currency}` : null,
        counterparty_name: data.counterparty_name,
        leg_number: 1
      },
      // Second leg (leg 2) - with reversed currencies and amounts
      {
        entity_id: data.entity_id,
        entity_name: data.entity_name,
        strategy_name: data.strategy_name,
        instrument: data.instrument,
        trade_date: data.trade_date ? parseDateToYYYYMMDD(data.trade_date) : null,
        settlement_date: parseDateToYYYYMMDD(data.settlement_date),
        ccy_1: data.sell_currency, // Reversed from leg 1
        ccy_2: data.buy_currency, // Reversed from leg 1
        ccy_1_amount: data.sell_amount ? parseFloat(data.sell_amount) : null, // Reversed from leg 1
        ccy_2_amount: data.buy_amount ? parseFloat(data.buy_amount) : null, // Reversed from leg 1
        cost_centre: data.cost_centre,
        ccy_pair: data.sell_currency && data.buy_currency ? `${data.sell_currency}${data.buy_currency}` : null,
        counterparty_name: data.counterparty_name,
        leg_number: 2
      }
    ];

    console.log("Transformed swap legs:", swapLegs);
    return swapLegs;
  }

  // For non-swap trades, return a single transformed trade
  const transformed = {
    entity_id: data.entity_id,
    entity_name: data.entity_name,
    strategy_name: data.strategy_name,
    instrument: data.instrument,
    trade_date: data.trade_date ? parseDateToYYYYMMDD(data.trade_date) : null,
    settlement_date: parseDateToYYYYMMDD(data.settlement_date),
    ccy_1: data.buy_currency,
    ccy_2: data.sell_currency,
    ccy_1_amount: data.buy_amount ? parseFloat(data.buy_amount) : null,
    ccy_2_amount: data.sell_amount ? parseFloat(data.sell_amount) : null,
    cost_centre: data.cost_centre,
    ccy_pair: data.buy_currency && data.sell_currency ? `${data.buy_currency}${data.sell_currency}` : null,
    counterparty_name: data.counterparty_name,
    leg_number: null
  };

  console.log("Transformed trade request:", transformed);
  return transformed;
};
