import { ColDef, ColGroupDef } from 'ag-grid-community';
import CheckboxCellRenderer from './CheckboxCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

export const createBaseColumnDefs = (): ColDef[] => [
  { 
    field: 'entity_id', 
    headerName: 'Entity ID', 
    width: 120,
    suppressSizeToFit: true,
    headerClass: 'ag-header-center custom-header',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    resizable: false
  },
  { 
    field: 'entity_name', 
    headerName: 'Entity Name', 
    width: 240,
    suppressSizeToFit: true,
    headerClass: 'ag-header-center custom-header',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'text-left pl-4',
    resizable: false
  },
  { 
    field: 'functional_currency', 
    headerName: 'Functional Currency', 
    width: 140,
    suppressSizeToFit: true,
    headerClass: 'ag-header-center custom-header',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    resizable: false
  },
  { 
    field: 'is_active', 
    headerName: 'Is Active', 
    width: 100,
    suppressSizeToFit: true,
    headerClass: 'ag-header-center custom-header',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellRenderer: CheckboxCellRenderer,
    cellRendererParams: {
      disabled: true
    },
    resizable: false
  }
];

export const createExposureColumns = (exposureTypes: any[]): ColGroupDef[] => {
  const groupedExposures = exposureTypes.reduce((acc: any, type) => {
    const l1 = type.exposure_category_l1;
    const l2 = type.exposure_category_l2;
    
    if (!acc[l1]) acc[l1] = {};
    if (!acc[l1][l2]) acc[l1][l2] = [];
    
    acc[l1][l2].push(type);
    return acc;
  }, {});

  return Object.entries(groupedExposures).map(([l1, l2Group]: [string, any]) => ({
    headerName: l1,
    groupId: l1,
    headerClass: 'ag-header-center custom-header',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    resizable: false,
    children: Object.entries(l2Group).map(([l2, types]: [string, any]) => ({
      headerName: l2,
      groupId: `${l1}-${l2}`,
      headerClass: 'ag-header-center custom-header',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      resizable: false,
      children: types.map((type: any) => ({
        headerName: type.exposure_category_l3,
        field: `exposure_${type.exposure_type_id}`,
        width: 120,
        suppressSizeToFit: true,
        headerClass: 'ag-header-center custom-header',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        resizable: false,
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: (params: any) => ({
          disabled: !params.data?.isEditing,
          onChange: (checked: boolean) => {
            if (params.node && params.api) {
              const newValue = checked;
              params.node.setDataValue(params.column.getColId(), newValue);
            }
          }
        })
      }))
    }))
  }));
};

export const createActionColumn = (): ColDef => ({
  headerName: 'Actions',
  width: 100,
  suppressSizeToFit: true,
  pinned: 'right',
  lockPinned: true,
  lockPosition: true,
  headerClass: 'ag-header-center custom-header',
  wrapHeaderText: true,
  autoHeaderHeight: true,
  resizable: false,
  cellRenderer: ActionsCellRenderer,
  cellRendererParams: (params: any) => ({
    isEditing: params.data?.isEditing,
    onEditClick: () => {
      if (params.node && params.api) {
        const updatedData = { ...params.data, isEditing: true };
        params.node.setData(updatedData);
        params.api.refreshCells({ rowNodes: [params.node] });
      }
    },
    onSaveClick: () => {
      if (params.node && params.api) {
        const updatedData = { ...params.data, isEditing: false };
        params.node.setData(updatedData);
        params.api.refreshCells({ rowNodes: [params.node] });
      }
    }
  })
});