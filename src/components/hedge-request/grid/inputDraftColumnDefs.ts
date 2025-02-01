import { ColDef } from 'ag-grid-community';

export const inputDraftColumnDefs: ColDef[] = [
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    cellRenderer: 'agSelectCellEditor',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: (params: any) => ({
      values: params.context.validEntities?.map((entity: any) => entity.entity_name) || [],
    }),
    valueSetter: (params: any) => {
      const selectedEntity = params.context.validEntities?.find(
        (entity: any) => entity.entity_name === params.newValue
      );
      if (selectedEntity) {
        params.data.entity_id = selectedEntity.entity_id;
        params.data.functional_currency = selectedEntity.functional_currency;
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
    minWidth: 120,
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
    editable: true
  },
  {
    field: 'exposure_category_l1',
    headerName: 'Exposure Category L1',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'exposure_category_l2',
    headerName: 'Exposure Category L2',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'exposure_category_l3',
    headerName: 'Exposure Category L3',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  }
];