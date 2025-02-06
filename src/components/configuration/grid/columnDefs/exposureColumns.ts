
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ExposureType } from '@/hooks/useExposureTypes';

export const createExposureColumns = (
  exposureTypes: ExposureType[],
  onCellValueChanged: (params: any) => void
): (ColDef | ColGroupDef)[] => {
  // Group exposures by L1 category
  const l1Groups = Array.from(new Set(exposureTypes.map(type => type.exposure_category_l1)));
  
  return l1Groups.map(l1 => {
    const l1Types = exposureTypes.filter(type => type.exposure_category_l1 === l1);
    const l2Groups = Array.from(new Set(l1Types.map(type => type.exposure_category_l2)));
    
    return {
      headerName: l1,
      headerClass: 'ag-header-center custom-header',
      children: l2Groups.map(l2 => {
        const l2Types = l1Types.filter(type => type.exposure_category_l2 === l2);
        const l3Groups = Array.from(new Set(l2Types.map(type => type.exposure_category_l3)));
        
        return {
          headerName: l2,
          headerClass: 'ag-header-center custom-header',
          children: l3Groups.map(l3 => {
            const type = l2Types.find(t => t.exposure_category_l3 === l3);
            if (!type) return null;
            
            return {
              headerName: l3,
              field: `exposure_${type.exposure_type_id}`,
              minWidth: 120,
              flex: 1,
              headerClass: 'ag-header-center custom-header',
              suppressSizeToFit: true,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              editable: (params: any) => !!params.data?.isEditing,
              cellRenderer: 'checkboxCellRenderer',
              cellRendererParams: (params: any) => ({
                value: params.value,
                disabled: !params.data?.isEditing,
                onChange: (checked: boolean) => {
                  if (params.node && params.api) {
                    const updatedData = { ...params.data };
                    updatedData[params.column.getColId()] = checked;
                    params.node.setData(updatedData);
                    params.api.refreshCells({ 
                      rowNodes: [params.node],
                      force: true
                    });
                  }
                }
              }),
              onCellValueChanged
            };
          }).filter(Boolean) as ColDef[]
        };
      })
    };
  });
};
