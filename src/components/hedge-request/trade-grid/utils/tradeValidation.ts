import { HedgeRequestDraftTrade } from '../../grid/types';
import { toast } from 'sonner';

export const validateDate = (dateStr: string): boolean => {
  // Check if date is in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return false;
  }
  
  // Check if it's a valid date
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateTrade = (trade: HedgeRequestDraftTrade): boolean => {
  if (!trade.trade_date || !trade.settlement_date) {
    toast.error('Trade and settlement dates are required');
    return false;
  }

  if (!validateDate(trade.trade_date) || !validateDate(trade.settlement_date)) {
    toast.error('Dates must be in YYYY-MM-DD format');
    return false;
  }

  if (!trade.buy_currency || !trade.sell_currency) {
    toast.error('Buy and sell currencies are required');
    return false;
  }

  if (!trade.buy_amount && !trade.sell_amount) {
    toast.error('Either buy or sell amount is required');
    return false;
  }

  return true;
};