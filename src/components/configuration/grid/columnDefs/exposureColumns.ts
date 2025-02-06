
import { ColDef } from 'ag-grid-community';
import { ExposureType } from '@/hooks/useExposureTypes';

export const createExposureColumns = (
  exposureTypes: ExposureType[],
  onCellValueChanged: (params: any) => void
): ColDef[] => {
  return exposureTypes.map((type) => ({
    field: `exposure_${type.exposure_type_id}`,
    headerName: type.exposure_type_name || `Exposure ${type.exposure_type_id}`,
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    editable: (params) => !!params.data?.isEditing,
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
  }));
};
