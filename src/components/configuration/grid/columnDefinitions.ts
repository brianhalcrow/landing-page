import { ColDef, ColGroupDef } from 'ag-grid-community';

const createHeaderGroup = (headerName: string, children: (ColDef | ColGroupDef)[]) => ({
  headerName,
  headerClass: 'text-center main-header wrap-header-text ag-header-group-text-center',
  children,
  suppressMovable: true, // Prevent group from being moved
  marryChildren: true // Keep children together
});

const createColumn = (field: string, headerName: string, width: number, cellClass: string = 'ag-checkbox-center') => ({
  field,
  headerName,
  width,
  headerClass: 'text-center wrap-header-text',
  cellClass,
  suppressMovable: true // Prevent individual columns from being moved
});

export const getColumnDefs = (): (ColDef | ColGroupDef)[] => [
  createHeaderGroup('Entity Information', [
    createColumn('entity_name', 'Entity Name', 250, 'text-left'),
    createColumn('entity_id', 'Entity ID', 110, 'text-center'),
    { ...createColumn('functional_currency', 'Functional Currency', 180, 'text-center'), cellClass: 'ag-checkbox-center right-border' },
  ]),
  createHeaderGroup('Monetary Exposure', [
    createHeaderGroup('Balance Sheet', [
      createColumn('monetary_assets', 'Monetary Assets', 130),
      createColumn('monetary_liabilities', 'Monetary Liabs', 130),
      { ...createColumn('net_monetary', 'Net Monetary', 120), cellClass: 'ag-checkbox-center right-border' },
    ]),
  ]),
  createHeaderGroup('Cashflow Exposure', [
    createHeaderGroup('Highly Probable Transactions', [
      createColumn('revenue', 'Revenue', 130),
      createColumn('costs', 'Costs', 100),
      { ...createColumn('net_income', 'Net Income', 110), cellClass: 'ag-checkbox-center right-border' },
    ]),
    createHeaderGroup('Firm Commitments', [
      createColumn('po', 'Purchase Orders', 130),
      createColumn('ap', 'Accounts Payable', 130),
      createColumn('ar', 'Accounts Receivable', 140),
      { ...createColumn('other', 'Other', 100), cellClass: 'ag-checkbox-center right-border' },
    ]),
  ]),
  createHeaderGroup('Settlement Exposure', [
    createHeaderGroup('Intramonth', [
      createColumn('ap_realized', 'Accounts Payable', 130),
      createColumn('ar_realized', 'Accounts Receivable', 140),
      { ...createColumn('fx_realized', 'FX Conversions', 130), cellClass: 'ag-checkbox-center right-border' },
    ]),
  ]),
];