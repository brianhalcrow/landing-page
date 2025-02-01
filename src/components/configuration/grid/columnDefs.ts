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
  
  // Extract the actual exposure type from the field name
  const exposureType = fieldChanged.replace('exposure_', '');
  
  // Handle Monetary group validation
  if (exposureType.includes('monetary')) {
    if (exposureType === 'net_monetary') {
      if (newValue) {
        // If net_monetary is checked, uncheck assets and liabilities
        newData['exposure_monetary_assets'] = false;
        newData['exposure_monetary_liabilities'] = false;
      }
    } else {
      // If assets or liabilities are being modified
      if (newValue) {
        // If checking either assets or liabilities, uncheck net_monetary
        newData['exposure_net_monetary'] = false;
      } else {
        // If unchecking either assets or liabilities, check if the other is also unchecked
        const isAssetsField = exposureType === 'monetary_assets';
        const otherField = isAssetsField ? 'exposure_monetary_liabilities' : 'exposure_monetary_assets';
        
        // If the other field is checked, enable net_monetary and uncheck the other field
        if (newData[otherField]) {
          newData['exposure_net_monetary'] = true;
          newData[otherField] = false;
        }
      }
    }
  }

  // Handle Revenue/Costs/Net Income group validation
  if (exposureType.includes('revenue') || exposureType.includes('costs') || exposureType.includes('net_income')) {
    if (exposureType === 'net_income') {
      if (newValue) {
        // If net_income is checked, uncheck revenue and costs
        newData['exposure_revenue'] = false;
        newData['exposure_costs'] = false;
      }
    } else {
      // If revenue or costs are being modified
      if (newValue) {
        // If checking either revenue or costs, uncheck net_income
        newData['exposure_net_income'] = false;
      } else {
        // If unchecking either revenue or costs, check if the other is checked
        const isRevenueField = exposureType === 'revenue';
        const otherField = isRevenueField ? 'exposure_costs' : 'exposure_revenue';
        
        // If the other field is checked, enable net_income and uncheck the other field
        if (newData[otherField]) {
          newData['exposure_net_income'] = true;
          newData[otherField] = false;
        }
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
          value: params.data?.[`exposure_${type.exposure_type_id}`] || false,
          onChange: (checked: boolean) => {
            if (params.node && params.api) {
              const fieldName = params.column.getColId();
              
              // Create a copy of the current data
              const currentData = { ...params.data };
              
              // Apply validation before updating the data
              const validatedData = validateExposureData(currentData, fieldName, checked);
              
              // Update the field that was actually clicked
              validatedData[fieldName] = checked;
              
              // Update row with validated data
              params.node.setData(validatedData);
              
              // Notify parent of changes
              onCellValueChanged({ 
                ...params, 
                data: validatedData,
                oldValue: currentData[fieldName],
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
