import { ColDef, ColGroupDef } from 'ag-grid-community';
import CheckboxCellRenderer from './CheckboxCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

// Type definitions
interface ExposureData {
  entity_id: string;
  isEditing: boolean;
  [key: string]: any;
}

interface ExposureType {
  exposure_type_id: number;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
}

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

const validateExposureData = (data: ExposureData, fieldChanged: string, newValue: boolean) => {
  console.log('=== Starting Validation ===');
  console.log('Field changed:', fieldChanged);
  console.log('New value:', newValue);
  console.log('Data before validation:', data);
  
  const newData = { ...data };
  const typeId = fieldChanged.replace('exposure_', '');
  const exposureType = data[`type_${typeId}`];

  if (!exposureType) {
    console.log('WARNING: No exposure type found for:', typeId);
    return newData;
  }

  const category = exposureType.exposure_category_l2?.toLowerCase();
  const subcategory = exposureType.exposure_category_l3?.toLowerCase();

  console.log('Processing category:', category);
  console.log('Processing subcategory:', subcategory);

  // Monetary Validation
  if (category === 'monetary') {
    const isNetMonetary = subcategory === 'net monetary';
    console.log('Monetary validation:', { isNetMonetary, newValue });

    if (isNetMonetary && newValue) {
      // If checking Net Monetary, uncheck other monetary types
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('exposure_') && key !== fieldChanged) {
          const otherTypeId = key.replace('exposure_', '');
          const otherType = data[`type_${otherTypeId}`];
          if (otherType?.exposure_category_l2?.toLowerCase() === 'monetary') {
            newData[key] = false;
            console.log('Unchecking monetary field:', key);
          }
        }
      });
    } else if (!isNetMonetary && newValue) {
      // If checking Monetary Assets or Liabilities, uncheck Net Monetary
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('exposure_')) {
          const otherTypeId = key.replace('exposure_', '');
          const otherType = data[`type_${otherTypeId}`];
          if (otherType?.exposure_category_l3?.toLowerCase() === 'net monetary') {
            newData[key] = false;
            console.log('Unchecking net monetary field:', key);
          }
        }
      });
    }
  }

  // Highly Probable Transactions Validation
  if (category === 'highly probable transactions') {
    const isNetIncome = subcategory === 'net income';
    console.log('Income validation:', { isNetIncome, newValue });

    if (isNetIncome && newValue) {
      // If checking Net Income, uncheck Revenue and Expense
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('exposure_') && key !== fieldChanged) {
          const otherTypeId = key.replace('exposure_', '');
          const otherType = data[`type_${otherTypeId}`];
          if (otherType?.exposure_category_l2?.toLowerCase() === 'highly probable transactions' &&
              ['revenue', 'expense'].includes(otherType?.exposure_category_l3?.toLowerCase())) {
            newData[key] = false;
            console.log('Unchecking revenue/expense field:', key);
          }
        }
      });
    } else if (['revenue', 'expense'].includes(subcategory) && newValue) {
      // If checking Revenue or Expense, uncheck Net Income
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith('exposure_')) {
          const otherTypeId = key.replace('exposure_', '');
          const otherType = data[`type_${otherTypeId}`];
          if (otherType?.exposure_category_l3?.toLowerCase() === 'net income') {
            newData[key] = false;
            console.log('Unchecking net income field:', key);
          }
        }
      });
    }
  }

  console.log('=== Validation Complete ===');
  console.log('Original data:', data);
  console.log('Modified data:', newData);
  
  return newData;
};

export const createExposureColumns = (exposureTypes: any[], onCellValueChanged: (params: any) => void): ColGroupDef[] => {
  // Create a map of exposure types by ID for quick lookup
  const exposureTypeMap = exposureTypes.reduce((map: {[key: string]: any}, type) => {
    map[type.exposure_type_id] = type;
    return map;
  }, {});

  console.log('Exposure Type Map:', exposureTypeMap);

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
              console.log('1. Checkbox onChange triggered:', { fieldName, checked });
              
              // Add ALL exposure types to the data for validation
              const currentData = { 
                ...params.data,
                ...Object.keys(exposureTypeMap).reduce((acc: {[key: string]: any}, typeId) => {
                  acc[`type_${typeId}`] = exposureTypeMap[typeId];
                  return acc;
                }, {})
              };
              
              console.log('2. Data prepared for validation:', currentData);
              
              // Apply validation
              const validatedData = validateExposureData(currentData, fieldName, checked);
              console.log('3. Data after validation:', validatedData);
              
              // Update the clicked field
              validatedData[fieldName] = checked;
              
              // Clean up type information
              Object.keys(validatedData).forEach(key => {
                if (key.startsWith('type_')) {
                  delete validatedData[key];
                }
              });
              
              console.log('4. Final data to be set:', validatedData);
              
              // Update row
              params.node.setData(validatedData);
              onCellValueChanged({ 
                ...params, 
                data: validatedData,
                oldValue: params.value,
                newValue: checked 
              });
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
