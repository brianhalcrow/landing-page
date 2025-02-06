
import { ColGroupDef } from 'ag-grid-community';
import CheckboxCellRenderer from '../cellRenderers/CheckboxCellRenderer';

export const createProcessColumnGroups = (processTypes: any[]): ColGroupDef[] => 
  processTypes.map(processType => ({
    headerName: processType.process_name,
    groupId: `process_${processType.process_type_id}`,
    headerClass: 'ag-header-center custom-header',
    children: processType.process_options.map(option => ({
      headerName: option.option_name,
      groupId: `option_${option.process_option_id}`,
      headerClass: 'ag-header-center custom-header',
      children: option.process_settings
        // Filter out any settings that have "scheduled" in their name since it's redundant
        .filter(setting => !setting.setting_name.toLowerCase().includes('scheduled'))
        .map(setting => ({
          headerName: setting.setting_name,
          field: `setting_${setting.process_setting_id}`,
          minWidth: 120,
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
