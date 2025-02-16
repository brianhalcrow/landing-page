
export interface BankQuote {
  bankName: string;
  buySpot: number;
  buyPoints: number;
  buyContract: number;
  sellSpot: number;
  sellPoints: number;
  sellContract: number;
}

export interface TradingState {
  baseCurrency: string;
  termCurrency: string;
  amount: number;
  direction: 'BUY' | 'SELL';
  quotes: BankQuote[];
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface GridConfig {
  headerCells: {
    sell: CellPosition;
    buy: CellPosition;
    buyBase: CellPosition;
    sellTerm: CellPosition;
  };
  inputCells: {
    amount: CellPosition;
    currencies: {
      base: CellPosition;
      term: CellPosition;
    };
  };
  bankMatrix: {
    startRow: number;
    columns: Array<{
      field: string;
      col: number;
    }>;
  };
}
