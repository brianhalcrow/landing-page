
import { ColDef } from 'ag-grid-community';
import { ExposureType } from '@/hooks/useExposureTypes';

export const createExposureColumns = (
  exposureTypes: ExposureType[],
  onCellValueChanged: (params: any) => void
): ColDef[] => {
  return exposureTypes.map((type) => ({
    field: `exposure_${type.exposure_type_id}`,
    headerName: type.exposure_type_name,
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center custom-header',
    suppressSizeToFit: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    editable: (params) => !!params.data?.isEditing,
    cellRenderer: 'checkboxCellRenderer',
    onCellValueChanged
  }));
};
