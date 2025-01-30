import { ColDef } from 'ag-grid-community';
import { entityColumns } from './columns/entityColumns';
import { instrumentColumns } from './columns/instrumentColumns';
import { currencyColumns } from './columns/currencyColumns';
import { dateColumns } from './columns/dateColumns';
import { tradeColumns } from './columns/tradeColumns';

export const getColumnDefs = (): ColDef[] => [
  ...entityColumns,
  ...instrumentColumns,
  ...currencyColumns,
  ...dateColumns,
  ...tradeColumns
];