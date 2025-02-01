import { ColDef, ColGroupDef } from 'ag-grid-community';
import CheckboxCellRenderer from './CheckboxCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

export const createBaseColumnDefs = (): ColDef[] => [
  { 
    field: 'entity_id', 
    headerName: 'Entity ID', 
    minWidth: 120, 
    flex: 1,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true
  },
  { 
    field: 'entity_name', 
    headerName: 'Entity Name', 
    minWidth: 240, 
    flex: 2,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'text-left pl-4'
  },
  { 
    field: 'functional_currency', 
    headerName: 'Functional Currency', 
    minWidth: 140, 
    flex: 1,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true
  },
  { 
    field: 'is_active', 
    headerName: 'Is Active', 
    minWidth: 100, 
    flex: 1,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellRenderer: CheckboxCellRenderer,
    cellRendererParams: {
      disabled: true
    }
  }
];

const validateExposureData = (data: any) => {
  const newData = { ...data };
  
  // Monetary validation
  if (newData.exposure_monetary_assets && newData.exposure_monetary_liabilities) {
    newData.exposure_net_monetary = true;
    newData.exposure_monetary_assets = false;
    newData.exposure_monetary_liabilities = false;
  }
  if (newData.exposure_net_monetary) {
    newData.exposure_monetary_assets = false;
    newData.exposure_monetary_liabilities = false;
  }

  // Revenue/Expense/Net Income validation
  if (newData.exposure_revenue && newData.exposure_costs) {
    newData.exposure_net_income = true;
    newData.exposure_revenue = false;
    newData.exposure_costs = false;
  }
  if (newData.exposure_net_income) {
    newData.exposure_revenue = false;
    newData.exposure_costs = false;
  }

  return newData;
};

export const createExposureColumns = (exposureTypes: any[], onCellValueChanged: (params: any) => void): ColGroupDef[] => {
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
    children: Object.entries(l2Group).map(([l2, types]: [string, any]) => ({
      headerName: l2,
      groupId: `${l1}-${l2}`,
      headerClass: 'ag-header-center custom-header',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      children: types.map((type: any) => ({
        headerName: type.exposure_category_l3,
        field: `exposure_${type.exposure_type_id}`,
        minWidth: 120,
        flex: 1,
        headerClass: 'ag-header-center custom-header',
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: (params: any) => ({
          disabled: !params.data?.isEditing,
          onChange: (checked: boolean) => {
            if (params.node && params.api) {
              const newData = { ...params.data };
              newData[params.column.getColId()] = checked;
              
              // Apply validation rules
              const validatedData = validateExposureData(newData);
              
              // Update row with validated data
              params.node.setData(validatedData);
              
              // Notify parent of changes without updating database
              onCellValueChanged({ ...params, data: validatedData });
              
              // Refresh the row to show all changes
              params.api.refreshCells({
                rowNodes: [params.node],
                force: true
              });
            }
          }
        })
      }))
    }))
  }));
};

export const createActionColumn = (): ColDef => ({
  headerName: 'Actions',
  minWidth: 100,
  maxWidth: 100,
  suppressSizeToFit: true,
  headerClass: 'ag-header-center custom-header',
  wrapHeaderText: true,
  autoHeaderHeight: true,
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
    onSaveClick: async () => {
      if (params.node && params.api && params.context.updateConfig) {
        const data = params.data;
        const exposureUpdates = Object.entries(data)
          .filter(([key, value]) => key.startsWith('exposure_'))
          .map(([key, value]) => ({
            entityId: data.entity_id,
            exposureTypeId: parseInt(key.replace('exposure_', '')),
            isActive: value as boolean
          }));

        try {
          await params.context.updateConfig.mutateAsync(exposureUpdates);
          const updatedData = { ...data, isEditing: false };
          params.node.setData(updatedData);
          params.api.refreshCells({ rowNodes: [params.node] });
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      }
    }
  })
});