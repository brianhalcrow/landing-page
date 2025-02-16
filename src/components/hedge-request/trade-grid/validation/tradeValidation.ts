
import { HedgeRequestDraftTrade } from '../../grid/types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTrade = (trade: HedgeRequestDraftTrade): ValidationResult => {
  const errors: string[] = [];

  // Validate currencies
  if (!trade.buy_currency || !trade.sell_currency) {
    errors.push('Both buy and sell currencies are required');
    return { isValid: false, errors };
  }

  if (trade.buy_currency === trade.sell_currency) {
    errors.push('Buy and sell currencies must be different');
    return { isValid: false, errors };
  }

  // Validate amounts
  const hasBuyAmount = trade.buy_amount !== null && trade.buy_amount !== undefined;
  const hasSellAmount = trade.sell_amount !== null && trade.sell_amount !== undefined;

  if (!hasBuyAmount && !hasSellAmount) {
    errors.push('Either buy amount or sell amount must be specified');
    return { isValid: false, errors };
  }

  if (hasBuyAmount && hasSellAmount) {
    errors.push('Only one amount (buy or sell) can be specified, not both');
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [] };
};

export const validateSwapTrades = (trades: HedgeRequestDraftTrade[]): ValidationResult => {
  const errors: string[] = [];
  const swapTrades = trades.filter(trade => trade.instrument === 'Swap');

  if (swapTrades.length === 0) {
    return { isValid: true, errors: [] };
  }

  if (swapTrades.length % 2 !== 0) {
    errors.push('Swap trades must have exactly two legs');
    return { isValid: false, errors };
  }

  for (let i = 0; i < swapTrades.length; i += 2) {
    const leg1 = swapTrades[i];
    const leg2 = swapTrades[i + 1];
    const swapIndex = Math.floor(i / 2) + 1;

    // Validate individual legs first
    const leg1Validation = validateTrade(leg1);
    const leg2Validation = validateTrade(leg2);

    if (!leg1Validation.isValid) {
      errors.push(`Swap ${swapIndex} Leg 1: ${leg1Validation.errors.join(', ')}`);
    }

    if (!leg2Validation.isValid) {
      errors.push(`Swap ${swapIndex} Leg 2: ${leg2Validation.errors.join(', ')}`);
    }

    // Validate currency matching between legs
    if (leg1.buy_currency !== leg2.sell_currency || leg1.sell_currency !== leg2.buy_currency) {
      errors.push(`Swap ${swapIndex}: Currencies must match between legs (leg 1 buy/sell should match leg 2 sell/buy)`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

export const validateAllTrades = (trades: HedgeRequestDraftTrade[]): ValidationResult => {
  const errors: string[] = [];

  // Validate each individual trade
  trades.forEach((trade, index) => {
    const validation = validateTrade(trade);
    if (!validation.isValid) {
      errors.push(`Row ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });

  // Validate swaps if any exist
  const swapValidation = validateSwapTrades(trades);
  if (!swapValidation.isValid) {
    errors.push(...swapValidation.errors);
  }

  return { isValid: errors.length === 0, errors };
};
