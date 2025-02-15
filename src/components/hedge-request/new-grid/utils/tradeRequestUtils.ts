
import { toast } from "sonner";
import { parse, format, isValid } from "date-fns";

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
  counterparty_name: string;
}

interface TradeRequest {
  entity_id: string;
  entity_name: string;
  strategy_name: string;
  instrument: string;
  trade_date: string | null;
  settlement_date: string;
  ccy_1: string | null;
  ccy_2: string | null;
  ccy_1_amount: number | null;
  ccy_2_amount: number | null;
  cost_centre: string;
  ccy_pair: string | null;
  counterparty_name: string | null;
  leg_number: number | null;
  swap_reference?: string | null;
}

export const validateTradeRequest = (data: any): boolean => {
  console.log("Starting validation for trade request data:", data);
  
  // Basic required fields
  if (!data.entity_id || !data.entity_name) {
    console.log("Validation failed: Missing entity information");
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

  // For all trades, validate that at least one side is complete
  const hasBuySide = buyCurrency && buyAmount && buyAmount !== "0";
  const hasSellSide = sellCurrency && sellAmount && sellAmount !== "0";

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
  if (!dateStr || dateStr.trim() === '') return null;
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isValid(date)) {
      return dateStr;
    }
  }
  
  try {
    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, 'yyyy-MM-dd');
    }
    return null;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const transformTradeRequest = (data: any): TradeRequest | TradeRequest[] => {
  // If it's a swap, we need to create both legs
  if (data.instrument === 'Swap') {
    const parsedTradeDate = parseDateToYYYYMMDD(data.trade_date);
    const parsedSettlementDate = parseDateToYYYYMMDD(data.settlement_date);
    
    const firstLegBuyAmount = data.buy_amount ? parseFloat(data.buy_amount) : null;
    const firstLegSellAmount = data.sell_amount ? parseFloat(data.sell_amount) : null;
    
    const swapLegs: TradeRequest[] = [
      {
        entity_id: data.entity_id,
        entity_name: data.entity_name,
        strategy_name: data.strategy_name,
        instrument: data.instrument,
        trade_date: parsedTradeDate,
        settlement_date: parsedSettlementDate!,
        ccy_1: data.buy_currency,
        ccy_2: data.sell_currency,
        ccy_1_amount: firstLegBuyAmount,
        ccy_2_amount: firstLegSellAmount,
        cost_centre: data.cost_centre,
        ccy_pair: data.buy_currency && data.sell_currency ? `${data.buy_currency}${data.sell_currency}` : null,
        counterparty_name: data.counterparty_name,
        leg_number: 1,
      },
      {
        entity_id: data.entity_id,
        entity_name: data.entity_name,
        strategy_name: data.strategy_name,
        instrument: data.instrument,
        trade_date: parsedTradeDate,
        settlement_date: parsedSettlementDate!,
        ccy_1: data.sell_currency,
        ccy_2: data.buy_currency,
        ccy_1_amount: firstLegSellAmount,
        ccy_2_amount: firstLegBuyAmount,
        cost_centre: data.cost_centre,
        ccy_pair: data.sell_currency && data.buy_currency ? `${data.sell_currency}${data.buy_currency}` : null,
        counterparty_name: data.counterparty_name,
        leg_number: 2,
      }
    ];

    console.log("Transformed swap legs:", swapLegs);
    return swapLegs;
  }

  // For non-swap trades, return a single transformed trade
  const parsedTradeDate = parseDateToYYYYMMDD(data.trade_date);
  const parsedSettlementDate = parseDateToYYYYMMDD(data.settlement_date);
  
  const transformed: TradeRequest = {
    entity_id: data.entity_id,
    entity_name: data.entity_name,
    strategy_name: data.strategy_name,
    instrument: data.instrument,
    trade_date: parsedTradeDate,
    settlement_date: parsedSettlementDate!,
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
