
import { ColDef, ColGroupDef } from 'ag-grid-enterprise';
import CheckboxCellRenderer from '@/components/configuration/grid/cellRenderers/CheckboxCellRenderer';
import ActionsCellRenderer from '../grid/ActionsCellRenderer';

export const createBaseColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    width: 120,
    sort: 'asc',
    pinned: 'left',
    headerClass: 'ag-header-center custom-header'
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    width: 200,
    pinned: 'left',
    headerClass: 'ag-header-center custom-header'
  }
];

export const createProcessColumnGroups = (processTypes: any[]): ColGroupDef[] =>
  (processTypes || []).map(processType => ({
    headerName: processType.process_name,
    headerClass: 'ag-header-center custom-header',
    children: processType.process_options.map(option => ({
      headerName: option.option_name,
      headerClass: 'ag-header-center custom-header',
      children: option.process_settings.map(setting => ({
        field: `setting_${setting.process_setting_id}`,
        headerName: setting.setting_name,
        flex: 1,
        headerClass: 'ag-header-center custom-header',
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: (params: any) => ({
          disabled: !params.data?.isEditing,
          value: params.value,
          hasSchedule: setting.setting_type === 'scheduled',
          entityId: params.data?.entity_id,
          processSettingId: setting.process_setting_id,
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
        })
      }))
    }))
  }));

export const createActionsColumn = (): ColDef => ({
  headerName: 'Actions',
  minWidth: 100,
  maxWidth: 100,
  headerClass: 'ag-header-center custom-header',
  cellRenderer: ActionsCellRenderer,
  cellRendererParams: (params: any) => ({
    data: params.data,
    node: params.node,
    api: params.api
  })
});
