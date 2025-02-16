
import { GridConfig } from './types';

export const GRID_CONFIG: GridConfig = {
  headerCells: {
    sell: { row: 0, col: 2 },
    buy: { row: 0, col: 5 },
    buyBase: { row: 2, col: 2 },
    sellTerm: { row: 2, col: 4 }
  },
  inputCells: {
    amount: { row: 1, col: 3 },
    currencies: {
      base: { row: 1, col: 2 },
      term: { row: 1, col: 4 }
    }
  },
  bankMatrix: {
    startRow: 4,
    columns: [
      { field: 'bankName', col: 0 },
      { field: 'buySpot', col: 1 },
      { field: 'buyPoints', col: 2 },
      { field: 'buyContract', col: 3 },
      { field: 'sellSpot', col: 4 },
      { field: 'sellPoints', col: 5 }
    ]
  }
};

export const MOCK_BANK_DATA = [
  {
    bankName: "BANK A",
    buySpot: 1.0825,
    buyPoints: -0.0002,
    buyContract: 1.0823,
    sellSpot: 1.0827,
    sellPoints: -0.0002,
    sellContract: 1.0825
  },
  {
    bankName: "BANK B",
    buySpot: 1.0824,
    buyPoints: -0.0002,
    buyContract: 1.0822,
    sellSpot: 1.0828,
    sellPoints: -0.0002,
    sellContract: 1.0826
  },
  {
    bankName: "BANK C",
    buySpot: 1.0826,
    buyPoints: -0.0002,
    buyContract: 1.0824,
    sellSpot: 1.0829,
    sellPoints: -0.0002,
    sellContract: 1.0827
  },
  {
    bankName: "BANK D",
    buySpot: 1.0823,
    buyPoints: -0.0002,
    buyContract: 1.0821,
    sellSpot: 1.0826,
    sellPoints: -0.0002,
    sellContract: 1.0824
  }
];
