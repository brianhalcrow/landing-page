
import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    enableRowGroup: true,
    rowGroup: true,
    hide: true
  },
  {
    field: 'entity',
    headerName: 'Entity',
    enableRowGroup: true,
    flex: 1,
    minWidth: 150
  },
  {
    field: 'account_type',
    headerName: 'Account Type',
    enableRowGroup: true,
    flex: 1,
    minWidth: 150
  },
  {
    field: 'currency_code',
    headerName: 'Currency',
    enableRowGroup: true,
    width: 120
  },
  {
    field: 'bank_name',
    headerName: 'Bank',
    enableRowGroup: true,
    flex: 1,
    minWidth: 150
  },
  {
    field: 'account_number_bank',
    headerName: 'Account Number',
    flex: 1,
    minWidth: 150
  },
  {
    field: 'account_name_bank',
    headerName: 'Account Name',
    flex: 1,
    minWidth: 200
  },
  {
    field: 'active',
    headerName: 'Active',
    width: 100,
    cellRenderer: (params: any) => {
      const isActive = params.value;
      return (
        <div className={`flex items-center justify-center w-full h-full ${isActive ? 'text-green-600' : 'text-red-600'}`}>
          {isActive ? '✓' : '✗'}
        </div>
      );
    }
  }
];

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  floatingFilter: true,
  menuTabs: ['filterMenuTab'],
  filterParams: {
    buttons: ['reset', 'apply'],
    closeOnApply: true
  }
};
