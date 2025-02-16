
import { toast } from "sonner";
import { parse, format, isValid } from "date-fns";

interface TradeRequestInput {
  entity_id: string;
  entity_name: string;
  strategy_name: string;
  instrument: string;
  trade_date: string | Date | null;
  settlement_date: string | Date | null;
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
  settlement_date: string | null;
  ccy_1: string | null;
  ccy_2: string | null;
  ccy_1_amount: number | null;
  ccy_2_amount: number | null;
  cost_centre: string;
  ccy_pair: string | null;
  counterparty_name: string | null;
}

export const validateTradeRequest = (data: any): boolean => {
  console.log("Starting validation for trade request data:", data);
  
  // Basic required fields validation
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

  // Currency validation
  const buyCurrency = data.buy_currency || data.ccy_1;
  const sellCurrency = data.sell_currency || data.ccy_2;
  const buyAmount = data.buy_amount || data.ccy_1_amount;
  const sellAmount = data.sell_amount || data.ccy_2_amount;

  // Both currencies must be present
  if (!buyCurrency || !sellCurrency) {
    console.log("Validation failed: Missing currencies");
    toast.error("Both buy and sell currencies must be specified");
    return false;
  }

  // Currencies must be different
  if (buyCurrency === sellCurrency) {
    console.log("Validation failed: Same currency on both sides");
    toast.error("Buy and sell currencies must be different");
    return false;
  }

  // Amount validation - exactly one amount must be specified
  const hasBuyAmount = buyAmount && buyAmount !== "0" && Number(buyAmount) > 0;
  const hasSellAmount = sellAmount && sellAmount !== "0" && Number(sellAmount) > 0;

  if (hasBuyAmount && hasSellAmount) {
    console.log("Validation failed: Both amounts specified");
    toast.error("Please specify only one amount (either buy or sell)");
    return false;
  }

  if (!hasBuyAmount && !hasSellAmount) {
    console.log("Validation failed: No amount specified");
    toast.error("Please specify one amount (either buy or sell)");
    return false;
  }

  // Settlement date is required
  if (!data.settlement_date) {
    console.log("Validation failed: Missing settlement date");
    toast.error("Settlement date is required");
    return false;
  }

  // Note: trade_date is optional, so we don't validate it

  console.log("Validation passed successfully");
  return true;
};

const parseDateToYYYYMMDD = (dateInput: Date | string | null | undefined): string | null => {
  if (!dateInput) return null;

  try {
    // If it's already a Date object
    if (dateInput instanceof Date) {
      return format(dateInput, 'yyyy-MM-dd');
    }

    // If it's an object with a value property (from AG Grid's date picker)
    if (typeof dateInput === 'object' && dateInput !== null && 'value' in dateInput) {
      const dateValue = dateInput.value;
      if (dateValue && typeof dateValue === 'object' && 'iso' in dateValue) {
        return format(new Date(dateValue.iso), 'yyyy-MM-dd');
      }
      if (dateValue) {
        return format(new Date(dateValue), 'yyyy-MM-dd');
      }
    }

    // If it's a string
    if (typeof dateInput === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
      }
      
      const parsedDate = parse(dateInput, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd');
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export const transformTradeRequest = (data: any): TradeRequest => {
  // Handle both AG Grid date format and regular date strings
  const parsedTradeDate = parseDateToYYYYMMDD(data.trade_date);
  const parsedSettlementDate = parseDateToYYYYMMDD(data.settlement_date);
  
  console.log("Transforming dates:", {
    original: {
      tradeDate: data.trade_date,
      settlementDate: data.settlement_date
    },
    parsed: {
      tradeDate: parsedTradeDate,
      settlementDate: parsedSettlementDate
    }
  });

  // Transform a single row into the database format
  const transformed: TradeRequest = {
    entity_id: data.entity_id,
    entity_name: data.entity_name,
    strategy_name: data.strategy_name,
    instrument: data.instrument,
    trade_date: parsedTradeDate,
    settlement_date: parsedSettlementDate,
    ccy_1: data.buy_currency,
    ccy_2: data.sell_currency,
    ccy_1_amount: data.buy_amount ? parseFloat(data.buy_amount) : null,
    ccy_2_amount: data.sell_amount ? parseFloat(data.sell_amount) : null,
    cost_centre: data.cost_centre,
    ccy_pair: data.buy_currency && data.sell_currency ? `${data.buy_currency}${data.sell_currency}` : null,
    counterparty_name: data.counterparty_name
  };

  return transformed;
};
