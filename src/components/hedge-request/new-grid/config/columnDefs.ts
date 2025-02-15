
import { GridApi } from "ag-grid-community";
import { EntitySelector } from "../selectors/EntitySelector";
import { StrategySelector } from "../selectors/StrategySelector";
import { CounterpartySelector } from "../selectors/CounterpartySelector";
import { CostCentreSelector } from "../selectors/CostCentreSelector";
import { CurrencySelector } from "../selectors/CurrencySelector";
import { HedgeRequestRow, ValidHedgeConfig } from "../types/hedgeRequest.types";

interface Context {
  validConfigs?: ValidHedgeConfig[];
  updateRowData?: (rowIndex: number, updates: any) => void;
}

export const createColumnDefs = (gridApi: GridApi | null, context: Context) => [
  {
    headerName: "Entity Name",
    field: "entity_name",
    cellRenderer: EntitySelector,
    cellRendererParams: {
      context
    },
    minWidth: 200
  },
  {
    headerName: "Entity ID",
    field: "entity_id",
    cellRenderer: EntitySelector,
    cellRendererParams: {
      context
    },
    minWidth: 150
  },
  {
    headerName: "Cost Centre",
    field: "cost_centre",
    cellRenderer: CostCentreSelector,
    cellRendererParams: {
      context
    },
    minWidth: 150
  },
  {
    headerName: "Strategy",
    field: "strategy_name",
    cellRenderer: StrategySelector,
    cellRendererParams: {
      context
    },
    minWidth: 200
  },
  {
    headerName: "Instrument",
    field: "instrument",
    minWidth: 150
  },
  {
    headerName: "Counterparty",
    field: "counterparty_name",
    cellRenderer: CounterpartySelector,
    cellRendererParams: {
      context
    },
    minWidth: 200
  },
  {
    headerName: "Buy Currency",
    field: "buy_currency",
    cellRenderer: CurrencySelector,
    cellRendererParams: {
      context
    },
    minWidth: 150
  },
  {
    headerName: "Buy Amount",
    field: "buy_amount",
    editable: true,
    minWidth: 150
  },
  {
    headerName: "Sell Currency",
    field: "sell_currency",
    cellRenderer: CurrencySelector,
    cellRendererParams: {
      context
    },
    minWidth: 150
  },
  {
    headerName: "Sell Amount",
    field: "sell_amount",
    editable: true,
    minWidth: 150
  },
  {
    headerName: "Trade Date",
    field: "trade_date",
    editable: true,
    minWidth: 150
  },
  {
    headerName: "Settlement Date",
    field: "settlement_date",
    editable: true,
    minWidth: 150
  }
];
