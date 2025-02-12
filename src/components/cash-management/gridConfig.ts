import { ColDef } from 'ag-grid-community';

export const createColumnDefs = (): ColDef[] => {
  return [
    { 
      field: 'entity_id',
      headerName: 'Entity ID',
      rowGroup: true,
      hide: false, // Changed to false temporarily for debugging
      sort: 'asc',
      // Add these to force grouping
      enableRowGroup: true,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      field: 'entity',
      headerName: 'Entity Name',
      hide: false,
    },
    // ... rest of your columns
  ];
};

export const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  suppressSizeToFit: false,
  floatingFilter: true,
  // Add these properties
  enableRowGroup: false,
  enablePivot: false,
  enableValue: false,
};

export const autoGroupColumnDef = {
  headerName: 'Bank Accounts By Entity',
  minWidth: 300,
  flex: 1,
  sortable: true,
  // Modified cell renderer params
  cellRenderer: 'agGroupCellRenderer',
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      if (!params.value) return '';
      if (params.node.group) {
        return `${params.node.key} - ${params.node.allLeafChildren?.[0]?.data?.entity || ''}`;
      }
      return params.value;
    }
  }
};
