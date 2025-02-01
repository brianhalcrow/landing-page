import { ColDef } from 'ag-grid-community';

export const draftDetailsColumnDefs: ColDef[] = [
  { 
    field: 'entity_name', 
    headerName: 'Entity Name', 
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    cellEditor: 'agSelectCellEditor',
    editable: (params) => !params.data?.id, // Only editable for new rows
    cellEditorParams: (params) => ({
      values: params.context.validEntities?.map((e: any) => e.entity_name) || []
    }),
    valueSetter: (params) => {
      const entity = params.context.validEntities?.find((e: any) => e.entity_name === params.newValue);
      if (entity) {
        params.data.entity_id = entity.entity_id;
        params.data.entity_name = entity.entity_name;
        params.data.functional_currency = entity.functional_currency;
        return true;
      }
      return false;
    }
  },
  { 
    field: 'entity_id', 
    headerName: 'Entity ID', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  { 
    field: 'functional_currency', 
    headerName: 'Functional Currency', 
    minWidth: 150,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  { 
    field: 'cost_centre', 
    headerName: 'Cost Centre', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: (params) => !params.data?.id
  },
  { 
    field: 'exposure_category_l1', 
    headerName: 'Exposure L1', 
    minWidth: 130,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: (params) => !params.data?.id
  },
  { 
    field: 'exposure_category_l2', 
    headerName: 'Exposure L2', 
    minWidth: 130,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: (params) => !params.data?.id
  },
  { 
    field: 'exposure_category_l3', 
    headerName: 'Exposure L3', 
    minWidth: 130,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: (params) => !params.data?.id
  },
  { 
    field: 'strategy', 
    headerName: 'Strategy', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: (params) => !params.data?.id
  },
  { 
    field: 'instrument', 
    headerName: 'Instrument', 
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: (params) => !params.data?.id
  }
];