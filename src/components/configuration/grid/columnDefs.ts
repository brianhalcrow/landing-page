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

const validateExposureData = (data: any, fieldChanged: string, newValue: boolean) => {
  const newData = { ...data };
  const typeId = fieldChanged.replace('exposure_', '');

  // Get exposure type details from data attributes
  const exposureType = data[`type_${typeId}`];
  if (!exposureType) return newData;

  const category = exposureType.exposure_category_l2?.toLowerCase() || '';
  
  // Handle Monetary group validation
  if (category === 'monetary') {
    if (data[`type_${typeId}`]?.exposure_category_l3?.toLowerCase() === 'net monetary') {
      if (newValue) {
        // If net_monetary is checked, uncheck assets and liabilities
        Object.keys(data).forEach(key => {
          if (key.startsWith('exposure_') && key !== fieldChanged) {
            const otherTypeId = key.replace('exposure_', '');
            const otherType = data[`type_${otherTypeId}`];
            if (otherType?.exposure_category_l2?.toLowerCase() === 'monetary') {
              newData[key] = false;
            }
          }
        });
      }
    } else {
      // If assets or liabilities are being modified
      if (newValue) {
        // If checking either assets or liabilities, uncheck net_monetary
        Object.keys(data).forEach(key => {
          if (key.startsWith('exposure_')) {
            const otherTypeId = key.replace('exposure_', '');
            const otherType = data[`type_${otherTypeId}`];
            if (otherType?.exposure_category_l3?.toLowerCase() === 'net monetary') {
              newData[key] = false;
            }
          }
        });
      }
    }
  }

  // Handle Revenue/Costs/Net Income group validation
  if (category === 'income') {
    if (data[`type_${typeId}`]?.exposure_category_l3?.toLowerCase() === 'net income') {
      if (newValue) {
        // If net_income is checked, uncheck revenue and costs
        Object.keys(data).forEach(key => {
          if (key.startsWith('exposure_') && key !== fieldChanged) {
            const otherTypeId = key.replace('exposure_', '');
            const otherType = data[`type_${otherTypeId}`];
            if (otherType?.exposure_category_l2?.toLowerCase() === 'income') {
              newData[key] = false;
            }
          }
        });
      }
    } else {
      // If revenue or costs are being modified
      if (newValue) {
        // If checking either revenue or costs, uncheck net_income
        Object.keys(data).forEach(key => {
          if (key.startsWith('exposure_')) {
            const otherTypeId = key.replace('exposure_', '');
            const otherType = data[`type_${otherTypeId}`];
            if (otherType?.exposure_category_l3?.toLowerCase() === 'net income') {
              newData[key] = false;
            }
          }
        });
      }
    }
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
          value: params.value,
          onChange: (checked: boolean) => {
            if (params.node && params.api) {
              const fieldName = params.column.getColId();
              
              // Add type information to the data for validation
              const currentData = { 
                ...params.data,
                [`type_${type.exposure_type_id}`]: type
              };
              
              // Apply validation before updating the data
              const validatedData = validateExposureData(currentData, fieldName, checked);
              
              // Update the field that was actually clicked
              validatedData[fieldName] = checked;
              
              // Remove temporary type information
              Object.keys(validatedData).forEach(key => {
                if (key.startsWith('type_')) {
                  delete validatedData[key];
                }
              });
              
              // Update row with validated data
              params.node.setData(validatedData);
              
              // Notify parent of changes
              onCellValueChanged({ 
                ...params, 
                data: validatedData,
                oldValue: params.value,
                newValue: checked 
              });
              
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
